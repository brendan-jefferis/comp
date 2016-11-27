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
	        let recordingId = `${model.sessionName}-${now.getDay()}${now.getMonth()}${now.getYear()}${now.getHours()}${now.getMinutes()}${now.getSeconds()}`;
	        localStorage.setItem(recordingId, JSON.stringify(model));
	        console.log(recordingId);
		},
		load: (id) => {
			let loadedState = JSON.parse(localStorage.getItem(id));
	        if (loadedState === null) {
	        	console.log("Failed to load recording. Please check your recording id and try again.");
	        	return;
	        }
	        model.steps = loadedState.steps;
	        Object.keys(loadedState.components).map((componentName) => {
	            model.components[componentName].initialState = loadedState.components[componentName].initialState;
	        });
	        console.log(`${id} loaded`);
		},
		storeComponent: (component, componentModel) => {
			model.components[component.componentName] = component;
        	model.components[component.componentName].initialState = Object.assign({}, componentModel);
		},
		setRecordingId: (recordingId) => {
			model.recordingId = recordingId;
		}
	};
};


Recorder.View = () => {
	const COMPONENT = $("[data-component=componentizer-recorder]");
	const BUTTON_PAUSE = COMPONENT.find("[data-selector=recorder-pause]");
	const BUTTON_RESUME = COMPONENT.find("[data-selector=recorder-resume]");
	const BUTTON_SAVE = COMPONENT.find("[data-selector=recorder-save]");
	const BUTTON_LOAD = COMPONENT.find("[data-selector=recorder-load]");
	const BUTTON_REPLAY = COMPONENT.find("[data-selector=recorder-replay]");
	const INPUT_RECORDING_ID = COMPONENT.find("[data-selector=recorder-recording-id]");

	return {
		init: (actions, model) => {
			BUTTON_PAUSE.on("click", actions.pause);
			BUTTON_RESUME.on("click", actions.resume);
			BUTTON_SAVE.on("click", actions.save);
			BUTTON_LOAD.on("click", () => { actions.load(model.recordingId); });
			BUTTON_REPLAY.on("click", actions.replay);
			INPUT_RECORDING_ID.on("keyup", (e) => { actions.setRecordingId(e.currentTarget.value); });
		},
		render: (model) => {

		}
	};
};
