'use strict';

var path = require('path');
var webpack = require('webpack');

var PROD = JSON.parse(process.env.NODE_ENV === 'PRODUCTION' || "0");

var config = {
    devtool: "source-map",
    entry: path.resolve(__dirname, 'client-react/src/scripts/reportEntry.js'),   // TODO:entry point...probably should rename to something like quickbase.js
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
            }
        ]
    },
    plugins: PROD ? [
        new webpack.optimize.UglifyJsPlugin({minimize: true})
    ] : []
};

module.exports = config;

