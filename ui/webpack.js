'use strict';

var path = require('path');
var webpack = require('webpack');

var PROD = JSON.parse(process.env.NODE_ENV === 'PRODUCTION' || "0");

var config = {
    devtool: "source-map",
    entry: [
        path.resolve(__dirname, 'client-react/src/scripts/router.js'),   // TODO:entry point...probably should rename to something like quickbase.js
        "bootstrap-sass!./client-react/bootstrap-sass.config.js"
    ],
    output: {
        path: path.resolve(__dirname, 'client-react/dist'),
        filename: PROD ? 'bundle.min.js' :'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js?$/,
                include: [
                    path.resolve(__dirname, 'client-react/src'),
                    path.resolve(__dirname, 'client-react/test')
                ],
                loader: 'babel'
            },
            {
                test: /\.css?$/,
                include: [
                    path.resolve(__dirname, 'client-react/src')
                ],
                loader: 'style!css'
            },
            {
                test: /\.png?$/,
                include: [
                    path.resolve(__dirname, 'client-react/src')
                ],
                loader: 'url-loader'
            },

            // SASS
            {
                test: /\.scss$/,
                loader: "css-loader!sass-loader"
            },
            { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,   loader: "url?limit=10000&mimetype=application/font-woff" },
            { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,  loader: "url?limit=10000&mimetype=application/font-woff" },
            { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,    loader: "url?limit=10000&mimetype=application/octet-stream" },
            { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,    loader: "file" },
            { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,    loader: "url?limit=10000&mimetype=image/svg+xml" }
        ]
    },
    resolve: {

        extensions: ['', '.js', '.json', ".scss"]
    },
    plugins: PROD ? [
        new webpack.optimize.UglifyJsPlugin({minimize: true})
    ] : []
};

module.exports = config;

