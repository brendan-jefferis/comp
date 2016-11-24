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
    const Selector = {
        //COMPONENT: "[data-component=your-module]",
        //INPUT_YOUR_INPUT: "[data-selector=your-module-your-input]"
    }
    //const component = $(Selector.COMPONENT);

    function update(model) {
        //component.find(Selector.INPUT_YOUR_INPUT).val(model.yourProp);
    }

    update(model);
};