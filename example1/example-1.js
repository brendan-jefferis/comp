Example1 = {};

Example1.Actions = (model) => {
    return {
        setName: (name) => {
            console.log(`calling setName with ${name}`);
            model.name = name;
        },
        clear: () => {
            console.log('calling clear');
            model.name = "";
        }
    };
};

Example1.Render = (model) => {
    const COMPONENT = $("[data-component=example-1]");

    const INPUT_NAME = COMPONENT.find("[data-selector=example-1-your-name]");
    const H2_OUTPUT = COMPONENT.find("[data-selector=example-1-output]");
    const CLEAR_BUTTON = COMPONENT.find("[data-selector=example-1-clear]");

    return () => {
        if (INPUT_NAME.val() !== model.name) {
            INPUT_NAME.val(model.name);
        }
        CLEAR_BUTTON.prop("disabled", model.name == null || model.name === "");

        let greeting = (model.name != null && model.name !== "") ? `Hello ${model.name}` : "";
        H2_OUTPUT.html(greeting);
    };
};