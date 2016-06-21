# Component Library

- ComponentLibraryWrapper is a wrapper holding it all together
- The route handles the logic of figuring out what 'doc' to show
- Each /doc has the content of the page. Usually this can come straight from the component metadata
- Add a long description to the top of a component if you want to document it there
- In some cases, we can't document things like typography so you get your own that way.

You can easily grab a componets description with a `<ComponentDescription component='yourComponent' />`

You can use the `ReactPlayground` component to give a demo.
- You need to give it the name of the component.
- That component needs a sample added to the examples folder.
- You need to add a map for that to the `Samples.js` file.

You can build `Proptables` easily. Just include a `<PropTable component='yourComponent' />` component.

For this to all show up you need to add your component to the `metadata.js` file.

Wrapper -> Router -> Doc -> ComponentDescription (or your own) + ReactPlayground + Proptable


## Adding a component to the library

1. Setup a new 'doc' file in `componentLibrary/docs`
1. Add a reference to `componentLibrary/src/Metadata.js` so it has the components description and proptype descriptions
1. Add a code example to `componentLibrary/examples`
1. Import that example in the `componentLibrary/src/Examples.js` file
1. Add a route to `componentLibrary/index.js` that points to the original doc file