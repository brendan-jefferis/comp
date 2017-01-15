import * as compEvents from "./lib/comp-events";
import setDom from "set-dom";
import html from "./lib/html-template";
import renderAfterAsync from "./lib/render-after-async";
import { findChildComponents } from "./lib/render-children";

const components = {};

function componentize(name, actions, render, model) {
    render(model);
    let component = {};
    Object.keys(actions).map((action) => {
        component[action] = (...args) => {

            let returnValue = actions[action].apply(actions, args);

            if (returnValue && returnValue.then) {
                renderAfterAsync(returnValue, render);
            }
            render(model);
        }
    }, this);
    component.name = name;
    component.get = (prop) => model[prop];
    component.render = () => render(model);
    return component;
}

function create(name, actions, view, model) {
    if (name == null || name === "") {
        throw new Error("Your component needs a name");
    }

    if (actions == null) {
        const example = "// It must be a function that takes a model and returns an object of functions, e.g.\r\n\r\nYourComponent.Actions = function (model) {\r\n    return {\r\n        sayHello: function () { console.log('Hi.'); },\r\n        greet: function (name) { console.log('Hello, ' + name); }\r\n    }\r\n}";
        throw new Error(`${name} needs some actions! Here's an example of an Actions function:\r\n\r\n${example}\r\n\r\n`);
    }

    let _view = view && view();
    let viewInit = _view && _view.init ? _view.init : () => {};
    let viewRender = _view && _view.render
        ? (_model) => {
            const htmlString = _view.render(_model, html);
            if (typeof document !== "undefined" && htmlString) {
                let target = document.querySelector(`[data-component=${name}]`);
                if (target) {
                    const childComponents = findChildComponents(target);
                    if (target.innerHTML === "") {
                        target.innerHTML = htmlString;
                    } else {
                        setDom(target.firstElementChild, htmlString);
                    }
                    if (childComponents.length) {
                        childComponents.map(x => components[x] && components[x].render());
                    }
                }
            }
        }
        : () => {};

    let component = componentize(name, actions(model), viewRender, model);
    components[name] = component;

    viewInit(component, model);

    return component;
}

if (typeof document !== "undefined" && typeof compEvents !== "undefined") {
    compEvents.registerEventDelegator(components);
}

export default {
    components: components,
    create: create
};