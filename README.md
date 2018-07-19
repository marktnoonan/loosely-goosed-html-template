# Loosely Goosed HTML Template

> Put string or number values from JavaScript object into a HTML template with a minimum of fuss, little-to-no logic, and a couple of friendly error messages.

This project provides a simple interface to do one thing well: fill up a template with data from a JS object, then push it to a web page at the location of your choosing.

![](https://i.imgur.com/aIDudv1.png)

## Installation

Can be installed via npm, or downloaded directly from this repo (lght.js is the file you want).

```sh
npm install loosely-goosed-html-template --save
```

Then include the script at the end of your `<body>` element like `<script src="path/to/lght.js"></script>`.

For the least amount of work you could skip all the above and load it from the jsdlivr CDN in a script tag:

```
<script src="https://cdn.jsdelivr.net/npm/loosely-goosed-html-template@0.1.3/lght.js"></script>
```

This will create a global object, `lght` which you will use to interact with the templating functionality.

As long as you include any of your JS code that uses Loosely Goosed HTML Template below this in your document, everything will be ok.

## Usage

You can see the process creating and populating a basic template in the [video demo](https://www.youtube.com/watch?v=wvn6xXBwdaA).

First, define a template in your HTML. This example uses the `template` element because it is hidden when the page loads. But loosely-goosed templates can be stored in any element, and there are cases where you might prefer the template itself to be displayed to the user, even when empty. All it really needs is an `id` attribute that we can use later to refer to it, and some HTML inside that forms the template itself.

Here is an example:

```html
<template id="starwars-template">
	<b>
    A random character from the<a href="https://swapi.co/">Star Wars API</a>:
  </b>
	<br>
  <b>Name</b>: {name}
	<br>
	<b>Hair Color</b>: {hair_color}
	<br>
	<b>Eye Color</b>: {eye_color}
</template>
```

Templates contain a mix of static and dynamic content. Static content will be the same every time the template is used, and dynamic content is provided by the data object used when invoking the template. `{curly braces}` are used to indentify dynamic content. Any text inside of curly braces will be used to look up a corresponding value in the data object.

Elsewhere in your html, where you want the template to be rendered, create a container element with an appropiate id:

```html
<div id="starwars-target"></div>
```

In the above example, the data object is provided by the Staw Wars API, and looks something like this:

```js
const starWarsPerson = {
	name: "Cliegg Lars",
	height: "183",
	mass: "unknown",
	hair_color: "brown",
	skin_color: "fair",
	eye_color: "blue",
	birth_year: "82BBY",
	gender: "male",
	homeworld: "https://swapi.co/api/planets/1/",
	films: ["https://swapi.co/api/films/5/"],
	species: ["https://swapi.co/api/species/1/"],
	vehicles: [],
	starships: [],
	created: "2014-12-20T15:59:03.958000Z",
	edited: "2014-12-20T21:17:50.451000Z",
	url: "https://swapi.co/api/people/62/"
};
```

But any JS object can provide data.

To combine the template with your data, make a call to `lght.addContentToTarget` with the following arguments:

```js
lght.addContentToTarget({
	templateSelector: "#starwars-template",
	targetSelector: "#starwars-target",
	templateData: starWarsPerson
});
```

This will:

1.  Grab the template html from the template element with id `starwars-template`.
2.  Populate it with the data from the object `starWarsPerson`.
3.  Insert the completed templated into the web page inside the target element with id `starwars-target`.

### Rendering Multiple Items

If `lght.addContentToTarget` receives an array of objects as the `templateData` argument, it will do the honorable thing, which is iterate over the array and render each object one after the other, appending them inside the target element. In these cases, think of the target element as a wrapper for your templated content.

### An important note about your `templateData` object

These templates are completely logic-less. All they know how to do is look for a specific `{key}` in the object, and if its value coerces happily to a string, replace all occurances of `{key}` with the matching value. The object can _have_ properties that do not resolve to strings or numbers, but they can't be used directly by the template. An error will be generated if, say `{someProperty}` in the template turns out to be an array or object in the data.

In our example above, we avoid referring to properties like `{films}` for this reason.

It's OK for the strings to contain HTML though, it will be parsed and rendered. It's also OK for a property be an ES6 template literal, function call, or other expression that returns a string, or something that coerces nicely a string, so these, for example, would be valid and render just fine:

```js
const data = {
	someHTML: "<h1>" + someHeadingFromElsewhere + "</h1>",
	aRandomNumber: Math.floor(Math.random() * 100 + 1),
	timestamp: Date.now(),
	aTemplateString: `<p>This is another way to embed short templates into larger templates using ${externalVariable}s</p>`
};
```

_NOTE_: It's not good practice to just render whatever is provided by an external API as HTML on your own site. Be wise, sanitize: [DOMPurify](https://github.com/cure53/DOMPurify) can be used to clean strings if you don't know for sure that they are safe to inject into your web page.

Templates also have no syntax for if/else statements or loops. If you feel you need these _in your template_, you might be looking for Mustache, Handlebars, or similar libraries that have already nailed these problems.



## Some Mildly Advanced Funny Business

#### Repeated Elements

Though there is no syntax for looping within the template itself, a helper function called `arrayToHTMLString` is provided to massage an array of items into a string of repeated HTML elements. Its parameters are they array to act on, the HTML tag to wrap each item in, and the attributes that should be added to that tag when it is rendered.

```js
lght.arrayToHTMLString({ 
	array: ["list item 1", "list item 2", "list item 3"], 
	itemWrapperTagName: "li", 
	wrapperTagAttributeString: 'class="fancy"' }
));
```

This function call will return the following string:

```js
'<li class="fancy" id="array-item-0">list item 1</li><li class="fancy" id="array-item-1">list item 2</li><li class="fancy" id="array-item-1">list item 3</li>'
```

A way to use this would be to use process your data a little bit and create an object that ready for templating, instead of trying to make your template work within the structure of a JSON response you might get from an external API. As a bonus: if that API changes, you know you only need to modify code related to those changes in your adapater function, and the rest of your template will be unaffected. Or you can call `lght.arrayToHTMLString` directly in your data object:

```js
const someArrayOfThingsToRender = ["list item 1", "list item 2", "list item 3"];
const nameOfYourDataObject = {
...
	listItems: lght.arrayToHTMLString({ array: someArrayOfThingsToRender, itemWrapperTagName: "li", wrapperTagAttributeString: 'class="fancy"' }),
	listItemHeader: "Some list items!"
...
};
```

This keeps all your logic in JS but bumps you up against the practical reality of why 100% purity in things like this can sometimes increase complexity and make the code itself harder to reason about. Workaround like this for common tasks explain why major templating engines provide ways to express loops and conditionals in the template itself.



##### Unique IDs on repeated elements

By default repeated elements will receive an id of `array-item-0`, `array-item-1`, and so on. These are globally unique, but if you need a different format of ID, you can pass an argument called `idGenerator` to `lght.arrayToHTMLString`. It should be a reference to a an already-instantiated Generator object. Internally, Loosely Goosed HTML Template does it with an immediately-invoked function expression (IIFE) on the lght object itself, so it runs once on pageload:

```js
const lght = {
...
 repeatedItemIdGenerator: (function*() {
    let i = 0;
    while (i < i + 1) {
      yield `array-item-${i++}`;
    }
  })()
...
```

#### Callbacks

Your `templateData` object has one trick up its sleeve: the optional `$callback` property. This should be a function that will be run after the template is hydrated with data and pushed to the DOM. This provides you with a way to do any work that needs to happen after your template renders. You could, for example, kick off a CSS animation to fade the content in, or alert the user that something has happened.

#### Loading States

Sometimes you might want to show something in your template's target location until a template has rendered. To do this, place one element inside with the class of "loading" and it will be displayed only until the actual content has been rendered. This is useful if your data requires a network request.

```html
<div id="starwars-target">
	<span class="loading">Loading a Star Wars character from swapi.co</span>
</div>
```

#### Rendering Templates Within Other Templates

This is possible, but if you find this happening much you probably need to upgrade your experience to a "real" templating engine. As long as every `targetSelector` is unique and the target element is in the DOM by the time you call `lght.addContentToTarget`, a template that renders to a target that is inside another template will work just fine.

This is something you can do inside the `$callback` function of the parent template, because it is guaranteed to run after the template has been rendered, so if the template contains a target element, it will definitely be available to you by the time the callback runs.

You could do this indefinitely, nesting templates and targets inside each other as deep as you like. But that would be madness.

#### Forgivness when properties are not found in the data object

If a template refers to `{someProp}` and `someProp` does not exist on the data object, `{someProp}` will be replaced by an empty string. A warning will be logged to the console about this, listing any "missing" props. If the missing data causes weird spacing in the template, a CSS rule like the below can be very useful. This will squish, say, and empty `p` tag so that it's not taking up space.

```css
*:empty {
	margin: 0 !important;
	padding: 0 !important;
	height: 0 !important;
}
```

This will also happen if the value for that key is an empty string, of course. You could shoehorn some conditional logic into your template by having

```html
<p>{successMessage}{failureMessage}</p>
```

If you know that only one will be on the object when you call `lght.addContentToTarget`, or that at least one of them will be an empty string at that time, then only one of them will render. And if neither property is there, you will just have an empty `p` tag.

DON'T DO THIS THOUGH, it's also madness. The best thing would be to handle all of your logic in your JS and just make sure the data object has what you need for rendering the template in it correctly. So in the above example, it would make more sense to have

```html
<p>{statusMessage}</p>
```

And just ensure that it has the right content.

#### Escaping {somePropName}!

If you need to use {thisSyntax} and do NOT want it parsed or ovewritten in the template, you can include an exclamation point inside the curly braces like this:

```html
{example!}
```

and LGHT will render

```html
{example}
```
with no exclamation point. So you can use Loosely Goosed HTML Template to talk about Loosely Goosed HTML Template... or JSX.


## Advantages

In small projects, you can manage your HTML templates as HTML. Not a template literal, not JSX, not Handlebars in a script tag. Just a regular HTML element with some `{familiar syntax}` for pulling data out of an object.

This means you are free to use all your text-editor's features for generating, editing, and formatting HTML in your templates. But you also have the full power of JavaScript available in order to populate those templates with data, either as single objects or as an array of objects to iterate through.

## Drawbacks

This is a _very_ minimal templating function (less than 100 lines of JS). It does not handle nested data, loops, if/else statments, etc. As mentioned above, if you need those things in your template, maybe use Mustache, Handlebars, hyperHTML, or lit-html. And if you need all of that plus a bag of reactivity, you might want a front-end framework like Vue, React, Glimmer, Svelte, what have you.

The separation of concerns here is at a truly obnoxious level, forcing all logic into your JS, unless you do weird workarounds with the `$callback` feature.

## Conclusion

This has been a fun way to explore how templating engines work and the kinds of challenges faced when building them. It's a task that on the surface seems very simple, but when you get into it, it forces you to make all kinds of decisions and tradeoffs.

## Production

Well. Probably don't use this in production.

## Meta

Created by Mark Noonan – [@marktnoonan](https://twitter.com/marktnoonan)

Distributed under the MIT license. See `LICENSE` for more information.

## Contributing

1.  Fork it (<https://github.com/yourname/yourproject/fork>)
2.  Create your feature branch (`git checkout -b feature/fooBar`)
3.  Commit your changes (`git commit -am 'Add some fooBar'`)
4.  Push to the branch (`git push origin feature/fooBar`)
5.  Create a new Pull Request
