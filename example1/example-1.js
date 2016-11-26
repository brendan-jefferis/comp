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

Example1.Render = () => {
    const COMPONENT = $("[data-component=example-1]");

    let el = {
        INPUT_NAME: COMPONENT.find("[data-selector=example-1-your-name]"),
        H2_OUTPUT: COMPONENT.find("[data-selector=example-1-output]"),
        CLEAR_BUTTON: COMPONENT.find("[data-selector=example-1-clear]")
    };

    el.CLEAR_BUTTON.off().on("click", (e) => { example1.clear(e.currentTarget.value); });
    el.INPUT_NAME.off().on("keyup", (e) => { example1.setName(e.currentTarget.value); });

    return (model) => {
        if (el.INPUT_NAME.val() !== model.name) {
            el.INPUT_NAME.val(model.name);
        }
        el.CLEAR_BUTTON.prop("disabled", model.name == null || model.name === "");

        let greeting = (model.name != null && model.name !== "") ? `Hello ${model.name}` : "";
        el.H2_OUTPUT.html(greeting);
    };
};