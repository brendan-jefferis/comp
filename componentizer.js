/**
 * Created by bjefferis on 23/11/2016.
 */
/*

    This will return a new object with all your actions + a generic get method
    for read-only access to properties on the model.

    The componentizer also ensures that the render function is called with the
    latest model after each action is called.

    Example return value:

    {
        sayHello: (),
        setName: (name),
        get(prop)
    }

 */
class Componentizer {
    constructor(options = { record: true}) {
        if (options.record) {
            window.recorder = new Componentizer.Recorder();
        }
    }

    create(componentName, actions, render = ()=>{}, model = {}) {
        window[componentName] = new Componentizer.Component(componentName, actions, render, model);
    }
};

Componentizer.Recorder = class Recorder {
    constructor() {
        this.pageLoadTimestamp = Date.now();
        this.steps = [];
        this.components = {};
        this.recording = true;
        let path = window.location.pathname;
        this.sessionName = path.substr(1, path.indexOf('.')-1).split('/').join('_');
    }

    replay() {
        this.steps.map(this.runStep, this);
    }

    pause() {
        this.recording = false;
    }

    resume() {
        this.recording = true;
    }

    runStep(step) {
        let component = this.components[step.componentName];
        component.actions[step.action].apply(component, step.args);
    }

    save() {
        let now = new Date();
        let storageId = `${this.sessionName}-${now.getDay()}${now.getMonth()}${now.getYear()}${now.getHours()}${now.getMinutes()}${now.getSeconds()}`;
        localStorage.setItem(storageId, JSON.stringify(this));
        console.log(storageId);
    }

    load(id) {
        let loadedState = JSON.parse(localStorage.getItem(id));
        this.steps = loadedState.steps;
        Object.keys(loadedState.components).map((componentName) => {
            this.components[componentName].initialState = loadedState.components[componentName].initialState;
        }, this);
        console.log(`${id} loaded`);
    }

    storeComponent(componentName, actions, model) {
        this.components[componentName] = {
            actions: actions,
            initialState: Object.assign({}, model)
        };
    }
};

Componentizer.Component = class Component {
    constructor (componentName, actions, render, model) {
        if (componentName == null || componentName === "") {
            throw new Error("Your component needs a name");
        }
        this.componentName = componentName;

        if (actions == null) {
            throw new Error("This won't do much without actions. GO GET ME SOME ACTIONS");
        }

        render(model);

        let component = this.componentize(this.componentName, actions(model), model, render);
        Object.keys(component).map((prop) => {
            this[prop] = component[prop];
        });

        if (window.recorder) {
            window.recorder.storeComponent(componentName, component, model);
        }
    }

    componentize(componentName, actions, model, render) {
        let result = {};
        Object.keys(actions).map((fn) => {
            result[fn] = (...args) => {

                if (window.recorder && window.recorder.recording) {
                    window.recorder.steps.push({
                        timestamp: Date.now(),
                        componentName: componentName,
                        action: fn,
                        args: args
                    });
                }

                let promise = actions[fn].apply(actions, args);

                if (promise && promise.constructor.name === "Promise") {
                    promise.catch((result) => {
                        if ((!result.reason || typeof result.reason !== "string")
                            || (!result.model || typeof result.model !== "object")) {
                            console.error("The reject function is expecting an object of type: { reason: string, model: object }\r\nRendering view with last available model");
                            return model;
                        }
                        console.error(result.reason);
                        return result.model;
                    }).then((updatedModel) => {
                        render(updatedModel);
                    });
                }
                render(model);
            }
        });
        result.get = (prop) => model[prop];
        return result;
    }
};