Example2 = {};

Example2.Actions = (model) => {
    return {
        setName: (name) => {
            model.name = name;
        },
        foo: () => {
            model.foo = "yep";
        },
        clear: () => {
            model.name = "";
        }
    };
};

Example2.View = () => {

    return {
        el: {
            COMPONENT: "[data-component=example-2]",
            INPUT_NAME: "[data-selector=example-2-your-name]",
            OUTPUT: "[data-selector=example-2-output]",
            CLEAR_BUTTON: "[data-selector=example-2-clear]",
            DYNAMIC_ELEMENT: "[data-selector=dyn-1]",
            DYNAMIC_BUTTON: "[data-selector=dyn-2]",
        },
        init: (actions, el) => {
            el.CLEAR_BUTTON.on("click", actions.clear);
            el.INPUT_NAME.on("keyup", (e) => { actions.setName(e.currentTarget.value); });
            el.DYNAMIC_BUTTON.on("click", actions.foo);
        },
        render: (model, el) => {
            if (el.INPUT_NAME.val() !== model.name) {
                el.INPUT_NAME.val(model.name);
            }
            el.CLEAR_BUTTON.prop("disabled", model.name == null || model.name === "");

            let greeting = (model.name != null && model.name !== "") ? `Hello ${model.name}` : "";
            el.OUTPUT.html(greeting);

            if (model.foo) {
                console.log(model.foo + " " + Date.now())
            }
        }
    };
};