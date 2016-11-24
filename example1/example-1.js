Example1 = {};

Example1.Actions = (model, render) => {
    return componentize({
        setName: (name) => {
            model.nameField = name;
            model.greeting = `Hello ${name}`;
        },
        clear: () => {
            model.nameField = "";
            model.greeting = "";
        }
    }, model, render);
};

Example1.Render = (model) => {
    const COMPONENT = $("[data-component=example-1]");

    const INPUT_NAME = COMPONENT.find("[data-selector=example-1-your-name]");
    const H2_OUTPUT = COMPONENT.find("[data-selector=example-1-output]");
    const CLEAR_BUTTON = COMPONENT.find("[data-selector=example-1-clear]");

    function update(model) {
        INPUT_NAME.val(model.nameField);
        CLEAR_BUTTON.prop("disabled", model.nameField == null || model.nameField === "");

        if (model.greeting != null) {
            H2_OUTPUT.html(model.greeting);
        }
    }

    update(model);
};