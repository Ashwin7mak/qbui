// Protractor configuration
// https://github.com/angular/protractor/blob/master/docs/referenceConf.js

(function() {
    'use strict';
    var baseE2EPath = '../../e2e/';
    // Add a screenshot reporter for errors when testing locally
    var HtmlScreenshotReporter = require('protractor-jasmine2-screenshot-reporter');
    var reporter = new HtmlScreenshotReporter({
        dest: './ui/e2e/screenshots',
        filename: 'test-report.html',
        ignoreSkippedSpecs: false,
        reportOnlyFailedSpecs: false,
        captureOnlyFailedSpecs: true
    });
    exports.config = {
        // The timeout for each script run on the browser. This should be longer
        // than the maximum time your application needs to stabilize between tasks.
        allScriptsTimeout: 120000,
        // A base URL for your application under test will be passed in via grunt config so that we can use whatever url we please
        baseUrl: process.env.DOMAIN,
        // A callback function called once configs are read but before any environment
        // setup. This will only run once, and before onPrepare.
        beforeLaunch: function() {
            //Have the tests start an instance of node
            require('../../server/src/app');
            // Setup the results report before any tests start
            return new Promise(function(resolve) {
                reporter.beforeLaunch(resolve);
            });
        },
        // list of files / patterns to load in the browser
        specs: [
            baseE2EPath + 'qbapp/tests/reports/*.e2e.spec.js'
        ],
        // Patterns to exclude.
        exclude: [baseE2EPath + 'qbapp/tests/reports/reportGroupingViaColumnHeader.e2e.spec.js',
            baseE2EPath + 'qbapp/tests/reports/reportSortingViaColumnHeader.e2e.spec.js'],
        // ----- Capabilities to be passed to the webdriver instance ----
        //
        // For a full list of available capabilities, see
        // https://code.google.com/p/selenium/wiki/DesiredCapabilities
        // and
        // https://code.google.com/p/selenium/source/browse/javascript/webdriver/capabilities.js
        capabilities: {
            browserName: 'chrome'
            //shardTestFiles: true,
            //maxInstances: 2
        },
        // ----- The test framework -----
        //
        // Jasmine and Cucumber are fully supported as a test and assertion framework.
        // Mocha has limited beta support. You will need to include your own
        // assertion framework if working with mocha.
        framework: 'jasmine2',
        // ----- Options to be passed to minijasminenode -----
        //
        // See the full list at https://github.com/juliemr/minijasminenode
        jasmineNodeOpts: {
            // If true, print colors to the terminal.
            showColors: true,
            // Default time to wait in ms before a test fails.
            defaultTimeoutInterval: 60000
        },
        // Globally accessible variables (params is a property of the Protractor instance)
        params: {
            // Used for running tests slower / faster if running in Sauce Labs
            tinySleep: 100,
            smallSleep: 1000,
            mediumSleep: 2500,
            largeSleep: 5000,
            // Constant for protractors ExpectedConditions functions (see e2ePageBase)
            ecTimeout: 5000
        },
        // This function is run once before any of the test files. Acts as a global test preparation step
        onPrepare: function() {
            // Initialize all Page Objects
            global.requirePO = function(relativePath) {
                return require(baseE2EPath + 'qbapp/pages/' + relativePath + '.po.js');
            };

            // Initialize all Common Files
            global.requireCommon = function(relativePath) {
                return require(baseE2EPath + relativePath + '.js');
            };

            // Read the base classes
            global.e2eBase = requireCommon('common/e2eBase')();
            global.consts = require('../../common/src/constants');
            global.e2eConsts = requireCommon('common/e2eConsts');

            // Third party library that lets us retry webdriver commands
            global.e2eRetry = require('webdriverjs-retry');
            e2eRetry.setDefaultTimeout(10000);

            // Lets Protractor know there is no Angular code to wait for
            browser.ignoreSynchronization = true;

            // Maximizes the browser window (known bug with Chrome)
            browser.driver.manage().window().maximize();

            // Grab the browser name to use in spec files
            browser.getCapabilities().then(function(cap) {
                global.browserName = cap.get('browserName');
            });

            // Add jasmine-spec-reporter
            var SpecReporter = require('jasmine-spec-reporter');
            jasmine.getEnv().addReporter(new SpecReporter({displayStacktrace: 'all', displaySpecDuration: true, displayFailuresSummary: false, displayFailedSpec: true}));

            // Add protractor-jasmine2-screenshot-reporter
            jasmine.getEnv().addReporter(reporter);
        },
        // A callback function called once all tests have finished running and the WebDriver instance has been shut down
        afterLaunch: function(exitCode) {
            // Close the reporter after all tests finish
            return new Promise(function(resolve) {
                reporter.afterLaunch(resolve.bind(this, exitCode));
            });
        }
    };
}());
