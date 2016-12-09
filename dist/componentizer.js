'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by bjefferis on 23/11/2016.
 */

var Componentizer = function () {
    function Componentizer() {
        _classCallCheck(this, Componentizer);
    }

    _createClass(Componentizer, [{
        key: 'createRecorder',
        value: function createRecorder(actions) {
            var view = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

            var path = window.location.pathname;
            var model = {
                pageLoadTimestamp: Date.now(),
                steps: [],
                components: {},
                recording: true,
                sessionName: path.substr(1, path.indexOf('.') - 1).split('/').join('_')
            };
            this.recorder = new Componentizer.Component("recorder", actions, view, model);
        }
    }, {
        key: 'create',
        value: function create(componentName, actions) {
            var view = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};
            var model = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

            if (this.components === undefined) {
                this.components = {};
            }
            this.components[componentName] = new Componentizer.Component(componentName, actions, view, model);
        }
    }]);

    return Componentizer;
}();

;

Componentizer.Component = function () {
    function Component(componentName, actions, view, model) {
        var _this = this;

        _classCallCheck(this, Component);

        if (componentName == null || componentName === "") {
            throw new Error("Your component needs a name");
        }

        if (actions == null) {
            var example = "// It must be a function that takes a model and returns an object of functions, e.g.\r\n\r\nYourComponent.Actions = function (model) {\r\n    return {\r\n        sayHello: () { console.log('Hi.'); },\r\n        greet: (name) { console.log('Hello, ' + name); }\r\n    }\r\n}";
            throw new Error(componentName + ' needs some actions! Here\'s an example of an Actions function:\r\n\r\n' + example + '\r\n\r\n');
        }

        this.componentName = componentName;

        var _view = view && view();
        var viewInit = _view && _view.init ? _view.init : function () {};
        var selectors = _view && _view.el ? _view.el : {};
        var elements = this.confirmOrRegisterElements(selectors, {});
        var render = _view && _view.render ? function (model) {
            elements = _this.confirmOrRegisterElements(selectors, elements);
            _view.render(model, elements);
        } : function () {};

        Object.assign(this, this.componentize(this.componentName, actions(model), render, model));
        if (Object.keys(elements).length === 0 && elements.constructor === Object) {
            viewInit(this, model);
        } else {
            viewInit(this, elements, model);
        }

        if (componentizer.recorder && componentName !== "recorder") {
            componentizer.recorder.storeComponent(this, model);
        }
    }

    _createClass(Component, [{
        key: 'componentize',
        value: function componentize(componentName, actions, render, model) {
            var _this2 = this;

            render(model);
            var component = {};
            Object.keys(actions).map(function (action) {
                component[action] = function () {
                    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                        args[_key] = arguments[_key];
                    }

                    var returnValue = actions[action].apply(actions, args);

                    if (componentizer.recorder && componentName !== "recorder" && componentizer.recorder.get("recording")) {
                        componentizer.recorder.recordStep(componentName, model, action, args);
                    }

                    if (returnValue && returnValue.then) {
                        _this2.handlePromise(returnValue, render);
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
        key: 'handlePromise',
        value: function handlePromise(promise, render) {
            promise.then(function (updatedModel) {
                if (updatedModel == null) {
                    throw new Error("No model received: aborting render");
                }
                render(updatedModel, elements);
            }).catch(function (err) {
                if (typeof err === "string") {
                    console.error(err);
                } else {
                    console.error('Error unhandled by component. Add a catch handler to your AJAX method.');
                }
            });
        }
    }, {
        key: 'confirmOrRegisterElements',
        value: function confirmOrRegisterElements(selectors) {
            var elements = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            Object.keys(selectors).map(function (elName) {
                elements[elName] = elements[elName] && document.documentElement.contains(elements[elName][0]) ? elements[elName] = elements[elName] : elements[elName] = $(selectors[elName]);
            });
            return elements;
        }
    }]);

    return Component;
}();

window.componentizer = window._comp = new Componentizer();
