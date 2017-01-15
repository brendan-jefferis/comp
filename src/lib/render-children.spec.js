import test from "ava";
import { findChildComponents } from "./render-children";

test.beforeEach(t => {
    document.body.innerHTML = `
        <div data-component="parent">
            <div data-component="child-one"></div>
            <div data-component="child-two"></div>
            <div data-component="child-three"></div>
        </div>
        <div data-component=childless-parent>
            <p>foo</p>
            <p>bar</p>
        </div>
    `;

    t.context.parent = document.querySelector("[data-component=parent]");
    t.context.childlessParent = document.querySelector("[data-component=childless-parent]");
});

test("Should throw error if not supplied with DOM element", t => {
    const error = t.throws(() => {
        findChildComponents();
    }, Error);

    t.is(error.message, "InvalidArgument: DOM element expected");
});

test("Should return a list of child component names", t => {
    const list = findChildComponents(t.context.parent);

    t.deepEqual(list, ["child-one", "child-two", "child-three"]);
});

test("Should return empty array if no child components found", t => {
    const list = findChildComponents(t.context.childlessParent);

    t.is(list.length, 0);
});