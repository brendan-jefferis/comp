const BUTTON_ADD = $("[data-selector=external-add]");
const BUTTON_REFRESH = $("[data-selector=external-refresh]");
const COUNT = $("[data-selector=external-count]");

BUTTON_ADD.on("click", (e) => {
	if (_comp && _comp.components.counter) {
		_comp.components.counter.add();
	}
});

BUTTON_REFRESH.on("click", (e) => {
	if (_comp && _comp.components.counter) {
		let count = _comp.components.counter.get("count");
		COUNT.text(count);
	}
});