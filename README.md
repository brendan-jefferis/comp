Comp.
=====

[![experimental](http://hughsk.github.io/stability-badges/dist/experimental.svg)](http://github.com/hughsk/stability-badges)
[![Build Status](https://travis-ci.org/brendan-jefferis/comp.svg?branch=master)](https://travis-ci.org/brendan-jefferis/comp)
[![Coverage Status](https://coveralls.io/repos/github/brendan-jefferis/comp/badge.svg?branch=master)](https://coveralls.io/github/brendan-jefferis/comp?branch=master)
[![Dependency Status](https://gemnasium.com/badges/github.com/brendan-jefferis/comp.svg)](https://gemnasium.com/github.com/brendan-jefferis/comp)
[![NSP Status](https://nodesecurity.io/orgs/brendan-jefferis/projects/c309fea5-4d7e-4334-8729-7c8598f7662e/badge)](https://nodesecurity.io/orgs/brendan-jefferis/projects/c309fea5-4d7e-4334-8729-7c8598f7662e)

A design pattern and micro-framework for creating UI components.

Not intended to be the Next Big Thing, more of a stepping stone to make your code and development experience more Elm-like but with less of a commitment to functional programming, more flexibility in working with existing JS code and a shallower learning curve.

[Hello world with comp](http://codepen.io/brendan-jefferis/pen/dNdLRa?editors=1011)

###Features
- Virtual dom diffing (using [set-dom](https://www.npmjs.com/package/set-dom))
- Write declarative views with ES6 template strings (or regular ES5 string concatenation)
- Built-in event delegation
- Easy to learn, with very few proprietary concepts to remember
- Designed to promote an easy future refactor job to migrate your JavaScript code to Elm or something Elm-like.

###Architecture
Comp borrows the model/update/view pattern and one-way data flow from the Elm Architecture and React/Flux, with a few key differences:

- Actions (i.e., the "update" bit) are expressed with functions rather than a switch block
- While model and state remain internal to each component, a component's Actions can be called
  from external sources, e.g., other components, the console etc. This allow easy interop
  between components and allows your layout to be more loosely-coupled to your logic.
- The model is not immutable

###ES5 support
While most of the examples are in ES2015+, you can use good ol' ES5 as well.

[Hello world in ES5](http://codepen.io/brendan-jefferis/pen/JWBjZr?editors=1010)


Install with npm
-----------

```
npm install comp --save
```

Install as static JS
----------

[Download comp.min.js](https://raw.githubusercontent.com/brendan-jefferis/comp/master/comp.min.js) and add to your HTML via a script tag.

Alternatively, add the script tag below to use the CDN version

```
<script type="text/javascript" src="https://unpkg.com/comp"></script>
```

Basic usage
-------

####Model

```
// my-component.js

var model = {
    foo: ""
}

```

####Actions

```
// my-component.js

var actions = function (model) {
	return {
		setFoo(value) {
			model.foo = value;
		}
	}
}
```

This must be a function that **takes a model** and **returns an object of functions** (referred to as actions).

These will be used exclusively for changing your model.

####View

```
// my-component.js

var view = function() {
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

A comp view is a function that **returns a render method** and an optional init method. When you create a component with `comp.create()` comp will pass your actions into the init function if you're using it; render will be passed your model and an HTML helper for working with ES6 template strings

Comp will ensure that the render function is called after every action.

_NOTE: Your component must return a single top-level element_

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

```
// my-component.js
comp.create("myComponent", actions, view, model);
```

**Important**: The name you specify as the forst argument to `comp.create()` must match the `data-component` value of the HTML container element you declared in the previous step. This name is the unique identifier used by comp for event delegation, rendering etc.

Additional info
---------------

####The Comp global object
Comp has a simple API:

`components`    An object containing all components on the current page

`create(name, actions, view, model)` Creates a new component and adds it to comp.components

You can call a component's actions externally via the Comp global object like so:

```
comp.components.HelloWorld.setGreeting("Sup");
```

When a component is created, a special method is added to the list of actions called `get`, which allows read-only
access to any property on the component's model, e.g.

```
comp.components.HelloWorld.get("greeting") // "Sup"
```

####Async actions
As long as your action returns a Promise, comp will ensure your view is rendered when it resolves.

```
var actions = function(model) {
    return {
        myDelayedAction() {
            return new Promise((resolve, reject) => {
               // do async stuff here, setTimeout, call the server etc

               // Make sure to resolve with the updated model so it can be rendered
               resolve(model); 
            })
            .catch(err => {
                console.error(err);
            });
        }
    }
}
``` 
[Async demo](http://codepen.io/brendan-jefferis/pen/VpBwKr)

####Generators in actions (ES2015+)
Comp supports actions that return generator functions. This allows you to do multi-step, asynchronous actions (handy for things like animation sequences without having to use nested setTimeouts)

```
var actions = function(model) {
    return {
        myMultiStepAction() {
            return function* () {
                yield new Promise(resolve => {
                    setTimeout(() => {
                        model.counter++;
                        resolve(model);
                    }, 1000);
                });

                yield new Promise(resolve => {
                    setTimeout(() => {
                        model.counter++;
                        resolve(model);
                    }, 500);
                });

                yield new Promise(resolve => {
                    setTimeout(() => {
                        model.counter++;
                        resolve(model);
                    }, 800);
                });
            }
        }
    }
}
}
```

[Generator demo](http://codepen.io/brendan-jefferis/pen/KWBppo?editors=1010)

####Rules
- The component name you pass to `comp.create()` must match the `data-component` attribute of the HTML container
- All values passed as arguments in a `data-[event]` attribute are converted to strings when they're written to the DOM. However, comp ensures you can reference the target element's full attributes using `this`
  e.g., `<input type="text" data-change="myAction(this.value, this.dataset.foo)" data-foo="123">`
- Comp adds a total of 24 event event listeners to the document, and delegates all events to child elements that use the `data-[event]` attribute, e.g., `data-click` `data-change` `data-keyup` etc

  The available events are
    - `mousedown`
    - `mouseup`
    - `mouseover`
    - `mouseout`
    - `mousemove`
    - `mousedrag`
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
    - `drag`
    - `dragstart`
    - `dragend`
    - `dragover`
    - `dragenter`
    - `dragleave`
    - `dragexit`
    - `drop`
