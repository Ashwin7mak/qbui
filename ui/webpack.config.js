'use strict';

var path = require('path');
var webpack = require('webpack');

// node modules
var nodeModulesPath = path.resolve(__dirname, 'node_modules');

// where generated files go
var buildPath = path.join(__dirname, 'client-react/dist');

var clientPath = path.join(__dirname, 'client-react');

var envConfig = require('./server/config/environment');

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

var config = {
    // devtool Makes sure errors in console map to the correct file
    // and line number
    // eval is faster than 'source-map' for dev but eval is not supported for prod
    devtool: PROD ? 'source-map' : 'eval',

    entry: [
        // main entry point to the app
        // TODO:entry point...when more pages are flushed out
        // we probably should rename to something like quickbase.js and add a builder entry
        path.resolve(clientPath, 'src/scripts/router.js'),
        'bootstrap-sass!./client-react/bootstrap-sass.config.js'
    ],
    output: {
        // pathinfo - false disable outputting file info comments in prod bundle
        pathinfo: !PROD,
        // generated files directory for output
        path: buildPath,
        // generated js file
        filename: PROD ? 'bundle.min.js' : 'bundle.js',
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
                    path.resolve(__dirname, 'client-react/src'),
                    path.resolve(__dirname, 'client-react/test')
                ],
                exclude: [nodeModulesPath],
                loaders: ['react-hot-loader', 'babel-loader']
            },
            {
                // all css files can be required into js files with this
                test: /\.css?$/,
                include: [
                    path.resolve(__dirname, 'client-react/src'),
                    path.resolve(__dirname, 'node_modules/ag-grid')
                ],
                loader: 'style!css'
            },
            {
                // all png files can be required into js files with this
                // url loader transform works like a file loader,
                // but can return a Data Url if the file is smaller than a limit.
                test: /\.png?$/,
                include: [
                    path.resolve(__dirname, 'client-react/src')
                ],
                loader: 'url-loader'
            },

            // SASS - transformed to css,
            {
                test: /\.scss$/,
                loader: 'style!css!sass'
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
        new webpack.optimize.UglifyJsPlugin({minimize: true}),

        //  run-time environment for our application
        envPlugin
    ] :  [
        // When there are compilation errors, this plugin skips the emitting (and recording) phase.
        // This means there are no assets emitted that include errors.
        new webpack.NoErrorsPlugin(),

        //  run-time environment for our application
        envPlugin
    ]
};

module.exports = config;

