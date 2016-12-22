/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Componentizer = function () {
    function Componentizer() {
        _classCallCheck(this, Componentizer);

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
    //     this.recorder = new Componentizer.Component("recorder", actions, view, model);
    // }

    _createClass(Componentizer, [{
        key: "create",
        value: function create(componentName, actions) {
            var view = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};
            var model = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

            this.components[componentName] = new Componentizer.Component(componentName, actions, view, model);
        }
    }]);

    return Componentizer;
}();

Componentizer.Component = function () {
    function _class(componentName, actions, view, model) {
        _classCallCheck(this, _class);

        if (componentName == null || componentName === "") {
            throw new Error("Your component needs a name");
        }

        if (actions == null) {
            var example = "// It must be a function that takes a model and returns an object of functions, e.g.\r\n\r\nYourComponent.Actions = function (model) {\r\n    return {\r\n        sayHello: () { console.log('Hi.'); },\r\n        greet: (name) { console.log('Hello, ' + name); }\r\n    }\r\n}";
            throw new Error(componentName + " needs some actions! Here's an example of an Actions function:\r\n\r\n" + example + "\r\n\r\n");
        }

        this.componentName = componentName;

        var _view = view && view();
        var viewInit = _view && _view.init ? _view.init : function () {};
        var render = _view && _view.render ? _view.render : function () {};

        Object.assign(this, this.componentize(actions(model), render, model));
        viewInit(this, model);

        // if (componentizer.recorder && componentName !== "recorder") {
        //     componentizer.recorder.storeComponent(this, model);
        // }
    }

    _createClass(_class, [{
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

    return _class;
}();

var comp = new Componentizer();
Object.freeze(comp);

if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    exports = module.exports = comp;
} else {
    window.comp = comp;
}

/***/ }
/******/ ]);