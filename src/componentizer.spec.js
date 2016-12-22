import test from "ava";
import comp from "./componentizer.js";

const model = {
    num: 0,
    asyncNum: 0,
    initCalled: false,
    renderCalled: false,
    renderCalledAfterAction: false
};

const Mock = {
    Actions: (model) => {
        return {
            double: (num) => { model.num = num * 2 },
            setRenderCalledFalse: () => {
                model.renderCalledAfterAction = false;
            },
            // asyncAction: (asyncNum) => {
            //     return new Promise((res) => {
            //         setTimeout(() => {
            //             model.asyncNum = asyncNum;
            //             model.renderCalled = false;
            //             res(model);
            //         }, 1000);
            //     })
            //     .then(result => {
            //         return result;
            //     });
            // }
        }
    },
    View: () => {
        return {
            init: (actions, model) => {
                model.initCalled = true;
            },
            render: (model) => {
                model.renderCalled = true;
                model.renderCalledAfterAction = true;
            }
        }
    }
};

test("Should throw error if no component name supplied", t => {
    const error = t.throws(() => {
        comp.create(null, Mock.Actions, Mock.View)
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
    comp.create("mock", Mock.Actions, Mock.View, model);

    t.truthy(comp.components.mock);
});

test("Should be able to access model properties with getter function", t => {
    comp.create("mock", Mock.Actions, Mock.View, model);

    const result = comp.components.mock.get("num");

    t.is(result, 0);
});

test("Should have public actions", t => {
    comp.create("mock", Mock.Actions, Mock.View, model);

    comp.components.mock.double(2);

    t.is(comp.components.mock.get("num"), 4);
});

test("View.init should be called if present", t => {
    comp.create("mock", Mock.Actions, Mock.View, model);

    const result = comp.components.mock.get("initCalled");

    t.is(result, true);
});

test("View.render should be called if present", t => {
    comp.create("mock", Mock.Actions, Mock.View, model);

    const result = comp.components.mock.get("renderCalled");

    t.is(result, true);
});

test("View.render should be called after each action is called", t => {
    comp.create("mock", Mock.Actions, Mock.View, model);

    comp.components.mock.setRenderCalledFalse();
    const result = comp.components.mock.get("renderCalledAfterAction");

    t.is(result, true);
});

test.todo("Should call View.render after async action complete"/*, async t => {
    comp.create("mock", Mock.Actions, Mock.View, model);

    await comp.components.mock.asyncAction(6);
    const asyncNum = comp.components.mock.get("asyncNum");
    //const renderCalled = comp.components.mock.get("renderCalled");

    t.is(asyncNum, 6);
}*/);