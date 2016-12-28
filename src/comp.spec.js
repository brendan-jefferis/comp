import test from "ava";
import comp from "./comp.js";

// TODO use sinon to check if functions have been called

test.beforeEach(t => {
    document.body.innerHTML = "<div data-component=mock></div>";

    t.context.model = {
        num: 0,
        title: "Mock title"
    };

    t.context.Mock = {
        Actions(model) {
            return {
                empty() {
                },
                double(num) {
                    model.num = num * 2
                },
                setTitle(title) {
                    model.title = title;
                },
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
                    `;
                }
            }
        }
    };
});

test("Should throw error if no component name supplied", t => {
    const error = t.throws(() => {
        comp.create()
    }, Error);

    t.is(error.message, "Your component needs a name");
});

test("Should throw error if no Actions supplied", t => {
    t.plan(2);

    const error = t.throws(() => {
        comp.create("mock")
    });

    t.is(error.message.substr(0, 24), "mock needs some actions!");
});

test("Should be able to access model properties with getter function", t => {
    const c = t.context;
    const mock = comp.create("mock", c.Mock.Actions, null, c.model);

    const result = mock.get("num");

    t.is(result, 0);
});

test("Should have public actions", t => {
    const c = t.context;
    const mock = comp.create("mock", c.Mock.Actions, null, c.model);

    mock.double(2);

    t.is(mock.get("num"), 4);
});

test("Should store component by name in shared components object", t => {
    const c = t.context;
    comp.create("mock", c.Mock.Actions, null, c.model);

    t.truthy(comp.components.mock);
});

test("View.init should be optional", t => {
    const c = t.context;

    t.notThrows(() => {
        comp.create("mock", c.Mock.Actions, null, c.model);
    });
});

test("View.render should be optional", t => {
    const c = t.context;

    t.notThrows(() => {
        comp.create("mock", c.Mock.Actions, () => {
            return {};
        });
    });
});

test("View.init should be called if present", t => {
    const c = t.context;
    t.plan(1);

    const mock = comp.create("mock", c.Mock.Actions, () => {
        return {
            init: () => {
                t.pass();
            }
        };
    }, c.model);
});

test("View.render should be called if present", t => {
    const c = t.context;
    t.plan(1);

    comp.create("mock", c.Mock.Actions, () => {
        return {
            render: () => {
                t.pass();
            }
        }
    }, c.model);
});

test("View.render should be called after each action is called", t => {
    const c = t.context;
    t.plan(2);

    const mock = comp.create("mock", c.Mock.Actions, () => {
        return {
            render: () => {
                t.pass();
            }
        }
    }, c.model);

    mock.empty();
});

test("Should call View.render after async action complete", t => {
    const c = t.context;
    t.plan(2);

    const mock = comp.create("mock", c.Mock.Actions, () => {
        return {
            render: () => {
                t.pass();
            }
        }
    }, c.model);

    mock.asyncAction();
});

test("Should write to target element on init", t => {
    const c = t.context;
    comp.create("mock", c.Mock.Actions, c.Mock.View, c.model);

    const title = document.querySelector("h1");
    t.is(title.innerHTML, "Mock title");
});

test("Should write to target element if rendered HTML has changed", t => {
    const c = t.context;
    const mock = comp.create("mock", c.Mock.Actions, c.Mock.View, c.model);

    mock.setTitle("New title");
    const title = document.querySelector("h1");

    t.is(title.innerHTML, "New title");
});

test("Should not write to target element if rendered HTML has not changed", t => {
    const c = t.context;
    const mock = comp.create("mock", c.Mock.Actions, c.Mock.View, c.model);

    const target = document.querySelector("[data-component=mock]");
    target.appendChild(document.createElement("em"));
    mock.setTitle("Mock title");
    const extra = target.querySelector("em");

    t.is(extra.tagName, "EM");
});

test.todo("Should write to target element if rendered HTML has changed for async actions");