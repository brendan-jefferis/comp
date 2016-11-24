Example1 = {};

Example1.Actions = (model) => {
    return {
        setName: (name) => {
            model.name = name;
        },
        clear: () => {
            model.name = "";
        }
    };
};

Example1.Render = (model) => {
    console.log("rendering example1");
    const COMPONENT = $("[data-component=example-1]");

    const INPUT_NAME = COMPONENT.find("[data-selector=example-1-your-name]");
    const H2_OUTPUT = COMPONENT.find("[data-selector=example-1-output]");
    const CLEAR_BUTTON = COMPONENT.find("[data-selector=example-1-clear]");

    function update(model) {
        INPUT_NAME.val(model.name);
        CLEAR_BUTTON.prop("disabled", model.name == null || model.name === "");

        let greeting = (model.name != null && model.name !== "") ? `Hello ${model.name}` : "";
        H2_OUTPUT.html(greeting);
    }

    update(model);
};