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
	        model.confirmationMessage = `Saved recording with recording id:<br><strong>${recordingId}</strong>`;
	        return new Promise((resolve) => {
	        	setTimeout(() => {
	        		model.confirmationMessage = "";
	        		resolve(model);
	        	}, 10000);
	        });
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
	        model.confirmationMessage = `Recording ${id} loaded`;
	        return new Promise((resolve) => {
	        	setTimeout(() => {
	        		model.confirmationMessage = "";
	        		resolve(model);
	        	}, 3000);
	        });
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
	let COMPONENT = $("[data-component=componentizer-recorder]");
	
	let BUTTON_PAUSE = COMPONENT.find("[data-selector=recorder-pause]");
	let BUTTON_RESUME = COMPONENT.find("[data-selector=recorder-resume]");
	let BUTTON_SAVE = COMPONENT.find("[data-selector=recorder-save]");
	let BUTTON_LOAD = COMPONENT.find("[data-selector=recorder-load]");
	let BUTTON_REPLAY = COMPONENT.find("[data-selector=recorder-replay]");
	let INPUT_RECORDING_ID = COMPONENT.find("[data-selector=recorder-recording-id]");
	let CONFIRMATION_MESSAGE = COMPONENT.find("[data-selector=recorder-confirmation-message]");

	function renderControls() {
		var component = document.createElement("div");
		component.setAttribute("data-component", "componentizer-recorder");
		
		var header = document.createElement("h6");
		header.innerText = "Recorder";

		var pause = document.createElement("button");
		pause.setAttribute("data-selector", "recorder-pause");
		pause.innerText = "Pause";

		var resume = document.createElement("button");
		resume.setAttribute("data-selector", "recorder-resume");
		resume.innerText = "Resume";

		var save = document.createElement("button");
		save.setAttribute("data-selector", "recorder-save");
		save.innerText = "Save";

		var storageId = document.createElement("input");
		storageId.setAttribute("type", "text");
		storageId.setAttribute("placeholder", "e.g., tiny-components_index-510116124653");
		storageId.setAttribute("data-selector", "recorder-recording-id");

		var load = document.createElement("button");
		load.setAttribute("data-selector", "recorder-load");
		load.innerText = "Load";

		var replay = document.createElement("button");
		replay.setAttribute("data-selector", "recorder-replay");
		replay.innerText = "Replay";
		
		var message = document.createElement("p");
		message.style.display = "none";
		message.setAttribute("data-selector", "recorder-confirmation-message");

		component.appendChild(header);
		component.appendChild(pause);
		component.appendChild(resume);
		component.appendChild(save);
		component.appendChild(storageId);
		component.appendChild(load);
		component.appendChild(replay);
		component.appendChild(message);

		return component;
	};

	return {
		init: (actions, model) => {
			document.body.append(renderControls());

			COMPONENT = $("[data-component=componentizer-recorder]");	
			BUTTON_PAUSE = COMPONENT.find("[data-selector=recorder-pause]");
			BUTTON_RESUME = COMPONENT.find("[data-selector=recorder-resume]");
			BUTTON_SAVE = COMPONENT.find("[data-selector=recorder-save]");
			BUTTON_LOAD = COMPONENT.find("[data-selector=recorder-load]");
			BUTTON_REPLAY = COMPONENT.find("[data-selector=recorder-replay]");
			INPUT_RECORDING_ID = COMPONENT.find("[data-selector=recorder-recording-id]");
			CONFIRMATION_MESSAGE = COMPONENT.find("[data-selector=recorder-confirmation-message]");

			BUTTON_PAUSE.on("click", actions.pause);
			BUTTON_RESUME.on("click", actions.resume);
			BUTTON_SAVE.on("click", actions.save);
			BUTTON_LOAD.on("click", () => { actions.load(model.recordingId); });
			BUTTON_REPLAY.on("click", actions.replay);
			INPUT_RECORDING_ID.on("keyup", (e) => { actions.setRecordingId(e.currentTarget.value); });
		},
		render: (model) => {
			if (model.confirmationMessage) {
				CONFIRMATION_MESSAGE.html(model.confirmationMessage);
			}
			if (model.confirmationMessage !== "") {
				CONFIRMATION_MESSAGE.fadeIn(200);
			} else {
				CONFIRMATION_MESSAGE.fadeOut(200);
			}
		}
	};
};

if (window.componentizer != null && window.componentizer.createRecorder != null) {
	componentizer.createRecorder(Recorder.Actions, Recorder.View);
} else {
	console.warn("Componentizer recorder failed to attach. Make sure to load comp.js script first.");
}
