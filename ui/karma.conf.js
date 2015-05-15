// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

'use strict';

module.exports = function (config) {

    config.set({
        // base path, that will be used to resolve files and exclude
        basePath: '',

        // testing framework to use (jasmine/mocha/qunit/...)
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            //  bower dependencies are auto injected by the grunt build when running the test:client task
            //startbower:
            'client/bower_components/jquery/dist/jquery.js',
            'client/bower_components/es5-shim/es5-shim.js',
            'client/bower_components/angular/angular.js',
            'client/bower_components/json3/lib/json3.js',
            'client/bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/affix.js',
            'client/bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/alert.js',
            'client/bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/button.js',
            'client/bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/carousel.js',
            'client/bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/collapse.js',
            'client/bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/dropdown.js',
            'client/bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/tab.js',
            'client/bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/transition.js',
            'client/bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/scrollspy.js',
            'client/bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/modal.js',
            'client/bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/tooltip.js',
            'client/bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/popover.js',
            'client/bower_components/bootstrap/dist/js/bootstrap.js',
            'client/bower_components/angular-resource/angular-resource.js',
            'client/bower_components/angular-cookies/angular-cookies.js',
            'client/bower_components/angular-sanitize/angular-sanitize.js',
            'client/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
            'client/bower_components/ng-lodash/build/ng-lodash.js',
            'client/bower_components/angular-ui-grid/ui-grid.js',
            'client/bower_components/angular-ui-router/release/angular-ui-router.js',
            'client/bower_components/chance/chance.js',
            'client/bower_components/angular-mocks/angular-mocks.js',
            //endbower:


            // load the application dependencies - loading order is important; broadest
            // to narrowest.
            'client/*.index.html',
            'client/quickbase/**/**/*.html',
            'client/gallery/**/*Example.modules.js',
            'client/quickbase/common/**/*.modules.js',
            'client/quickbase/**/*.modules.js',
            'client/quickbase/common/**/*.js',
            'client/quickbase/**/**/*.js',

            // fixtures
            {
                pattern: "**/mockdata/*.json",
                watched: 'true',
                served:  'true',
                included: 'false'
            }


        ],

        // list of files / patterns to exclude
        exclude: [],

        preprocessors: {
            //'**/*.jade': 'ng-jade2js',
            '**/*.html': 'html2js',
            //'**/mockdata/*.json': 'html2js',
            //'**/*.coffee': 'coffee',
            //if any 3rd party vendor plugin within code coverage target folder, need to exclude (ie: jasmine, angular, etc)
            'client/{quickbase/**/*.js,*.js}' : ['coverage']
        },

        ngHtml2JsPreprocessor: {
            stripPrefix: 'client/'
        },

        ngJade2JsPreprocessor: {
            stripPrefix: 'client/'
        },

        reporters: ['progress', 'coverage'],

        coverageReporter: {
            // specify a common output directory
            dir: 'build/reports/client/coverage',
            reporters: [
                { type: 'lcov', subdir: '.' }
            ]
        },
        junitReporter : {
            outputFile : 'build/reports/client/unit/client_report.xml'
        },

        // web server port
        port: 8083,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,

        // to avoid DISCONNECTED messages
        browserDisconnectTimeout : 10000, // default 2000
        browserDisconnectTolerance : 1, // default 0
        browserNoActivityTimeout : 60000, //default 10000


        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['PhantomJS'],


        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false
    });
};
