Comp.
=====

[![Build Status](https://travis-ci.org/brendan-jefferis/comp.svg?branch=master)](https://travis-ci.org/brendan-jefferis/comp)

A design pattern and micro-framework for creating UI components.

Not intended to be the Next Big Thing, more of a stepping stone to make your code and development experience more Elm-like but with less of a commitment to functional programming, more flexibility in working with existing JS code and a shallower learning curve.

> Warning: this is a work in progress and is not yet ready for use

###Features
- Virtual dom diffing (using [set-dom](https://www.npmjs.com/package/set-dom))
- Write declarative views with ES6 template strings (using [html-template-tag](https://www.npmjs.com/package/html-template-tag))
- Built-in event delegation
- Lightweight and not overly opinionated
- Components as siblings rather than parent/child with easy cross-component interop
- Easy to learn, with very few proprietary concepts to remember
- Designed to promote an easy future refactor job to migrate your JavaScript code to Elm or something Elm-like (but probably Elm, let's face it).

###Architecture
Comp borrows the model/update/view pattern and one-way data flow from the Elm Architecture and React/Flux, with a few key differences:

- All Comp components are siblings (no nesting or parent/child relationships)
- Actions (i.e., the "update" bit) are expressed with functions rather than a switch block
- While model and state remain internal to each component, a component's Actions can be called
  from external sources, e.g., other components, the console etc. This allow easy interop
  between components and allows your layout to be more loosely-coupled to your logic.
- It currently doesn't use immutable data


Install
-----------

####npm/yarn

```
npm install comp --save
```
or

```
yarn add comp
```

####Static JS

[Download comp.js (or comp.min.js)](https://github.com/brendan-jefferis/comp) and add to your HTML

Usage
-----

```
<body>
    ...
    <div data-component="helloWorld"></div>
    ...
</body>
```

```
// hello-world.js
import comp from "comp";

const model = {
    greeting: ""
};

const HelloWorld = {

    Actions = function (model) {
        return {
            setGreeting: function(greeting) {
                model.greeting = greeting || "";
            }
        }
    },

    View = function() {
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
};

comp.create("helloWorld", HelloWorld.Actions, HelloWorld.View, model);
```

Details
-------

####Declare your component

```
// my-component.js

MyComponent = {};
```

####Declare a model and give it some defaults
This step is not required but highly recommended (it'll save a few lines of null-or-undefined checking later on)

```
// my-component.js

var model = {
    foo: ""
};
```

####Add some Actions

```
// my-component.js

MyComponent.Actions = function (model) {
	return {
		setFoo(value) {
			model.foo = value;
		}
	}
}
```

This must be a function that **takes a model** and **returns an object of functions** (referred to as actions).

These will be used exclusively for changing your model.

####Add a View

A Comp View is simply a function that **returns a render method** and an optional init method. init will be passed your
actions, render will be passed your model and an HTML helper for working with ES6 template strings

Comp will ensure that the render function is called after every action.

```
// my-component.js

MyComponent.View = function() {
    return {
        init: (actions) {
            // initialize some things here if you need to
        },
        render: (model, html) {
            return html`
                <div>
                    <h1>${model.foo}</h1>
                    <input type="text" data-keyup="setFoo(this.value)">
                </div>
            `
        }
    }
}
```
####Add an HTML container element

```
//index.html
<body>
	...
	<div data-component="myComponent"></div>
	...
</body>
```

####Create your component
The name you provide must match the data-component attribute of the container element

```
// my-component.js
comp.create("myComponent", MyComponent.Actions, MyComponent.View, model);
```

Additional info
---------------

####The Comp global object
Comp has a simple API:

`components`    An object containing all components on the current page

`create(name:string, actions:(model: Object) -> Object, view:() -> Object, model:Object)` Creates a new component and adds it to components

You can call a component's actions externally via the Comp global object like so:

```
comp.components.HelloWorld.setGreeting("Sup");
```

When a component is created, a special method is added to the list of actions called `get`, which allows read-only
access to any property on the component's model, e.g.

```
comp.components.HelloWorld.get("greeting") // "Sup"
```

####Notes
- Your component's name must match your HTML container's data-component attribute if you want to use ES6 string
  templates, virtual-dom diffing and event delegation
- Currently, values passed as arguments in a `data-[event]` attribute are treated as strings - except for references to the element's attributes, which will be treated as the actual values (not the literal string "this.value")
  e.g., `<input type="text" data-change="setGreeting(this.value)">` - this works for any HTML element attribute
- The event delegation adds a single event listener to the HTML container, and delegates events to child elements
  that use the `data-[event]` attribute, e.g., `data-click` `data-change` `data-keyup` etc

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


####Writing a View with jQuery

Comp will call your View's render function, but doesn't care what's in it (unless it returns a template string as
explained above). This means that you're free to implement your view code however you like. Here's an example using jQuery with manual event handling and DOM operations.

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
