import test from "ava";
import inspectSyntax from "./inspect-syntax";

test("Should throw on syntax error", t => {
    t.plan(2);
    const error = t.throws(() => {
        inspectSyntax("foo(1,2,3");
    }, SyntaxError);
    t.is(error.message, "SyntaxError: missing ) after argument list");
});

test("Should not throw for correct syntax", t => {
    t.notThrows(() => {
        inspectSyntax("foo(1,2,3)");
    }, SyntaxError);
});
