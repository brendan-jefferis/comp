import test from "ava";
import html from "./html-template";

test("Should return a string", t => {
    const result = html`Hello`;

    t.is(result, "Hello");
});

test("Should not escape HTML passed as template value", t => {
    const string = "<p>foo</p>";

    const result = html`${string}`;

    t.is(result, "<p>foo</p>")
});

test("Should escape HTML if '@' symbol used", t => {
    const string = `<p>foo</p>`;

    const result = html`@${string}`;

    t.is(result, "&lt;p&gt;foo&lt;/p&gt;");
});

test("Should output lists without commas", t => {
    const model = [1,2,3];
    function renderList(num) { return `<li>item ${num}</li>`}

    const result = html`<ul>${model.map(renderList)}</ul>`;

    t.is(result, "<ul><li>item 1</li><li>item 2</li><li>item 3</li></ul>");
});