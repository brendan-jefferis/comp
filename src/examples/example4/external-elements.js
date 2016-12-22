const BUTTON_ADD = $("[data-selector=external-add]");
const BUTTON_REFRESH = $("[data-selector=external-refresh]");
const COUNT = $("[data-selector=external-count]");

BUTTON_ADD.on("click", () => {
	if (comp && comp.components.counter) {
		comp.components.counter.add();
	}
});

BUTTON_REFRESH.on("click", () => {
	if (comp && comp.components.counter) {
		let count = comp.components.counter.get("count");
		COUNT.text(count);
	}
});