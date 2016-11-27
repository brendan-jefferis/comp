Recorder = {};

Recorder.Actions = (model) => {

	function runStep(step) {
		let component = model.components[step.componentName];
        component[step.action].apply(component, step.args);
	};

	return {
		replay: () => {
			model.steps.map(runStep);
		},
		pause: () => {
			model.recording = false;
		},
		resume: () => {
			model.recording = true;
		},
		recordStep: (componentName, componentModel, componentAction, args) => {
			model.components[componentName].currentState = componentModel;
	        model.steps.push({
	            timestamp: Date.now(),
	            componentName: componentName,
	            action: componentAction,
	            args: args
	        });
		},
		save: () => {
			let now = new Date();
	        let storageId = `${this.sessionName}-${now.getDay()}${now.getMonth()}${now.getYear()}${now.getHours()}${now.getMinutes()}${now.getSeconds()}`;
	        localStorage.setItem(storageId, JSON.stringify(this));
	        console.log(storageId);
		},
		load: (id) => {
			let loadedState = JSON.parse(localStorage.getItem(id));
	        model.steps = loadedState.steps;
	        Object.keys(loadedState.components).map((componentName) => {
	            model.components[componentName].initialState = loadedState.components[componentName].initialState;
	        });
	        console.log(`${id} loaded`);
		},
		storeComponent: (component, componentModel) => {
			model.components[component.componentName] = component;
        	model.components[component.componentName].initialState = Object.assign({}, componentModel);
		}
	};
};


Recorder.View = () => {
	return {
		init: (actions, model) => {},
		render: (model) => {}
	};
};
