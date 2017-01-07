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