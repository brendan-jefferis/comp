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
class Recorder {
    constructor() {
        this.initialTimestamp = Date.now();
        this.steps = [];
        this.components = [];
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
        let component = this.components[step.componentIndex].component;
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
        loadedState.components.map((x, i) => { this.components[i].initialState = x.initialState }, this);
        console.log(`${id} loaded`);
    }

    storeComponent(component, model) {
        // TODO ensure only one of each is added
        this.components.push({
            component: component,
            initialState: model
        });
    }
};

class Component {
    constructor (actions, render = ()=>{}, model = {}) {
        if (actions == null) {
            throw new Error("This won't do much without actions. GO GET ME SOME ACTIONS");
        }

        render(model);

        let recorderId = window.recorder ? window.recorder.components.length : null;
        let component = this.componentize(actions(model), model, render, recorderId);
        Object.keys(component).map((prop) => {
            this[prop] = component[prop];
        });

        if (window.recorder) {
            window.recorder.storeComponent(component, model);
        }
    }

    componentize(actions, model, render, recorderId = -1) {
        let result = {};
        Object.keys(actions).map((fn) => {
            result[fn] = (...args) => {

                if (window.recorder && window.recorder.recording) {
                    window.recorder.steps.push({
                        timestamp: Date.now(),
                        componentIndex: recorderId,
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