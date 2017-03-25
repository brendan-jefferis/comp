#1.6.0

### Added support for mouse events

    - `mousedown`
    - `mouseup`
    - `mouseover`
    - `mouseout`
    - `mousemove`
    - `mousedrag`

### Updated dependencies

### Improved README documentation
Added codepen examples; simplified install and usage instructions; added async and generator examples

### Removed unused dependency Sinon 

#1.5.0

### Added support for actions that return generator functions
This enables developers to queue multiple, delayed state changes from the same action, by yielding promises.

A common use case for this is for UI state changes that trigger a sequence of animations - now comp can render each step as it completes.

e.g.,

```
actions(model) {
    return {

        threeStepAction() {
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
```

#1.4.2

###Minor bug fix
- The model that is passed to `comp.create` is now cloned
 
 Predictably, this fixes issues of concurrency in cases where multiple instances of the same component are instantiated.

#1.4.1

###Minor bug fix
- Ensure child components are rendered after parent (recursively) 

# 1.4.0

### Summary

Added support for nesting components, which consisted of:

- On render but before updating DOM, check if current render target has component children, if so render them in order next
- Moved event delegation to the document body - all events are now handled in the one place which has the added optimisation benefit of only requiring 10 event listeners per page instead of 10 per component

# 1.3.0

### Summary

With the change to HTML escaping in templates outlined below, this package is now ready for use (i.e., that was the last known issue at this stage).

### HTML escaping

>tl;dr now opt-in with `@` symbol, e.g., @${myHtmlToEscape}

I removed the `html-template-tag` dependency and reimplemented it as internal module. This was necessary because `html-template-tag` escapes HTML by default, whereas I needed it to be opt-in.

Consider the following use scenario

```
render(model, html) {

    function renderTitle() {
        return `<h1>Hello World</h1>`;
    }

    return html`
        <div>
            ${renderTitle}
        </div>
    `
}
```

Using `html-template-tag`, the string returned from `renderTitle` would be escaped, which would end up rendering "<h1>Hello World</h1>", which was not what I wanted.

HTML escaping is still possible, but must now be explicitly opted-in to by using the `@` symbol, e.g.,

```
render(model, html) {

    function renderTitle() {
        return `<h1>Hello World</h1>`;
    }

    return html`
        <div>
            @${renderTitle}
        </div>
    `
}
```

As with `html-template-tag`, the source for this code is [this article and comment](http://www.2ality.com/2015/01/template-strings-html.html#comment-2078932192)