/* ____ ____ _  _ ___   
*  |___ [__] |\/| |--' . v1.0.1
* 
* A design pattern and micro-framework for creating UI components
*
* Copyright Brendan Jefferis and other contributors
* Released under the MIT license
* 
* Issues? Please visit https://github.com/brendan-jefferis/comp/issues
*
* Date: 2016-12-29T20:00:21.156Z 
*/
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.comp = factory());
}(this, (function () { 'use strict';

function registerEventDelegator(component) {
    var componentHtmlTarget = document.querySelector("[data-component=" + component.name + "]");
    if (componentHtmlTarget === null) {
        return component;
    }

    Object.keys(Event.prototype).map(function (ev, i) {
        if (i >= 10 && i <= 19) {
            componentHtmlTarget.addEventListener(ev.toLowerCase(), function (e) {
                var target = getEventTarget(e);
                var action = getEventActionFromElement(e, target);
                if (component[action.name] == null) {
                    return;
                }

                if (action.args === "") {
                    component[action.name]();
                } else {
                    component[action.name].apply(action, action.args);
                }
            });
        }
    }, this);

    return component;
}

function getEventTarget(event) {
    event = event || window.event;
    return event.target || event.srcElement;
}

function getEventActionFromElement(event, element) {
    var actionStr = element.getAttribute("data-" + [event.type]) || "";

    return {
        name: extractActionName(actionStr),
        args: extractArguments(actionStr, element)
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
        var attributeReference = /(this)(?:\.)(\w+)/ig.exec(arg);
        return attributeReference != null && attributeReference[2] ? this[attributeReference[2]] : arg;
    }, target);

    return args;
}

var compEvents = Object.freeze({
	registerEventDelegator: registerEventDelegator,
	getEventTarget: getEventTarget,
	getEventActionFromElement: getEventActionFromElement,
	extractActionName: extractActionName,
	extractArguments: extractArguments
});

var parser = new window.DOMParser();
var htmlType = 'text/html';
var xhtmlType = 'application/xhtml+xml';
var testCode = '<i></i>';
var documentRootName = 'HTML';
var supportsHTMLType = false;
var supportsXHTMLType = false;

// Check if browser supports text/html DOMParser
try {
  /* istanbul ignore next: Fails in older browsers */
  if (parser.parseFromString(testCode, htmlType)) supportsHTMLType = true;
} catch (err) {}

try {
  /* istanbul ignore next: Only used in ie9 */
  if (!supportsHTMLType && parser.parseFromString(testCode, xhtmlType)) supportsXHTMLType = true;
} catch (err) {}

/**
 * Returns the results of a DOMParser as an HTMLElement.
 * (Shims for older browser and IE9).
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
    var isRoot = rootName === documentRootName;

    // Special case for ie9 (documentElement.innerHTML not supported).
    if (supportsXHTMLType && isRoot) {
      return parser.parseFromString(markup, xhtmlType).documentElement
    }

    // Fallback to innerHTML for other older browsers.
    var doc = document.implementation.createHTMLDocument('');
    if (isRoot) {
      doc.documentElement.innerHTML = markup;
      return doc.documentElement
    } else {
      doc.body.innerHTML = markup;
      return doc.body.firstChild
    }
  };

var parseHTML = parseHtml;
var KEY_PREFIX = '_set-dom-';
var NODE_INDEX = KEY_PREFIX + 'index';
var NODE_MOUNTED = KEY_PREFIX + 'mounted';
var ELEMENT_TYPE = window.Node.ELEMENT_NODE;
var DOCUMENT_TYPE = window.Node.DOCUMENT_NODE;
setDOM.KEY = 'data-key';
setDOM.IGNORE = 'data-ignore';
setDOM.CHECKSUM = 'data-checksum';

var index = setDOM;

/**
 * @description
 * Updates existing dom to match a new dom.
 *
 * @param {Node} prev - The html entity to update.
 * @param {String|Node} next - The updated html(entity).
 */
function setDOM (prev, next) {
  // Ensure a realish dom node is provided.
  assert(prev && prev.nodeType, 'You must provide a valid node to update.');

  // Alias document element with document.
  if (prev.nodeType === DOCUMENT_TYPE) prev = prev.documentElement;

  // If a string was provided we will parse it as dom.
  if (typeof next === 'string') next = parseHTML(next, prev.nodeName);

  // Update the node.
  setNode(prev, next);

  // Trigger mount events on initial set.
  if (!prev[NODE_MOUNTED]) {
    prev[NODE_MOUNTED] = true;
    mount(prev);
  }
}

/**
 * @private
 * @description
 * Updates a specific htmlNode and does whatever it takes to convert it to another one.
 *
 * @param {Node} prev - The previous HTMLNode.
 * @param {Node} next - The updated HTMLNode.
 */
function setNode (prev, next) {
  if (prev.nodeType === next.nodeType) {
    // Handle regular element node updates.
    if (prev.nodeType === ELEMENT_TYPE) {
      // Ignore elements if their checksum matches.
      if (getCheckSum(prev) === getCheckSum(next)) return
      // Ignore elements that explicity choose not to be diffed.
      if (isIgnored(prev) && isIgnored(next)) return

      // Update all children (and subchildren).
      setChildNodes(prev, prev.childNodes, next.childNodes);

      // Update the elements attributes / tagName.
      if (prev.nodeName === next.nodeName) {
        // If we have the same nodename then we can directly update the attributes.
        setAttributes(prev, prev.attributes, next.attributes);
      } else {
        // Otherwise clone the new node to use as the existing node.
        var newPrev = next.cloneNode();
        // Copy over all existing children from the original node.
        while (prev.firstChild) newPrev.appendChild(prev.firstChild);
        // Replace the original node with the new one with the right tag.
        prev.parentNode.replaceChild(newPrev, prev);
      }
    } else {
      // Handle other types of node updates (text/comments/etc).
      // If both are the same type of node we can update directly.
      if (prev.nodeValue !== next.nodeValue) {
        prev.nodeValue = next.nodeValue;
      }
    }
  } else {
    // we have to replace the node.
    dismount(prev);
    prev.parentNode.replaceChild(next, prev);
    mount(next);
  }
}

/**
 * @private
 * @description
 * Utility that will update one list of attributes to match another.
 *
 * @param {Node} parent - The current parentNode being updated.
 * @param {NamedNodeMap} prev - The previous attributes.
 * @param {NamedNodeMap} next - The updated attributes.
 */
function setAttributes (parent, prev, next) {
  var i, a, b, ns, name;

  // Remove old attributes.
  for (i = prev.length; i--;) {
    a = prev[i];
    ns = a.namespaceURI;
    name = a.localName;
    b = next.getNamedItemNS(ns, name);
    if (!b) prev.removeNamedItemNS(ns, name);
  }

  // Set new attributes.
  for (i = next.length; i--;) {
    a = next[i];
    ns = a.namespaceURI;
    name = a.localName;
    b = prev.getNamedItemNS(ns, name);
    if (!b) {
      // Add a new attribute.
      next.removeNamedItemNS(ns, name);
      prev.setNamedItemNS(a);
    } else if (b.value !== a.value) {
      // Update existing attribute.
      b.value = a.value;
    }
  }
}

/**
 * @private
 * @description
 * Utility that will update one list of childNodes to match another.
 *
 * @param {Node} parent - The current parentNode being updated.
 * @param {NodeList} prevChildNodes - The previous children.
 * @param {NodeList} nextChildNodes - The updated children.
 */
function setChildNodes (parent, prevChildNodes, nextChildNodes) {
  var key, a, b, newPosition, nextEl;

  // Convert nodelists into a usuable map.
  var prev = keyNodes(prevChildNodes);
  var next = keyNodes(nextChildNodes);

  // Remove old nodes.
  for (key in prev) {
    if (next[key]) continue
    // Trigger custom dismount event.
    dismount(prev[key]);
    // Remove child from dom.
    parent.removeChild(prev[key]);
  }

  // Set new nodes.
  for (key in next) {
    a = prev[key];
    b = next[key];
    // Extract the position of the new node.
    newPosition = b[NODE_INDEX];

    if (a) {
      // Update an existing node.
      setNode(a, b);
      // Check if the node has moved in the tree.
      if (a[NODE_INDEX] === newPosition) continue
      // Get the current element at the new position.
      /* istanbul ignore next */
      nextEl = prevChildNodes[newPosition] || null; // TODO: figure out if || null is needed.
      // Check if the node has already been properly positioned.
      if (nextEl === a) continue
      // Reposition node.
      parent.insertBefore(a, nextEl);
    } else {
      // Get the current element at the new position.
      nextEl = prevChildNodes[newPosition] || null;
      // Append the new node at the correct position.
      parent.insertBefore(b, nextEl);
      // Trigger custom mounted event.
      mount(b);
    }
  }
}

/**
 * @private
 * @description
 * Converts a nodelist into a keyed map.
 * This is used for diffing while keeping elements with 'data-key' or 'id' if possible.
 *
 * @param {NodeList} childNodes - The childNodes to convert.
 * @return {Object}
 */
function keyNodes (childNodes) {
  var result = {};
  var len = childNodes.length;
  var el;

  for (var i = 0; i < len; i++) {
    el = childNodes[i];
    el[NODE_INDEX] = i;
    result[getKey(el) || i] = el;
  }

  return result
}

/**
 * @private
 * @description
 * Utility to try to pull a key out of an element.
 * Uses 'data-key' if possible and falls back to 'id'.
 *
 * @param {Node} node - The node to get the key for.
 * @return {String}
 */
function getKey (node) {
  if (node.nodeType !== ELEMENT_TYPE) return
  var key = node.getAttribute(setDOM.KEY) || node.id;
  if (key) key = KEY_PREFIX + key;
  return key && KEY_PREFIX + key
}

/**
 * @private
 * @description
 * Utility to try to pull a checksum attribute from an element.
 * Uses 'data-checksum' or user specified checksum property.
 *
 * @param {Node} node - The node to get the checksum for.
 * @return {String|NaN}
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
 * @return {Boolean}
 */
function isIgnored (node) {
  return node.getAttribute(setDOM.IGNORE) != null
}

/**
 * Recursively trigger a mount event for a node and it's children.
 *
 * @param {Node} node - the initial node to be mounted.
 */
function mount (node) {
  // Trigger mount event for this element if it has a key.
  if (getKey(node)) dispatch(node, 'mount');

  // Mount all children.
  var child = node.firstChild;
  while (child) {
    mount(child);
    child = child.nextSibling;
  }
}

/**
 * Recursively trigger a dismount event for a node and it's children.
 *
 * @param {Node} node - the initial node to be dismounted.
 */
function dismount (node) {
  // Dismount all children.
  var child = node.firstChild;
  while (child) {
    dismount(child);
    child = child.nextSibling;
  }

  // Trigger dismount event for this element if it has a key.
  if (getKey(node)) dispatch(node, 'dismount');
}

/**
 * @private
 * @description
 * Create and dispatch a custom event.
 *
 * @param {Node} el - the node to dispatch the event for.
 * @param {String} type - the name of the event.
 */
function dispatch (el, type) {
  var e = document.createEvent('Event');
  var prop = { value: el };
  e.initEvent(type, false, false);
  Object.defineProperty(e, 'target', prop);
  Object.defineProperty(e, 'srcElement', prop);
  el.dispatchEvent(e);
}

/**
 * @private
 * @description
 * Confirm that a value is truthy, throws an error message otherwise.
 *
 * @param {*} val - the val to test.
 * @param {String} msg - the error message on failure.
 * @throws Error
 */
function assert (val, msg) {
  if (!val) throw new Error('set-dom: ' + msg)
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
                handlePromise(returnValue, render);
            }
            render(model);
        };
    }, this);
    component.name = name;
    component.get = function (prop) {
        return model[prop];
    };
    return component;
}

function handlePromise(promise, render) {
    promise.then(function (updatedModel) {
        if (updatedModel == null) {
            throw new Error("No model received: aborting render");
        }
        render(updatedModel);
    }).catch(function (err) {
        if (typeof err === "string") {
            console.error(err);
        } else {
            console.error("Error unhandled by component. Add a catch handler to your AJAX method.");
        }
    });
}

function create(name, actions, view, model) {
    if (name == null || name === "") {
        throw new Error("Your component needs a name");
    }

    if (actions == null) {
        var example = "// It must be a function that takes a model and returns an object of functions, e.g.\r\n\r\nYourComponent.Actions = function (model) {\r\n    return {\r\n        sayHello: function () { console.log('Hi.'); },\r\n        greet: function (name) { console.log('Hello, ' + name); }\r\n    }\r\n}";
        throw new Error(name + " needs some actions! Here's an example of an Actions function:\r\n\r\n" + example + "\r\n\r\n");
    }

    var _view = view && view();
    var viewInit = _view && _view.init ? _view.init : function () {};
    var viewRender = _view && _view.render ? function (_model) {
        var htmlString = _view.render(_model);
        if (typeof document !== "undefined" && htmlString) {
            var target = document.querySelector("[data-component=" + name + "]");
            if (target) {
                var container = document.createElement("div");
                container.innerHTML = htmlString;
                if (target.firstChild === null) {
                    target.innerHTML = htmlString;
                }
                index(target.firstChild, container.innerHTML);
            }
        }
    } : function () {};

    var component = componentize(name, actions(model), viewRender, model);
    components[name] = component;

    if (typeof document !== "undefined" && typeof compEvents !== "undefined") {
        component = registerEventDelegator(component);
    }

    viewInit(component, model);

    return component;
}

var comp = {
    components: components,
    create: create
};

return comp;

})));
