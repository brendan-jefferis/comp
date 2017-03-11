export function renderAfterPromise(promise, render) {
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

export function renderAfterGenerator(gen, render) {    
    let state = gen.next();
    if (state.value) {
        if (state.value.then) {
            renderAfterPromise(state.value, render)
                .then(() => {
                    if (!state.done) {
                        renderAfterGenerator(gen, render);
                    }
                });
        } else {
            render(state.value);
            if (!state.done) {
                renderAfterGenerator(gen, render);
            }
        }
    }
}