Example4 = {};

Example4.Actions = (model) => {
    return {
        add: function() {
            model.count = model.count + 1;
        },

        subtract: function() {
            model.count = model.count - 1;
        },

        double: function() {
            model.count = model.count * 2;
        },

        reset: function() {
            model.count = 0;
        }
    };
};

Example4.View = () => {
    const COMPONENT = $("[data-component=counter]");
    
    const COUNTER = COMPONENT.find("[data-selector=count]");
    const BUTTON_SUBTRACT = COMPONENT.find("[data-selector=button-subtract]");
    const BUTTON_ADD = COMPONENT.find("[data-selector=button-add]");
    const BUTTON_DOUBLE = COMPONENT.find("[data-selector=button-double]");
    const BUTTON_RESET = COMPONENT.find("[data-selector=button-reset]");

    return {
        init: (actions) => {
            BUTTON_SUBTRACT.on("click", actions.subtract);
            BUTTON_ADD.on("click", actions.add);
            BUTTON_DOUBLE.on("click", actions.double);
            BUTTON_RESET.on("click", actions.reset);
        },
        render: (model) => {
            COUNTER.html(model.count);
        }
    }
};

comp.create("counter", Example4.Actions, Example4.View, { count: 0 });