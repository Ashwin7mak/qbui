// Karma configuration
//
var path = require("path");
var webpack = require('webpack');
var nodeModulesPath = path.resolve(__dirname, "node_modules");
var nodeComponentsPath = path.resolve(__dirname, "client-react/src/components/node");

module.exports = function(config) {
    "use strict";

    config.set({
        //  base path that is used to resolve files, excludes, etc.
        basePath: "",

        frameworks: ["phantomjs-shim", "intl-shim", "es6-shim", "jasmine"],

        // list of files/patterns to load and test
        files: [
            {pattern: "tests.webpack.js"}
        ],

        // list of files to exclude
        exclude: [],

        // add webpack as the preprocessor
        // code coverage against all client react code EXCEPT node modules that we have privately forked
        preprocessors: {
            "tests.webpack.js": ["webpack", "sourcemap"],
            "client-react/src/!(components/node)/**/*.js" : ["coverage"]
        },

        webpack: {
            devtool: "eval",
            module: {
                loaders: [
                    {
                        // all js src and test files get treated by babel
                        test: /\.js?$/,
                        include: [
                            path.resolve(__dirname, "client-react/src"),
                            path.resolve(__dirname, "client-react/test"),
                            path.resolve(__dirname, "componentLibrary/src"),
                            path.resolve(__dirname, "componentLibrary/test")
                        ],
                        exclude: [nodeModulesPath, nodeComponentsPath],
                        loader: "babel-loader",
                        query: {
                            plugins: ['babel-plugin-rewire', 'babel-plugin-rewire-ignore-coverage']
                        }
                    },
                    {
                        // all css files can be required into js files with this
                        test: /\.css?$/,
                        include: [
                            path.resolve(__dirname, "client-react/src"),
                            path.resolve(__dirname, "componentLibrary/src"),
                            path.resolve(__dirname, "node_modules/ag-grid"),
                            path.resolve(__dirname, "node_modules/react-notifications"),
                            path.resolve(__dirname, 'node_modules/react-select')
                        ],
                        loader: "style!css"
                    },
                    {
                        // all png files can be required into js files with this
                        // url loader transform works like a file loader,
                        // but can return a Data Url if the file is smaller than a limit.
                        test: /\.png?$/,
                        include: [
                            path.resolve(__dirname, "client-react/src")
                        ],
                        loader: "url-loader"
                    },
                    {
                        // SASS - transformed to css,
                        test: /\.scss$/,
                        loader: "style!css!sass",
                        include: [
                            path.resolve(__dirname, "client-react/src"),
                            path.resolve(__dirname, "componentLibrary/src")
                        ]
                    },
                    {
                        test   : /\.woff|\.woff2|\.svg|.eot|\.ttf/,
                        loader : 'url?prefix=font/&limit=10000'
                    },
                    {
                        include: /\.json$/,
                        loaders: ["json-loader"]
                    }
                ],
                postLoaders: [
                    { //delays coverage til after tests are run, fixing transpiled source coverage error
                        test: /\.js$/,
                        include: [
                            path.resolve(__dirname, "client-react/src"),
                            path.resolve(__dirname, "componentLibrary/src")
                        ],
                        exclude: [
                            nodeModulesPath,
                            nodeComponentsPath,
                            path.resolve(__dirname, "client-react/test"),
                            path.resolve(__dirname, "componentLibrary/test")
                        ],
                        loader: "istanbul-instrumenter"
                    }
                ]
            },
            plugins: [
                // Define the build run-time environment.  Configure to run as a PROD build.
                // This will allow us to write unit tests against the prod configuration.
                // ONE and ONLY ONE variable is to be set to true.
                new webpack.DefinePlugin({
                    __QB_PROD__: JSON.stringify(true),
                    __QB_TEST__: JSON.stringify(false),
                    __QB_LOCAL__: JSON.stringify(false)
                })
            ],
            watch: true
        },
        webpackServer: {
            noInfo: true
        },

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ["PhantomJS_Desktop"],
        customLaunchers: {
            'PhantomJS_Desktop': {
                base: 'PhantomJS',
                options: {
                    viewportSize: {
                        width: 1440,
                        height: 900
                    }
                }
            }
        },
        reporters: ["progress", "mocha", "coverage", "junit"],

        //  define where the coverage reports live for the client code
        coverageReporter: {
            // specify a common output directory
            dir: "build/reports/client/",
            reporters: [
                {type: "lcov", subdir: "coverage"},
                {type: "text-summary"}    // outputs to the console by default
            ]
        },

        // will be resolved to basePath (in the same way as files/exclude patterns)
        junitReporter : {
            outputFile : "build/reports/client/unit/client_report.xml"
        },

        // web server port
        port: 8083,

        // browser activity settings
        browserDisconnectTimeout : 5000,    // default 2000
        browserNoActivityTimeout : 5000,    // default 10000
        browserDisconnectTolerance : 99,     // default 0

        colors: true,
        singleRun: false,

        // level of output logging
        // LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,

        // report which specs are slower than 500ms
        reportSlowerThan: 500,

        // allow for client console logging
        client: {
            captureConsole: true
        }

    });
};
