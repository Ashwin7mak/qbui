'use strict';

var path = require('path');
var webpack = require('webpack');
var exec = require('child_process').exec;

// node modules
var nodeModulesPath = path.resolve(__dirname, 'node_modules');

// where generated files go
var buildPath = path.join(__dirname, 'client-react/dist');

var clientPath = path.join(__dirname, 'client-react');

var reuseLibraryPath = path.join(__dirname, 'reuse');

var componentLibraryPath = path.join(__dirname, 'componentLibrary/src');

var governancePath = path.join(__dirname, 'governance');

var envConfig = require('./server/src/config/environment');

// 3 supported run-time environments..ONE and ONLY ONE variable is to be set to true.
var PROD = (envConfig.env === 'PRODUCTION' || false);
var TEST = (envConfig.env === 'TEST' || false);
var LOCAL = !PROD && !TEST ? true : false;

// Variables referenced by our application to determine the run-time environment (ie: configuration)
var envPlugin = new webpack.DefinePlugin({
    __QB_PROD__: JSON.stringify(PROD),
    __QB_TEST__: JSON.stringify(TEST),
    __QB_LOCAL__: JSON.stringify(LOCAL)
});

function MyNotifyPlugin() {
}
MyNotifyPlugin.prototype.apply = function(compiler) {
    if (envConfig.growlNotify) {
        compiler.plugin('done', function(stats) {
            //notify watched update is done
            process.stdout.write('\x07');
            if (stats.hasErrors()) {
                exec('growlnotify -n "Build" -m "Failed"');
            } else {
                exec('growlnotify -n "Build" -m "Built"');
            }
        });
    }
};

var config = {
    // devtool Makes sure errors in console map to the correct file
    // and line number
    // eval is faster than 'source-map' for dev but eval is not supported for prod
    devtool: PROD ? 'source-map' : 'eval',
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
            path.resolve(reuseLibraryPath, 'client/src/assets/fonts/lato-font.css'),
            path.resolve(reuseLibraryPath, 'client/src/assets/css/qbMain.scss'),
            path.resolve(clientPath, 'src/scripts/router.js')
        ],
        componentLibrary: [
            'bootstrap-sass!./client-react/bootstrap-sass.config.js',
            path.resolve(reuseLibraryPath, 'client/src/assets/fonts/lato-font.css'),
            path.resolve(reuseLibraryPath, 'client/src/assets/css/qbMain.scss'),
            path.resolve(componentLibraryPath, 'index.js')
        ],
        governance: [
            'bootstrap-sass!./client-react/bootstrap-sass.config.js',
            path.resolve(reuseLibraryPath, 'client/src/assets/fonts/lato-font.css'),
            path.resolve(reuseLibraryPath, 'client/src/assets/css/qbMain.scss'),
            path.resolve(governancePath, 'src/app/index.js')
        ]
    },
    output: {
        // pathinfo - false disable outputting file info comments in prod bundle
        pathinfo: !PROD,
        // generated files directory for output
        path: buildPath,
        // generated js file
        filename: PROD ? '[name].min.js' : '[name].js',
        chunkFilename: PROD ? '[id].bundle.min.js' : '[id].bundle.js',
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
                ],
                exclude: [
                    nodeModulesPath,
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
                    path.resolve(__dirname, 'node_modules/ag-grid'),
                    path.resolve(__dirname, 'node_modules/react-notifications'),
                    path.resolve(__dirname, 'node_modules/react-select')
                ],
                exclude: [
                    // Exclude fonts because webpack sourceMaps mess up the urls for font-face
                    path.resolve(__dirname, 'reuse/client/src/assets/fonts'),
                    path.resolve(__dirname, 'reuse/client/src/components/reIcon')
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
                    path.resolve(__dirname, 'reuse/client/src/components/reIcon')
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
        // extensions are so we can require('file') instead of require('file.js')
        extensions: ['', '.js', '.json', '.scss']
    },
    plugins: PROD ? [
        // This has beneficial effect on the react lib size for deploy
        new webpack.DefinePlugin({'process.env': {NODE_ENV: JSON.stringify('production')}}),

        // for prod we also de-dupe, obfuscate and minimize
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            sourceMap: false,
            compress: {
                warnings: false
            }
        }),

        //  run-time environment for our application
        envPlugin
    ] :  [
        // When there are compilation errors, this plugin skips the emitting (and recording) phase.
        // This means there are no assets emitted that include errors.
        new webpack.NoErrorsPlugin(),
        //  run-time environment for our application
        envPlugin,

        new MyNotifyPlugin()
    ]
};

module.exports = config;

