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

            render(model);
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
                    render(model);
                };
            }, this);
            component.get = function (prop) {
                return model[prop];
            };
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
    }]);

    return Component;
}();

var comp = new Comp();

if (typeof exports != 'undefined' && !exports.nodeType) {
    if (typeof module != 'undefined' && !module.nodeType && module.exports) {
        exports = module.exports = comp;
    }
    exports.comp = comp;
} else {
    window.comp = comp;
}
