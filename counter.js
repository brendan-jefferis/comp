/**
 * Created by bjefferis on 23/11/2016.
 */
Counter = {};

Counter.Actions = function (model) {
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
}

Counter.View = function() {
    const COMPONENT = $("[data-component=counter]");
    const COUNTER = COMPONENT.find("[data-selector=count]");
    const BUTTON_SUBTRACT = COMPONENT.find("[data-selector=button-subtract]");
    const BUTTON_ADD = COMPONENT.find("[data-selector=button-add]");
    const BUTTON_DOUBLE = COMPONENT.find("[data-selector=button-double]");
    const BUTTON_RESET = COMPONENT.find("[data-selector=button-reset]");
    const SHOW_COUNTER_MODAL = COMPONENT.find("[data-selector=show-counter-modal]");

    return {
        init: (actions, model) => {
            BUTTON_SUBTRACT.on("click", actions.subtract);
            BUTTON_ADD.on("click", actions.add);
            BUTTON_DOUBLE.on("click", actions.double);
            BUTTON_RESET.on("click", actions.reset);
            SHOW_COUNTER_MODAL.on("click", () => {
                c.actions.modal.show(`Current count is ${model.count}`);
            });
        },
        render: (model) => {
            COUNTER.html(model.count);
        }
    }
};