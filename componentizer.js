/**
 * Created by bjefferis on 23/11/2016.
 */

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
        if (this.actions === undefined) {
            this.actions = {};
        }
        this.actions[componentName] = new Componentizer.Component(componentName, actions, view, model);
    }
};

Componentizer.Component = class Component {
    constructor (componentName, actions, view, model) {
        if (componentName == null || componentName === "") {
            throw new Error("Your component needs a name");
        }

        if (actions == null) {
            throw new Error("This won't do much without actions. GO GET ME SOME ACTIONS");
        }

        this.componentName = componentName;

        let _view = view && view();
        let render = _view && _view.render ? _view.render : () =>{};
        let viewInit = _view && _view.init ? _view.init : () => {};
        
        Object.assign(this, this.componentize(this.componentName, actions(model), render, model));
        viewInit(this, model);
        
        if (componentizer.recorder && componentName !== "recorder") {
            componentizer.recorder.storeComponent(this, model);
        }
    }

    componentize(componentName, actions, render, model) {
        render(model);
        let component = {};
        Object.keys(actions).map((action) => {
            component[action] = (...args) => {

                if (componentizer.recorder && componentName !== "recorder" && componentizer.recorder.get("recording")) {
                    componentizer.recorder.recordStep(componentName, model, action, args);
                }

                let returnValue = actions[action].apply(actions, args);

                if (returnValue && returnValue.constructor.name === "Promise") {
                    this.handlePromise(returnValue, render);
                }
                render(model);
            }
        }, this);
        component.get = (prop) => model[prop];
        return component;
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
            render(updatedModel);
        });
    }
};