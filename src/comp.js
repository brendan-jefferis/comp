class Comp {
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
    //     this.recorder = new Component("recorder", actions, view, model);
    // }

    create(componentName, actions, view = ()=>{}, model = {}) {
        this.components[componentName] = new Component(componentName, actions, view, model);
    }
}

class Component {
    constructor (componentName, actions, view, model) {
        if (componentName == null || componentName === "") {
            throw new Error("Your component needs a name");
        }

        if (actions == null) {
            const example = "// It must be a function that takes a model and returns an object of functions, e.g.\r\n\r\nYourComponent.Actions = function (model) {\r\n    return {\r\n        sayHello: function () { console.log('Hi.'); },\r\n        greet: function (name) { console.log('Hello, ' + name); }\r\n    }\r\n}";
            throw new Error(`${componentName} needs some actions! Here's an example of an Actions function:\r\n\r\n${example}\r\n\r\n`);
        }

        this.componentName = componentName;

        let _view = view && view();
        let viewInit = _view && _view.init ? _view.init : () => {};
        let viewRender = _view && _view.render ? _view.render : () => {};

        Object.assign(this, this.componentize(actions(model), viewRender, model));
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

let comp = new Comp();

if (typeof exports != 'undefined' && !exports.nodeType) {
    if (typeof module != 'undefined' && !module.nodeType && module.exports) {
        exports = module.exports = comp;
    }
    exports.comp = comp;
} else {
    window.comp = comp;
}