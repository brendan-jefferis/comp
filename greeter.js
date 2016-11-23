/**
 * Created by bjefferis on 23/11/2016.
 */
function Greeter(model) {
    model = model || {};
    this.Render(model);
    return this.Actions(model, this.Render);
};

Greeter.prototype.Actions = (model, render) => {
    return componentize({
        greet: (greeting) => {
            model.greeting = model.greeting = greeting.toUpperCase();
        },
        setName: (name) => {
            model.name = name;
        }
    }, model, render);
};

Greeter.prototype.Render = (model) => {
    var component = document.querySelector("[data-component=greeter]");

    function update(model) {
        component.querySelector("[data-model=greeting]").innerHTML = model.greeting + " " + model.name;
        document.querySelectorAll("[data-model=show-greeter-modal]").forEach((x) => {
            x.disabled = model.name.length === 0 || model.greeting.length === 0;
        });
    }

    update(model);
};