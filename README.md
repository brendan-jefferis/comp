Comp.
=====

A design pattern and micro-framework for creating UI components

Designed to be used instead of a framework, in cases where that might be overkill.

###Features
- Virtual dom diffing (using [set-dom](https://www.npmjs.com/package/set-dom))
- Write declarative views with ES6 template strings (using [html-template-tag](https://www.npmjs.com/package/html-template-tag))
- Built-in event delegation
- Lightweight and not overly opinionated
- Components as siblings rather than parent/child with easy cross-component interop
- Easy to learn, with very few proprietary concepts to remember

###Architecture
Comp borrows the model/update/view pattern and one-way data flow from the Elm Architecture and React/Flux,
with a few key differences:

- All Comp components are siblings (no nesting or parent/child relationships)
- Actions (i.e., the "update" bit) are expressed with functions rather than a switch block
- While model and state remain internal to each component, a component's Actions can be called
  from external sources, e.g., other components, the console etc. This allow easy interop
  between components and allows your layout to be more loosely-coupled to your logic.
- It currently doesn't use immutable data


###Get started
#####[Download comp](https://github.com/brendan-jefferis/comp/blob/master/comp.js) and add to your html
Add a container div with a `data-component` attribute and give it a name.

```
<div data-component="HelloWorld"></div>

<script src="comp.js"></script>
```

#####Or install locally to your project with npm/yarn

```
npm install comp -S

or

yarn add comp
```

Then add your import/require statement at the top of your `hello-world.js` file as usual


#####Declare your component

```
// hello-world.js

MyComponent = {};
```

#####Declare a model and give it some defaults
This step is not required but highly recommended (it'll save a few lines of null-or-undefined checking later on)

```
// hello-world.js

var model = {
    greeting: ""
};
```

#####Add some Actions

```
// hello-world.js

MyComponent.Actions = function (model) {
	return {
		setGreeting: function(greeting) {
			model.greeting = greeting || "";
		}
	}
}
```

This must be a function that takes a model and returns an object of functions (referred to as actions).

These will be used exclusively for changing your model.

#####Add a View

A Comp View is simply a function that returns a render method and an optional init method. init will be passed your
actions, render will be passed your model and an HTML helper for working with ES6 template strings

Comp will ensure that the render function is called after every action.

```
// hello-world.js

MyComponent.View = function() {
    return {
        init: (actions) {
            // initialize some things here if you need to
        },
        render: (model, html) {
            return html`
                <div>
                    <h1>${model.greeting} world</h1>
                    <input type="text" data-keyup="setGreeting(this.value)">
                </div>
            `
        }
    }
}
```

#####Create your component

```
// hello-world.js

comp.create("HelloWorld", HelloWorld.Actions, HelloWorld.View, model);
```

Your code should now look something like this..

```
// index.html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Hello World</title>
    </head>
    <body>

        <div data-component="HelloWorld"></div>

        <script src="comp.js"></script>
        <script src="hello-world.js"></script>
    </body>
</html>
```

```
// hello-world.js
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
                    <h1>${model.greeting} world!</h1>
                    <input type="text" data-keyup="setGreeting(this.value)">
                `;
            }
        }
    };

    comp.create("HelloWorld", HelloWorld.Actions, HelloWorld.View, model);
})();
```

###Further details

#####The Comp global object
Comp has a simple API:

`components`    An object containing all components on the current page
`create(name, actions, view, model)` Creates a new component and adds it to components

You can call a component's actions externally via the Comp global object like so:

```
comp.components.HelloWorld.setGreeting("Sup");
```

When a component is created, a special method is added to the list of actions called `get`, which allows read-only
access to any property on the component's model, e.g.

```
comp.components.HelloWorld.get("greeting") // "Sup"
```

#####Notes
- Your component's name must match your HTML container's data-component attribute if you want to use ES6 string
  templates, virtual-dom diffing and event delegation
- Currently, values passed as arguments are treated as strings - except for references to the element's attributes
  e.g., `<input type="text" data-change="setGreeting(this.value)">` - this works for any HTML element attribute
- The event delegation adds a single event listener to the HTML container, and delegates events to child elements
  that use the `data-[event]` attribute, e.g/. `data-click` `data-change` `data-keyup` etc

  The currently supported events are
    - `click`
    - `dblclick`
    - `keydown`
    - `keyup`
    - `keypress`
    - `dragdrop`
    - `focus`
    - `blur`
    - `select`
    - `change`

```

#####Writing a View with jQuery

Comp will call your View's render function, but doesn't care what's in it (unless it returns a template string as
explained above). This means that you're free to implement your view code however you like.

```
HelloWorld.View = function() {
	const COMPONENT = document.querySelector("[data-component=hello-world]");

	const BUTTON = COMPONENT.querySelector("[data-selector=say-hello]");
	const GREETING = COMPONENT.querySelector("[data-selector=greeting]");

	return {
		init: function(actions) {
			BUTTON.addEventListener("click", actions.sayHello);
		},
		render: function(model) {
			if (model.greeting && model.greeting !== "") {
				GREETING.innerHTML = model.greeting + " world";
			}
		}
	}
}
```
