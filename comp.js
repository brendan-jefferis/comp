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
* Date: 2016-12-29T01:03:43.166Z 
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
        return arg.match(/(value)/) ? this.value : arg;
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
    var cachedViewHtml = "";
    var viewRender = _view && _view.render ? function (_model) {
        var html = _view.render(_model);
        if (typeof document !== "undefined" && html && html !== cachedViewHtml) {
            var target = document.querySelector("[data-component=" + name + "]");
            if (target) {
                target.innerHTML = cachedViewHtml = html;
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
