# Introduction
The purpose of this document is to layout best practices when writing CSS for QuickBase. As part of the rearchitecture project QuickBase is now built atop of Bootstrap for React using a Sass preprocessor.

# High Level Change Recommendations
The majority lays out a number of best practices that amount to code formatting and structuring conventions

## Sass Structuring
- All Sass files should be explicitly included into one master `main.scss` file. Except for a base set of styles required to bootstrap the page–i.e., we should prioritize loading the shell by inlining that CSS and then loading the rest. (We need to check and see if this will make much of a difference, including across different connection types)
    - This prevents source ordering problems. For instance, Nomalize.css is the last thing included right now. So that's dumb.
- All variables should be defined in a master file instead of locally.

## Naming
- We should move to a version of the BEM naming convention that works for us. That means no camel casing in CSS and using dashes and underscores to break up names.

## Libraries we should start using
- Autoprefixer
- [Easing](http://easings.net/) [functions](https://github.com/jhardy/compass-ceaser-easing)

## Missing things
- A grid system

## Open Questions/Issues
- Is the NODE_ENV flag prod or production?
- Does the PROD environment build a css file and set a cache-expire? I can't find any evidence that it does. Is there any advantage to the current way CSS is delivered?
- Should we look into [code-splitting with webpack](http://webpack.github.io/docs/code-splitting.html)?
- Should we firewall the usage of bootstrap mixins?
- Should we be name spacing our CSS?

# Architecture
This proposed architecture is roughly based on the [7-1 Pattern](http://sass-guidelin.es/#architecture) (see below). Basically, all the partials for QuickBase are contained in about six folders and compiled together using a single `main.scss` file. This provides a couple of benefits:
  - Control over source ordering. For instance, the current build applies Normalize and Bootstrap styles **last**.
  - A better home for styles that aren't directly tied to a component. For instance, `body` and `html` styles are found in the `nav.scss` file.
  - A single source of truth for shared variables and the ability to see how they relate to each other
  - A home for vendor based styles
  - A single CSS file that can be minified and cached for users. The current build sends all the CSS down with the `bundle.js` file and then is injected into the DOM using JavaScript.
  - This is an organization scheme that a lot of developers are used to seeing

````
sass/
│
│– base/
│   ├─ _variables.scss   # Sass Variables (I'm open to splitting this if it gets too big)
│   ├─ _grid.scss        # Grid system
│   └─ _typography.scss  # Typography rules
│   …                    # Etc.
│
├─ components/
│   ├─ _buttons.scss     # Buttons
│   ├─ _trowser.scss     # Trowser
│   ├─ _cover.scss       # Cover
│   ├─ _dropdown.scss    # Dropdown
│   └─ _forms.scss       # Forms
│   …                    # Etc.
│
├─ shell/
│   ├─ _global-bar.scss  # Global bar
│   ├─ _footer.scss      # Footer
│   └─ _leftNav.scss     # Left Nav
│   …                    # Etc.
│
├─ pages/
│   ├─ _home.scss        # Home specific styles
│   └─ _contact.scss     # Contact specific styles
│   …                    # Etc.
│
├─ utils/
│   ├─ _functions.scss   # Sass Functions
│   ├─ _mixins.scss      # Sass Mixins
│   └─ _helpers.scss     # Class & placeholders helpers
│
├─ vendors/
│   ├─ _bootstrap.scss   # Bootstrap
│   ├─ _ceaser.scss      # Easing functions
│   └─ _animate.scss     # Animate.css
│   …                    # Etc.
│
└─ main.scss             # Main Sass file
````

Additionally, don't inline styles in React. Inline styles ruin the specificity graph, make it hard to share shared styles and can't make use of pseudo-selectors/media queries.

# Formating

## Spacing
* Where possible, limit CSS files width to 80 characters. There will be unavoidable exceptions to this rule, such as URLs, or gradient syntax. Don’t worry.
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

- Do not use shorthand declarations unless you need to explicitly set all the available values.

````sass
// Bad
margin: inherit 3em;

// Good
margin-bottom: 3em;
margin-top: 3em;

margin: 3em 4em 2em 1em;
````

- Single-quote URLs and string values.

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

- Declarations are ordered by type so that a developer can quickly see all of the styles together.
- Place a new line before nested selectors unless they are after the first selector.

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
* In some cases we might use the [Sass](http://sass-lang.com/documentation/Sass/Script/Functions.html) `lighten($color, $amount)` and `darken($color, $amount)` functions instead of explicit Sass variables. Still TBD.

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

When it comes to naming, the most important thing is consistency. Since Bootstrap already has a naming convention, we will try to stick close to it. 
This means we will use our own form of the Block Element Modifier (BEM) naming convention. The naming convention follows this pattern:

```sass
.block {}
.block__element {}
.block--modifier {}

/** Examples **/

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

Additional reading:
* [article explaining BEM](http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/)
* [BEM website](https://en.bem.info/method/)

Additionally, along with naming components using the BEM method be sure to follow these guidelines:
* Name things clearly.
* Write classes semantically. Name its function not its appearance.
* Avoid presentation- or location-specific words in names, as this will cause problems when we (invariably) need to change the color, width, or feature later.

```sass
// Bad
// Avoid uppercase
.ClassNAME { }

// Avoid camel case
.commentForm { }

// What is a c1-xr? Use a more explicit name.
.c1-xr { }

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
.inset--is_hovered { }
```

# Specificity, Nesting & Mixins

## Specificity

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

* Global selectors should generally be avoided. A global selector is a selector that runs the risk of styling an element that it did not intend to style. In fact, this is the goal of using the BEM convention and will help alleviate problems caused by global selectors.

```sass
// Bad
* {
    background: red;
}

// Bad
div, nav, li {
    font-weight: bold;
}

// Bad
.item, [data-foo] {
    margin-left: 20px;
}

// Good
.trowser__item {
    background: red;
}

// Bad
:hover {
    top: 20px;
}
```

Additional Reading:
* [CSS specificity graph](http://jonassebastianohlsson.com/specificity-graph/)
* [Explanation](http://csswizardry.com/2014/10/the-specificity-graph/)

## Nesting
Avoid unnecessary nesting. In fact, our linting tool restricts nesting to a maximum of 3 levels. If you're using BEM for components then elements and modifiers don't need to be nested, you can if it helps with readability.

Additional reading:
* [nesting in Sass and Less](http://markdotto.com/2015/07/20/css-nesting/)

## @Mixins
* Use mixins for groups of properties that appear together intentionally and are used multiple times.
* Before creating a new mixin, check to see if Bootstrap already has one.

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

## @Extend
Be very careful with using @extend. It's a powerful tool that can have disastrous side-effects. Before using please consider:

* Where is my current selector going to be appended?
* Am I likely to be causing undesired side-effects?
* How large is the CSS generated by this single extend?

If you're unsure of using @extend, use these rules to not run into trouble:

* Use extend from within a module, not across different modules.
* Use extend on placeholders exclusively, not on actual selectors.
* Make sure the placeholder you extend is present as little as possible in the stylesheet.

You can use mixins in place of selectors. While mixins will copy more code, the difference will often be negligible once the output file has been gzipped.

# Variables
- Variables should be placed in the `_qbVariables.scss` file. This helps us understand what values really are shared and maintain consistency across the project.

- Create new variables in the following circumstances:
  - The value is repeated twice
  - The value is likely to be updated at least once
  - **All occurrences of the value are tied to the variable (i.e. not by coincidence)** *(this is for you Drew)*

- Use the `!default` flag to allow overriding when setting variables.
  - [Further Reading](https://robots.thoughtbot.com/sass-default)

```sass
$baseline: 1em !default;
```

- For colors we have two sets of variables. The first set is an initial set of colors that maps directly to our style guide. The second are colors by their usage that map to the first set of colors. The second set is to make sure that all occurrences of a color variable are meant to be used together.

````sass
$bigleaf: #365ebf;

// This might be changed in a theme
$header-background: $bigleaf;

// But this won't
$active-state: $bigleaf;
````

# Responsive Design & Breakpoints
We use variables for global breakpoints as a single source of truth throughout the CSS framework. These should be shared with both JavaScript and Bootstrap. You can find them in `_qbVariables.scss` (is this correct?). See the section on Property Ordering for details on where to place media queries.

When laying out a component you should first try to make it work with Flexbox, then with the global breakpoints and lastly with a locally set breakpoint. If all else fails, switch to using JavaScript to swap out a component based on the breakpoint. This is preferred because:
  - Flexbox means it's one set of selectors for all breakpoints
  - Using JavaScript to set breakpoints alters the specificity of selectors instead of relying on cascading
  - JavaScript switching is slower and requires more maintenance.

Our breakpoints are the following:

```sass
// Need to be updated
$sm: new-breakpoint(min-width 0 max-width 40em $sm_cols);
$md: new-breakpoint(min-width 0 max-width 40em $sm_cols);
$lg: new-breakpoint(min-width 0 max-width 40em $sm_cols);
```

> TODO: We could share breakpoint settings between React and Sass using the [jsontosass-loader NPM module](https://www.npmjs.com/package/jsontosass-loader).

# Bootstrap
- Use the bootstrap configuration file before trying to style a bootstrap component. You can find it in `client-react/src/assets/css/_customVariables.scss`.
- Because of how the current build system is setup, you must remove the `!default` flag in order for the variable to take effect.
- Don't use Bootstrap variables in QuickBase components. Instead, add a new variable to `_qbVariables.scss` and use that variable in your component or the Bootstrap config file.

- Boostrap has a ton of great mixins, please read up on them and consider using them where necessary.
- Generally, we should exclude bootstrap components that we're not using until we are.

# Accessibility
- Don't [remove outlines for accessibility reasons](http://a11yproject.com/posts/never-remove-css-outlines/)

> TODO: Fill out this section