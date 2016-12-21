/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
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
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
class Componentizer {
    constructor() {
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

    create(componentName, actions, view = ()=>{}, model = {}) {
        this.components[componentName] = new Componentizer.Component(componentName, actions, view, model);
    }
}

Componentizer.Component = class {
    constructor (componentName, actions, view, model) {
        if (componentName == null || componentName === "") {
            throw new Error("Your component needs a name");
        }

        if (actions == null) {
            const example = "// It must be a function that takes a model and returns an object of functions, e.g.\r\n\r\nYourComponent.Actions = function (model) {\r\n    return {\r\n        sayHello: () { console.log('Hi.'); },\r\n        greet: (name) { console.log('Hello, ' + name); }\r\n    }\r\n}";
            throw new Error(`${componentName} needs some actions! Here's an example of an Actions function:\r\n\r\n${example}\r\n\r\n`);
        }

        this.componentName = componentName;

        let _view = view && view();
        let viewInit = _view && _view.init ? _view.init : () => {};
        let render = _view && _view.render ? _view.render : () =>{};

        Object.assign(this, this.componentize(actions(model), render, model));
        viewInit(this, model);

        // if (componentizer.recorder && componentName !== "recorder") {
        //     componentizer.recorder.storeComponent(this, model);
        // }
    }

    componentize(actions, render, model) {
        render(model);
        let component = {};
        Object.keys(actions).map((action) => {
            component[action] = (...args) => {

                let returnValue = actions[action].apply(actions, args);

                // if (componentizer.recorder && componentName !== "recorder" && componentizer.recorder.get("recording")) {
                //     componentizer.recorder.recordStep(componentName, model, action, args);
                // }

                if (returnValue && returnValue.then) {
                    this.handlePromise(returnValue, render);
                }
                render(model);
            }
        }, this);
        component.get = (prop) => model[prop];
        return component;
    }

    handlePromise(promise, render) {
        promise
            .then((updatedModel)=> {
                if (updatedModel == null) {
                    throw new Error("No model received: aborting render");
                }
                render(updatedModel);
            })
            .catch((err) => {
                if (typeof err === "string") {
                    console.error(err);
                } else {
                    console.error(`Error unhandled by component. Add a catch handler to your AJAX method.`);
                }
            });
    }
}

const comp = new Componentizer();
Object.freeze(comp);

/* harmony default export */ exports["a"] = comp;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(4);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(6)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./styles.scss", function() {
			var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/sass-loader/index.js!./styles.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__componentizer__ = __webpack_require__(0);


window.Example6 = window.Example6 ? window.Example6 : {};

Example6.Modal = {};

Example6.Modal.Actions = (model) => {

    return {
        show: function(content) {
            if (typeof content === "string") {
                content.trim();
            }
            model.content = content;
            model.showModal = model.content != null && model.content !== "";
        },

        close: function () {
            model.content = "";
            model.showModal = false;
        }
    };
};

Example6.Modal.View = () => {
    const COMPONENT = $("[data-component=modal]");
    
    const MODAL_CONTENT = COMPONENT.find("[data-selector=modal-content]");
    const BUTTON_CLOSE = COMPONENT.find("[data-selector=button-close]");

    return {
        init: (actions) => {
            COMPONENT.children().on("click", (e) => { e.stopPropagation(); });
            COMPONENT.on("click", actions.close);
            BUTTON_CLOSE.on("click", actions.close);
        },
        render: (model) => {
            if (model.content != null && model.content !== "") {
                MODAL_CONTENT.html(model.content);
            }

            if (model.showModal) {
                COMPONENT.fadeIn();
            } else {
                COMPONENT.fadeOut();
            }
        }
    };
};

__WEBPACK_IMPORTED_MODULE_0__componentizer__["a" /* default */].create("modal", Example6.Modal.Actions, Example6.Modal.View);

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__componentizer__ = __webpack_require__(0);


window.Example6 = window.Example6 ? window.Example6 : {};

Example6.Actions = (model) => {

	return {
		getUsers: () => {
			return $.get(`${model.apiUrl}/users`)
				.catch((result) => {
					if (result.readyState === 4) {
                        model.errorMessage = `Sorry! We couldn't find any users.`;    
                    } else if (result.readyState === 0) {
                        model.errorMessage = `We couldn't get any users due to a network error.`
                    } else {
                        model.errorMessage = "Something went wrong.";
                    }
				})
				.then((result) => {
					model.users = result;
					return model;
				});
		}
	}
};

Example6.View = () => {
	const COMPONENT = $("[data-component=example-6]");
	const BUTTON = COMPONENT.find("[data-selector=get-user-list]");
	const USER_LIST = COMPONENT.find("[data-selector=user-list]");

	function renderUserList(users) {
		return $("<ul/>")
			.append(users.map(renderUser));
	}

	function renderUser(user) {
		return $("<li/>")
			.append(
				$("<span/>")
					.attr("class", "user-name")
					.text(user.name)
			)
			.append(
				$("<button>")
					.attr("data-selector", `show-user-details`)
					.attr("data-user-id", user.id)
					.text("View details")
			)
	}

	function renderUserDetails(user) {
		return user
			? $("<div/>")
				.append(
					$("<p/>")
						.text(`Email: ${user.email}`)
				)
				.append(
					$("<p/>")
						.text(`Phone: ${user.phone}`)
				)
			: "";
	}

	return {
		init: (actions, model) => {
			BUTTON.on("click", actions.getUsers);
			COMPONENT.on("click", "[data-selector=show-user-details]", (e) => {
				var user = model.users.find((x) => { return x.id === parseInt(e.currentTarget.getAttribute("data-user-id"), 10); });

				if (__WEBPACK_IMPORTED_MODULE_0__componentizer__["a" /* default */].components.modal) {
                    __WEBPACK_IMPORTED_MODULE_0__componentizer__["a" /* default */].components.modal.show(renderUserDetails(user));
                }
			});
		},
		render: (model) => {
			if (model.users) {
				USER_LIST.html(renderUserList(model.users));
			}
		}
	}
};

__WEBPACK_IMPORTED_MODULE_0__componentizer__["a" /* default */].create("example6", Example6.Actions, Example6.View, {
    apiUrl: "https://jsonplaceholder.typicode.com",
    users: []
});

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(5)();
// imports


// module
exports.push([module.i, "* {\n  box-sizing: border-box; }\n\nbody {\n  font-family: sans-serif; }\n\na {\n  color: blue; }\n\n[data-component] {\n  border: 1px dotted #ccc;\n  margin: 10px;\n  padding: 10px; }\n  [data-component] h6 {\n    color: #aaa;\n    font-size: 10px;\n    margin: 0; }\n\n.modal {\n  border: none;\n  margin: 0;\n  content: '';\n  width: 100%;\n  height: 100%;\n  position: fixed;\n  background: rgba(0, 0, 0, 0.5);\n  top: 0;\n  left: 0; }\n  .modal .modal-container {\n    background: #fff;\n    position: absolute;\n    top: 20%;\n    transform: translate(50%);\n    min-width: 320px;\n    width: 50%;\n    box-shadow: 0 6px 20px rgba(50, 50, 50, 0.2);\n    border-radius: 3px;\n    border: 1px solid #ddd;\n    padding: 10px; }\n  .modal .modal-content {\n    margin-bottom: 30px; }\n\n.validation {\n  font-size: 10px;\n  color: crimson; }\n\n.error-message {\n  background: crimson;\n  color: #fff;\n  padding: 10px;\n  border-radius: 2px;\n  display: none; }\n", ""]);

// exports


/***/ },
/* 5 */
/***/ function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function() {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		var result = [];
		for(var i = 0; i < this.length; i++) {
			var item = this[i];
			if(item[2]) {
				result.push("@media " + item[2] + "{" + item[1] + "}");
			} else {
				result.push(item[1]);
			}
		}
		return result.join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};


/***/ },
/* 6 */
/***/ function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
	}),
	getHeadElement = memoize(function () {
		return document.head || document.getElementsByTagName("head")[0];
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [];

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the bottom of <head>.
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
}

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var head = getHeadElement();
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			head.insertBefore(styleElement, head.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			head.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		head.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	styleElement.type = "text/css";
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	linkElement.rel = "stylesheet";
	insertStyleElement(options, linkElement);
	return linkElement;
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__css_styles_scss__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__css_styles_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__css_styles_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__example_6_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__example_6_modal_js__ = __webpack_require__(2);





/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNjU5M2U3NzMxZTM0MzQ2MzIyYWEiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudGl6ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2V4YW1wbGVzL2Nzcy9zdHlsZXMuc2Nzcz9lYWE1Iiwid2VicGFjazovLy8uL3NyYy9leGFtcGxlcy9leGFtcGxlNi9leGFtcGxlLTYtbW9kYWwuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2V4YW1wbGVzL2V4YW1wbGU2L2V4YW1wbGUtNi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZXhhbXBsZXMvY3NzL3N0eWxlcy5zY3NzIiwid2VicGFjazovLy8uL34vY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanMiLCJ3ZWJwYWNrOi8vLy4vfi9zdHlsZS1sb2FkZXIvYWRkU3R5bGVzLmpzIiwid2VicGFjazovLy8uL3NyYy9leGFtcGxlcy9leGFtcGxlNi9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsbURBQTJDLGNBQWM7O0FBRXpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0Q0FBNEM7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7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Q0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1REFBdUQ7QUFDdkQ7O0FBRUEsNkJBQTZCLG1CQUFtQjs7QUFFaEQ7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDclBBO0FBQ0E7QUFDQSIsImZpbGUiOiJleGFtcGxlNi9leGFtcGxlNi5idW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9ueSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA3KTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA2NTkzZTc3MzFlMzQzNDYzMjJhYSIsImNsYXNzIENvbXBvbmVudGl6ZXIge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnRzID0ge307XHJcbiAgICB9XHJcbiAgICAvLyBjcmVhdGVSZWNvcmRlcihhY3Rpb25zLCB2aWV3ID0gKCk9Pnt9KSB7XHJcbiAgICAvLyAgICAgbGV0IHBhdGggPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWU7XHJcbiAgICAvLyAgICAgbGV0IG1vZGVsID0ge1xyXG4gICAgLy8gICAgICAgICBwYWdlTG9hZFRpbWVzdGFtcDogRGF0ZS5ub3coKSxcclxuICAgIC8vICAgICAgICAgc3RlcHM6IFtdLFxyXG4gICAgLy8gICAgICAgICBjb21wb25lbnRzOiB7fSxcclxuICAgIC8vICAgICAgICAgcmVjb3JkaW5nOiB0cnVlLFxyXG4gICAgLy8gICAgICAgICBzZXNzaW9uTmFtZTogcGF0aC5zdWJzdHIoMSwgcGF0aC5pbmRleE9mKCcuJyktMSkuc3BsaXQoJy8nKS5qb2luKCdfJylcclxuICAgIC8vICAgICB9O1xyXG4gICAgLy8gICAgIHRoaXMucmVjb3JkZXIgPSBuZXcgQ29tcG9uZW50aXplci5Db21wb25lbnQoXCJyZWNvcmRlclwiLCBhY3Rpb25zLCB2aWV3LCBtb2RlbCk7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgY3JlYXRlKGNvbXBvbmVudE5hbWUsIGFjdGlvbnMsIHZpZXcgPSAoKT0+e30sIG1vZGVsID0ge30pIHtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudHNbY29tcG9uZW50TmFtZV0gPSBuZXcgQ29tcG9uZW50aXplci5Db21wb25lbnQoY29tcG9uZW50TmFtZSwgYWN0aW9ucywgdmlldywgbW9kZWwpO1xyXG4gICAgfVxyXG59XHJcblxyXG5Db21wb25lbnRpemVyLkNvbXBvbmVudCA9IGNsYXNzIHtcclxuICAgIGNvbnN0cnVjdG9yIChjb21wb25lbnROYW1lLCBhY3Rpb25zLCB2aWV3LCBtb2RlbCkge1xyXG4gICAgICAgIGlmIChjb21wb25lbnROYW1lID09IG51bGwgfHwgY29tcG9uZW50TmFtZSA9PT0gXCJcIikge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJZb3VyIGNvbXBvbmVudCBuZWVkcyBhIG5hbWVcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoYWN0aW9ucyA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGV4YW1wbGUgPSBcIi8vIEl0IG11c3QgYmUgYSBmdW5jdGlvbiB0aGF0IHRha2VzIGEgbW9kZWwgYW5kIHJldHVybnMgYW4gb2JqZWN0IG9mIGZ1bmN0aW9ucywgZS5nLlxcclxcblxcclxcbllvdXJDb21wb25lbnQuQWN0aW9ucyA9IGZ1bmN0aW9uIChtb2RlbCkge1xcclxcbiAgICByZXR1cm4ge1xcclxcbiAgICAgICAgc2F5SGVsbG86ICgpIHsgY29uc29sZS5sb2coJ0hpLicpOyB9LFxcclxcbiAgICAgICAgZ3JlZXQ6IChuYW1lKSB7IGNvbnNvbGUubG9nKCdIZWxsbywgJyArIG5hbWUpOyB9XFxyXFxuICAgIH1cXHJcXG59XCI7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHtjb21wb25lbnROYW1lfSBuZWVkcyBzb21lIGFjdGlvbnMhIEhlcmUncyBhbiBleGFtcGxlIG9mIGFuIEFjdGlvbnMgZnVuY3Rpb246XFxyXFxuXFxyXFxuJHtleGFtcGxlfVxcclxcblxcclxcbmApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jb21wb25lbnROYW1lID0gY29tcG9uZW50TmFtZTtcclxuXHJcbiAgICAgICAgbGV0IF92aWV3ID0gdmlldyAmJiB2aWV3KCk7XHJcbiAgICAgICAgbGV0IHZpZXdJbml0ID0gX3ZpZXcgJiYgX3ZpZXcuaW5pdCA/IF92aWV3LmluaXQgOiAoKSA9PiB7fTtcclxuICAgICAgICBsZXQgcmVuZGVyID0gX3ZpZXcgJiYgX3ZpZXcucmVuZGVyID8gX3ZpZXcucmVuZGVyIDogKCkgPT57fTtcclxuXHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCB0aGlzLmNvbXBvbmVudGl6ZShhY3Rpb25zKG1vZGVsKSwgcmVuZGVyLCBtb2RlbCkpO1xyXG4gICAgICAgIHZpZXdJbml0KHRoaXMsIG1vZGVsKTtcclxuXHJcbiAgICAgICAgLy8gaWYgKGNvbXBvbmVudGl6ZXIucmVjb3JkZXIgJiYgY29tcG9uZW50TmFtZSAhPT0gXCJyZWNvcmRlclwiKSB7XHJcbiAgICAgICAgLy8gICAgIGNvbXBvbmVudGl6ZXIucmVjb3JkZXIuc3RvcmVDb21wb25lbnQodGhpcywgbW9kZWwpO1xyXG4gICAgICAgIC8vIH1cclxuICAgIH1cclxuXHJcbiAgICBjb21wb25lbnRpemUoYWN0aW9ucywgcmVuZGVyLCBtb2RlbCkge1xyXG4gICAgICAgIHJlbmRlcihtb2RlbCk7XHJcbiAgICAgICAgbGV0IGNvbXBvbmVudCA9IHt9O1xyXG4gICAgICAgIE9iamVjdC5rZXlzKGFjdGlvbnMpLm1hcCgoYWN0aW9uKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbXBvbmVudFthY3Rpb25dID0gKC4uLmFyZ3MpID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgcmV0dXJuVmFsdWUgPSBhY3Rpb25zW2FjdGlvbl0uYXBwbHkoYWN0aW9ucywgYXJncyk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gaWYgKGNvbXBvbmVudGl6ZXIucmVjb3JkZXIgJiYgY29tcG9uZW50TmFtZSAhPT0gXCJyZWNvcmRlclwiICYmIGNvbXBvbmVudGl6ZXIucmVjb3JkZXIuZ2V0KFwicmVjb3JkaW5nXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgY29tcG9uZW50aXplci5yZWNvcmRlci5yZWNvcmRTdGVwKGNvbXBvbmVudE5hbWUsIG1vZGVsLCBhY3Rpb24sIGFyZ3MpO1xyXG4gICAgICAgICAgICAgICAgLy8gfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChyZXR1cm5WYWx1ZSAmJiByZXR1cm5WYWx1ZS50aGVuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVQcm9taXNlKHJldHVyblZhbHVlLCByZW5kZXIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmVuZGVyKG1vZGVsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIHRoaXMpO1xyXG4gICAgICAgIGNvbXBvbmVudC5nZXQgPSAocHJvcCkgPT4gbW9kZWxbcHJvcF07XHJcbiAgICAgICAgcmV0dXJuIGNvbXBvbmVudDtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVQcm9taXNlKHByb21pc2UsIHJlbmRlcikge1xyXG4gICAgICAgIHByb21pc2VcclxuICAgICAgICAgICAgLnRoZW4oKHVwZGF0ZWRNb2RlbCk9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAodXBkYXRlZE1vZGVsID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJObyBtb2RlbCByZWNlaXZlZDogYWJvcnRpbmcgcmVuZGVyXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmVuZGVyKHVwZGF0ZWRNb2RlbCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGVyciA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihgRXJyb3IgdW5oYW5kbGVkIGJ5IGNvbXBvbmVudC4gQWRkIGEgY2F0Y2ggaGFuZGxlciB0byB5b3VyIEFKQVggbWV0aG9kLmApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgY29tcCA9IG5ldyBDb21wb25lbnRpemVyKCk7XHJcbk9iamVjdC5mcmVlemUoY29tcCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjb21wO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2NvbXBvbmVudGl6ZXIuanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gc3R5bGUtbG9hZGVyOiBBZGRzIHNvbWUgY3NzIHRvIHRoZSBET00gYnkgYWRkaW5nIGEgPHN0eWxlPiB0YWdcblxuLy8gbG9hZCB0aGUgc3R5bGVzXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvaW5kZXguanMhLi9zdHlsZXMuc2Nzc1wiKTtcbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2FkZFN0eWxlcy5qc1wiKShjb250ZW50LCB7fSk7XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbmlmKG1vZHVsZS5ob3QpIHtcblx0Ly8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0aWYoIWNvbnRlbnQubG9jYWxzKSB7XG5cdFx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvaW5kZXguanMhLi9zdHlsZXMuc2Nzc1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9pbmRleC5qcyEuL3N0eWxlcy5zY3NzXCIpO1xuXHRcdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cdFx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gV2hlbiB0aGUgbW9kdWxlIGlzIGRpc3Bvc2VkLCByZW1vdmUgdGhlIDxzdHlsZT4gdGFnc1xuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9leGFtcGxlcy9jc3Mvc3R5bGVzLnNjc3Ncbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IGNvbXAgZnJvbSBcIi4uLy4uL2NvbXBvbmVudGl6ZXJcIjtcclxuXHJcbndpbmRvdy5FeGFtcGxlNiA9IHdpbmRvdy5FeGFtcGxlNiA/IHdpbmRvdy5FeGFtcGxlNiA6IHt9O1xyXG5cclxuRXhhbXBsZTYuTW9kYWwgPSB7fTtcclxuXHJcbkV4YW1wbGU2Lk1vZGFsLkFjdGlvbnMgPSAobW9kZWwpID0+IHtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHNob3c6IGZ1bmN0aW9uKGNvbnRlbnQpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBjb250ZW50ID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgICAgICBjb250ZW50LnRyaW0oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBtb2RlbC5jb250ZW50ID0gY29udGVudDtcclxuICAgICAgICAgICAgbW9kZWwuc2hvd01vZGFsID0gbW9kZWwuY29udGVudCAhPSBudWxsICYmIG1vZGVsLmNvbnRlbnQgIT09IFwiXCI7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgY2xvc2U6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgbW9kZWwuY29udGVudCA9IFwiXCI7XHJcbiAgICAgICAgICAgIG1vZGVsLnNob3dNb2RhbCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn07XHJcblxyXG5FeGFtcGxlNi5Nb2RhbC5WaWV3ID0gKCkgPT4ge1xyXG4gICAgY29uc3QgQ09NUE9ORU5UID0gJChcIltkYXRhLWNvbXBvbmVudD1tb2RhbF1cIik7XHJcbiAgICBcclxuICAgIGNvbnN0IE1PREFMX0NPTlRFTlQgPSBDT01QT05FTlQuZmluZChcIltkYXRhLXNlbGVjdG9yPW1vZGFsLWNvbnRlbnRdXCIpO1xyXG4gICAgY29uc3QgQlVUVE9OX0NMT1NFID0gQ09NUE9ORU5ULmZpbmQoXCJbZGF0YS1zZWxlY3Rvcj1idXR0b24tY2xvc2VdXCIpO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaW5pdDogKGFjdGlvbnMpID0+IHtcclxuICAgICAgICAgICAgQ09NUE9ORU5ULmNoaWxkcmVuKCkub24oXCJjbGlja1wiLCAoZSkgPT4geyBlLnN0b3BQcm9wYWdhdGlvbigpOyB9KTtcclxuICAgICAgICAgICAgQ09NUE9ORU5ULm9uKFwiY2xpY2tcIiwgYWN0aW9ucy5jbG9zZSk7XHJcbiAgICAgICAgICAgIEJVVFRPTl9DTE9TRS5vbihcImNsaWNrXCIsIGFjdGlvbnMuY2xvc2UpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcmVuZGVyOiAobW9kZWwpID0+IHtcclxuICAgICAgICAgICAgaWYgKG1vZGVsLmNvbnRlbnQgIT0gbnVsbCAmJiBtb2RlbC5jb250ZW50ICE9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICBNT0RBTF9DT05URU5ULmh0bWwobW9kZWwuY29udGVudCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChtb2RlbC5zaG93TW9kYWwpIHtcclxuICAgICAgICAgICAgICAgIENPTVBPTkVOVC5mYWRlSW4oKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIENPTVBPTkVOVC5mYWRlT3V0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59O1xyXG5cclxuY29tcC5jcmVhdGUoXCJtb2RhbFwiLCBFeGFtcGxlNi5Nb2RhbC5BY3Rpb25zLCBFeGFtcGxlNi5Nb2RhbC5WaWV3KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9leGFtcGxlcy9leGFtcGxlNi9leGFtcGxlLTYtbW9kYWwuanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IGNvbXAgZnJvbSBcIi4uLy4uL2NvbXBvbmVudGl6ZXJcIlxyXG5cclxud2luZG93LkV4YW1wbGU2ID0gd2luZG93LkV4YW1wbGU2ID8gd2luZG93LkV4YW1wbGU2IDoge307XHJcblxyXG5FeGFtcGxlNi5BY3Rpb25zID0gKG1vZGVsKSA9PiB7XHJcblxyXG5cdHJldHVybiB7XHJcblx0XHRnZXRVc2VyczogKCkgPT4ge1xyXG5cdFx0XHRyZXR1cm4gJC5nZXQoYCR7bW9kZWwuYXBpVXJsfS91c2Vyc2ApXHJcblx0XHRcdFx0LmNhdGNoKChyZXN1bHQpID0+IHtcclxuXHRcdFx0XHRcdGlmIChyZXN1bHQucmVhZHlTdGF0ZSA9PT0gNCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RlbC5lcnJvck1lc3NhZ2UgPSBgU29ycnkhIFdlIGNvdWxkbid0IGZpbmQgYW55IHVzZXJzLmA7ICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzdWx0LnJlYWR5U3RhdGUgPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbW9kZWwuZXJyb3JNZXNzYWdlID0gYFdlIGNvdWxkbid0IGdldCBhbnkgdXNlcnMgZHVlIHRvIGEgbmV0d29yayBlcnJvci5gXHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbW9kZWwuZXJyb3JNZXNzYWdlID0gXCJTb21ldGhpbmcgd2VudCB3cm9uZy5cIjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0XHQudGhlbigocmVzdWx0KSA9PiB7XHJcblx0XHRcdFx0XHRtb2RlbC51c2VycyA9IHJlc3VsdDtcclxuXHRcdFx0XHRcdHJldHVybiBtb2RlbDtcclxuXHRcdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9XHJcbn07XHJcblxyXG5FeGFtcGxlNi5WaWV3ID0gKCkgPT4ge1xyXG5cdGNvbnN0IENPTVBPTkVOVCA9ICQoXCJbZGF0YS1jb21wb25lbnQ9ZXhhbXBsZS02XVwiKTtcclxuXHRjb25zdCBCVVRUT04gPSBDT01QT05FTlQuZmluZChcIltkYXRhLXNlbGVjdG9yPWdldC11c2VyLWxpc3RdXCIpO1xyXG5cdGNvbnN0IFVTRVJfTElTVCA9IENPTVBPTkVOVC5maW5kKFwiW2RhdGEtc2VsZWN0b3I9dXNlci1saXN0XVwiKTtcclxuXHJcblx0ZnVuY3Rpb24gcmVuZGVyVXNlckxpc3QodXNlcnMpIHtcclxuXHRcdHJldHVybiAkKFwiPHVsLz5cIilcclxuXHRcdFx0LmFwcGVuZCh1c2Vycy5tYXAocmVuZGVyVXNlcikpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gcmVuZGVyVXNlcih1c2VyKSB7XHJcblx0XHRyZXR1cm4gJChcIjxsaS8+XCIpXHJcblx0XHRcdC5hcHBlbmQoXHJcblx0XHRcdFx0JChcIjxzcGFuLz5cIilcclxuXHRcdFx0XHRcdC5hdHRyKFwiY2xhc3NcIiwgXCJ1c2VyLW5hbWVcIilcclxuXHRcdFx0XHRcdC50ZXh0KHVzZXIubmFtZSlcclxuXHRcdFx0KVxyXG5cdFx0XHQuYXBwZW5kKFxyXG5cdFx0XHRcdCQoXCI8YnV0dG9uPlwiKVxyXG5cdFx0XHRcdFx0LmF0dHIoXCJkYXRhLXNlbGVjdG9yXCIsIGBzaG93LXVzZXItZGV0YWlsc2ApXHJcblx0XHRcdFx0XHQuYXR0cihcImRhdGEtdXNlci1pZFwiLCB1c2VyLmlkKVxyXG5cdFx0XHRcdFx0LnRleHQoXCJWaWV3IGRldGFpbHNcIilcclxuXHRcdFx0KVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gcmVuZGVyVXNlckRldGFpbHModXNlcikge1xyXG5cdFx0cmV0dXJuIHVzZXJcclxuXHRcdFx0PyAkKFwiPGRpdi8+XCIpXHJcblx0XHRcdFx0LmFwcGVuZChcclxuXHRcdFx0XHRcdCQoXCI8cC8+XCIpXHJcblx0XHRcdFx0XHRcdC50ZXh0KGBFbWFpbDogJHt1c2VyLmVtYWlsfWApXHJcblx0XHRcdFx0KVxyXG5cdFx0XHRcdC5hcHBlbmQoXHJcblx0XHRcdFx0XHQkKFwiPHAvPlwiKVxyXG5cdFx0XHRcdFx0XHQudGV4dChgUGhvbmU6ICR7dXNlci5waG9uZX1gKVxyXG5cdFx0XHRcdClcclxuXHRcdFx0OiBcIlwiO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIHtcclxuXHRcdGluaXQ6IChhY3Rpb25zLCBtb2RlbCkgPT4ge1xyXG5cdFx0XHRCVVRUT04ub24oXCJjbGlja1wiLCBhY3Rpb25zLmdldFVzZXJzKTtcclxuXHRcdFx0Q09NUE9ORU5ULm9uKFwiY2xpY2tcIiwgXCJbZGF0YS1zZWxlY3Rvcj1zaG93LXVzZXItZGV0YWlsc11cIiwgKGUpID0+IHtcclxuXHRcdFx0XHR2YXIgdXNlciA9IG1vZGVsLnVzZXJzLmZpbmQoKHgpID0+IHsgcmV0dXJuIHguaWQgPT09IHBhcnNlSW50KGUuY3VycmVudFRhcmdldC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXVzZXItaWRcIiksIDEwKTsgfSk7XHJcblxyXG5cdFx0XHRcdGlmIChjb21wLmNvbXBvbmVudHMubW9kYWwpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb21wLmNvbXBvbmVudHMubW9kYWwuc2hvdyhyZW5kZXJVc2VyRGV0YWlscyh1c2VyKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSxcclxuXHRcdHJlbmRlcjogKG1vZGVsKSA9PiB7XHJcblx0XHRcdGlmIChtb2RlbC51c2Vycykge1xyXG5cdFx0XHRcdFVTRVJfTElTVC5odG1sKHJlbmRlclVzZXJMaXN0KG1vZGVsLnVzZXJzKSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcbn07XHJcblxyXG5jb21wLmNyZWF0ZShcImV4YW1wbGU2XCIsIEV4YW1wbGU2LkFjdGlvbnMsIEV4YW1wbGU2LlZpZXcsIHtcclxuICAgIGFwaVVybDogXCJodHRwczovL2pzb25wbGFjZWhvbGRlci50eXBpY29kZS5jb21cIixcclxuICAgIHVzZXJzOiBbXVxyXG59KTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9leGFtcGxlcy9leGFtcGxlNi9leGFtcGxlLTYuanNcbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKCk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCIqIHtcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7IH1cXG5cXG5ib2R5IHtcXG4gIGZvbnQtZmFtaWx5OiBzYW5zLXNlcmlmOyB9XFxuXFxuYSB7XFxuICBjb2xvcjogYmx1ZTsgfVxcblxcbltkYXRhLWNvbXBvbmVudF0ge1xcbiAgYm9yZGVyOiAxcHggZG90dGVkICNjY2M7XFxuICBtYXJnaW46IDEwcHg7XFxuICBwYWRkaW5nOiAxMHB4OyB9XFxuICBbZGF0YS1jb21wb25lbnRdIGg2IHtcXG4gICAgY29sb3I6ICNhYWE7XFxuICAgIGZvbnQtc2l6ZTogMTBweDtcXG4gICAgbWFyZ2luOiAwOyB9XFxuXFxuLm1vZGFsIHtcXG4gIGJvcmRlcjogbm9uZTtcXG4gIG1hcmdpbjogMDtcXG4gIGNvbnRlbnQ6ICcnO1xcbiAgd2lkdGg6IDEwMCU7XFxuICBoZWlnaHQ6IDEwMCU7XFxuICBwb3NpdGlvbjogZml4ZWQ7XFxuICBiYWNrZ3JvdW5kOiByZ2JhKDAsIDAsIDAsIDAuNSk7XFxuICB0b3A6IDA7XFxuICBsZWZ0OiAwOyB9XFxuICAubW9kYWwgLm1vZGFsLWNvbnRhaW5lciB7XFxuICAgIGJhY2tncm91bmQ6ICNmZmY7XFxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gICAgdG9wOiAyMCU7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKDUwJSk7XFxuICAgIG1pbi13aWR0aDogMzIwcHg7XFxuICAgIHdpZHRoOiA1MCU7XFxuICAgIGJveC1zaGFkb3c6IDAgNnB4IDIwcHggcmdiYSg1MCwgNTAsIDUwLCAwLjIpO1xcbiAgICBib3JkZXItcmFkaXVzOiAzcHg7XFxuICAgIGJvcmRlcjogMXB4IHNvbGlkICNkZGQ7XFxuICAgIHBhZGRpbmc6IDEwcHg7IH1cXG4gIC5tb2RhbCAubW9kYWwtY29udGVudCB7XFxuICAgIG1hcmdpbi1ib3R0b206IDMwcHg7IH1cXG5cXG4udmFsaWRhdGlvbiB7XFxuICBmb250LXNpemU6IDEwcHg7XFxuICBjb2xvcjogY3JpbXNvbjsgfVxcblxcbi5lcnJvci1tZXNzYWdlIHtcXG4gIGJhY2tncm91bmQ6IGNyaW1zb247XFxuICBjb2xvcjogI2ZmZjtcXG4gIHBhZGRpbmc6IDEwcHg7XFxuICBib3JkZXItcmFkaXVzOiAycHg7XFxuICBkaXNwbGF5OiBub25lOyB9XFxuXCIsIFwiXCJdKTtcblxuLy8gZXhwb3J0c1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2Nzcy1sb2FkZXIhLi9+L3Nhc3MtbG9hZGVyIS4vc3JjL2V4YW1wbGVzL2Nzcy9zdHlsZXMuc2Nzc1xuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKlxyXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXHJcblx0QXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxyXG4qL1xyXG4vLyBjc3MgYmFzZSBjb2RlLCBpbmplY3RlZCBieSB0aGUgY3NzLWxvYWRlclxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xyXG5cdHZhciBsaXN0ID0gW107XHJcblxyXG5cdC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcclxuXHRsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XHJcblx0XHR2YXIgcmVzdWx0ID0gW107XHJcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHR2YXIgaXRlbSA9IHRoaXNbaV07XHJcblx0XHRcdGlmKGl0ZW1bMl0pIHtcclxuXHRcdFx0XHRyZXN1bHQucHVzaChcIkBtZWRpYSBcIiArIGl0ZW1bMl0gKyBcIntcIiArIGl0ZW1bMV0gKyBcIn1cIik7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmVzdWx0LnB1c2goaXRlbVsxXSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiByZXN1bHQuam9pbihcIlwiKTtcclxuXHR9O1xyXG5cclxuXHQvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxyXG5cdGxpc3QuaSA9IGZ1bmN0aW9uKG1vZHVsZXMsIG1lZGlhUXVlcnkpIHtcclxuXHRcdGlmKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKVxyXG5cdFx0XHRtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCBcIlwiXV07XHJcblx0XHR2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xyXG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dmFyIGlkID0gdGhpc1tpXVswXTtcclxuXHRcdFx0aWYodHlwZW9mIGlkID09PSBcIm51bWJlclwiKVxyXG5cdFx0XHRcdGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdGZvcihpID0gMDsgaSA8IG1vZHVsZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0dmFyIGl0ZW0gPSBtb2R1bGVzW2ldO1xyXG5cdFx0XHQvLyBza2lwIGFscmVhZHkgaW1wb3J0ZWQgbW9kdWxlXHJcblx0XHRcdC8vIHRoaXMgaW1wbGVtZW50YXRpb24gaXMgbm90IDEwMCUgcGVyZmVjdCBmb3Igd2VpcmQgbWVkaWEgcXVlcnkgY29tYmluYXRpb25zXHJcblx0XHRcdC8vICB3aGVuIGEgbW9kdWxlIGlzIGltcG9ydGVkIG11bHRpcGxlIHRpbWVzIHdpdGggZGlmZmVyZW50IG1lZGlhIHF1ZXJpZXMuXHJcblx0XHRcdC8vICBJIGhvcGUgdGhpcyB3aWxsIG5ldmVyIG9jY3VyIChIZXkgdGhpcyB3YXkgd2UgaGF2ZSBzbWFsbGVyIGJ1bmRsZXMpXHJcblx0XHRcdGlmKHR5cGVvZiBpdGVtWzBdICE9PSBcIm51bWJlclwiIHx8ICFhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XHJcblx0XHRcdFx0aWYobWVkaWFRdWVyeSAmJiAhaXRlbVsyXSkge1xyXG5cdFx0XHRcdFx0aXRlbVsyXSA9IG1lZGlhUXVlcnk7XHJcblx0XHRcdFx0fSBlbHNlIGlmKG1lZGlhUXVlcnkpIHtcclxuXHRcdFx0XHRcdGl0ZW1bMl0gPSBcIihcIiArIGl0ZW1bMl0gKyBcIikgYW5kIChcIiArIG1lZGlhUXVlcnkgKyBcIilcIjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bGlzdC5wdXNoKGl0ZW0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fTtcclxuXHRyZXR1cm4gbGlzdDtcclxufTtcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qXHJcblx0TUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcclxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXHJcbiovXHJcbnZhciBzdHlsZXNJbkRvbSA9IHt9LFxyXG5cdG1lbW9pemUgPSBmdW5jdGlvbihmbikge1xyXG5cdFx0dmFyIG1lbW87XHJcblx0XHRyZXR1cm4gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRpZiAodHlwZW9mIG1lbW8gPT09IFwidW5kZWZpbmVkXCIpIG1lbW8gPSBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG5cdFx0XHRyZXR1cm4gbWVtbztcclxuXHRcdH07XHJcblx0fSxcclxuXHRpc09sZElFID0gbWVtb2l6ZShmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiAvbXNpZSBbNi05XVxcYi8udGVzdCh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpKTtcclxuXHR9KSxcclxuXHRnZXRIZWFkRWxlbWVudCA9IG1lbW9pemUoZnVuY3Rpb24gKCkge1xyXG5cdFx0cmV0dXJuIGRvY3VtZW50LmhlYWQgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdO1xyXG5cdH0pLFxyXG5cdHNpbmdsZXRvbkVsZW1lbnQgPSBudWxsLFxyXG5cdHNpbmdsZXRvbkNvdW50ZXIgPSAwLFxyXG5cdHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wID0gW107XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGxpc3QsIG9wdGlvbnMpIHtcclxuXHRpZih0eXBlb2YgREVCVUcgIT09IFwidW5kZWZpbmVkXCIgJiYgREVCVUcpIHtcclxuXHRcdGlmKHR5cGVvZiBkb2N1bWVudCAhPT0gXCJvYmplY3RcIikgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHN0eWxlLWxvYWRlciBjYW5ub3QgYmUgdXNlZCBpbiBhIG5vbi1icm93c2VyIGVudmlyb25tZW50XCIpO1xyXG5cdH1cclxuXHJcblx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcblx0Ly8gRm9yY2Ugc2luZ2xlLXRhZyBzb2x1dGlvbiBvbiBJRTYtOSwgd2hpY2ggaGFzIGEgaGFyZCBsaW1pdCBvbiB0aGUgIyBvZiA8c3R5bGU+XHJcblx0Ly8gdGFncyBpdCB3aWxsIGFsbG93IG9uIGEgcGFnZVxyXG5cdGlmICh0eXBlb2Ygb3B0aW9ucy5zaW5nbGV0b24gPT09IFwidW5kZWZpbmVkXCIpIG9wdGlvbnMuc2luZ2xldG9uID0gaXNPbGRJRSgpO1xyXG5cclxuXHQvLyBCeSBkZWZhdWx0LCBhZGQgPHN0eWxlPiB0YWdzIHRvIHRoZSBib3R0b20gb2YgPGhlYWQ+LlxyXG5cdGlmICh0eXBlb2Ygb3B0aW9ucy5pbnNlcnRBdCA9PT0gXCJ1bmRlZmluZWRcIikgb3B0aW9ucy5pbnNlcnRBdCA9IFwiYm90dG9tXCI7XHJcblxyXG5cdHZhciBzdHlsZXMgPSBsaXN0VG9TdHlsZXMobGlzdCk7XHJcblx0YWRkU3R5bGVzVG9Eb20oc3R5bGVzLCBvcHRpb25zKTtcclxuXHJcblx0cmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XHJcblx0XHR2YXIgbWF5UmVtb3ZlID0gW107XHJcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgc3R5bGVzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHZhciBpdGVtID0gc3R5bGVzW2ldO1xyXG5cdFx0XHR2YXIgZG9tU3R5bGUgPSBzdHlsZXNJbkRvbVtpdGVtLmlkXTtcclxuXHRcdFx0ZG9tU3R5bGUucmVmcy0tO1xyXG5cdFx0XHRtYXlSZW1vdmUucHVzaChkb21TdHlsZSk7XHJcblx0XHR9XHJcblx0XHRpZihuZXdMaXN0KSB7XHJcblx0XHRcdHZhciBuZXdTdHlsZXMgPSBsaXN0VG9TdHlsZXMobmV3TGlzdCk7XHJcblx0XHRcdGFkZFN0eWxlc1RvRG9tKG5ld1N0eWxlcywgb3B0aW9ucyk7XHJcblx0XHR9XHJcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgbWF5UmVtb3ZlLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHZhciBkb21TdHlsZSA9IG1heVJlbW92ZVtpXTtcclxuXHRcdFx0aWYoZG9tU3R5bGUucmVmcyA9PT0gMCkge1xyXG5cdFx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBkb21TdHlsZS5wYXJ0cy5sZW5ndGg7IGorKylcclxuXHRcdFx0XHRcdGRvbVN0eWxlLnBhcnRzW2pdKCk7XHJcblx0XHRcdFx0ZGVsZXRlIHN0eWxlc0luRG9tW2RvbVN0eWxlLmlkXTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZFN0eWxlc1RvRG9tKHN0eWxlcywgb3B0aW9ucykge1xyXG5cdGZvcih2YXIgaSA9IDA7IGkgPCBzdHlsZXMubGVuZ3RoOyBpKyspIHtcclxuXHRcdHZhciBpdGVtID0gc3R5bGVzW2ldO1xyXG5cdFx0dmFyIGRvbVN0eWxlID0gc3R5bGVzSW5Eb21baXRlbS5pZF07XHJcblx0XHRpZihkb21TdHlsZSkge1xyXG5cdFx0XHRkb21TdHlsZS5yZWZzKys7XHJcblx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBkb21TdHlsZS5wYXJ0cy5sZW5ndGg7IGorKykge1xyXG5cdFx0XHRcdGRvbVN0eWxlLnBhcnRzW2pdKGl0ZW0ucGFydHNbal0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZvcig7IGogPCBpdGVtLnBhcnRzLmxlbmd0aDsgaisrKSB7XHJcblx0XHRcdFx0ZG9tU3R5bGUucGFydHMucHVzaChhZGRTdHlsZShpdGVtLnBhcnRzW2pdLCBvcHRpb25zKSk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHZhciBwYXJ0cyA9IFtdO1xyXG5cdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgaXRlbS5wYXJ0cy5sZW5ndGg7IGorKykge1xyXG5cdFx0XHRcdHBhcnRzLnB1c2goYWRkU3R5bGUoaXRlbS5wYXJ0c1tqXSwgb3B0aW9ucykpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHN0eWxlc0luRG9tW2l0ZW0uaWRdID0ge2lkOiBpdGVtLmlkLCByZWZzOiAxLCBwYXJ0czogcGFydHN9O1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gbGlzdFRvU3R5bGVzKGxpc3QpIHtcclxuXHR2YXIgc3R5bGVzID0gW107XHJcblx0dmFyIG5ld1N0eWxlcyA9IHt9O1xyXG5cdGZvcih2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XHJcblx0XHR2YXIgaXRlbSA9IGxpc3RbaV07XHJcblx0XHR2YXIgaWQgPSBpdGVtWzBdO1xyXG5cdFx0dmFyIGNzcyA9IGl0ZW1bMV07XHJcblx0XHR2YXIgbWVkaWEgPSBpdGVtWzJdO1xyXG5cdFx0dmFyIHNvdXJjZU1hcCA9IGl0ZW1bM107XHJcblx0XHR2YXIgcGFydCA9IHtjc3M6IGNzcywgbWVkaWE6IG1lZGlhLCBzb3VyY2VNYXA6IHNvdXJjZU1hcH07XHJcblx0XHRpZighbmV3U3R5bGVzW2lkXSlcclxuXHRcdFx0c3R5bGVzLnB1c2gobmV3U3R5bGVzW2lkXSA9IHtpZDogaWQsIHBhcnRzOiBbcGFydF19KTtcclxuXHRcdGVsc2VcclxuXHRcdFx0bmV3U3R5bGVzW2lkXS5wYXJ0cy5wdXNoKHBhcnQpO1xyXG5cdH1cclxuXHRyZXR1cm4gc3R5bGVzO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucywgc3R5bGVFbGVtZW50KSB7XHJcblx0dmFyIGhlYWQgPSBnZXRIZWFkRWxlbWVudCgpO1xyXG5cdHZhciBsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcCA9IHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wW3N0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wLmxlbmd0aCAtIDFdO1xyXG5cdGlmIChvcHRpb25zLmluc2VydEF0ID09PSBcInRvcFwiKSB7XHJcblx0XHRpZighbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3ApIHtcclxuXHRcdFx0aGVhZC5pbnNlcnRCZWZvcmUoc3R5bGVFbGVtZW50LCBoZWFkLmZpcnN0Q2hpbGQpO1xyXG5cdFx0fSBlbHNlIGlmKGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wLm5leHRTaWJsaW5nKSB7XHJcblx0XHRcdGhlYWQuaW5zZXJ0QmVmb3JlKHN0eWxlRWxlbWVudCwgbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AubmV4dFNpYmxpbmcpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0aGVhZC5hcHBlbmRDaGlsZChzdHlsZUVsZW1lbnQpO1xyXG5cdFx0fVxyXG5cdFx0c3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3AucHVzaChzdHlsZUVsZW1lbnQpO1xyXG5cdH0gZWxzZSBpZiAob3B0aW9ucy5pbnNlcnRBdCA9PT0gXCJib3R0b21cIikge1xyXG5cdFx0aGVhZC5hcHBlbmRDaGlsZChzdHlsZUVsZW1lbnQpO1xyXG5cdH0gZWxzZSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHZhbHVlIGZvciBwYXJhbWV0ZXIgJ2luc2VydEF0Jy4gTXVzdCBiZSAndG9wJyBvciAnYm90dG9tJy5cIik7XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KSB7XHJcblx0c3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcclxuXHR2YXIgaWR4ID0gc3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3AuaW5kZXhPZihzdHlsZUVsZW1lbnQpO1xyXG5cdGlmKGlkeCA+PSAwKSB7XHJcblx0XHRzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcC5zcGxpY2UoaWR4LCAxKTtcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZVN0eWxlRWxlbWVudChvcHRpb25zKSB7XHJcblx0dmFyIHN0eWxlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcclxuXHRzdHlsZUVsZW1lbnQudHlwZSA9IFwidGV4dC9jc3NcIjtcclxuXHRpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucywgc3R5bGVFbGVtZW50KTtcclxuXHRyZXR1cm4gc3R5bGVFbGVtZW50O1xyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVMaW5rRWxlbWVudChvcHRpb25zKSB7XHJcblx0dmFyIGxpbmtFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpbmtcIik7XHJcblx0bGlua0VsZW1lbnQucmVsID0gXCJzdHlsZXNoZWV0XCI7XHJcblx0aW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMsIGxpbmtFbGVtZW50KTtcclxuXHRyZXR1cm4gbGlua0VsZW1lbnQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZFN0eWxlKG9iaiwgb3B0aW9ucykge1xyXG5cdHZhciBzdHlsZUVsZW1lbnQsIHVwZGF0ZSwgcmVtb3ZlO1xyXG5cclxuXHRpZiAob3B0aW9ucy5zaW5nbGV0b24pIHtcclxuXHRcdHZhciBzdHlsZUluZGV4ID0gc2luZ2xldG9uQ291bnRlcisrO1xyXG5cdFx0c3R5bGVFbGVtZW50ID0gc2luZ2xldG9uRWxlbWVudCB8fCAoc2luZ2xldG9uRWxlbWVudCA9IGNyZWF0ZVN0eWxlRWxlbWVudChvcHRpb25zKSk7XHJcblx0XHR1cGRhdGUgPSBhcHBseVRvU2luZ2xldG9uVGFnLmJpbmQobnVsbCwgc3R5bGVFbGVtZW50LCBzdHlsZUluZGV4LCBmYWxzZSk7XHJcblx0XHRyZW1vdmUgPSBhcHBseVRvU2luZ2xldG9uVGFnLmJpbmQobnVsbCwgc3R5bGVFbGVtZW50LCBzdHlsZUluZGV4LCB0cnVlKTtcclxuXHR9IGVsc2UgaWYob2JqLnNvdXJjZU1hcCAmJlxyXG5cdFx0dHlwZW9mIFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXHJcblx0XHR0eXBlb2YgVVJMLmNyZWF0ZU9iamVjdFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXHJcblx0XHR0eXBlb2YgVVJMLnJldm9rZU9iamVjdFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXHJcblx0XHR0eXBlb2YgQmxvYiA9PT0gXCJmdW5jdGlvblwiICYmXHJcblx0XHR0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XHJcblx0XHRzdHlsZUVsZW1lbnQgPSBjcmVhdGVMaW5rRWxlbWVudChvcHRpb25zKTtcclxuXHRcdHVwZGF0ZSA9IHVwZGF0ZUxpbmsuYmluZChudWxsLCBzdHlsZUVsZW1lbnQpO1xyXG5cdFx0cmVtb3ZlID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xyXG5cdFx0XHRpZihzdHlsZUVsZW1lbnQuaHJlZilcclxuXHRcdFx0XHRVUkwucmV2b2tlT2JqZWN0VVJMKHN0eWxlRWxlbWVudC5ocmVmKTtcclxuXHRcdH07XHJcblx0fSBlbHNlIHtcclxuXHRcdHN0eWxlRWxlbWVudCA9IGNyZWF0ZVN0eWxlRWxlbWVudChvcHRpb25zKTtcclxuXHRcdHVwZGF0ZSA9IGFwcGx5VG9UYWcuYmluZChudWxsLCBzdHlsZUVsZW1lbnQpO1xyXG5cdFx0cmVtb3ZlID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cdHVwZGF0ZShvYmopO1xyXG5cclxuXHRyZXR1cm4gZnVuY3Rpb24gdXBkYXRlU3R5bGUobmV3T2JqKSB7XHJcblx0XHRpZihuZXdPYmopIHtcclxuXHRcdFx0aWYobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwKVxyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0dXBkYXRlKG9iaiA9IG5ld09iaik7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZW1vdmUoKTtcclxuXHRcdH1cclxuXHR9O1xyXG59XHJcblxyXG52YXIgcmVwbGFjZVRleHQgPSAoZnVuY3Rpb24gKCkge1xyXG5cdHZhciB0ZXh0U3RvcmUgPSBbXTtcclxuXHJcblx0cmV0dXJuIGZ1bmN0aW9uIChpbmRleCwgcmVwbGFjZW1lbnQpIHtcclxuXHRcdHRleHRTdG9yZVtpbmRleF0gPSByZXBsYWNlbWVudDtcclxuXHRcdHJldHVybiB0ZXh0U3RvcmUuZmlsdGVyKEJvb2xlYW4pLmpvaW4oJ1xcbicpO1xyXG5cdH07XHJcbn0pKCk7XHJcblxyXG5mdW5jdGlvbiBhcHBseVRvU2luZ2xldG9uVGFnKHN0eWxlRWxlbWVudCwgaW5kZXgsIHJlbW92ZSwgb2JqKSB7XHJcblx0dmFyIGNzcyA9IHJlbW92ZSA/IFwiXCIgOiBvYmouY3NzO1xyXG5cclxuXHRpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcclxuXHRcdHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSByZXBsYWNlVGV4dChpbmRleCwgY3NzKTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0dmFyIGNzc05vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpO1xyXG5cdFx0dmFyIGNoaWxkTm9kZXMgPSBzdHlsZUVsZW1lbnQuY2hpbGROb2RlcztcclxuXHRcdGlmIChjaGlsZE5vZGVzW2luZGV4XSkgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKGNoaWxkTm9kZXNbaW5kZXhdKTtcclxuXHRcdGlmIChjaGlsZE5vZGVzLmxlbmd0aCkge1xyXG5cdFx0XHRzdHlsZUVsZW1lbnQuaW5zZXJ0QmVmb3JlKGNzc05vZGUsIGNoaWxkTm9kZXNbaW5kZXhdKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChjc3NOb2RlKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFwcGx5VG9UYWcoc3R5bGVFbGVtZW50LCBvYmopIHtcclxuXHR2YXIgY3NzID0gb2JqLmNzcztcclxuXHR2YXIgbWVkaWEgPSBvYmoubWVkaWE7XHJcblxyXG5cdGlmKG1lZGlhKSB7XHJcblx0XHRzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibWVkaWFcIiwgbWVkaWEpXHJcblx0fVxyXG5cclxuXHRpZihzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xyXG5cdFx0c3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcclxuXHR9IGVsc2Uge1xyXG5cdFx0d2hpbGUoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcclxuXHRcdFx0c3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcclxuXHRcdH1cclxuXHRcdHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcclxuXHR9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVwZGF0ZUxpbmsobGlua0VsZW1lbnQsIG9iaikge1xyXG5cdHZhciBjc3MgPSBvYmouY3NzO1xyXG5cdHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xyXG5cclxuXHRpZihzb3VyY2VNYXApIHtcclxuXHRcdC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzI2NjAzODc1XHJcblx0XHRjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiICsgYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSArIFwiICovXCI7XHJcblx0fVxyXG5cclxuXHR2YXIgYmxvYiA9IG5ldyBCbG9iKFtjc3NdLCB7IHR5cGU6IFwidGV4dC9jc3NcIiB9KTtcclxuXHJcblx0dmFyIG9sZFNyYyA9IGxpbmtFbGVtZW50LmhyZWY7XHJcblxyXG5cdGxpbmtFbGVtZW50LmhyZWYgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xyXG5cclxuXHRpZihvbGRTcmMpXHJcblx0XHRVUkwucmV2b2tlT2JqZWN0VVJMKG9sZFNyYyk7XHJcbn1cclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3N0eWxlLWxvYWRlci9hZGRTdHlsZXMuanNcbi8vIG1vZHVsZSBpZCA9IDZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IFwiLi4vY3NzL3N0eWxlcy5zY3NzXCJcclxuaW1wb3J0IFwiLi9leGFtcGxlLTYuanNcIlxyXG5pbXBvcnQgXCIuL2V4YW1wbGUtNi1tb2RhbC5qc1wiXHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2V4YW1wbGVzL2V4YW1wbGU2L2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSA3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=