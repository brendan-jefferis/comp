import test from "ava";
import comp from "./componentizer.js";

const model = {
    num: 0
};

const Mock = {
    Actions: (model) => {
        return {
            empty: () => {},
            double: (num) => { model.num = num * 2 },
            asyncAction: () => {
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
    View: () => {
        return {
            init: (actions, model) => {
                
            },
            render: (model) => {
            }
        }
    }
};

test("Should throw error if no component name supplied", t => {
    const error = t.throws(() => {
        comp.create(null, Mock.Actions)
    }, Error);

    t.is(error.message, "Your component needs a name");
});

test("Should throw error if no Actions supplied", t => {
    const error = t.throws(() => {
        comp.create("mock")
    });

    t.is(error.message.substr(0, 24), "mock needs some actions!")
});

test("Should store component by name in shared components object", t => {
    comp.create("mock", Mock.Actions, null, model);

    t.truthy(comp.components.mock);
});

test("Should be able to access model properties with getter function", t => {
    comp.create("mock", Mock.Actions, null, model);

    const result = comp.components.mock.get("num");

    t.is(result, 0);
});

test("Should have public actions", t => {
    comp.create("mock", Mock.Actions, null, model);

    comp.components.mock.double(2);

    t.is(comp.components.mock.get("num"), 4);
});

test("View.init should be called if present", t => {
    t.plan(1);

    comp.create("mock", Mock.Actions, () => {
        return {
            init: model => {
                t.pass();
            }
        }
    }, model);
});

test("View.render should be called if present", t => {
    t.plan(1);

    comp.create("mock", Mock.Actions, () => {
        return {
            render: model => {
                t.pass();
            }
        }
    }, model);
});

test("View.render should be called after each action is called", t => {
    t.plan(2);

    comp.create("mock", Mock.Actions, () => {
        return {
            render: model => {
                t.pass();
            }
        }
    }, model);

    comp.components.mock.empty();
});

test("Should call View.render after async action complete", t => {
    t.plan(2);

    comp.create("mock", Mock.Actions, () => {
        return {
            render: model => {
                t.pass();
            }
        }
    }, model);

    comp.components.mock.asyncAction();
});