# Introduction
The purpose of this document is to layout best practices when writing CSS for QuickBase. As part of the re-architecture project QuickBase is now built atop of Bootstrap for React using a Sass preprocessor.

# Architecture
The file structure is an adapted (for QuickBase) version of the the [7-1 Pattern](http://sass-guidelin.es/#architecture) (see below). Basically, all the partials for QuickBase are contained in seven folders (open to revising based on our needs) and compiled together using a single `main.scss` file. This provides a couple of benefits:
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
│   ├─ _qbVariables.scss   # Sass Variables (I'm open to splitting this if it gets too big)
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
└─ main.scss             # Main Sass file (does not import Bootstrap)
````

## Folder Details
See below for notes on what goes into each folder.

### Base
These are styles and variables that should always be present on every page of the product. Most of this is actually already available in Bootstrap but I'm leaving it in as we add in our own base styles.

### Components
I know that this is going to be conflated with the idea that everything is a component in React but this is reserved for things that are truly a reusable component. See [Bootstrap](http://getbootstrap.com/components/), [Foundation](http://foundation.zurb.com/) or the [Harmony UI Component Library](http://fmsscm.corp.intuit.net/deploy-harmony-ui-component-gallery/origin/master/#typography) for examples of "component libraries". Items in here will eventually feed into our UI Component Library (TBD).

### Shell
This is for React components that build the generic shell of our product (see the Nav component) such as the Global Nav and Left Nav. Arguably, this could be put into the components library but I'd argue for keeping them separate because the shell 'glues' all the parts of the components together.

### Pages
This is for React components that make up specific parts of the product. For example the ReportRoute, RecordRoute and TableHomePageRoute components.

### Utils
This is reserved for helper classes (`.left` or `.hide-on-mobile`), mixins (`@include foobar()`) and functions (`calc-space()`).

### Vendors
This is for third-party libraries such as Bootstrap and Animate.css.

## About Inlining Styles
Don't inline styles in React. Inlined styles are difficult to override (thereby breaking the specificity graph), make it hard to share styles and can't make use of pseudo-selectors/media queries.

# Formating
For the most part our formating guide will be enforced by the Sass linting tool but here's a full writeup on how it all works.

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
    background: linear-gradient(to right, rgba(255, 0, 0, 0), rgba(255, 0, 0, 1));
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
4. Pseudo-states and pseudo-elements
5. Media queries (this includes `@include` media queries)
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

    &::before {
        content: "hello";
    }

    @include media($small-screen) {
        margin-top: ($amount + 10em);
    }

    .module__ele {
        color: #fff932;
    }
}
````

# Units

## Measurements
- Default to using px units for everything unless we're working on something that is deliberately scaled or fluid.
  - Additional reading: [R.I.P. REM, Viva CSS Reference Pixel!](https://mindtheshift.wordpress.com/2015/04/02/r-i-p-rem-viva-css-reference-pixel/?utm_source=designernews)
- Avoid specifying units for zero values, e.g., `margin: 0;` instead of `margin: 0px;`.
- Definitely use a unit for dimensions, margins, borders, padding, and typography.

````sass
// Good
width: 0;

// Bad
width: 0px;

// Bad
width: 12;
````

## Colors
- All colors should be defined as a variable in the global `_qbVariables.scss` file. If it's not there, add it and work with the visual design team to name it.
- Use hex notation first, then rgb(a) and hsl(a) last.
- Both three-digit and six-digit hexadecimal notation are acceptable.
- When denoting color using hexadecimal notation, use all lowercase letters.
- In some cases we might use the [Sass](http://sass-lang.com/documentation/Sass/Script/Functions.html) `lighten($color, $amount)` and `darken($color, $amount)` functions instead of explicit Sass variables. Still TBD.

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

# Naming & Specificity

## Block Element Modifier (BEM)

We use a modified version of BEM that follows the Bootstrap convention. It still uses blocks, sections within blocks and modifiers, but doesn’t use as long a syntax.

- use the Block Element Modifier (BEM) naming convention for naming components.
- The name of block elements should match with their React component name.
- Use your best judgment when deciding what needs to follow the BEM convention. If you're creating utility classes like `.left { ... }` they obviously don't have to follow the BEM convention.
- If you want an good reference, look at Bootstraps `_navbar.scss` implementation.

```sass
.block {} // Name of the React component
.block-element {} // Element contained in the component
.block-modifier {} // State change or variation

/** Examples **/
// block
.trowser {
    position: absolute;
}

// element
.trowser-content {
    padding: 3em;
}

// modifier

.trowser-is-open {
    display: block;
}

// Protip
.trowser-progress {
    key: value
    &-progress-stage {
        display: block;
    }
}

// Outputs
.trowser-progress { key: value }
.trowser-progress-stage { display: block }

```

> PROTIP: You can use the `&` operator in Sass to [create new classes](http://alwaystwisted.com/articles/2014-02-27-even-easier-bem-ing-with-sass-33) when nested within a selector.

Additional reading:
- [article explaining BEM](http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/)
- [BEM website](https://en.bem.info/method/)

## Naming
Additionally, along with naming components using the BEM method be sure to follow these guidelines:
- Name things clearly.
- Write classes semantically. Name its function not its appearance.
- Avoid presentation- or location-specific words in names, as this will cause problems when we (invariably) need to change the color, width, or feature later.

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

- Be wary of naming components based on content, as this limits the use of the class.

```sass
// Danger zone
.product_list

// Better
.item_list
```

- Don't abbreviate unless it’s a well-known abbreviation.

```sass
// Bad
.bm-rd

// Good
.block--lg
```

- Use quotes in type pseudo selectors.

```sass
// Good
.top_image[type=’text’] { }
```

- Name CSS components and modules with singular nouns.

```sass
.button { }
```

- Name modifiers and state-based rules with adjectives.

```sass
.inset--is-hovered { }
```

## Specificity
- Pro Tip: Using the BEM convention should ameliorate most specificity problems
- IDs are reserved for when you are absolutely certain that there will only ever be one of the thing on the page.

```sass
// Bad
#component { }

// Good
.component { }
```

- Do not fix problems with ```!important```. Use ```!important``` purposefully.

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

- Keep specificity low and trend upwards in specificity as you move further down file. See Specificity graph.
- Don't use unnecessary tag selectors.

```sass
// Bad
p.body_text { }

// Good
.body_text
```

- If you have to hack specificity, use a safe hack: the multi class.

```sass
// multi-class hack
.component.component { }
```

- Global selectors should generally be avoided. A global selector is a selector that runs the risk of styling an element that it did not intend to style.

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
- [CSS specificity graph](http://jonassebastianohlsson.com/specificity-graph/)
- [Explanation](http://csswizardry.com/2014/10/the-specificity-graph/)

# Sass Functionality

## Variables
- Variables should be placed in the `_qbVariables.scss` file. This helps us understand what values really are shared and maintain consistency across the project.

- Create new variables in the following circumstances:
  - The value is repeated twice
  - The value is likely to be updated at least once
  - **All occurrences of the value are tied to the variable (i.e. not by coincidence)** *(this is for you Drew)*

- Use the `!default` flag to allow overriding when setting variables.
  - [Further Reading](https://robots.thoughtbot.com/sass-default)
- You can set variables at the top of a component file, just be sure to use the `!default` flag.

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

> PROTIP: You can do string interpolation in Sass using `#{$variable-name}`

## Functions
- Sass has a ton of [great functions](http://sass-lang.com/documentation/Sass/Script/Functions.html). Please review what's available and use them!
- You can create your own [Sass functions](http://www.sitepoint.com/sass-basics-function-directive/) as needed. Do this when you need to calculate the same thing in more than one place.

## Nesting
Avoid unnecessary nesting. In fact, our linting tool (TODO: implement linting tool) restricts nesting to a maximum of 3 levels. If you're using BEM for components then elements and modifiers don't need to be nested, you can if it helps with readability.

Additional reading:
- [nesting in Sass and Less](http://markdotto.com/2015/07/20/css-nesting/)

## @Mixins
- Use mixins for groups of properties that appear together intentionally and are used multiple times.
- Before creating a new mixin, check to see if Bootstrap already has one.

```sass
@mixin clearfix {
    &:after {
        content: '';
        display: table;
        clear: both;
    }
}
```

- Use mixins for components to change size.
- Use mixins when something requires parameters.

```sass
@mixin size($width, $height: $width) {
    width: $width;
    height: $height;
}
```

- Do not use mixins for browser prefixes. Likewise, you don't need to use vendor prefixing. Instead, we use [Autoprefixer](https://github.com/postcss/autoprefixer) to automatically apply the required prefixes.

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

- Where is my current selector going to be appended?
- Am I likely to be causing undesired side-effects?
- How large is the CSS generated by this single extend?

If you're unsure of using @extend, use these rules to not run into trouble:

- Use extend from within a module, not across different modules.
- Use extend on placeholders exclusively, not on actual selectors.
- Make sure the placeholder you extend is present as little as possible in the stylesheet.

You can use mixins in place of selectors. While mixins will copy more code, the difference will often be negligible once the output file has been gzipped.

## Bootstrap
- Use the bootstrap configuration file before trying to style a bootstrap component. You can find it in `client-react/src/assets/css/_bootstrapVariables.scss`.
- Because of how the current build system is setup, you must remove the `!default` flag in order for the variable to take effect.
- Don't use Bootstrap variables in QuickBase components. Instead, add a new variable to `_qbVariables.scss` and use that variable in your component or the Bootstrap config file.
- Bootstrap has a ton of great mixins, please read up on them and consider using them where necessary.
- Generally speaking, we exclude bootstrap components that we're not using until we need them.

# Responsive Design & Breakpoints
- We use variables for global breakpoints as a single source of truth throughout the CSS framework. These should be shared with both JavaScript and Bootstrap. They will eventually loaded via a JSON config file that is shared between Sass and React (TODO!).
- See the section on Property Ordering for details on where to place media queries.

## Principles for Responsive Layouts
When laying out a component you should try to lay it out using the following techniques:

1. Use Flexbox, it's pretty powerful and _flexible_.
  - Don't forget that Flexbox can be used to PUSH and PULL the (horizontal or vertical) ordering of elements
  - [Flexbox cheatsheet](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
2. Use the global breakpoints.
  - These combined with Flexbox should be able to do most of the heavy lifting
3. Try a locally set breakpoint.
  - Be sure to set the breakpoint as a variable at the top of the component.
  - Add a comment explaining why it is needed
4. Consider hiding and showing components wholesale if their effect on page weight is minimal
4. If all else fails, switch to using JavaScript to swap out a component based on the breakpoint.

This is recommended because:
  - Flexbox means it's one set of selectors for all breakpoints
  - Using JavaScript to set breakpoints alters the specificity of selectors instead of relying on the cascading part of CSS
  - JavaScript switching is slower and requires more maintenance.

Our breakpoints are the following:

```sass
// Need to be updated
$sm: new-breakpoint(min-width 0 max-width XXpx);
$md: new-breakpoint(min-width 0 max-width XXpx);
$lg: new-breakpoint(min-width 0 max-width XXpx);
```

> TODO: Add point of view about mobile-first or desktop first breakpoints.

## Types of Media Queries

See [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries) for details on available media queries.

- Use orientation to optimize layouts that may not work well when in landscape. (The majority of our designs assume a decent portrait design)
- Use [resolution](http://caniuse.com/#feat=css-media-resolution) for serving up higher resolution assets (icons) for high resolution devices.
- [Interaction media features](http://caniuse.com/#feat=css-media-interaction) are not yet fully supported by Firefox. Use them sparingly and only when other means are available.

# Accessibility
- Don't [remove outlines for accessibility reasons](http://a11yproject.com/posts/never-remove-css-outlines/)

> TODO: Fill out this section

# Animations
> TODO: Fill out this section.

We have Animation.css but there are other techniques we might want to look into using.
For example, [look at Repaintless.css](http://blog.lunarlogic.io/2016/boost-your-css-animation-performance-with-repaintless-css/)

Additionally, we should have shared variables for easings.