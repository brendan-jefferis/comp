import test from "ava";
import suggestAction from "./suggest-actions";

test.beforeEach(t => {
    t.context.components = {
        mockOne: {
            aaa: () => {},
            bbb: () => {},
            ccxss: () => {}
        },
        mockTwo: {
            abb: () => {},
            aab: () => {},
            ccc: () => {}
        },
        mockThree: {
            aabb: () => {},
            bAc: () => {},
            ccc: () => {}
        }
    }
});

test("Should throw error if no query passed", t => {
    t.plan(2);
    const error = t.throws(() => {
        suggestAction();
    }, Error);
    t.is(error.message, "suggestActions requires a string argument to use as a query");
});
//
test("Should throw if no currentComponent passed", t => {
    t.plan(2);
    const error = t.throws(() => {
        suggestAction("aaa");
    }, Error);
    t.is(error.message, "suggestActions requires a component to search for actions");
});

test("Should return empty array if no matches found", t => {
    const suggestions = suggestAction("zzzz", t.context.components.mockOne);

    t.deepEqual(suggestions, []);
});

test("Should search for matches in current component actions", t => {
    const suggestions = suggestAction("ada", t.context.components.mockOne);

    t.is(suggestions[0].term, "aaa");
});

test("Should sort matches by edit distance ascending (closest matches first)", t => {
    const suggestions = suggestAction("ada", t.context.components.mockOne);

    t.true(suggestions[0].distance < suggestions[suggestions.length -1 ].distance);
});