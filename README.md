Componentizer
=============

A minimal library + design pattern to help organise your JS code into manageable components.

Designed to be used instead of a framework, in cases where that might be overkill.

No external dependencies. Componentizer code is around 3K including the state recorder.

I use jQuery in the examples for DOM manipulation but it's not required by Componentizer.

###Features
- Auto-update the DOM when the model changes
- State recorder saves actions and state for testing/logging/debugging


##Examples

####[Example 1](/example1) - Core functionality
Simplest implementation (with console log statements to demonstrate when key component functions are called)

####[Example 2](/example1) - Simple component
Basic read/write functionality. The state recorder is also introduced here.

####[Example 3](/example3) - Async actions
Componentizer will ensure that your view function is called when your jQuery AJAX or ES6 Promises are resolved.

####[Example 4](/example4) - Interacting with external elements
While encapsulation of UI code is important, your layout should not be completely restricted by your code design. All components have encapsulated state; publicly accessible logic (i.e., actions); and full write access to the DOM. This means we can avoid having to deal with parent-child relationships as all components are siblings.


TODO
----
- Example 5 Interacting with other components
- Example 6 Targeting dynamic DOM elements
- Example 7 Interop with .NET model binding
- Example 8 Interop with .NET model binding using dynamic elements
- Example 9 Multiple views
- Example 10 React views (?)