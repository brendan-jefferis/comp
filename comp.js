"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Comp = function () {
    function Comp() {
        _classCallCheck(this, Comp);

        this.components = {};
    }
    // createRecorder(actions, view = ()=>{}) {
    //     let path = window.location.pathname;
    //     let model = {
    //         pageLoadTimestamp: Date.now(),
    //         steps: [],
    //         components: {},
    //         recording: true,
    //         sessionName: path.substr(1, path.indexOf('.')-1).split('/').join('_')
    //     };
    //     this.recorder = new Component("recorder", actions, view, model);
    // }

    _createClass(Comp, [{
        key: "create",
        value: function create(componentName, actions) {
            var view = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};
            var model = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

            this.components[componentName] = new Component(componentName, actions, view, model);
        }
    }]);

    return Comp;
}();

var Component = function () {
    function Component(componentName, actions, view, model) {
        _classCallCheck(this, Component);

        if (componentName == null || componentName === "") {
            throw new Error("Your component needs a name");
        }

        if (actions == null) {
            var example = "// It must be a function that takes a model and returns an object of functions, e.g.\r\n\r\nYourComponent.Actions = function (model) {\r\n    return {\r\n        sayHello: function () { console.log('Hi.'); },\r\n        greet: function (name) { console.log('Hello, ' + name); }\r\n    }\r\n}";
            throw new Error(componentName + " needs some actions! Here's an example of an Actions function:\r\n\r\n" + example + "\r\n\r\n");
        }

        this.componentName = componentName;

        var _view = view && view();
        var viewInit = _view && _view.init ? _view.init : function () {};
        var viewRender = _view && _view.render ? _view.render : function () {};

        Object.assign(this, this.componentize(actions(model), viewRender, model));
        viewInit(this, model);

        // if (componentizer.recorder && componentName !== "recorder") {
        //     componentizer.recorder.storeComponent(this, model);
        // }
    }

    _createClass(Component, [{
        key: "componentize",
        value: function componentize(actions, render, model) {
            var _this = this;

            var html = render(model);
            var cachedHtml = html;
            if (typeof document !== "undefined" && html) {
                var target = document.querySelector("[data-component=" + this.componentName + "]");
                if (target) {
                    target.innerHTML = html;
                }
            }
            var component = {};
            Object.keys(actions).map(function (action) {
                component[action] = function () {
                    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                        args[_key] = arguments[_key];
                    }

                    var returnValue = actions[action].apply(actions, args);

                    // if (componentizer.recorder && componentName !== "recorder" && componentizer.recorder.get("recording")) {
                    //     componentizer.recorder.recordStep(componentName, model, action, args);
                    // }

                    if (returnValue && returnValue.then) {
                        _this.handlePromise(returnValue, render);
                    }
                    html = render(model);
                    if (typeof document !== "undefined" && html && html !== cachedHtml) {
                        var _target = document.querySelector("[data-component=" + _this.componentName + "]");
                        if (_target) {
                            _target.innerHTML = html;
                            cachedHtml = html;
                        }
                    }
                };
            }, this);
            component.get = function (prop) {
                return model[prop];
            };

            if (typeof document !== "undefined") {
                this.registerEventDelegation(this.componentName, component);
            }
            return component;
        }
    }, {
        key: "handlePromise",
        value: function handlePromise(promise, render) {
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
    }, {
        key: "registerEventDelegation",
        value: function registerEventDelegation(name, actions) {
            var componentHtmlTarget = document.querySelector("[data-component=" + name + "]");
            if (componentHtmlTarget === null) {
                return;
            }

            Object.keys(Event.prototype).map(function (ev, i) {
                var _this2 = this;

                if (i >= 10 && i <= 19) {
                    componentHtmlTarget.addEventListener(ev.toLowerCase(), function (e) {
                        var target = _this2.getTarget(e);
                        var action = _this2.getAction(e, target);
                        if (actions[action.name] == null) {
                            return;
                        }

                        if (action.args === "") {
                            actions[action.name]();
                        } else {
                            actions[action.name].apply(action, action.args);
                        }
                    });
                }
            }, this);
        }
    }, {
        key: "getTarget",
        value: function getTarget(e) {
            e = e || window.event;
            return e.target || e.srcElement;
        }
    }, {
        key: "getAction",
        value: function getAction(e, target) {
            var actionStr = target.dataset[e.type] || "";

            return {
                name: this.getActionName(actionStr),
                args: this.extractArgs(actionStr, target)
            };
        }
    }, {
        key: "getActionName",
        value: function getActionName(actionStr) {
            var nameResult = actionStr.match(/[^(]*/);
            return nameResult ? nameResult[0] : "";
        }
    }, {
        key: "extractArgs",
        value: function extractArgs(actionStr, target) {
            var args = /\(\s*([^)]+?)\s*\)/.exec(actionStr);
            if (!args || args[1] == null) {
                return "";
            }

            args = args[1].split(/\s*,\s*/).map(function (arg) {
                return arg.match(/(value)/) ? this.value : arg;
            }, target);

            return args;
        }
    }]);

    return Component;
}();

var comp = new Comp();

if (typeof exports != 'undefined' && !exports.nodeType) {
    if (typeof module != 'undefined' && !module.nodeType && module.exports) {
        exports = module.exports = comp;
    }
} else {
    window.comp = comp;
}
