import test from "ava";
import getEventTarget from "./get-event-target";

test.beforeEach(() =>{
    document.body.innerHTML = "<button>Click</button>";
});

test("Should identify event target", t => {
    const event = new MouseEvent("click");
    const button = document.querySelector("button");
    Object.defineProperty(event, "target", { value: button, enumerable: true });

    const target = getEventTarget(event);

    t.is(target, button);
});

test("Should identify event target on legacy browsers", t => {
    const event = new MouseEvent("click");
    const button = document.querySelector("button");
    Object.defineProperty(event, "srcElement", { value: button, enumerable: true });

    const target = getEventTarget(event);

    t.is(target, button);
});