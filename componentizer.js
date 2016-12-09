/**
 * Created by bjefferis on 23/11/2016.
 */
import "babel-polyfill";

class Componentizer {

    createRecorder(actions, view = ()=>{}) {
        let path = window.location.pathname;
        let model = {
            pageLoadTimestamp: Date.now(),
            steps: [],
            components: {},
            recording: true,
            sessionName: path.substr(1, path.indexOf('.')-1).split('/').join('_')
        };
        this.recorder = new Componentizer.Component("recorder", actions, view, model);
    }

    create(componentName, actions, view = ()=>{}, model = {}) {
        if (this.components === undefined) {
            this.components = {};
        }
        this.components[componentName] = new Componentizer.Component(componentName, actions, view, model);
    }
};

Componentizer.Component = class Component {
    constructor (componentName, actions, view, model) {
        if (componentName == null || componentName === "") {
            throw new Error("Your component needs a name");
        }

        if (actions == null) {
            var example = "// It must be a function that takes a model and returns an object of functions, e.g.\r\n\r\nYourComponent.Actions = function (model) {\r\n    return {\r\n        sayHello: () { console.log('Hi.'); },\r\n        greet: (name) { console.log('Hello, ' + name); }\r\n    }\r\n}"
            throw new Error(`${componentName} needs some actions! Here's an example of an Actions function:\r\n\r\n${example}\r\n\r\n`);
        }

        this.componentName = componentName;

        let _view = view && view();
        let viewInit = _view && _view.init ? _view.init : () => {};
        let selectors = _view && _view.el ? _view.el : {};
        let elements = this.confirmOrRegisterElements(selectors, {});
        let render = _view && _view.render
            ? (model) => {
                elements = this.confirmOrRegisterElements(selectors, elements);
                _view.render(model, elements);
            }
            : () =>{};

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

    componentize(componentName, actions, render, model) {
        render(model);
        let component = {};
        Object.keys(actions).map((action) => {
            component[action] = (...args) => {

                let returnValue = actions[action].apply(actions, args);

                if (componentizer.recorder && componentName !== "recorder" && componentizer.recorder.get("recording")) {
                    componentizer.recorder.recordStep(componentName, model, action, args);
                }

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
                render(updatedModel, elements);
            })
            .catch((err) => {
                if (typeof err === "string") {
                    console.error(err);
                } else {
                    console.error(`Error unhandled by component. Add a catch handler to your AJAX method.`);
                }
            });
    }

    confirmOrRegisterElements(selectors, elements = {}) {
        Object.keys(selectors).map((elName) => {
            elements[elName] = elements[elName] && document.documentElement.contains(elements[elName][0])
                ? elements[elName] = elements[elName]
                : elements[elName] = $(selectors[elName]);
        });
        return elements;
    }
};

window.componentizer = window._comp = new Componentizer();