import leven from "leven";

const threshold = 3;

export default function suggestActions(str, component) {
    if (str == null) {
        throw new Error("suggestActions requires a string argument to use as a query");
    }

    if (component == null) {
        throw new Error("suggestActions requires a component to search for actions");
    }

    let suggestions = [];

    Object.keys(component).map(actionName => {
        const distance = leven(str, actionName);
        if (distance > threshold) {
            return;
        }

        suggestions.push({ term: actionName, distance: distance });
    });

    return suggestions.sort((a, b) => a.distance > b.distance);
};
