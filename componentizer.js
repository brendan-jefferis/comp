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

function Component(actions, render = ()=>{}, model = {}) {
    if (actions == null) {
        throw new Error("This won't do much without actions. GO GET ME SOME ACTIONS");
    }

    render(model);
    return actions(model, render);
};

function componentize(actions, model, render) {
    let result = {};
    Object.keys(actions).map((fn) => {
        result[fn] = (...args) => {
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
};