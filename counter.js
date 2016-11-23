/**
 * Created by bjefferis on 23/11/2016.
 */
Counter = {};

Counter.Actions = function (model, render) {
    return componentize({
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
    }, model, render);
}

Counter.Render = function (model) {
    console.log("rendering counter");
    var component = document.querySelector("[data-component=counter]");

    function update(count) {
        component.querySelector("[data-selector=count]").innerHTML = count;
    }

    update(model.count);
}