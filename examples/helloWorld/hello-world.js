(function () {
    let HelloWorld = {};

    const model = {
        greeting: "Hello"
    };

    HelloWorld.Actions = function(model) {
        return {
            setGreeting: function(greeting) {
                model.greeting = greeting || "";
            }
        }
    };

    HelloWorld.View = function() {
        return {
            render: function(model, html) {
                return html`
                    <div>
                        <h1>${model.greeting} world!</h1>
                        <input type="text" data-keyup="setGreeting(this.value)">
                    </div>
                `;
            }
        }
    };

    comp.create("HelloWorld", HelloWorld.Actions, HelloWorld.View, model);
})();