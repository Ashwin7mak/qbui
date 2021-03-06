# Component Library
Welcome to the QuickBase component library. This is a little wrapper that lets us show off and play with components in QBUI. Only reusable components should be added to this library.

## Adding a component to the library

### Use the Grunt task
1. In your terminal, navigate to the qbui/ui folder
2. Run the following grunt task using the name of your component and relative path to your component (from qbui/ui folder)

`$ grunt addComponentToLibrary --name=[name of component] --path=[relative path to component]`

For example:
`$ grunt addComponentToLibrary --name=MyNewComponent --path=client-react/src/components/myNewComponent.js`

#### Grunt Task Dependencies

(All paths relative to qbui/ui/componentLibrary/src/)

1. `components/Examples.js` exists and has two comments (`// END OF IMPORT` and `// END OF EXPORT`)
2. `components/Metadata.js` exists and has two comments (`// END OF IMPORT STATEMENTS` and `// END OF METADATA MERGE`)
3. `components/componentLibrary` exists and has a `<nav>` block
4. `components/ReactPlayground.js` exists and has a comment (`// END OF IMPORT STATEMENTS`)
5. `index.js` exists and has a `<Route>` block

### For reference:
1. Setup a new 'doc' file in `componentLibrary/src/docs`. You can use the other files as an example.
1. Add a reference to `componentLibrary/src/components/Metadata.js` so we have the component and PropType descriptions.
1. Add a new file in `componentLibrary/src/examples` that contains an example of using the component. This is what gets rendered into `<ReactPlayground />`.
1. Import that example in the `componentLibrary/components/Examples.js` file. This serves as a shortcut reference for all the examples.
1. Import the component in `components/ReactPlayground.js` file using a **require statement**. `const YourComponent = require(path_to_comp)`. We do this so the code editor can compile the component and the
1. Add a route to `componentLibrary/src/index.js` that points to the doc file you created at the start of this.
1. Add a link to `componentLibrary/src/components/componentLibrary.js` with a link to your new route.

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

*TODO:* Metadata can be passed automatically through the [tree using Context](https://facebook.github.io/react/docs/context.html). This would make it so that we don't have to pass in the `Metadata` object every time it's added to the page. Same with `ReactPlayground`.


### ReactPlayground
The react playground is built using CodeMirror and a few other tools. It needs to be passed uncompiled JSX and it does the rest. Use it like so:

```
<ReactPlayground codeText={Examples.YourExample} />
```

### Running the Playground
The Component Library is part of the build process and is deployed whenever QBUI is deployed. During the build process a separate component library bundle is generated (you can see that in the webpack config file `../qbui/ui/webpack.config.js`). That bundle is then served via Express (you can see that route in the client routes file `../qbui/ui/server/src/routes/qbClientRoutes.js`).

So once any changes that are merged into master they get pushed just like everything else.

To run the components use the /components route

For example the latest master build is live at [https://team.newstack.quickbase.com/qbase/components](https://team.newstack.quickbase.com/qbase/components)
