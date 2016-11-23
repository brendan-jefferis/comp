/**
 * Created by bjefferis on 23/11/2016.
 */
function Counter(model) {
    model = model || {};
    this.Render(model);
    return this.Actions(model, this.Render);
}

Counter.prototype.Actions = function (model, render) {
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

Counter.prototype.Render = function (model) {
    var component = document.querySelector("[data-component=counter]");

    function update(count) {
        component.querySelector("[data-model=count]").innerHTML = count;
    }

    update(model.count);
}