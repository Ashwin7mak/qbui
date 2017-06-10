'use strict';

/**
 * These configurations build the javascript bundles that run the app.
 * Configuration options (set as ENV vars, e.g., `NODE_ENV=prod ANLAYZE_WEBPACK=true webpack`)
 * - NODE_ENV - =prod will minify, uglify, and set cache-busting for all bundles. Other values will only bundle.
 *               Note: The final value of ENV is set through the config files in server/src/config/environments
 * - ANALYZE_WEBPACK - =true will run the webpack analyzer after building. Useful for identifying webpack bundle optimizations.
 */

const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const exec = require('child_process').exec;

// Environment variable constants
const envConstants = require(path.join(__dirname, 'server/src/config/environment/environmentConstants'));

// The current environment configuration. Uses NODE_ENV to determine environment.
const envConfig = require('./server/src/config/environment');

// Where generated files go
const buildPath = path.join(__dirname, 'client-react/dist');

// Paths to functional area directories
const clientPath = path.join(__dirname, 'client-react');
const reuseLibraryPath = path.join(__dirname, 'reuse');
const componentLibraryPath = path.join(__dirname, 'componentLibrary/src');
const governancePath = path.join(__dirname, 'governance');
var automationPath = path.join(__dirname, 'automation');

// A plugin that helps create the webpack manifest file so that we can identify the bundle names (e.g., bundle.382sdjfkeo.min.js) correctly.
const ManifestPlugin = require('webpack-manifest-plugin');

// A plugin that helps identify possible optimizations and effects of configuration changes when building webpack bundles.
// This should not be used in production or during normal development.
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// A plugin that gives each bundle a pre-defined hash such that re-bundling will produce the same chunkhash each time if no code changes.
// Allows cache-busting to work ANALYZEcorrectly by only updating the hash when the code has actually changed.
const WebpackMd5Hash = require('webpack-md5-hash');

// 3 supported run-time environments..ONE and ONLY ONE constiable is to be set to true.
const PROD = (envConfig.env === envConstants.PRODUCTION || false);
const TEST = (envConfig.env === envConstants.TEST || false);
const LOCAL = (!PROD && !TEST);

// constiables referenced by our application to determine the run-time environment (ie: configuration)
const envPlugin = new webpack.DefinePlugin({
    __QB_PROD__: JSON.stringify(PROD),
    __QB_TEST__: JSON.stringify(TEST),
    __QB_LOCAL__: JSON.stringify(LOCAL)
});

// We only minify and uglify files when the environment is 'prod' and on the master branch or when deploying and no branch is specified.
// This speeds up the test runs and builds for individual branches where we don't need to export the minified bundle.
// Other setting such as whether or not to make source maps or display paths is still only determined by the environment.
const shouldMinify = PROD && (!process.env.GIT_UIBRANCH || process.env.GIT_UIBRANCH === 'master');

/**
 * A plugin that shows a notification when webpack has completed.
 */
class MyNotifyPlugin {
    apply(compiler) {
        if (envConfig.growlNotify) {
            compiler.plugin('done', function(stats) {
                //notify watched update is done
                process.stdout.write('\x07');
                if (stats.hasErrors()) {
                    exec('growlnotify -n "BuildFailed" -m "Failed"');
                } else {
                    exec('growlnotify -n "Build" -m "Built"');
                }
            });
        }
    }
}

// A plugin that prints timestamp to the console when webpack bundles update.
const WatchTimePlugin = require('webpack-watch-time-plugin');

// ------ START CONFIG ------
const config = {
    // devtool Makes sure errors in console map to the correct file
    // and line number
    // eval-source-map is faster than 'source-map' for dev but eval is not supported for prod
    //devtool: PROD ? 'source-map' : 'eval',
    devtool: PROD ? 'source-map' : 'eval-source-map',
    watchDelay: 50,

    entry: {
        // main entry point to the app
        // TODO:entry point...when more pages are flushed out
        // we probably should rename to something like quickbase.js and add a builder entry
        // Global font (Lato) is loaded here directly because importing it in a .scss file
        // causes the url() to not work when source maps are turned on. Files containing
        // urls() that aren't inlined must not be loaded into a blob:// URL by webpack.
        bundle: [
            'bootstrap-sass!./client-react/bootstrap-sass.config.js',
            path.resolve(reuseLibraryPath, 'client/src/assets/css/qbMain.scss'),
            path.resolve(clientPath, 'src/scripts/router.js')
        ],
        componentLibrary: [
            'bootstrap-sass!./client-react/bootstrap-sass.config.js',
            path.resolve(reuseLibraryPath, 'client/src/assets/css/qbMain.scss'),
            path.resolve(componentLibraryPath, 'index.js')
        ],
        governance: [
            'bootstrap-sass!./client-react/bootstrap-sass.config.js',
            path.resolve(reuseLibraryPath, 'client/src/assets/css/qbMain.scss'),
            path.resolve(governancePath, 'src/app/index.js')
        ],
        automation: [
            'bootstrap-sass!./client-react/bootstrap-sass.config.js',
            path.resolve(reuseLibraryPath, 'client/src/assets/css/qbMain.scss'),
            path.resolve(automationPath, 'src/app/index.js')

        ],

        /**
         * A list of shared node modules across functional areas. These are split out so that the vendor bundle
         * can be cached by the browser and not downloaded on every page load.
         *
         * This list was derived by using the Webpack Analyzer (see top of file for instructions on using that).
         * We could determine the best combination of dependencies to include in the vendor bundle by modifying this
         * list and comparing bundle sizes and load times.
         *
         * Developers should consider whether they should add a dependency here when they updated the package.json.
         * If the dependency will be used across functional areas or is used in the Reuse library, then the answer is likely
         * "yes, it should be added."
         *
         * For example, CodeMirror is not included in this list because it is a very large dependency and is only
         * used in the component library. However, React is used everywhere so it is included.
         *
         * Packages that are only used in the Node/Express layer should not be included here.
         */
        vendor: [
            'axios',
            'bigdecimal',
            'bluebird',
            'cookie-parser',
            'intl',
            'intl/locale-data/jsonp/en',
            'intl/locale-data/jsonp/de',
            'intl/locale-data/jsonp/fr',
            'lodash',
            'messageformat',
            'moment',
            'moment-timezone',
            'mousetrap',
            'rc-tabs',
            'react',
            'react-addons-css-transition-group',
            'react-bootstrap',
            'react-cookie',
            'react-dnd',
            'react-dnd-touch-backend',
            'react-dom',
            'react-fastclick',
            'react-flip-move',
            'react-intl',
            'react-loader',
            'react-notifications',
            'react-radio-group',
            'react-redux',
            'react-router-dom',
            'react-select',
            'react-swipeable',
            'react-toggle-button',
            'reactabular-table',
            'redux',
            'redux-thunk',
            'searchtabular'
        ]
    },

    output: {
        // pathinfo - false disable outputting file info comments in prod bundle
        pathinfo: !PROD,

        // generated files directory for output
        path: buildPath,

        // generated js file
        filename: shouldMinify ? '[name].[chunkhash].min.js' : '[name].js',

        //publicPath is path from the view of the Javascript / HTML page.
        // where all js/css http://.. references will use for relative base
        publicPath: '/dist/' // Required for webpack-dev-server
    },
    module: {
        loaders: [
            {
                // all js src and test files get treated by babel
                // we get ES6/7 syntax and JSX transpiling out of the box with babel
                // the react-hot-loader loader when processing the .js
                // (it will add some js to magically do the hot reloading)
                test: /\.js?$/,
                include: [
                    path.resolve(__dirname, 'reuse/client/src'),
                    path.resolve(__dirname, 'reuse/client/test'),
                    path.resolve(__dirname, 'client-react/src'),
                    path.resolve(__dirname, 'client-react/test'),
                    reuseLibraryPath,
                    componentLibraryPath,
                    path.resolve(__dirname, 'governance/src'),
                    path.resolve(__dirname, 'governance/test'),
                    path.resolve(__dirname, 'automation/src'),
                    path.resolve(__dirname, 'automation/test')
                ],
                exclude: [
                    // We don't want these to get compiled because ReactPlayground does that in the browser
                    path.resolve(componentLibraryPath, 'examples')
                ],
                loaders: ['react-hot-loader', 'babel-loader']
            },
            {
                // all css files can be required into js files with this
                test: /\.css?$/,
                include: [
                    path.resolve(__dirname, 'client-react/src'),
                    reuseLibraryPath,
                    componentLibraryPath,
                    path.resolve(__dirname, 'node_modules/react-notifications'),
                    path.resolve(__dirname, 'node_modules/react-select'),
                    path.resolve(__dirname, 'node_modules/rc-tabs')
                ],
                exclude: [
                    // Exclude fonts because webpack sourceMaps mess up the urls for font-face
                    path.resolve(__dirname, 'reuse/client/src/assets/fonts'),
                    path.resolve(__dirname, 'reuse/client/src/components/icon')
                ],
                loader: LOCAL ? 'style?sourceMap!css?sourceMap' : 'style!css'
            },
            {
                // all css files can be required into js files with this
                // This is to process the files excluded in the previous loader.
                // It turns off source maps for .css files known to have font-face in them.
                test: /\.css?$/,
                include: [
                    path.resolve(__dirname, 'reuse/client/src/assets/fonts'),
                    path.resolve(__dirname, 'reuse/client/src/components/icon')
                ],
                loader: 'style!css' // never use source maps on these files
            },
            {
                // all png files can be required into js files with this
                // url loader transform works like a file loader,
                // but can return a Data Url if the file is smaller than a limit.
                test: /\.(png|gif)?$/,
                include: [
                    path.resolve(__dirname, 'client-react/src'),
                    reuseLibraryPath
                ],
                loader: 'url-loader'
            },
            {
                include: /\.json$/,
                loaders: ['json-loader']
            },
            // SASS - transformed to css,
            {
                test: /\.scss$/,
                loader: LOCAL ? 'style?sourceMap!css?sourceMap!sass?sourceMap' : 'style!css!sass'
            },

            {
                test   : /\.woff|\.woff2|\.svg|.eot|\.ttf/,
                loader : 'url?prefix=font/&limit=10000'
            }

        ]
    },

    resolve: {
        root: path.resolve(__dirname),
        // Allow easier imports for commonly imported folders
        alias: {
            APP: 'client-react/src',
            REUSE: 'reuse/client/src',
            GOVERNANCE: 'governance/src',
            AUTOMATION: 'automation/src',
            COMMON: 'common/src'
        },
        // extensions are so we can require('file') instead of require('file.js')
        extensions: ['', '.js', '.json', '.scss']
    },


    plugins: shouldMinify ? [
        // This has beneficial effect on the react lib size for deploy
        new webpack.DefinePlugin({'process.env': {NODE_ENV: JSON.stringify('production')}}),

        //  run-time environment for our application
        envPlugin,

        // for prod we also de-dupe, obfuscate and minimize
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            sourceMap: false,
            compress: {
                warnings: false
            }
        }),

        // Separates common node modules identified above into a separate vendor bundle
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor.[chunkhash].min.js',
            minChunks: Infinity
        }),

        // Makes sure that the chunkhash changes when, and only when, the code changes.
        new WebpackMd5Hash(),

        // Creates a manifest.json file in the /server/source/routes directory that contains the hash values for each bundle
        // This allows us to load the cache-busting file correctly in index.html
        new ManifestPlugin(),

        // Keeps the imports in the same order across webpack runs so that the chunkhash updates when, and only when, the code changes.
        new webpack.optimize.OccurrenceOrderPlugin(true),

        // Optionally run the analyzer.
        ...(process.env.ANALYZE_WEBPACK ? [new BundleAnalyzerPlugin()] : [])
    ] :  [

        // When there are compilation errors, this plugin skips the emitting (and recording) phase.
        // This means there are no assets emitted that include errors.
        new webpack.NoErrorsPlugin(),
        //  run-time environment for our application
        envPlugin,

        // Shows a growl notification when webpack completes.
        new MyNotifyPlugin(),

        // Separates common node modules identified above into a separate vendor bundle
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: Infinity
        }),

        // Optionally run the analyzer.
        ...(process.env.ANALYZE_WEBPACK ? [new BundleAnalyzerPlugin()] : []),

        // Print timestamp on each webpack build
        ...(LOCAL ? [WatchTimePlugin] : [])
    ]
};

module.exports = config;

