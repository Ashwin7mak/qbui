# Introduction
The purpose of this document is to layout best practices when writing CSS for QuickBase. As part of the rearchitecture project QuickBase is now built atop of Bootstrap for React using a SASS preprocessor.

# High Level Change Recommendations
The majority lays out a number of best practices that amount to code formatting and structuring conventions

## SASS Structuring
- All SASS files should be explicitly included into one master `main.scss` file. Except for a base set of styles required to bootstrap the page–i.e., we should prioritize loading the shell by inlining that CSS and then loading the rest. (We need to check and see if this will make much of a difference, including across different connection types)
    - This prevents source ordering problems. For instance, Nomalize.css is the last thing included right now. So that's dumb.
- All variables should be defined in a master file instead of locally.

## Naming
- We should move to a version of the BEM naming convention that works for us. That means no camel casing in CSS and using dashes and underscores to break up names.

## Libraries we should start using
- Animate.css
- Autoprefixer

## Missing things
- A grid system
- A folder/system for mixins
- Don't [remove outlines for accessiblity reasons](http://a11yproject.com/posts/never-remove-css-outlines/)

## Open Questions/Issues
- Is the NODE_ENV flag prod or production?
- Does the PROD environment build a css file and set a cache-expire?
- Should we look into [code-splitting with webpack](http://webpack.github.io/docs/code-splitting.html)?
- Should we firewall the usage of bootstrap variables and mixins?
- Should we be namespacing our CSS?

# Architecture

File structures

````
src
 │
 ├── assets
 │    ├─ css
 │    │   ├── _customVariables.scss
 │    │   ├── _qbColorVariables.scss
 │    │   ├── _qbVariables.scss
 │    │   └── main.scss
 │    │
 │    ├─ fonts
 │    └─ images
 │
 └── components
      └─ <...>
          ├── <...>.js
          └── <...>.scss
````

# Formating

## Spacing
* Where possible, limit CSS files’ width to 80 characters. There will be unavoidable exceptions to this rule, such as URLs, or gradient syntax. Don’t worry.
* Use soft-tabs with a four space indent.
* Put spaces before { in rule declarations.
* Do not indent selectors unless they are nested.
* Put a blank line between each selector block.
* To close a selector block, put an unindented closing curly brace on a separate line.
* Multiple selectors should each be on a single line, with no space after each comma, unless they selector is less than five chars.
* In instances where a rule set includes only one declaration, consider removing line breaks for readability and faster editing.

````sass
// Bad
.rule{
    margin:3px;text-align:center;}

// Bad
selector1, selector2 {
}

// Good
.rule {
    margin: 3px;
    text-align: center;
}

// Good
selector1,
selector2,
selector3 {
}

// Also Good
h1, h2 {
}

// And Good
.span1 { width: 60px; }
.span2 { width: 140px; }
.span3 { width: 220px; }
````

## Property-value pairs

* Put each pair on its own line.
* Indent each pair one level.
* End all declarations with a semi-colon.
* Put one space after : in property declarations.

````sass
.selector {
    name: value;
    name: value;
}
````

* Spaces should separate values and operators in Sass expressions.
* Comma-separated property values should include a space after each comma (e.g., `box-shadow`).
* Don't include spaces after commas within `rgb()`, `rgba()`, `hsl()`, `hsla()`, or `rect()` values. This helps differentiate multiple color values (comma, no space) from multiple property values (comma with space).

````sass
// Bad
.selector {
    font-size: ($font-size+2em);
    font-size: ($font-size +2em);
}

// Good
.selector {
    font-size: ($font-size + 2em);
}

.rule {
    // Note the usage of commas
    background: linear-gradient(to right, rgba(255,0,0,0), rgba(255,0,0,1));
}
````

* Do not use shorthand declarations unless you need to explicitly set all the available values.

````sass
// Bad
margin: inherit 3em;

// Good
margin-bottom: 3em;
margin-top: 3em;

margin: 3em 4em 2em 1em;
````

* Single-quote URLs and string values.

````sass
background-image: url('/images/kittens.jpg');
font-family: 'Helvetica', sans-serif;
font-family: 'Lucida Grande', 'Helvetica', sans-serif;
````

* Wrap numeric calculations in parentheses.

````sass
// Bad
.component {
    width: 100% / 3;
}

// Good
.component {
    width: (100% / 3);
}
````

## Property Ordering

Use the following ordering within a component:

1. @extend directives
2. @include directives
3. Declaration list (property name and value)
  1. Positioning
  2. Box model
  3. Typographic
  4. Visual
4. Media queries
5. Pseudo-states and pseudo-elements
6. Nested elements
7. Nested classes

* Declarations are ordered by type so that a developer can quickly see all of the styles together.
* Place a new line before nested selectors unless they are after the first selector.

````sass
// Bad
.module {

    .module-element {
      color: #fff932;
    }
}

// Good
.module {
    .module-element {
      color: #fff932;
    }
}

// Good
.module {
    $amount = 3;
    @extend .component;
    @include sizing($amount);
    margin-top: $amount * 1em;
    text-align: center;

    @include media($small-screen) {
        margin-top: ($amount + 10em);
    }

    &::before {
        content: "hello";
    }

    .module__ele {
        color: #fff932;
    }
}
````

# Units

## Measurements
* Default to using px units for everything unless we're working on something that is deliberately scaled or fluid.
* Avoid specifying units for zero values, e.g., `margin: 0;` instead of `margin: 0px;`.

````sass
// Good
width: 0;
// Bad
width: 0px;
````

* Definitely use a unit for dimensions, margins, borders, padding, and typography.

````sass
// Bad
width: 12;
````

## Colors
* All colors should be defined as a variable in the global file. If it's not there, add it and work with the visual design team to name it.
* Use hex notation first, then rgb(a) and hsl(a) last.
* Both three-digit and six-digit hexadecimal notation are acceptable.
* When denoting color using hexadecimal notation, use all lowercase letters.
* In some cases we might use the [SASS](http://sass-lang.com/documentation/Sass/Script/Functions.html) `lighten($color, $amount)` and `darken($color, $amount)` functions instead of explicit SASS variables. Still TBD.

````sass
// Good
$light: #fff;
color: $light;

// Good
$primary: #fe9848;
color: $primary;

// Good
$secondary: rgba(255,100,255,0.5);
color: $secondary;

// Bad
color: #FFF;
````

* If you use an rgba rule, include a fallback.

````sass
// Good
.illustration {
    background-color: #eee; // fallback
    background-color: rgba(221,221,221,0.75);
}
````

# Naming

When it comes to naming, the most important thing is consistency. Since Bootstrap already has a naming convention, we will try to stick close to it. This means we will use our own form of the Block Element Modifier (BEM) naming convention. The naming convention follows this pattern:

```sass
.block {}
.block__element {}
.block--modifier {}
````

```sass
body,
div {
```

Additionally, along with naming components based of 
* Name things clearly.
* Write classes semantically. Name its function not its appearance.

```sass
// Bad
// Avoid uppercase
.ClassNAME { }

// Avoid camel case
.commentForm { }

// What is a c1-xr? Use a more explicit name.
.c1-xr { }
```

* Avoid presentation- or location-specific words in names, as this will cause problems when you (invariably) need to change the color, width, or feature later.

```sass
// Bad
.blue
.text-gray
.100width-box

// Good
.warning
.primary
.lg-box
```

* Be wary of naming components based on content, as this limits the use of the class.

```sass
// Danger zone
.product_list

// Better
.item_list
```

* Don't abbreviate unless it’s a well-known abbreviation.

```sass
// Bad
.bm-rd

// Good
.block--lg
```

* Use quotes in type pseudo selectors.

```sass
// Good
.top_image[type=’text’] { }
```

* Name CSS components and modules with singular nouns.

```sass
.button { }
```

* Name modifiers and state-based rules with adjectives.

```sass
.is_hovered { }
```

* If your CSS has to interface with other CSS libraries, consider namespacing every class.

```css
.f18-component
```

### BEM

BEM (which stands for block, element, modifier) structures CSS such that every entity is composed of (you guessed it) blocks, elements and modifiers. From [Harry Roberts](http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/)

> The point of BEM is to tell other developers more about what a piece of markup is doing from its name alone. By reading some HTML with some classes in, you can see how – if at all – the chunks are related; something might just be a component, something might be a child, or element, of that component, and something might be a variation or modifier of that component.

### Suggested custom methodology

The 18F recommendation for a naming methodology is a modified version of BEM. It still uses blocks, sections within blocks and modifiers, but doesn’t use as long a syntax.

```
.accordion
.accordion-item
.accordion-item-selected

.nav_bar
.nav_bar-link
.nav_bar-link-clicked
```

### Resources
* [article explaining BEM](http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/)
* [BEM website](https://en.bem.info/method/)


```sass
// block
.inset {
    margin-left: 15%;

    // element
    .inset__content {
      padding: 3em;
    }
}

// modifier
.inset--sm {
    margin-left: 10%;

    .inset__content {
      padding: 1em;
    }
}

// modifier
.inset--lg {
    margin-left: 20%;
}

```

## js- flagged classes
Don't attach styles to classes with a `js-` flag. These classes are reserved for javascript.

```css
// Bad
.js-people {
    color: #ff0;
}
```

### Rationale
A `js-` flagged class needs to be highly portable. Adding styles to it breaks that portability.

## test- flagged classes
Don't attach styles to classes with a `test-` flag. These classes are reserved for testing hooks such as those used by selenium.

```css
// Bad
.test-people {
    color: #ff0;
}
```

# Inheritance & Nesting

## Nesting
Avoid unnecessary nesting. Just because you can nest, doesn't mean you always should. Consider nesting only if you must scope styles to a parent if there are multiple elements to be nested.

Additional reading:
* [nesting in Sass and Less](http://markdotto.com/2015/07/20/css-nesting/)

## Mixins
* Use mixins for groups of properties that appear together intentionally and are used multiple times.

```sass
@mixin clearfix {
    &:after {
        content: '';
        display: table;
        clear: both;
    }
}
```

* Use mixins for components to change size.
* Use mixins when something requires parameters.

```sass
@mixin size($width, $height: $width) {
    width: $width;
    height: $height;
}
```

* Do not use mixins for browser prefixes. Use [Autoprefixer](https://github.com/postcss/autoprefixer).

```sass
// Bad
@mixin transform($value) {
    -webkit-transform: $value;
    -moz-transform: $value;
    transform: $value;
}
```

## Extend
Be very careful with using @extend. It's a powerful tool that can have disastrous side-effects. Before using please consider:

* Where is my current selector going to be appended?
* Am I likely to be causing undesired side-effects?
* How large is the CSS generated by this single extend?

If you're unsure of using @extend, use these rules to not run into trouble:

* Use extend from within a module, not across different modules.
* Use extend on placeholders exclusively, not on actual selectors.
* Make sure the placeholder you extend is present as little as possible in the stylesheet.

You can use mixins in place of selectors. While mixins will copy more code, the difference will often be negligible once the output file has been gzipped.

# Specificity

* IDs are reserved for when you are absolutely certain that there will only ever be one of the thing on the page.

```sass
// Bad
#component { }

// Good
.component { }
```

* Do not fix problems with ```!important```. Use ```!important``` purposefully.

```sass
// Bad
.component {
    width: 37.4% !important;
}

// Good
.hidden {
    display: none !important
}
```

* Keep specificity low and trend upwards in specificity as you move further down file. See Specificity graph.
* Don't use unnecessary tag selectors.

```sass
// Bad
p.body_text { }

// Good
.body_text
```

* If you have to hack specificity, use a safe hack: the multi class.

```sass
// multi-class hack
.component.component { }
```

It’s worth mentioning (repeatedly) that CSS selectors are not variables. Selectors are “patterns that match against elements in a tree” (see the W3C specification on Selectors) and constrain declarations to the matched elements. With that said, a **global selector is one that runs the risk of styling an element that it did not intend to style**. These kinds of selectors are potentially hazardous, and should be avoided:

* Universal selector (*)
* Type selectors (e.g. div, nav, ul li, .foo > span)
* Non-namespaced class selectors (e.g. .button, .text-right, .foo > .bar)
* Non-namespaced attribute selectors (e.g. [aria-checked], [data-foo], [type])
* A pseudoselector that’s not within a compound selector (e.g. :hover, .foo > :checked)

```sass
// Bad
* {
    background: red;
}

div, nav, li {
    font-weight: bold;
}

.item, [data-foo] {
    margin-left: 20px;
}

:hover {
    top: 20px;
}
```

## Specificity graph
An easy rule to use when dealing with specificity is to start from a low specificity and curve to higher specificity as you move towards the bottom of the output file. Since CSS rules get replaced by rules further down in the file, you'll override rules in an expected way.

There’s a tool that can graph your files’ specificity, [CSS specificity graph](http://jonassebastianohlsson.com/specificity-graph/). Run your final output file through this tool and strive for a curve trending upwards.

### Rationale
With specificity comes great responsibility. Broad selectors allow us to be efficient, yet can have adverse consequences if not tested. Location-specific selectors can save us time, but will quickly lead to a cluttered stylesheet. Exercise your best judgement to create selectors that find the right balance between contributing to the overall style and layout of the DOM.

When modifying an existing element for a specific use, try to use specific class names. Instead of `.listings-layout.bigger` use rules like `.listings-layout.listings-bigger`. Think about ack/grepping your code in the future.

Use lowercase and separate words with hyphens when naming selectors. Avoid camelcase and underscores. Use human-readable selectors that describe what element(s) they style.

Attribute selectors should use double quotes around values. Refrain from using over-qualified selectors; `div.container` can simply be stated as `.container`.

IDs should be reserved for JavaScript. Unless you have a very good reason, all CSS should be attached to classes rather than IDs. When in doubt, use a class name. This prevents target confusion and allows CSS devs and JS devs to co-exist in the same code in peace. If you must use an id selector (`#id`) make sure that you have no more than one in your rule declaration.

### Resources
* [CSS specificity graph](http://jonassebastianohlsson.com/specificity-graph/)
* [Explanation](http://csswizardry.com/2014/10/the-specificity-graph/)

# Variables
* Variables across the whole scss codebase should be placed in their own file.

> See Architecture for more details but all variables should be placed in their own file.

* Create new variables in the following circumstances:
  * The value is repeated twice
  * The value is likely to be updated at least once
  * **All occurrences of the value are tied to the variable (i.e. not by coincidence)** *(this is for you Drew)*

> We have two sets of variables for color. The first set is an initial set of colors that maps directly to our style guide. The second are colors by their usage that map to the first set of colors. The second set is to make sure that all occurrences of a color variable are meant to be used together.

````sass
$bigleaf: #365ebf;

// This might be changed in a theme
$header-background: $bigleaf;

// But this won't
$active-state: $bigleaf;
````

* When building scss that will be used across multiple projects use the `!default` flag to allow overriding.
  * [Further Reading](https://robots.thoughtbot.com/sass-default)

```sass
$baseline: 1em !default;
```

* The `!global` flag should only be used when overriding a global variable from a local scope.

```sass
// Bad
$light_blue: #18f;
$dark_green: #383;

// Good
$primary: #18f;
$secondary: #383;
$neutral: #ccc;
```

* Be careful when naming variables based on their context.

```sass
// Bad
$background_color
```

* Don't use the value of dimensional variables in the variable name.

```sass
// Bad
$width_100: 100em;

// Good
$width_lg: 100em;
```

* Name all used z-indexes with a variable.
* Have a z-index variable for each z-index used, and a separate variable, possibly aliased for where the z-index is used.

```sass
$z_index-neg_1: -100;
$z_index-neg_2: -200;
$z_index-1: 100;

$z_index-hide: $z_index-neg_2;
$z_index-bg: $z_index-neg_1;
$z_index-show: $z_index-1;
```

* Avoid arbitrary numbers that are repeated, or linked, or dependent on other parts of the code, (aka “magic numbers”).

````sass
// Bad
.component {
    top: 0.327em;
}

// Better
/**
 * 1. Magic number. This value is the lowest I could find to align the top of
 * `.foo` with its parent. Ideally, we should fix it properly.
 */
.component {
    top: 0.327em;
}

// Good
$align_top: 100%;
.component {
      top: $align_top;
}
````

## Responsive Design & Breakpoints
We use variables for global breakpoints as a single source of truth throughout the CSS framework. These should be shared with both JavaScript and Bootstrap. You can find them in `_qbVariables.scss` (is this correct?).

When laying out a component you should first try to make it work with Flexbox, then with the global breakpoints and lastly with a locally set breakpoint. If all else fails, switch to using JavaScript to replace a component.

Our breakpoints are the following:

```sass
// Need to be updated
$sm: new-breakpoint(min-width 0 max-width 40em $sm_cols);
$md: new-breakpoint(min-width 0 max-width 40em $sm_cols);
$lg: new-breakpoint(min-width 0 max-width 40em $sm_cols);
```

* Use variables to set the queries throughout so they are easy to adapt if necessary.
* Place media queries nearest to the class they are affecting.
* Rather than focusing on devices when deciding where to put breakpoints, focus on content.