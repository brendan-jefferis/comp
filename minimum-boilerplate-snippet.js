/**
 * Created by bjefferis on 23/11/2016.
 */

YourComponent = {};

YourComponent.Actions = (model) => {
 	return {
        //.. yourActions: () => {}
    };
};

YourComponent.View = () => {
    //const COMPONENT = $("[data-component=your-component]");
    //const INPUT_YOUR_INPUT: COMPONENT.find("[data-selector=your-module-your-input]");

    return {
    	init: (actions, model) => {
    		//INPUT_YOUR_INPUT.on("change", actions.yourAction);
    	},
    	render: (model) => {
        	//INPUT_YOUR_INPUT.val(model.yourProp);
        }
    };
};