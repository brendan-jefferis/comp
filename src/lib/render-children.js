export function findChildComponents(root) {
    if (root == null) {
        throw new Error("InvalidArgument: DOM element expected");
    }

    return Array.prototype.map.call(root.querySelectorAll("[data-component]"), (x) => x.getAttribute("data-component"));
}