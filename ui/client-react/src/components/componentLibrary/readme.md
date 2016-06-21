# Component Library
Welcome to the QuickBase component library. This is a little wrapper that lets us show off and play with components in QBUI. Only reusable compnents should be added to this library.

## Adding a component to the library
1. Setup a new 'doc' file in `componentLibrary/docs`. You can use the other files as an example.
1. Add a reference to `componentLibrary/src/Metadata.js` so we have the component and PropType descriptions.
1. Add a new file in `componentLibrary/examples` that contains an example of using the component. This is what gets rendered into `<ReactPlayground />`.
1. Import that example in the `componentLibrary/src/Examples.js` file. This serves as a shortcut reference for all the examples.
1. Add a route to `componentLibrary/index.js` that points to the doc file you created at the start of this.
1. Add a link to `componentLibrary/src/componentLibrary.js` with a link to your new route.

## About the doc file
The purpose of the doc file is to give us some flexibility when setting up a page in the component library. Generally, there should be a description of the component, the documented PropTypes, and an example to play around with. We don't currently have a standard format for descriptions, so please provide feedback on what is working!

### Component Description
This comes from comments at the top of your react component. You can write it out in Markdown and the component-metadata module will do all the work. You can add the description anywhere you want like this:

```
<div dangerouslySetInnerHTML={{__html: Metadata.QBicon.descHtml}} />
```

### PropTypes Table
There is a component for taking the proptype documentation and turning it into a table. Assuming your components metadata is already added to `Metadata.js` you can use it like this.

```
<PropTable component="QBicon" metadata={Metadata} />
```

*TODO: Metadata can be passed automatically through the [tree using Context](https://facebook.github.io/react/docs/context.html). This would make it so that we don't have to pass in the `Metadata` object everytime its added to the page. Same with `ReactPlayground`.


### ReactPlayground
The react playground is built using CodeMirror and a few other tools. It needs to be passed uncompiled JSX and it does the rest. Use it like so:

```
<ReactPlayground codeText={Examples.YourExample} />
```