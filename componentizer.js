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
        return window[componentName] = new Componentizer.Component(componentName, actions, render, model);
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

    recordStep(componentName, model, action, args) {
        window.recorder.components[componentName].currentState = model;
        window.recorder.steps.push({
            timestamp: Date.now(),
            componentName: componentName,
            action: action,
            args: args
        });
    }

    runStep(step) {
        let component = this.components[step.componentName];
        component[step.action].apply(component, step.args);
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

    storeComponent(component, model) {
        this.components[component.componentName] = component;
        this.components[component.componentName].initialState = Object.assign({}, model);
    }
};

Componentizer.Component = class Component {
    constructor (componentName, actions, render, model) {
        if (componentName == null || componentName === "") {
            throw new Error("Your component needs a name");
        }

        if (actions == null) {
            throw new Error("This won't do much without actions. GO GET ME SOME ACTIONS");
        }

        this.componentName = componentName;
        Object.assign(this, this.componentize(this.componentName, actions, model, render));

        if (window.recorder) {
            window.recorder.storeComponent(this, model);
        }
    }

    handlePromise(promise, render) {
        promise.catch((result) => {
            if ((!result.reason || typeof result.reason !== "string")
                || (!result.model || typeof result.model !== "object")) {
                console.error("The reject function is expecting an object of type: { reason: string, model: object }\r\nRendering view with last available model");
                return model;
            }
            console.error(result.reason);
            return result.model;
        }).then((updatedModel) => {
            render(updatedModel)();
        });
    }

    componentize(componentName, actions, model, render) {
        let a = actions(model);
        let r = render(model);
        r();

        let component = {};
        Object.keys(a).map((fn) => {
            component[fn] = (...args) => {

                if (window.recorder && window.recorder.recording) {
                    window.recorder.recordStep(componentName, model, fn, args);
                }

                let promise = a[fn].apply(a, args);

                if (promise && promise.constructor.name === "Promise") {
                    this.handlePromise(promise, render);
                } else {
                    r();
                }
            }
        }, this);
        component.get = (prop) => model[prop];
        return component;
    }
};