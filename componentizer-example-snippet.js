YourComponent = {};

YourComponent.Actions = (model) => {
    // declare private action functions here...

 	return {
        //.. yourActions: () => {}
    };
};

YourComponent.View = () => {
    //const COMPONENT = $("[data-component=your-component]");
    
    //const INPUT_YOUR_INPUT: COMPONENT.find("[data-selector=your-module-your-input]");

    // declare private view functions here...

    return {
    	init: (actions, model) => {
    		//INPUT_YOUR_INPUT.on("change", actions.yourAction);
    	},
    	render: (model) => {
        	//INPUT_YOUR_INPUT.val(model.yourProp);
        }
    };
};