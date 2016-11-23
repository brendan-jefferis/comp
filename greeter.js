/**
 * Created by bjefferis on 23/11/2016.
 */
Greeter = {};

Greeter.Actions = (model, render) => {
    return componentize({
        greet: (greeting) => {
            model.greeting = model.greeting = greeting.toUpperCase();
        },
        setName: (name) => {
            model.name = name;
        }
    }, model, render);
};

Greeter.Render = (model) => {
    console.log("rendering greeter");
    var component = document.querySelector("[data-component=greeter]");

    function update(model) {
        component.querySelector("[data-selector=greeting]").innerHTML = model.greeting + " " + model.name;
        document.querySelectorAll("[data-selector=show-greeter-modal]").forEach((x) => {
            x.disabled = model.name.length === 0 || model.greeting.length === 0;
        });
    }

    update(model);
};