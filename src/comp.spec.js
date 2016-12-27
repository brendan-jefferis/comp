import test from "ava";
import comp from "./comp.js";

const model = {
    num: 0,
    title: "Mock title"
};

const Mock = {
    Actions: (model) => {
        return {
            empty: () => {},
            double: num => { model.num = num * 2 },
            setTitle: title => { model.title = title; },
            //clearTitle: () => { model.title = ""; },
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
    }
};

test("Should throw error if no component name supplied", t => {
    const error = t.throws(() => {
        comp.create(null, Mock.Actions)
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

test("View.init should be optional", t => {
    t.notThrows(() => {
        comp.create("mock", Mock.Actions, null, model);
    });
});

test("View.init should be called if present", t => {
    t.plan(1);

    comp.create("mock", Mock.Actions, () => {
        return {
            init: () => {
                t.pass();
            }
        };
    }, model);
});

test("View.render should be optional", t => {
    t.notThrows(() => {
        comp.create("mock", Mock.Actions, () => {
            return {};
        });
    });
});

test("View.render should be called if present", t => {
    t.plan(1);

    comp.create("mock", Mock.Actions, () => {
        return {
            render: () => {
                t.pass();
            }
        }
    }, model);
});

test("View.render should be called after each action is called", t => {
    t.plan(2);

    comp.create("mock", Mock.Actions, () => {
        return {
            render: () => {
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
            render: () => {
                t.pass();
            }
        }
    }, model);

    comp.components.mock.asyncAction();
});


/*
    HTML string rendering and event delegation
 */

Mock.View = () => {
    return {
        render:(model) => {
            return `
                <h1>${model.title}</h1>
                <button data-click="clearTitle">Click</button>
            `;
        }
    }
};

test.beforeEach(() => {
    document.body.innerHTML = `<div data-component="mock"></div>`;
    comp.create("mock", Mock.Actions, Mock.View, model);
});

test("Should write to target element on init", t => {
    const title = document.querySelector("h1");
    t.is(title.innerHTML, "Mock title");
});

test("Should not write to target element if rendered HTML has not changed", t => {
    const target = document.querySelector("[data-component=mock]");
    target.appendChild(document.createElement("em"));
    comp.components.mock.setTitle("Mock title");
    const extra = target.querySelector("em");

    t.is(extra.tagName, "EM");
});

test("Should write to target element if rendered HTML has changed", t => {
    comp.components.mock.setTitle("New title");
    const title = document.querySelector("h1");

    t.is(title.innerHTML, "New title");
});

test.todo("Should write to target element if rendered HTML has changed for async actions");

test("Should add delegate event listeners to target element", t => {
    t.plan(7);
    let f = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, fn, capture) {
        this.f = f;
        this.f(type, fn, capture);
        if (this.getAttribute("data-component") === "mock") {
            t.pass();
        }
    };

    comp.create("mock", Mock.Actions, Mock.View, model);
});

test.todo("Should fire events supplied as data attributes e.g., data-click"/*, t => {
    let event = new MouseEvent("click", {
        "view": document,
        "bubbles": true,
        "cancelable": true
    });
    Object.defineProperty(event, "target", { value: document.querySelector("button"), enumerable: true});
    //comp.components.mock.clearTitle = sinon.spy();
    document.querySelector("[data-component=mock]").dispatchEvent(event);
    console.log(event.target.getAttribute("data-click"));
    t.true(comp.components.mock.clearTitle.called);
}*/);

test.todo("Should translate 'this.value' argument to correct element value");

test.todo("Should pass all supplied arguments to actions");