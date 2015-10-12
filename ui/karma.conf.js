// Karma configuration
//
var path = require("path");
var nodeModulesPath = path.resolve(__dirname, "node_modules");

module.exports = function(config) {
    "use strict";

    config.set({
        //  base path that is used to resolve files, excludes, etc.
        basePath: "./",

        frameworks: ["jasmine"],

        // list of files/patterns to load and test
        files: [
            { pattern: "tests.webpack.js"}
        ],

        // list of files to exclude
        exclude: [],

        // add webpack as the preprocessor
        preprocessors: {
            "tests.webpack.js": ["webpack", "sourcemap"]
        },

        webpack: {
            devtool: "source-map",
            module: {
                loaders: [
                    {
                        // all js src and test files get treated by babel
                        test: /\.js?$/,
                        include: [
                            path.resolve(__dirname, "client-react/src"),
                            path.resolve(__dirname, "client-react/test")
                        ],
                        exclude: [nodeModulesPath],
                        loader: "babel-loader?plugins=babel-plugin-rewire"
                    }]
            },
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
        browsers: ["PhantomJS"],

        reporters: ["progress", "mocha", "coverage", "junit"],

        // web server port
        port: 8083,

        // browser activity settings
        browserDisconnectTimeout : 5000,    // default 2000
        browserNoActivityTimeout : 5000,    // default 10000
        browserDisconnectTolerance : 1,     // default 0

        colors: true,
        singleRun: true,

        // level of output logging
        // LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,

        // will be resolved to basePath (in the same way as files/exclude patterns)
        junitReporter: {
            outputFile: "build/reports/client/unit/client_report.xml"
        },

        // TODO: implement
        //coverageReporter: {
        //    // specify a common output directory
        //    dir: "build/reports/client/coverage",
        //    reporters: [
        //        {type: "lcov", subdir: "." },
        //        {type: "text-summary"}
        //    ]
        //},

        // report which specs are slower than 500ms
        reportSlowerThan: 500,

        // allow for client console logging
        client: {
            captureConsole: true
        }
    });
};
