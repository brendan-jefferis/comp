Example1 = {};

Example1.Actions = (model) => {
    console.log("Example1.Actions called... returning actions");

    return {
        setName: (name) => {
            console.log(`Calling actions.setName with ${name}`);
            model.name = name;
        },
        clear: () => {
            console.log('Calling actions.clear');
            model.name = "";
        }
    };
};

Example1.View = () => {
    console.log("Example1.View called... declaring consts and returning init & render");
    const COMPONENT = $("[data-component=example-1]");
    
    const INPUT_NAME = COMPONENT.find("[data-selector=example-1-your-name]");
    const H2_OUTPUT = COMPONENT.find("[data-selector=example-1-output]");
    const CLEAR_BUTTON = COMPONENT.find("[data-selector=example-1-clear]");

    return {
        init: (actions, model) => {
            console.log("View init called... event handlers attached");
            CLEAR_BUTTON.on("click", actions.clear);
            INPUT_NAME.on("keyup", (e) => { actions.setName(e.currentTarget.value); });
        },
        render: (model) => {
            console.log("View render called");
            if (INPUT_NAME.val() !== model.name) {
                INPUT_NAME.val(model.name);
            }
            CLEAR_BUTTON.prop("disabled", model.name == null || model.name === "");

            let greeting = (model.name != null && model.name !== "") ? `Hello ${model.name}` : "";
            H2_OUTPUT.html(greeting);
        }
    };
};