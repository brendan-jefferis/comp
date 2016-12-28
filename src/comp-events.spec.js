import test from "ava";
import comp from "./comp";
import * as compEvents from "./comp-events";

// TODO use sinon to check if functions have been called

test.beforeEach(t => {
    document.body.innerHTML = `<div data-component="mock"></div>`;

    t.context.model = {
        num: 0,
        title: "Mock title"
    };

    t.context.Mock = {
        Actions(model) {
            return {
                empty() {},
                setSum(a, b) { model.num = parseInt(a, 10) + parseInt(b, 10); },
                double(num) { model.num = num * 2 },
                setTitle(title) { model.title = title; },
                clearTitle() { model.title = ""; },
                asyncAction() {
                    return new Promise((res) => {
                        setTimeout(() => {
                            res(model);
                        }, 500);
                    })
                    .then(result => {
                        return result;
                    });
                }
            }
        },
        View() {
            return {
                render(model) {
                    return `
                        <h1>${model.title}</h1>
                        <input type="text" data-change="setTitle(this.value)" value="${model.title}">
                        <a data-click="setSum(2, 3)">Set sum</a>
                        <button data-click="clearTitle">Click</button>
                        <p data-click="unknownAction"></p>
                    `;
                }
            }
        }
    };
});

test("Should add delegate event listeners to target element", t => {
    const c = t.context;
    const mock = comp.create("mock", c.Mock.Actions, c.Mock.View, c.model);
    t.plan(7);

    let f = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, fn, capture) {
        this.f = f;
        this.f(type, fn, capture);
        if (this.getAttribute("data-component") === "mock") {
            t.pass();
        }
    };

    compEvents.registerEventDelegator(mock);
});

test("Should return component if no matching HTML target found", t => {
   const c = t.context;
   const mock = comp.create("foo", c.Mock.Actions, c.Mock.View, c.model);

   const result = compEvents.registerEventDelegator(mock);

   t.is(result, mock);
});

test("Should identify event target", t => {
    const c = t.context;
    comp.create("mock", c.Mock.Actions, c.Mock.View, c.model);
    const event = new MouseEvent("click");
    const button = document.querySelector("button");
    Object.defineProperty(event, "target", { value: button, enumerable: true });

    const target = compEvents.getEventTarget(event);

    t.is(target, button);
});

test("Should identify event target on legacy browsers", t => {
    const c = t.context;
    const mock = comp.create("mock", c.Mock.Actions, c.Mock.View, c.model);
    const event = new MouseEvent("click");
    const button = document.querySelector("button");
    Object.defineProperty(event, "srcElement", { value: button, enumerable: true });

    const target = compEvents.getEventTarget(event);

    t.is(target, button);
});

test("Should extract action name from event", t => {
    const c = t.context;
    const mock = comp.create("mock", c.Mock.Actions, c.Mock.View, c.model);
    const event = new MouseEvent("click");
    const element = document.querySelector("button");

    const action = compEvents.getEventActionFromElement(event, element);

    t.is(action.name, "clearTitle");
});

test("Should extract action name ignoring parentheses from event", t => {
    const c = t.context;
    const mock = comp.create("mock", c.Mock.Actions, c.Mock.View, c.model);
    const event = new MouseEvent("change");
    const element = document.querySelector("input[type=text]");

    const action = compEvents.getEventActionFromElement(event, element);

    t.is(action.name, "setTitle");
});

test("Should extract action arguments from event", t => {
    const c = t.context;
    const mock = comp.create("mock", c.Mock.Actions, c.Mock.View, c.model);
    const event = new MouseEvent("click");
    const element = document.querySelector("a");

    const action = compEvents.getEventActionFromElement(event, element);

    t.deepEqual(action.args, ["2","3"]);
});

test.todo("Should call action on delegated event");

test("Should translate 'this.value' argument to correct element value", t => {
    const c = t.context;
    const mock = comp.create("mock", c.Mock.Actions, c.Mock.View, c.model);
    const event = new MouseEvent("change");
    const element = document.querySelector("input[type=text]");
    element.value = "New title";

    const action = compEvents.getEventActionFromElement(event, element);

    t.deepEqual(action.args, ["New title"]);
});