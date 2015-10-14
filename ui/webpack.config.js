'use strict';

var path = require('path');
var webpack = require('webpack');

// node modules
var nodeModulesPath = path.resolve(__dirname, 'node_modules');

// where generated files go
var buildPath = path.join(__dirname, 'client-react/dist');

var clientPath = path.join(__dirname, 'client-react');

// main entry point to the app
// TODO:entry point...when more pages are flushed out
// we probably should rename to something like quickbase.js and add a builder entry
//var mainPath =  path.resolve(__dirname, 'client-react/src/scripts/router.js');
var mainPath =  path.resolve(clientPath, 'src/scripts/router.js');

var envConfig = require('./server/config/environment');

// Environment setting for prod enabled?
var PROD = (envConfig.env === 'PRODUCTION' || false);

var config = {
    // devtool Makes sure errors in console map to the correct file
    // and line number
    // eval is faster than 'source-map' for dev but eval is not supported for prod
    devtool: PROD ? 'source-map' : 'eval',

    contentBase: clientPath,

    entry: [
        mainPath,
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
                loaders: [ 'react-hot-loader', 'babel-loader' ]
            },
            {
                // all css files can be required into js files with this
                test: /\.css?$/,
                include: [
                    path.resolve(__dirname, 'client-react/src')
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
            // also handles fonts and svg files
            // can return a Data Url if the file is smaller than a limit.
            { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,   loader: 'url?limit=10000&mimetype=application/font-woff' },
            { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,  loader: 'url?limit=10000&mimetype=application/font-woff' },
            { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,    loader: 'url?limit=10000&mimetype=application/octet-stream' },
            { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,    loader: 'file' },
            { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,    loader: 'url?limit=10000&mimetype=image/svg+xml' }
        ]
    },
    resolve: {
        // extensions are so we can require('file') instead of require('file.js')
        extensions: ['', '.js', '.json', '.scss']
    },
    plugins: PROD ? [
        // This has beneficial effect on the react lib size for deploy
        new webpack.DefinePlugin({'process.env': { NODE_ENV: JSON.stringify('production')}}),
        // for prod we also dedupe, obfuscate and minimize
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({minimize: true})
    ] :  [
        //When there are errors while compiling this plugin skips the emitting phase
        // (and recording phase), so there are no assets emitted that include errors.
        new webpack.NoErrorsPlugin()
    ]
};

module.exports = config;

