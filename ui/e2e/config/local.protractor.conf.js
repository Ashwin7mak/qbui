// Protractor configuration
// Use when running E2E tests on your local dev environment
// https://github.com/angular/protractor/blob/master/docs/referenceConf.js

(function() {
    'use strict';
    var baseE2EPath = '../../e2e/';
    var e2eUtils = require('../common/e2eUtils')();

    // Add a screenshot reporter for errors when testing locally
    var HtmlScreenshotReporter = require('protractor-jasmine2-screenshot-reporter');
    var reporter = new HtmlScreenshotReporter({
        dest: './ui/build/reports/e2e/',
        filename: 'e2e-test-report.html',
        ignoreSkippedSpecs: false,
        reportOnlyFailedSpecs: false,
        captureOnlyFailedSpecs: true,
        showSummary: true,
        reportTitle: 'Protractor E2E Test Report: ' + e2eUtils.getCurrentTimestamp()
    });
    exports.config = {
        // The timeout for each script run on the browser. This should be longer
        // than the maximum time your application needs to stabilize between tasks.
        allScriptsTimeout: 120000,
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
        exclude: [
            baseE2EPath + 'qbapp/tests/reports/reportGroupingSortingViaIcon.e2e.spec.js',
            baseE2EPath + 'qbapp/tests/reports/reportGroupingViaColumnHeader.e2e.spec.js',
            baseE2EPath + 'qbapp/tests/reports/reportSortingViaColumnHeader.e2e.spec.js',
            baseE2EPath + 'qbapp/tests/reports/tableHomePage.e2e.spec.js'
        ],

        // ----- Capabilities to be passed to the webdriver instance ----
        //
        // For a full list of available capabilities, see
        // https://github.com/SeleniumHQ/selenium/wiki/DesiredCapabilities and
        // https://github.com/SeleniumHQ/selenium/blob/master/javascript/webdriver/capabilities.js
        capabilities: {
            browserName: 'chrome',
            breakpointSize: 'xlarge',
            // These two values enable parallel testing which will run a spec file per instance
            shardTestFiles: true,
            maxInstances: 2
        },
        // Uncomment below if you want to run multiple breakpoints or multiple browsers
        // Overrides any capabilities you have set above
        //multiCapabilities: [
        //    {
        //        browserName: 'chrome',
        //        breakpointSize: 'xlarge'
        //    },
        //    {
        //        browserName: 'chrome',
        //        breakpointSize: 'large'
        //    },
        //    {
        //        browserName: 'firefox',
        //        breakpointSize: 'large'
        //    },
        //    {
        //        browserName: 'safari',
        //        breakpointSize: 'medium'
        //    },
        //],

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
            ecTimeout: 7500
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
            global.e2eConsts = requireCommon('common/e2eConsts');
            global.e2eUtils = requireCommon('common/e2eUtils')();
            global.consts = require('../../common/src/constants');

            // Lets Protractor know there is no Angular code to wait for
            browser.ignoreSynchronization = true;

            // Grab the browser name to use in spec files
            browser.getCapabilities().then(function(cap) {
                global.browserName = cap.get('browserName');
            });

            // Grab the browser settings from the processed config and set the browser size
            browser.getProcessedConfig().then(function(config) {
                var browserDimensions = e2eUtils.getBrowserBreakpointDimensions(config.capabilities.breakpointSize);
                global.breakpointSize = browserDimensions.breakpointSize;
                global.browserWidth = browserDimensions.browserWidth;
                global.browserHeight = browserDimensions.browserHeight;

                //TODO: MB-386 - Need to use the logger wrapper instead of console.log
                console.log('Setting browser size to ' + global.breakpointSize + ' breakpoint (' + global.browserWidth + ', ' + global.browserHeight + ')');
                browser.driver.manage().window().setSize(global.browserWidth, global.browserHeight);
            });

            // Third party library that lets us retry webdriver commands
            global.e2eRetry = require('webdriverjs-retry');
            e2eRetry.setDefaultTimeout(15000);

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
