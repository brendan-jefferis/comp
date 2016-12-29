import * as compEvents from "./comp-events";
import setDom from "set-dom";

const components = {};

function componentize(name, actions, render, model) {
    render(model);
    let component = {};
    Object.keys(actions).map((action) => {
        component[action] = (...args) => {

            let returnValue = actions[action].apply(actions, args);

            if (returnValue && returnValue.then) {
                handlePromise(returnValue, render);
            }
            render(model);
        }
    }, this);
    component.name = name;
    component.get = (prop) => model[prop];
    return component;
}

function handlePromise(promise, render) {
    promise
        .then((updatedModel) => {
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
            const htmlString = _view.render(_model);
            if (typeof document !== "undefined" && htmlString) {
                let target = document.querySelector(`[data-component=${name}]`);
                if (target) {
                    let container = document.createElement("div");
                    container.innerHTML = htmlString;
                    if (target.firstChild === null) {
                        target.innerHTML = htmlString;
                    }
                    setDom(target.firstChild, container.innerHTML);
                }
            }
        }
        : () => {};

    let component = componentize(name, actions(model), viewRender, model);
    components[name] = component;

    if (typeof document !== "undefined" && typeof compEvents !== "undefined") {
        component = compEvents.registerEventDelegator(component);
    }

    viewInit(component, model);

    return component;
}

export default {
    components: components,
    create: create
};