export function registerEventDelegator(component) {
    const componentHtmlTarget = document.querySelector(`[data-component=${component.name}]`);
    if (componentHtmlTarget === null) {
        return component;
    }

    Object.keys(Event.prototype).map(function (ev, i) {
        if (i >= 10 && i <= 19) {
            componentHtmlTarget.addEventListener(ev.toLowerCase(), e => {
                const target = getEventTarget(e);
                const action = getEventActionFromElement(e, target);
                if (component[action.name] == null) {
                    return;
                }

                if (action.args === "") {
                    component[action.name]();
                } else {
                    component[action.name].apply(action, action.args);
                }
            });
        }
    }, this);

    return component;
}

export function getEventTarget(event) {
    event = event || window.event;
    return event.target || event.srcElement;
}

export function getEventActionFromElement(event, element) {
    const actionStr = element.getAttribute(`data-${[event.type]}`) || "";

    return {
        name: extractActionName(actionStr),
        args: extractArguments(actionStr, element)
    }
}

export function extractActionName(str) {
    const nameResult = str.match(/[^(]*/);
    return nameResult ? nameResult[0] : "";
}

export function extractArguments(str, target) {
    let args = /\(\s*([^)]+?)\s*\)/.exec(str);
    if (!args || args[1] == null) {
        return "";
    }

    args = args[1].split(/\s*,\s*/).map(function (arg) {
        // TODO extract any element property
        return arg.match(/(value)/) ? this.value : arg;
    }, target);

    return args;
}