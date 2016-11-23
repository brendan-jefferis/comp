/**
 * Created by bjefferis on 23/11/2016.
 */

YourModule = {};

YourModule.Actions = (model, render) => {
    return componentize({
        //.. yourActions: () => {}
    }, model, render);
};

YourModule.Render = (model) => {
    //var component = $("[data-component=your-module]");

    function update(model) {
        //component.find("[data-selector=your-element]").html(model.yourProp);
    }

    update(model);
};