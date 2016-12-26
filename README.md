Componentizer
=============

A design pattern + minimal library to convert your JS modules into reusable components.

Designed to be used instead of a framework, in cases where that might be overkill.

No external dependencies, Componentizer code is around 3K.

I use jQuery in the examples for DOM manipulation but it's not required by Componentizer.

###Get started
#####Add the library to your html

```
<script src="comp.js"></script>
```

#####Or install locally to your project with npm/yarn

```
npm install @brendan-jefferis/componentizer -S

or

yarn add @brendan-jefferis/componentizer
```

#####Declare your component

```
YourComponent = {};
```

#####Add an Actions module

```
YourComponent.Actions = function (model) {
	return {
		sayHello: function() {
			model.greeting = "Hello";
		}
	}
}
```

This must be a function that takes a model and returns an object of functions (referred to as actions).

These will be used exclusively for changing your model.

Componentizer will wrap each action with a function that ensures that your View's render is called after every action.

#####Add a View module

This must be a function that returns an object containing an init and a render function.

```
YourComponent.View = function() {
	return {
		init: function(actions) {

		},
		render: function(model) {

		}
	}
}
```

init is called once, on creation of a new component and will be passed your actions. This is the ideal place to put your event listeners.

render is called after an action is called. This is where you should put write-only DOM operations

#####Add some HTML

```
<div data-component="hello-world">
	<h2 data-selector="greeting"></h2>
	<button data-selector="say-hello">Say Hello</button>
</div>
```

There's no real significance to using data-component and data-selector here - I just prefer using selectors like this as a convention over class or id for targeting DOM elements.


#####Making it do stuff

```
YourComponent.View = function() {
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

HTML elements that are present on page load can be stored in your View module and referred to in your init and render functions. Dynamic elements (i.e., elements that will be added after page load will be addressed later).

Here we've hooked up an event listener to our button and added some render code to write to the DOM.

#####Componentize it

```
componentizer.create("YourComponent", YourComponent.Actions, YourComponent.View, { greeting: "Goodbye" });
```

Turn your modules into a component, passing it a name, your Actions, your View and an (optional but recommended) initial model.

Your page should now look something like this

```
<!DOCTYPE html>
<head lang="en">
	<meta charset="utf-8">
	<title>Componentizer tutorial</title>
</head>
<body>
	<div data-component="hello-world">
	    <h2 data-selector="greeting"></h2>
	    <button data-selector="say-hello">Say Hello</button>
	</div>

	<script src="comp.js"></script>

	<script>
		YourComponent = {};

		YourComponent.Actions = function (model) {
			return {
				sayHello: function() {
					model.greeting = "Hello";
				}
			}
		}

		YourComponent.View = function() {
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
	</script>
	<script>
		componentizer.create("hello-world", YourComponent.Actions, YourComponent.View, { greeting: "Goodbye"});
	</script>
</body>
```

##Examples

####[Example 1](/example1) - Core functionality
Simplest implementation (with console log statements to demonstrate when key component functions are called)

####[Example 2](/example1) - Simple component
Basic read/write functionality. The state recorder is also introduced here.

####[Example 3](/example3) - Async actions
Componentizer will ensure that your view function is called when your jQuery AJAX or ES6 Promises are resolved.

####[Example 4](/example4) - Interacting with external elements
While encapsulation of UI code is important, your layout should not be completely restricted by your code design. All components have encapsulated state; publicly accessible logic (i.e., actions); and full write access to the DOM. This means we can avoid having to deal with parent-child relationships as all components are siblings.

####[Example 5](/example5) - Interacting with other components
In addition to being able to interact with other DOM elements, Components can also interact with each other with minimal effort.

####[Example 6](/example6) - Dynamic elements
Registering events with elements added to the DOM after page load.
