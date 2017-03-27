(function () {
    let HelloWorld = {};

    const model = {
        message: "Hello world!"
    };

    HelloWorld.Actions = function(model) {

        return {
            setGreeting: function(e) {
                model.message = e.target.value || "";
            },
            asyncTest() {
                return new Promise(resolve => {
                    const delay = 800;
                    setTimeout(() => {
                        model.message = `Delayed action by ${delay}ms`;
                        resolve(model);
                    }, delay);
                });
            },
            genTest() {
                return function* () {
                    yield new Promise(resolve => {
                        setTimeout(() => {
                            model.message = `Step 1...`;
                            resolve(model);
                        }, 1000);
                    });
                    
                    yield new Promise(resolve => {
                        setTimeout(() => {
                            model.message = `Step 2...`;
                            resolve(model);
                        }, 800);
                    });

                    yield new Promise(resolve => {
                        setTimeout(() => {
                            model.message = `Step 3. (complete)`;
                            resolve(model);
                        }, 3000);
                    });
                }
            }
        }
    };

    HelloWorld.View = function() {
        return {
            render: function(model, html) {
                return html`
                    <div>
                        <h1>${model.message}</h1>
                        <input type="text" data-keyup="setGreeting(2,3,4)">
                        <button data-click="asyncTest">Promise</button>
                        <button data-click="genTest">Generator</button>
                    </div>
                `;
            }
        }
    };

    comp.create("HelloWorld", HelloWorld.Actions, HelloWorld.View, model);
})();