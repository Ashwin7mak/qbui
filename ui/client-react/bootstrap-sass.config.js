// Example file. Copy this to your project. Change then names of the referenced files or comment
// them out. Convention is to name sass partials to start with an '_'
module.exports = {
    verbose: true, // Set to true to show diagnostic information

    // IMPORTANT: Set next two configuration so you can customize
    // bootstrapCustomizations: gets loaded before bootstrap so you can configure the variables used
    // by bootstrap mainSass: gets loaded after bootstrap, so you can override a bootstrap style.
    // NOTE, these are optional.

    // Use preBootstrapCustomizations to change $brand-primary. Ensure this
    // preBootstrapCustomizations does not depend on other bootstrap variables.
    //preBootstrapCustomizations: './_pre-bootstrap-customizations.scss',

    // Use bootstrapCustomizations to utilize other sass variables defined in
    // preBootstrapCustomizations or the _variables.scss file. This is useful to set one
    // customization value based on another value.
    bootstrapCustomizations: './client-react/src/assets/css/_bootstrapVariables.scss',

    // mainSass: './client-react/src/assets/css/main.scss',

    // Default for the style loading
    styleLoader: 'style-loader!css-loader!sass-loader',
    //
    // If you want to use the ExtractTextPlugin
    //   and you want compressed
    //     styleLoader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader'),
    //
    // If you want expanded CSS
    //   styleLoader: ExtractTextPlugin.extract('style-loader',
    // 'css-loader!sass?outputStyle=expanded'),

    scripts: {
        //none, using react-bootstrap
    },

    // Use these to configure what components we're loading from bootstrap
    styles: {
        'mixins': true,

        'normalize': true,
        'print': true,
        'glyphicons': false,

        'scaffolding': true,
        'type': true,
        'code': false,
        'grid': false,
        'tables': false,
        'forms': true,
        'buttons': true,

        'component-animations': true,
        'dropdowns': true,
        'button-groups': true,
        'input-groups': true,
        'navs': false,
        'navbar': false,
        'breadcrumbs': false,
        'pagination': false,
        'pager': true,
        'labels': false,
        'badges': false,
        'jumbotron': false,
        'thumbnails': false,
        'alerts': false,
        'progress-bars': false,
        'media': false,
        'list-group': true,
        'panels': true,
        'wells': true,
        'responsive-embed': false,
        'close': false,

        'modals': true,
        'tooltip': true,
        'popovers': true,
        'carousel': false,

        'utilities': true,
        'responsive-utilities': true
    }
};

