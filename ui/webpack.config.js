'use strict';

var path = require('path');
var webpack = require('webpack');

// node modules
var nodeModulesPath = path.resolve(__dirname, 'node_modules');

// where generated files go
var buildPath = path.join(__dirname, 'client-react/dist');

// main entry point to the app
// TODO:entry point...when more pages are flushed out
// we probably should rename to something like quickbase.js and add a builder entry
var mainPath =  path.resolve(__dirname, 'client-react/src/scripts/router.js');

// Environment setting for prod enabled?
var PROD = JSON.parse(process.env.NODE_ENV === 'PRODUCTION' || '0');

var config = {

    // devtool Makes sure errors in console map to the correct file
    // and line number
    // eval is faster than 'source-map' for dev but eval is not supported for prod
    devtool: PROD ? 'source-map' : 'eval',
    entry: [
        mainPath,
        'bootstrap-sass!./client-react/bootstrap-sass.config.js'
    ],
    output: {
        // generated files
        path: buildPath,
        filename: PROD ? 'bundle.min.js' : 'bundle.js',
        //publicPath is path from the view of the Javascript / HTML page.
        // where all js/css http://.. references will use for relative base
        // webpack-dev-server will capture http refs to this and turn into it's in mem bundle's location
        // Note that we are not actually outputting any files when running the
        // webpack-dev workflow, but we want the 'in-memory' files to be fetched from the
        // same path as in production,e.g localhost:3000/dist/bundle.js.
        // That way we only need one index.html file.
        publicPath: '/dist/' // Required for webpack-dev-server
    },
    module: {
        loaders: [
            {
                // all js src and test files get treated by babel
                // we get ES6/7 syntax and JSX transpiling out of the box with babel
                test: /\.js?$/,
                include: [
                    path.resolve(__dirname, 'client-react/src'),
                    path.resolve(__dirname, 'client-react/test')
                ],
                exclude: [nodeModulesPath],
                loader: 'babel'
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
                loader: 'css-loader!sass-loader'
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
        // for prod we obfuscate and minimize
        new webpack.optimize.UglifyJsPlugin({minimize: true})
    ] : [
        // We will have to manually add the Hot Replacement plugin when running
        // from Node
       //new webpack.HotModuleReplacementPlugin()
    ]
};

module.exports = config;

