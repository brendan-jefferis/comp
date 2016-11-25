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

Counter.Render = function (model) {
    const COMPONENT = $("[data-component=counter]");
    const COUNTER = COMPONENT.find("[data-selector=count]");

    return () => {
        COUNTER.html(model.count);
    };
}