/**
 * Created by bjefferis on 23/11/2016.
 */
function YourModule(model) {
    model = model || {};
    this.Render(model);
    return this.Actions(model, this.Render);
};

YourModule.prototype.Actions = (model, render) => {
    return componentize({
        //.. yourActions: () => {}
    }, model, render);
};

YourModule.prototype.Render = (model) => {
    //var component = $("[data-component=your-module]");

    function update(model) {
        //component.find("[data-model=your-element]").html(model.yourProp);
    }

    update(model);
};