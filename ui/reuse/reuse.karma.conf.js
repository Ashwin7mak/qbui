// Karma configuration
//
let path = require("path");
let webpack = require('webpack');
let nodeModulesPath = path.resolve(__dirname, "node_modules");
let testsFile = "tests.webpack.js";
let testWithCoverage = true;
let profilePath = path.resolve(__dirname, '../build/chromeDebugPath'); //use to keep debug settings between sessions applied in customLaunchers ChromeWithCustomConfig

// Please copy "tests.custom.webpack.js.sample" from the UI directory to the reuse folder
// and rename it to "tests.custom.webpack.js".
// PLEASE MAKE SURE NOT TO COMMIT THE COPIED FILE TO MASTER OR TO YOUR BRANCH
// Focus on the particular test before running the karma server.
// To load the karma server, cd into reuse directory and run `karma start reuse.karma.conf.js`
// You should get the url in the terminal through which you can debug your tests in your browser console.
if (process.env.KARMA_USE_CUSTOM) {
    testsFile = "tests.custom.webpack.js";
}
if (process.env.KARMA_WITHOUT_COVERAGE) {
    testWithCoverage = false;
}
// TODO:: Once reuse folder is clean of dependencies on client-react, remove client-react auto-imports and transpilation throughout this file
module.exports = function(config) {
    "use strict";

    let newConf = {
        // base path that is used to resolve files, excludes, etc.
        basePath: "",

        frameworks: ["phantomjs-shim", "intl-shim", "es6-shim", "jasmine"],

        // list of files/patterns to load and test
        files: [
            {pattern:testsFile}
        ],

        // list of files to exclude
        exclude: [],

        // add webpack as the preprocessor
        // code coverage against all client react code EXCEPT node modules that we have privately forked
        preprocessors: {},

        webpack: {
            devtool: "eval",
            module: {
                loaders: [
                    {
                        // all js src and test files get treated by babel
                        test: /\.js?$/,
                        include: [
                            path.resolve(__dirname, "../client-react/src"),
                            path.resolve(__dirname, "../client-react/test"),
                            path.resolve(__dirname, "./client/src"),
                            path.resolve(__dirname, "./client/test"),
                        ],
                        exclude: [nodeModulesPath],
                        loader: "babel-loader",
                        query: {
                            plugins: ['babel-plugin-rewire', 'babel-plugin-rewire-ignore-coverage']
                        }
                    },
                    {
                        // all css files can be required into js files with this
                        test: /\.css?$/,
                        include: [
                            path.resolve(__dirname, "../client-react/src"),
                            path.resolve(__dirname, "./client/src"),
                            path.resolve(__dirname, "../node_modules/react-notifications"),
                            path.resolve(__dirname, '../node_modules/react-select'),
                            path.resolve(__dirname, '../node_modules/rc-tabs')
                        ],
                        loader: "style!css"
                    },
                    {
                        // all png files can be required into js files with this
                        // url loader transform works like a file loader,
                        // but can return a Data Url if the file is smaller than a limit.
                        test: /\.(png|gif)?$/,
                        include: [
                            path.resolve(__dirname, "../client-react/src"),
                            path.resolve(__dirname, "./client/src"),
                        ],
                        loader: "url-loader"
                    },
                    {
                        // SASS - transformed to css,
                        test: /\.scss$/,
                        loader: "style!css!sass",
                        include: [
                            path.resolve(__dirname, "../client-react/src"),
                            path.resolve(__dirname, "./client/src"),
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
                postLoaders: [],
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
            watch: true,
            externals: {
                // Settings used to support React unit tests that use Enzyme
                'react/addons': true,
                'react/lib/ExecutionEnvironment': true,
                'react/lib/ReactContext': true
            },
            resolve: {
                root: path.resolve(__dirname, '../'),
                // Allow easier imports for commonly imported folders
                alias: {
                    APP: 'client-react/src',
                    REUSE: 'reuse/client/src',
                    GOVERNANCE: 'governance/src',
                    AUTOMATION: 'automation/src',
                    COMMON: 'common/src'
                }
            }
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
            },
            'ChromeWithCustomConfig': {
                base: 'ChromeCanary',
                options : {
                },
                flags: ['--user-data-dir=' + profilePath],
                displayName: 'Custom Debugging',
            },
            'HeadlessChrome': {
                base: 'Chrome',
                flags: [
                    // See https://chromium.googlesource.com/chromium/src/+/lkgr/headless/README.md
                    '--no-sandbox',
                    '--headless',
                    '--disable-gpu',
                    // Without a remote debugging port, Google Chrome exits immediately.
                    ' --remote-debugging-port=9222',
                ],
            },
        },
        reporters: ["progress", "mocha", "junit"],


        // will be resolved to basePath (in the same way as files/exclude patterns)
        junitReporter : {
            outputFile : "../build/reports/reuse/unit/client_report.xml"
        },

        // web server port
        port: 8083,

        // browser activity settings
        browserDisconnectTimeout : 50000,    // default 2000
        browserNoActivityTimeout : 50000,    // default 10000
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

    };

    newConf.preprocessors["" + testsFile] = ["webpack", "sourcemap"];

    if (testWithCoverage) {
        newConf.preprocessors = Object.assign({}, newConf.preprocessors, {
            "./client/src/**/*.js" : ["coverage"],

            // We exclude client-react from reuse coverage. Files in those folders shouldn't count for or against coverage in reuse.
            "!../client-react/**/*.js" : ["coverage"],
        });
        newConf.webpack.module.postLoaders = [
            { //delays coverage til after tests are run, fixing transpiled source coverage error
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, "./client/src"),
                ],
                exclude: [
                    nodeModulesPath,
                    path.resolve(__dirname, "./client/test"),
                ],
                loader: "istanbul-instrumenter"
            }
        ];
        //  define where the coverage reports live for the client code
        newConf.coverageReporter = {
            // specify a common output directory
            dir: "../build/reports/reuse/",
            reporters: [
                {type: "lcov", subdir: "coverage"},
                {type: "text-summary"}    // outputs to the console by default
            ],
            check : {
                global: {
                    statements: 90,
                    branches: 60,
                    functions: 90,
                    lines: 90
                }
            }
        };

        newConf.reporters.push("coverage");
    }
    // console.log("testsFile = " + testsFile);
    // console.log("testWithCoverage = " + testWithCoverage);
    // console.log("newConf =  \n" + JSON.stringify(newConf));
    config.set(newConf);

};
