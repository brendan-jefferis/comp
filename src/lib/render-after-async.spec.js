import test from "ava";
import renderAfterAsync from "./render-after-async";

test("Should throw error if no model received", async t => {
    await renderAfterAsync(Promise.resolve()).then(err => {
        t.is(err.message, "No model received - aborting render");
    });
});

test("Should call render if resolved with model", async t => {
    await renderAfterAsync(Promise.resolve({foo: 123}), (model) => {
        t.is(model.foo, 123);
    });
});

test("Should warn if async action doesn't handle the error", async t => {
    await renderAfterAsync(Promise.reject("Foo")).then(err => {
        t.is(err, "Foo\r\nError unhandled by component. Add a catch handler in your action.")
    });
});