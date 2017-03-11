import test from "ava";
import { renderAfterPromise, renderAfterGenerator } from "./render-after-async";

test("Should throw error if no model received", async t => {
    await renderAfterPromise(Promise.resolve()).then(err => {
        t.is(err.message, "No model received - aborting render");
    });
});

test("Should call render if resolved with model", async t => {
    await renderAfterPromise(Promise.resolve({foo: 123}), (model) => {
        t.is(model.foo, 123);
    });
});

test("Should warn if async action doesn't handle the error", async t => {
    await renderAfterPromise(Promise.reject("Foo")).then(err => {
        t.is(err, "Foo\r\nError unhandled by component. Add a catch handler in your action.")
    });
});

test("Should render each yielded return", t => {
    function *gen() {
        yield 1;
        yield 2;
        yield 3;
    };

    t.plan(3);
    let i = 1;
    renderAfterGenerator(gen(), (value) => {
        t.is(value, i);
        i++;
    });
});

test("Should render yielded promises in sequence", async t => {
    function *gen() {
        yield Promise.resolve(1);
        yield Promise.resolve(2);
        yield Promise.resolve(3);
    };

    
    let i = 1;
    await renderAfterGenerator(gen(), (value) => {
        t.is(value, i);
        i++;
    });
});