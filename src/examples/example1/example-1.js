Example1 = {};

Example1.Actions = (model) => {
    console.group("Actions");
    console.log("Example1.Actions called... this is called once per component on page load");
    console.log("If you need private functions to perform complex operations on your model, declare them here");
    console.groupEnd();

    return {
        randomNumber: () => {
            console.group("Actions");
            console.log(`Calling actions.randomNumber`);
            model.number = Math.floor(Math.random()* 10 + 1);
            console.log(`Updating model: setting model.number to ${model.number}`);
            console.groupEnd();
        }
    };
};

Example1.View = () => {
    console.group("View");
    console.log("Example1.View called... this is called once per component on page load");
    console.log("Declare your jQuery objects here so they only get initialized once");
    console.groupEnd();
    const COMPONENT = $("[data-component=example-1]");

    const BUTTON_FOO = COMPONENT.find("[data-selector=example-1-foo]");
    const OUTPUT = COMPONENT.find("[data-selector=example-1-output]");

    return {
        init: (actions) => {
            console.group("View");
            console.log("View init called... this is called once, after your component has been created");
            console.groupEnd();
            BUTTON_FOO.on("click", actions.randomNumber);
        },
        render: (model) => {
            console.group("View");
            console.log("View render called... this is called on page load, then every time the model is updated");
            console.groupEnd();
            OUTPUT.html(model.number);
        }
    };
};

comp.create("example1", Example1.Actions, Example1.View);