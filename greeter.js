/**
 * Created by bjefferis on 23/11/2016.
 */
Greeter = {};

Greeter.Actions = (model) => {
    return {
        greet: (greeting) => {
            model.greeting = model.greeting = greeting.toUpperCase();
        },
        setName: (name) => {
            model.name = name;
        }
    };
};

Greeter.Render = (actions) => {
    const COMPONENT = $("[data-component=greeter]");
    const GREETING = COMPONENT.find("[data-selector=greeting]");
    const INPUT_NAME = COMPONENT.find("[data-selector=greeter-name]");
    const BUTTONS_SHOW_MODAL = $("[data-selector=show-greeter-modal]");

    return (model) => {
        GREETING.html(`${model.greeting} ${model.name}`);
        INPUT_NAME.val(model.name);
        BUTTONS_SHOW_MODAL.each((i, x) => {
            $(x).prop("disabled",  model.name.length === 0 || model.greeting.length === 0);
        });
    };
};