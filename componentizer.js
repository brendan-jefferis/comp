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
            actions[fn].apply(this, args);
            render(model);
        }
    });
    result.get = (prop) => model[prop];
    return result;
};