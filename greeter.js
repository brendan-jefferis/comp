/**
 * Created by bjefferis on 23/11/2016.
 */
Greeter = {};

Greeter.Actions = (model) => {

    function setFullGreeting(name = model.name, greeting = model.greeting) {
        let fullGreeting;
        if (name === "" && greeting !== "") {
            fullGreeting = `${greeting}!!`;
        } else if (name !== "" && greeting === "") {
            fullGreeting = `${name}!!`;
        } else if (name !== "" && greeting !== "") {
            fullGreeting = `${greeting} ${name}!!`;
        } else {
            fullGreeting = "Hello..?"
        }
        return fullGreeting.toUpperCase();
    }

    return {
        setGreeting: (greeting) => {
            model.greeting = greeting;
            model.fullGreeting = setFullGreeting(model.name, greeting);
        },
        setName: (name) => {
            model.name = name;
            model.fullGreeting = setFullGreeting(name, model.greeting);
        }
    };
};

Greeter.View = () => {
    const COMPONENT = $("[data-component=greeter]");

    const GREETING = COMPONENT.find("[data-selector=greeting]");
    const INPUT_NAME = COMPONENT.find("[data-selector=greeter-name]");
    const BUTTONS_SHOW_MODAL = $("[data-selector=show-greeter-modal]");
    const SELECT_GREETING = COMPONENT.find("[data-selector=greeter-select-greeting]");

    return {
        init: (actions, model) => {
            INPUT_NAME.on("keyup", (e) => { actions.setName(e.currentTarget.value); });
            SELECT_GREETING.on("change", (e) => { actions.setGreeting(e.currentTarget.value); });
            BUTTONS_SHOW_MODAL.on("click", (e) => { c.actions.modal.show(model.fullGreeting); });
        },
        render: (model) => {
            GREETING.html(model.fullGreeting);
            if (INPUT_NAME.val() !== model.name) {
                INPUT_NAME.val(model.name);
            }
            BUTTONS_SHOW_MODAL.each((i, x) => {
                $(x).prop("disabled",  model.name.length === 0 || model.greeting.length === 0);
            });
        }
    };
};