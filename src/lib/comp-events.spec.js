import test from "ava";
import comp from "../comp";
import * as compEvents from "./comp-events";

test.beforeEach(t => {
    // polyfill
    window.Element.prototype.closest = function (selector) {
        var el = this;
        while (el) {
            if (el.matches(selector)) {
                return el;
            }
            el = el.parentElement;
        }
    };

    document.body.innerHTML = `<div data-component="mock"></div>`;

    const model = {
        num: 0,
        title: "Mock title"
    };

    const Mock = {
        Actions(model) {
            return {
                empty() { model.num = 5},
                setSum(a, b) { model.num = parseInt(a, 10) + parseInt(b, 10); }
            }
        },
        View() {
            return {
                render(model) {
                    return `
                        <div>
                            <h1>${model.title}</h1>
                            <input type="text" data-change="setTitle(this.value)" value="${model.title}">
                            <input type="checkbox" data-change="empty(this.checked)" checked>
                            <a id="test-no-args" data-click="empty">No args</a>
                            <a id="test-set-num" data-click="setSum(2, 3)">Set sum</a>
                            <button data-click="empty">Click</button>
                            <p id="test-unknown-action" data-click="unknownAction"></p>
                            <p id="test-syntax-error" data-click="setGreeting(1,2"></p>
                            <h4 data-change="empty(this.innerHTML)">h4 text</h4>
                            <div id="test-bubbling-bounds" data-click="setTitle(should not hit)">
                                <div id="test-bubbling" data-click="setTitle(bubbled)">
                                    <span>span text</span>
                                    <p>p text</p>
                                </div>
                            </div>
                        </div>
                    `;
                }
            }
        }
    };

    t.context.mock = comp.create("mock", Mock.Actions, Mock.View, model);
});

test("Should extract action name from event", t => {
    const event = new MouseEvent("click");
    const element = document.querySelector("button");

    const action = compEvents.getEventActionFromElement(event, element);

    t.is(action.name, "empty");
});

test("Should extract action name ignoring parentheses from event", t => {
    const event = new MouseEvent("change");
    const element = document.querySelector("input[type=text]");

    const action = compEvents.getEventActionFromElement(event, element);

    t.is(action.name, "setTitle");
});

test("Should find closest component for an element", t => {
    const element = document.querySelector("#test-bubbling");

    const target = compEvents.getComponentHtmlTarget(element);

    t.is(target.getAttribute("data-component"), "mock"); 
});

test("Should extract action arguments from event", t => {
    const event = new MouseEvent("click");
    const element = document.querySelector("#test-set-num");

    const action = compEvents.getEventActionFromElement(event, element);

    t.deepEqual(action.args, ["2","3"]);
});

test("Should exit silently if event target is body", t => {
    const event = new MouseEvent("change");
    const body = document.body;
    Object.defineProperty(event, "target", { value: body, enumerable: true });

    t.notThrows(() => {
        compEvents.delegateEvent(event, comp.components);
    });
});

test("Should exit silently if no data-[event] action found", t => {
    const event = new MouseEvent("change");
    const element = document.querySelector("#test-unknown-action");
    const root = document.querySelector("[data-component=mock]");
    Object.defineProperty(event, "target", { value: element, enumerable: true });

    t.notThrows(() => {
        compEvents.delegateEvent(event, comp.components);
    });
});

test("Should throw error if unknown action specified", t => {
    const event = new MouseEvent("click");
    const element = document.querySelector("#test-unknown-action");
    const root = document.querySelector("[data-component=mock]");
    Object.defineProperty(event, "target", { value: element, enumerable: true });

    t.plan(2);
    const error = t.throws(() => {
        compEvents.delegateEvent(event, comp.components);
    }, Error);
    t.is(error.message.substr(0, 21), "Could not find action");
});

test("Should call action if known action specified", t => {
    const event = new MouseEvent("click");
    const element = document.querySelector("#test-no-args");
    const root = document.querySelector("[data-component=mock]");
    Object.defineProperty(event, "target", { value: element, enumerable: true });

    compEvents.delegateEvent(event, comp.components);

    t.pass();
});

test("Should call action if known action specified (with args)", t => {
    const event = new MouseEvent("click");
    const element = document.querySelector("#test-set-num");
    const root = document.querySelector("[data-component=mock]");
    Object.defineProperty(event, "target", { value: element, enumerable: true });

    compEvents.delegateEvent(event, comp.components);

    t.is(t.context.mock.get("num"), 5);
});

test("Should throw error if data-[event] action contains syntax error", t => {
    const event = new MouseEvent("click");
    const element = document.querySelector("#test-syntax-error");
    const root = document.querySelector("[data-component=mock]");
    Object.defineProperty(event, "target", { value: element, enumerable: true });

    t.throws(() => {
        compEvents.delegateEvent(event, comp.components);
    }, SyntaxError);
});

test("Should extract element attribute values (e.g., this.value, this.innerHTML) from data-[event] arguments", t => {
    const event = new MouseEvent("change");
    const input = document.querySelector("input[type=text]");
    input.value = "New title";
    const checkbox = document.querySelector("input[type=checkbox]");
    const h4 = document.querySelector("h4");

    const inputAction = compEvents.getEventActionFromElement(event, input);
    const checkboxAction = compEvents.getEventActionFromElement(event, checkbox);
    const h4Action = compEvents.getEventActionFromElement(event, h4);

    t.plan(3);
    t.deepEqual(inputAction.args, ["New title"]);
    t.deepEqual(checkboxAction.args, [true]);
    t.deepEqual(h4Action.args, ["h4 text"]);
});

test("Should use bubbling to look for data-[event] on closest ancestor node", t => {
    const event = new MouseEvent("click");
    const span = document.querySelector("#test-bubbling span");
    const root = document.querySelector("[data-component=mock]");

    const action = compEvents.bubbleUntilActionFound(event, span, root);

    t.is(action.name, "setTitle(bubbled)");
});

test("Bubbling should stop at root if data-[event] not found", t => {
    const event = new MouseEvent("change");
    const span = document.querySelector("#test-bubbling span");
    const root = document.querySelector("[data-component=mock]");

    const action = compEvents.bubbleUntilActionFound(event, span, root);

    t.is(action.element, root);
});

test("Bubbling should stop at closest ancestor node with matching data-[event]", t => {
    const event = new MouseEvent("click");
    const span = document.querySelector("#test-bubbling span");
    const root = document.querySelector("[data-component=mock]");

    const action = compEvents.bubbleUntilActionFound(event, span, root);

    t.not(action.name, "setTitle(should not hit)");
});