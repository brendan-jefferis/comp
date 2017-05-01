/* ____ ____ _  _ ___   
*  |___ [__] |\/| |--' . v1.10.0
* 
* A design pattern and micro-framework for creating UI components
*
* Copyright Brendan Jefferis and other contributors
* Released under the MIT license
* 
* Issues? Please visit https://github.com/brendan-jefferis/comp/issues
*
* Date: 2017-05-01T09:54:54.230Z 
*/
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.comp = factory());
}(this, (function () { 'use strict';

function inspectSyntax(str) {
    try {
        new Function(str);
    } catch (e) {
        if (e instanceof SyntaxError) {
            throw new SyntaxError(e);
        }
    }
}

function getEventTarget(event) {
    event = event || window.event;
    return event.target || event.srcElement;
}

/* eslint-disable no-nested-ternary */
var arr = [];
var charCodeCache = [];

var index = function (a, b) {
	if (a === b) {
		return 0;
	}

	var swap = a;

	// Swapping the strings if `a` is longer than `b` so we know which one is the
	// shortest & which one is the longest
	if (a.length > b.length) {
		a = b;
		b = swap;
	}

	var aLen = a.length;
	var bLen = b.length;

	if (aLen === 0) {
		return bLen;
	}

	if (bLen === 0) {
		return aLen;
	}

	// Performing suffix trimming:
	// We can linearly drop suffix common to both strings since they
	// don't increase distance at all
	// Note: `~-` is the bitwise way to perform a `- 1` operation
	while (aLen > 0 && (a.charCodeAt(~-aLen) === b.charCodeAt(~-bLen))) {
		aLen--;
		bLen--;
	}

	if (aLen === 0) {
		return bLen;
	}

	// Performing prefix trimming
	// We can linearly drop prefix common to both strings since they
	// don't increase distance at all
	var start = 0;

	while (start < aLen && (a.charCodeAt(start) === b.charCodeAt(start))) {
		start++;
	}

	aLen -= start;
	bLen -= start;

	if (aLen === 0) {
		return bLen;
	}

	var bCharCode;
	var ret;
	var tmp;
	var tmp2;
	var i = 0;
	var j = 0;

	while (i < aLen) {
		charCodeCache[start + i] = a.charCodeAt(start + i);
		arr[i] = ++i;
	}

	while (j < bLen) {
		bCharCode = b.charCodeAt(start + j);
		tmp = j++;
		ret = j;

		for (i = 0; i < aLen; i++) {
			tmp2 = bCharCode === charCodeCache[start + i] ? tmp : tmp + 1;
			tmp = arr[i];
			ret = arr[i] = tmp > ret ? tmp2 > ret ? ret + 1 : tmp2 : tmp2 > tmp ? tmp + 1 : tmp2;
		}
	}

	return ret;
};

var threshold = 3;

function suggestActions(str, component) {
    if (str == null) {
        throw new Error("suggestActions requires a string argument to use as a query");
    }

    if (component == null) {
        throw new Error("suggestActions requires a component to search for actions");
    }

    var suggestions = [];

    Object.keys(component).map(function (actionName) {
        var distance = index(str, actionName);
        if (distance > threshold) {
            return;
        }

        suggestions.push({ term: actionName, distance: distance });
    });

    return suggestions.sort(function (a, b) {
        return a.distance > b.distance;
    });
}

function registerEventDelegator(components) {
    ["mousedown", "mouseup", "mouseover", "mouseout", "mousemove", "mousedrag", "click", "dblclick", "keydown", "keyup", "keypress", "focus", "blur", "select", "change", "dragdrop", "drag", "dragstart", "dragend", "dragover", "dragenter", "dragleave", "dragexit", "drop"].map(function (ev, i) {
        if (i >= 4 && i <= 19) {
            document.body.addEventListener(ev.toLowerCase(), function (e) {
                delegateEvent(e, components);
            });
        }
    }, this);
}

function delegateEvent(e, components) {
    e.stopPropagation();
    var target = getEventTarget(e);
    if (target.nodeName === "BODY") {
        return;
    }
    var componentHtmlTarget = getComponentHtmlTarget(target);
    if (componentHtmlTarget == null) {
        return;
    }
    var component = components[componentHtmlTarget.getAttribute("data-component")];
    var action = getEventActionFromElement(e, target, componentHtmlTarget);
    if (action.name === "") {
        return;
    }

    if (component[action.name] == null) {
        var suggestions = suggestActions(action.name, component);
        var suggestionsMessage = suggestions.length ? "\r\n\r\nDid you mean\r\n\r\n" + suggestions.map(function (x) {
            return component.name + "." + x.term + "\n";
        }).join("") + "\r" : "";
        throw new Error("Could not find action " + action.name + " in component " + component.name + suggestionsMessage);
    }

    if (action.args === "") {
        component[action.name].call(action, e);
    } else {
        component[action.name].apply(action, action.args.concat(e));
    }

    var compActionEvent = new Event("comp_action");
    componentHtmlTarget.dispatchEvent(compActionEvent);
    document.dispatchEvent(compActionEvent);
}

function bubbleUntilActionFound(event, element, root) {
    var actionStr = element.getAttribute("data-" + [event.type]) || "";
    if (actionStr !== "" || element === root) {
        try {
            inspectSyntax(actionStr, element);
        } catch (e) {
            var tempDiv = document.createElement("div");
            tempDiv.appendChild(element.cloneNode(false));
            throw new SyntaxError("\r\n\r\nElement: " + tempDiv.innerHTML + "\r\nEvent: data-" + [event.type] + "\r\nAction: " + actionStr + "\r\n\r\n" + e);
        }
        return {
            name: actionStr,
            element: element
        };
    }

    return bubbleUntilActionFound(event, element.parentNode, root);
}

function getComponentHtmlTarget(eventTarget) {
    return eventTarget.closest("[data-component]");
}

function getEventActionFromElement(event, element, root) {
    var action = bubbleUntilActionFound(event, element, root);

    return {
        name: extractActionName(action.name),
        args: extractArguments(action.name, action.element)
    };
}

function extractActionName(str) {
    var nameResult = str.match(/[^(]*/);
    return nameResult ? nameResult[0] : "";
}

function extractArguments(str, target) {
    var args = /\(\s*([^)]+?)\s*\)/.exec(str);
    if (!args || args[1] == null) {
        return "";
    }

    args = args[1].split(/\s*,\s*/).map(function (arg) {
        var argList = arg.split(".");
        if (argList.length === 1 && argList.indexOf("this") === -1) {
            return arg;
        }

        if (arg === "this") {
            return target;
        }

        var dataset = argList.indexOf("dataset") === 1 ? Object.assign({}, target.dataset) : null;

        return dataset ? dataset[argList[2]] : target[argList[1]];
    }, target);

    return args;
}

var compEvents = Object.freeze({
	registerEventDelegator: registerEventDelegator,
	delegateEvent: delegateEvent,
	bubbleUntilActionFound: bubbleUntilActionFound,
	getComponentHtmlTarget: getComponentHtmlTarget,
	getEventActionFromElement: getEventActionFromElement,
	extractActionName: extractActionName,
	extractArguments: extractArguments
});

var parser = window.DOMParser && new window.DOMParser();
var documentRootName = 'HTML';
var supportsHTMLType = false;
var supportsInnerHTML = false;
var htmlType = 'text/html';
var xhtmlType = 'application/xhtml+xml';
var testCode = '<br/>';

/* istanbul ignore next: Fails in older browsers */
try {
  // Check if browser supports text/html DOMParser
  if (parser.parseFromString(testCode, htmlType)) supportsHTMLType = true;
} catch (e) {
  var mockDoc = document.implementation.createHTMLDocument('');
  var mockHTML = mockDoc.documentElement;
  var mockBody = mockDoc.body;
  try {
    // Check if browser supports documentElement.innerHTML
    mockHTML.innerHTML += '';
    supportsInnerHTML = true;
  } catch (e) {
    // Check if browser supports xhtml parsing.
    parser.parseFromString(testCode, xhtmlType);
    var bodyReg = /(<body[^>]*>)([\s\S]*)<\/body>/;
  }
}

/**
 * Returns the results of a DOMParser as an HTMLElement.
 * (Shims for older browsers).
 */
var parseHtml = supportsHTMLType
  ? function parseHTML (markup, rootName) {
    var doc = parser.parseFromString(markup, htmlType);
    return rootName === documentRootName
      ? doc.documentElement
      : doc.body.firstChild
  }
  /* istanbul ignore next: Only used in older browsers */
  : function parseHTML (markup, rootName) {
    // Fallback to innerHTML for other older browsers.
    if (rootName === documentRootName) {
      if (supportsInnerHTML) {
        mockHTML.innerHTML = markup;
        return mockHTML
      } else {
        // IE9 does not support innerhtml at root level.
        // We get around this by parsing everything except the body as xhtml.
        var bodyMatch = markup.match(bodyReg);
        if (bodyMatch) {
          var bodyContent = bodyMatch[2];
          var startBody = bodyMatch.index + bodyMatch[1].length;
          var endBody = startBody + bodyContent.length;
          markup = markup.slice(0, startBody) + markup.slice(endBody);
          mockBody.innerHTML = bodyContent;
        }

        var doc = parser.parseFromString(markup, xhtmlType);
        var body = doc.body;
        while (mockBody.firstChild) body.appendChild(mockBody.firstChild);
        return doc.documentElement
      }
    } else {
      mockBody.innerHTML = markup;
      return mockBody.firstChild
    }
  };

setDOM.KEY = 'data-key';
setDOM.IGNORE = 'data-ignore';
setDOM.CHECKSUM = 'data-checksum';
var parseHTML = parseHtml;
var KEY_PREFIX = '_set-dom-';
var NODE_MOUNTED = KEY_PREFIX + 'mounted';
var ELEMENT_TYPE = 1;
var DOCUMENT_TYPE = 9;
var DOCUMENT_FRAGMENT_TYPE = 11;

// Expose api.
var index$1 = setDOM;

/**
 * @description
 * Updates existing dom to match a new dom.
 *
 * @param {Node} oldNode - The html entity to update.
 * @param {String|Node} newNode - The updated html(entity).
 */
function setDOM (oldNode, newNode) {
  // Ensure a realish dom node is provided.
  assert(oldNode && oldNode.nodeType, 'You must provide a valid node to update.');

  // Alias document element with document.
  if (oldNode.nodeType === DOCUMENT_TYPE) oldNode = oldNode.documentElement;

  // Document Fragments don't have attributes, so no need to look at checksums, ignored, attributes, or node replacement.
  if (newNode.nodeType === DOCUMENT_FRAGMENT_TYPE) {
    // Simply update all children (and subchildren).
    setChildNodes(oldNode, newNode);
  } else {
    // Otherwise we diff the entire old node.
    setNode(oldNode, typeof newNode === 'string'
      // If a string was provided we will parse it as dom.
      ? parseHTML(newNode, oldNode.nodeName)
      : newNode
    );
  }

  // Trigger mount events on initial set.
  if (!oldNode[NODE_MOUNTED]) {
    oldNode[NODE_MOUNTED] = true;
    mount(oldNode);
  }
}

/**
 * @private
 * @description
 * Updates a specific htmlNode and does whatever it takes to convert it to another one.
 *
 * @param {Node} oldNode - The previous HTMLNode.
 * @param {Node} newNode - The updated HTMLNode.
 */
function setNode (oldNode, newNode) {
  if (oldNode.nodeType === newNode.nodeType) {
    // Handle regular element node updates.
    if (oldNode.nodeType === ELEMENT_TYPE) {
      // Checks if nodes are equal before diffing.
      if (isEqualNode(oldNode, newNode)) return

      // Update all children (and subchildren).
      setChildNodes(oldNode, newNode);

      // Update the elements attributes / tagName.
      if (oldNode.nodeName === newNode.nodeName) {
        // If we have the same nodename then we can directly update the attributes.
        setAttributes(oldNode.attributes, newNode.attributes);
      } else {
        // Otherwise clone the new node to use as the existing node.
        var newPrev = newNode.cloneNode();
        // Copy over all existing children from the original node.
        while (oldNode.firstChild) newPrev.appendChild(oldNode.firstChild);
        // Replace the original node with the new one with the right tag.
        oldNode.parentNode.replaceChild(newPrev, oldNode);
      }
    } else {
      // Handle other types of node updates (text/comments/etc).
      // If both are the same type of node we can update directly.
      if (oldNode.nodeValue !== newNode.nodeValue) {
        oldNode.nodeValue = newNode.nodeValue;
      }
    }
  } else {
    // we have to replace the node.
    oldNode.parentNode.replaceChild(newNode, dismount(oldNode));
    mount(newNode);
  }
}

/**
 * @private
 * @description
 * Utility that will update one list of attributes to match another.
 *
 * @param {NamedNodeMap} oldAttributes - The previous attributes.
 * @param {NamedNodeMap} newAttributes - The updated attributes.
 */
function setAttributes (oldAttributes, newAttributes) {
  var i, a, b, ns, name;

  // Remove old attributes.
  for (i = oldAttributes.length; i--;) {
    a = oldAttributes[i];
    ns = a.namespaceURI;
    name = a.localName;
    b = newAttributes.getNamedItemNS(ns, name);
    if (!b) oldAttributes.removeNamedItemNS(ns, name);
  }

  // Set new attributes.
  for (i = newAttributes.length; i--;) {
    a = newAttributes[i];
    ns = a.namespaceURI;
    name = a.localName;
    b = oldAttributes.getNamedItemNS(ns, name);
    if (!b) {
      // Add a new attribute.
      newAttributes.removeNamedItemNS(ns, name);
      oldAttributes.setNamedItemNS(a);
    } else if (b.value !== a.value) {
      // Update existing attribute.
      b.value = a.value;
    }
  }
}

/**
 * @private
 * @description
 * Utility that will nodes childern to match another nodes children.
 *
 * @param {Node} oldParent - The existing parent node.
 * @param {Node} newParent - The new parent node.
 */
function setChildNodes (oldParent, newParent) {
  var checkOld, oldKey, checkNew, newKey, foundNode, keyedNodes;
  var oldNode = oldParent.firstChild;
  var newNode = newParent.firstChild;
  var extra = 0;

  // Extract keyed nodes from previous children and keep track of total count.
  while (oldNode) {
    extra++;
    checkOld = oldNode;
    oldKey = getKey(checkOld);
    oldNode = oldNode.nextSibling;

    if (oldKey) {
      if (!keyedNodes) keyedNodes = {};
      keyedNodes[oldKey] = checkOld;
    }
  }

  // Loop over new nodes and perform updates.
  oldNode = oldParent.firstChild;
  while (newNode) {
    extra--;
    checkNew = newNode;
    newNode = newNode.nextSibling;

    if (keyedNodes && (newKey = getKey(checkNew)) && (foundNode = keyedNodes[newKey])) {
      delete keyedNodes[newKey];
      // If we have a key and it existed before we move the previous node to the new position if needed and diff it.
      if (foundNode !== oldNode) {
        oldParent.insertBefore(foundNode, oldNode);
      } else {
        oldNode = oldNode.nextSibling;
      }

      setNode(foundNode, checkNew);
    } else if (oldNode) {
      checkOld = oldNode;
      oldNode = oldNode.nextSibling;
      if (getKey(checkOld)) {
        // If the old child had a key we skip over it until the end.
        oldParent.insertBefore(checkNew, checkOld);
        mount(checkNew);
      } else {
        // Otherwise we diff the two non-keyed nodes.
        setNode(checkOld, checkNew);
      }
    } else {
      // Finally if there was no old node we add the new node.
      oldParent.appendChild(checkNew);
      mount(checkNew);
    }
  }

  // Remove old keyed nodes.
  for (oldKey in keyedNodes) {
    extra--;
    oldParent.removeChild(dismount(keyedNodes[oldKey]));
  }

  // If we have any remaining unkeyed nodes remove them from the end.
  while (--extra >= 0) {
    oldParent.removeChild(dismount(oldParent.lastChild));
  }
}

/**
 * @private
 * @description
 * Utility to try to pull a key out of an element.
 * Uses 'data-key' if possible and falls back to 'id'.
 *
 * @param {Node} node - The node to get the key for.
 * @return {string|void}
 */
function getKey (node) {
  if (node.nodeType !== ELEMENT_TYPE) return
  var key = node.getAttribute(setDOM.KEY) || node.id;
  if (key) return KEY_PREFIX + key
}

/**
 * Checks if nodes are equal using the following by checking if
 * they are both ignored, have the same checksum, or have the
 * same contents.
 *
 * @param {Node} a - One of the nodes to compare.
 * @param {Node} b - Another node to compare.
 */
function isEqualNode (a, b) {
  return (
    // Check if both nodes are ignored.
    (isIgnored(a) && isIgnored(b)) ||
    // Check if both nodes have the same checksum.
    (getCheckSum(a) === getCheckSum(b)) ||
    // Fall back to native isEqualNode check.
    a.isEqualNode(b)
  )
}

/**
 * @private
 * @description
 * Utility to try to pull a checksum attribute from an element.
 * Uses 'data-checksum' or user specified checksum property.
 *
 * @param {Node} node - The node to get the checksum for.
 * @return {string|NaN}
 */
function getCheckSum (node) {
  return node.getAttribute(setDOM.CHECKSUM) || NaN
}

/**
 * @private
 * @description
 * Utility to try to check if an element should be ignored by the algorithm.
 * Uses 'data-ignore' or user specified ignore property.
 *
 * @param {Node} node - The node to check if it should be ignored.
 * @return {boolean}
 */
function isIgnored (node) {
  return node.getAttribute(setDOM.IGNORE) != null
}

/**
 * Dispatches a mount event for the given node and children.
 *
 * @param {Node} node - the node to mount.
 * @return {node}
 */
function mount (node) {
  return dispatch(node, 'mount')
}

/**
 * Dispatches a dismount event for the given node and children.
 *
 * @param {Node} node - the node to dismount.
 * @return {node}
 */
function dismount (node) {
  return dispatch(node, 'dismount')
}

/**
 * Recursively trigger an event for a node and it's children.
 * Only emits events for keyed nodes.
 *
 * @param {Node} node - the initial node.
 * @return {Node}
 */
function dispatch (node, type) {
  // Trigger event for this element if it has a key.
  if (getKey(node)) {
    var ev = document.createEvent('Event');
    var prop = { value: node };
    ev.initEvent(type, false, false);
    Object.defineProperty(ev, 'target', prop);
    Object.defineProperty(ev, 'srcElement', prop);
    node.dispatchEvent(ev);
  }

  // Dispatch to all children.
  var child = node.firstChild;
  while (child) child = dispatch(child, type).nextSibling;
  return node
}

/**
 * @private
 * @description
 * Confirm that a value is truthy, throws an error message otherwise.
 *
 * @param {*} val - the val to test.
 * @param {string} msg - the error message on failure.
 * @throws {Error}
 */
function assert (val, msg) {
  if (!val) throw new Error('set-dom: ' + msg)
}

function unwrapExports (x) {
	return x && x.__esModule ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var clone_1 = createCommonjsModule(function (module) {
var clone = (function() {
'use strict';

function _instanceof(obj, type) {
  return type != null && obj instanceof type;
}

var nativeMap;
try {
  nativeMap = Map;
} catch(_) {
  // maybe a reference error because no `Map`. Give it a dummy value that no
  // value will ever be an instanceof.
  nativeMap = function() {};
}

var nativeSet;
try {
  nativeSet = Set;
} catch(_) {
  nativeSet = function() {};
}

var nativePromise;
try {
  nativePromise = Promise;
} catch(_) {
  nativePromise = function() {};
}

/**
 * Clones (copies) an Object using deep copying.
 *
 * This function supports circular references by default, but if you are certain
 * there are no circular references in your object, you can save some CPU time
 * by calling clone(obj, false).
 *
 * Caution: if `circular` is false and `parent` contains circular references,
 * your program may enter an infinite loop and crash.
 *
 * @param `parent` - the object to be cloned
 * @param `circular` - set to true if the object to be cloned may contain
 *    circular references. (optional - true by default)
 * @param `depth` - set to a number if the object is only to be cloned to
 *    a particular depth. (optional - defaults to Infinity)
 * @param `prototype` - sets the prototype to be used when cloning an object.
 *    (optional - defaults to parent prototype).
 * @param `includeNonEnumerable` - set to true if the non-enumerable properties
 *    should be cloned as well. Non-enumerable properties on the prototype
 *    chain will be ignored. (optional - false by default)
*/
function clone(parent, circular, depth, prototype, includeNonEnumerable) {
  if (typeof circular === 'object') {
    depth = circular.depth;
    prototype = circular.prototype;
    includeNonEnumerable = circular.includeNonEnumerable;
    circular = circular.circular;
  }
  // maintain two arrays for circular references, where corresponding parents
  // and children have the same index
  var allParents = [];
  var allChildren = [];

  var useBuffer = typeof Buffer != 'undefined';

  if (typeof circular == 'undefined')
    circular = true;

  if (typeof depth == 'undefined')
    depth = Infinity;

  // recurse this function so we don't reset allParents and allChildren
  function _clone(parent, depth) {
    // cloning null always returns null
    if (parent === null)
      return null;

    if (depth === 0)
      return parent;

    var child;
    var proto;
    if (typeof parent != 'object') {
      return parent;
    }

    if (_instanceof(parent, nativeMap)) {
      child = new nativeMap();
    } else if (_instanceof(parent, nativeSet)) {
      child = new nativeSet();
    } else if (_instanceof(parent, nativePromise)) {
      child = new nativePromise(function (resolve, reject) {
        parent.then(function(value) {
          resolve(_clone(value, depth - 1));
        }, function(err) {
          reject(_clone(err, depth - 1));
        });
      });
    } else if (clone.__isArray(parent)) {
      child = [];
    } else if (clone.__isRegExp(parent)) {
      child = new RegExp(parent.source, __getRegExpFlags(parent));
      if (parent.lastIndex) child.lastIndex = parent.lastIndex;
    } else if (clone.__isDate(parent)) {
      child = new Date(parent.getTime());
    } else if (useBuffer && Buffer.isBuffer(parent)) {
      child = new Buffer(parent.length);
      parent.copy(child);
      return child;
    } else if (_instanceof(parent, Error)) {
      child = Object.create(parent);
    } else {
      if (typeof prototype == 'undefined') {
        proto = Object.getPrototypeOf(parent);
        child = Object.create(proto);
      }
      else {
        child = Object.create(prototype);
        proto = prototype;
      }
    }

    if (circular) {
      var index = allParents.indexOf(parent);

      if (index != -1) {
        return allChildren[index];
      }
      allParents.push(parent);
      allChildren.push(child);
    }

    if (_instanceof(parent, nativeMap)) {
      parent.forEach(function(value, key) {
        var keyChild = _clone(key, depth - 1);
        var valueChild = _clone(value, depth - 1);
        child.set(keyChild, valueChild);
      });
    }
    if (_instanceof(parent, nativeSet)) {
      parent.forEach(function(value) {
        var entryChild = _clone(value, depth - 1);
        child.add(entryChild);
      });
    }

    for (var i in parent) {
      var attrs;
      if (proto) {
        attrs = Object.getOwnPropertyDescriptor(proto, i);
      }

      if (attrs && attrs.set == null) {
        continue;
      }
      child[i] = _clone(parent[i], depth - 1);
    }

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(parent);
      for (var i = 0; i < symbols.length; i++) {
        // Don't need to worry about cloning a symbol because it is a primitive,
        // like a number or string.
        var symbol = symbols[i];
        var descriptor = Object.getOwnPropertyDescriptor(parent, symbol);
        if (descriptor && !descriptor.enumerable && !includeNonEnumerable) {
          continue;
        }
        child[symbol] = _clone(parent[symbol], depth - 1);
        if (!descriptor.enumerable) {
          Object.defineProperty(child, symbol, {
            enumerable: false
          });
        }
      }
    }

    if (includeNonEnumerable) {
      var allPropertyNames = Object.getOwnPropertyNames(parent);
      for (var i = 0; i < allPropertyNames.length; i++) {
        var propertyName = allPropertyNames[i];
        var descriptor = Object.getOwnPropertyDescriptor(parent, propertyName);
        if (descriptor && descriptor.enumerable) {
          continue;
        }
        child[propertyName] = _clone(parent[propertyName], depth - 1);
        Object.defineProperty(child, propertyName, {
          enumerable: false
        });
      }
    }

    return child;
  }

  return _clone(parent, depth);
}

/**
 * Simple flat clone using prototype, accepts only objects, usefull for property
 * override on FLAT configuration object (no nested props).
 *
 * USE WITH CAUTION! This may not behave as you wish if you do not know how this
 * works.
 */
clone.clonePrototype = function clonePrototype(parent) {
  if (parent === null)
    return null;

  var c = function () {};
  c.prototype = parent;
  return new c();
};

// private utility functions

function __objToStr(o) {
  return Object.prototype.toString.call(o);
}
clone.__objToStr = __objToStr;

function __isDate(o) {
  return typeof o === 'object' && __objToStr(o) === '[object Date]';
}
clone.__isDate = __isDate;

function __isArray(o) {
  return typeof o === 'object' && __objToStr(o) === '[object Array]';
}
clone.__isArray = __isArray;

function __isRegExp(o) {
  return typeof o === 'object' && __objToStr(o) === '[object RegExp]';
}
clone.__isRegExp = __isRegExp;

function __getRegExpFlags(re) {
  var flags = '';
  if (re.global) flags += 'g';
  if (re.ignoreCase) flags += 'i';
  if (re.multiline) flags += 'm';
  return flags;
}
clone.__getRegExpFlags = __getRegExpFlags;

return clone;
})();

if (typeof module === 'object' && module.exports) {
  module.exports = clone;
}
});

var index$2 = createCommonjsModule(function (module, exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:true});var chars={"&":"&amp;",">":"&gt;","<":"&lt;",'"':"&quot;","'":"&#39;","`":"&#96;"};var re=new RegExp(Object.keys(chars).join("|"),"g");exports["default"]=function(){var str=arguments.length<=0||arguments[0]===undefined?"":arguments[0];return String(str).replace(re,function(match){return chars[match]})};module.exports=exports["default"];
});

var htmlEscape = unwrapExports(index$2);

// Source: http://www.2ality.com/2015/01/template-strings-html.html#comment-2078932192
var html = (function (literals) {
    for (var _len = arguments.length, substs = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        substs[_key - 1] = arguments[_key];
    }

    return literals.raw.reduce(function (acc, lit, i) {
        var subst = substs[i - 1];
        if (Array.isArray(subst)) {
            subst = subst.join('');
        }
        if (acc.endsWith('@')) {
            subst = htmlEscape(subst);
            acc = acc.slice(0, -1);
        }
        return acc + subst + lit;
    });
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

function renderAfterPromise(promise, render) {
    return promise.then(function (updatedModel) {
        if (updatedModel == null) {
            throw new Error("No model received - aborting render");
        }
        render(updatedModel);
    }).catch(function (err) {
        err = (typeof err === "undefined" ? "undefined" : _typeof(err)) === "object" ? err : err + "\r\nError unhandled by component. Add a catch handler in your action.";
        console.error(err);
        return err;
    });
}

function renderAfterGenerator(gen, render) {
    var state = gen.next();
    if (state.value) {
        if (state.value.then) {
            renderAfterPromise(state.value, render).then(function () {
                if (!state.done) {
                    renderAfterGenerator(gen, render);
                }
            });
        } else {
            render(state.value);
            if (!state.done) {
                renderAfterGenerator(gen, render);
            }
        }
    }
}

function findChildComponents(root) {
    if (root == null) {
        throw new Error("InvalidArgument: DOM element expected");
    }

    return Array.prototype.map.call(root.querySelectorAll("[data-component]"), function (x) {
        return x.getAttribute("data-component");
    });
}

var components = {};

function componentize(name, actions, render, model) {
    render(model);
    var component = {};
    Object.keys(actions).map(function (action) {
        component[action] = function () {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            var returnValue = actions[action].apply(actions, args);

            if (returnValue && returnValue.then) {
                renderAfterPromise(returnValue, render);
            }

            if (returnValue && typeof returnValue === "function" && returnValue().next) {
                renderAfterGenerator(returnValue(), render);
            }
            render(model);
        };
    }, this);
    component.name = name;
    component.get = function (prop) {
        return model[prop];
    };
    component.render = function () {
        return render(model);
    };
    return component;
}

function create(name, actions, view, model) {
    if (name == null || name === "") {
        throw new Error("Your component needs a name");
    }

    if (actions == null) {
        var example = "// It must be a function that takes a model and returns an object of functions, e.g.\r\n\r\nYourComponent.Actions = function (model) {\r\n    return {\r\n        sayHello: function () { console.log('Hi.'); },\r\n        greet: function (name) { console.log('Hello, ' + name); }\r\n    }\r\n}";
        throw new Error(name + " needs some actions! Here's an example of an Actions function:\r\n\r\n" + example + "\r\n\r\n");
    }

    model = clone_1(model);
    var _view = view && view();
    var viewInit = _view && _view.init ? _view.init : function () {};
    var viewRender = _view && _view.render ? function (_model) {
        var htmlString = _view.render(_model, html);
        if (typeof document !== "undefined" && htmlString) {
            var target = document.querySelector("[data-component=" + name + "]");
            if (target) {
                if (target.innerHTML === "") {
                    target.innerHTML = htmlString;
                } else {
                    index$1(target.firstElementChild, htmlString);
                }
                var childComponents = findChildComponents(target);
                if (childComponents.length) {
                    childComponents.map(function (x) {
                        return components[x] && components[x].render();
                    });
                }
            }
        }
    } : function () {};

    var component = componentize(name, actions(model), viewRender, model);
    components[name] = component;

    viewInit(component, model);

    return component;
}

if (typeof document !== "undefined" && typeof compEvents !== "undefined") {
    document.addEventListener("DOMContentLoaded", function () {
        registerEventDelegator(components);
    });
}

var comp = {
    components: components,
    create: create
};

return comp;

})));
