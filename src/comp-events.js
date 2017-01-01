import inspectSyntax from "./lib/inspect-syntax";
import getEventTarget from "./lib/get-event-target";

export function registerEventDelegator(component) {
    const componentHtmlTarget = document.querySelector(`[data-component=${component.name}]`);
    if (componentHtmlTarget === null) {
        return component;
    }

    Object.keys(Event.prototype).map(function (ev, i) {
        if (i >= 10 && i <= 19) {
            componentHtmlTarget.addEventListener(ev.toLowerCase(), e => delegateEvent(e, component, componentHtmlTarget));
        }
    }, this);

    return component;
}

export function delegateEvent(e, component, componentHtmlTarget) {
    const target = getEventTarget(e);
    const action = getEventActionFromElement(e, target, componentHtmlTarget);
    if (action.name === "") {
        return;
    }

    if (component[action.name] == null) {
        throw new Error(`Could not find action ${action.name} in component ${component.name}`);
    }

    if (action.args === "") {
        component[action.name]();
    } else {
        component[action.name].apply(action, action.args);
    }
}

export function bubbleUntilActionFound(event, element, root) {
    let actionStr = element.getAttribute(`data-${[event.type]}`) || "";
    if (actionStr !== "" || element === root) {
        try {
            inspectSyntax(actionStr, element);
        } catch (e) {
            const tempDiv = document.createElement("div");
            tempDiv.appendChild(element.cloneNode(false));
            throw new SyntaxError(`\r\n\r\nElement: ${tempDiv.innerHTML}\r\nEvent: data-${[event.type]}\r\nAction: ${actionStr}\r\n\r\n${e}`);
        }
        return {
            name: actionStr,
            element: element
        };
    }

    return bubbleUntilActionFound(event, element.parentNode, root);
}

export function getEventActionFromElement(event, element, root) {
    let action = bubbleUntilActionFound(event, element, root);

    return {
        name: extractActionName(action.name),
        args: extractArguments(action.name, action.element)
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
        const argList = arg.split(".");
        if (argList.length === 1 && argList.indexOf("this") === -1) {
            return arg;
        }

        const dataset = (argList.indexOf("dataset") === 1)
            ? Object.assign({}, target.dataset)
            : null;

        return dataset ? dataset[argList[2]] : target[argList[1]];

    }, target);

    return args;
}