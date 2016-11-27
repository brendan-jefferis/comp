Example2 = {};

Example2.Actions = (model) => {
    return {
        setName: (name) => {
            model.name = name;
        },
        clear: () => {
            model.name = "";
        }
    };
};

Example2.View = () => {
    const COMPONENT = $("[data-component=example-2]");
    
    const INPUT_NAME = COMPONENT.find("[data-selector=example-2-your-name]");
    const H2_OUTPUT = COMPONENT.find("[data-selector=example-2-output]");
    const CLEAR_BUTTON = COMPONENT.find("[data-selector=example-2-clear]");

    return {
        init: (actions, model) => {
            CLEAR_BUTTON.on("click", actions.clear);
            INPUT_NAME.on("keyup", (e) => { actions.setName(e.currentTarget.value); });
        },
        render: (model) => {
            if (INPUT_NAME.val() !== model.name) {
                INPUT_NAME.val(model.name);
            }
            CLEAR_BUTTON.prop("disabled", model.name == null || model.name === "");

            let greeting = (model.name != null && model.name !== "") ? `Hello ${model.name}` : "";
            H2_OUTPUT.html(greeting);
        }
    };
};