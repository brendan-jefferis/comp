export default function renderAfterAsync(promise, render) {
    return promise
        .then((updatedModel) => {
            if (updatedModel == null) {
                throw new Error("No model received - aborting render");
            }
            render(updatedModel);
        })
        .catch(err => {
            err = typeof err === "object"
                ? err
                : `${err}\r\nError unhandled by component. Add a catch handler in your action.`;
            console.error(err);
            return err;
        });
}
