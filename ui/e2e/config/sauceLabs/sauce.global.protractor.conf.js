// Protractor configuration
// https://github.com/angular/protractor/blob/master/docs/referenceConf.js
(function() {
    'use strict';
    var baseE2EPath = '../../../e2e/';
    // Global properties file with params common to all Sauce lab config files
    module.exports = {
        // A callback function called once configs are read but before any environment
        // setup. This will only run once, and before onPrepare.
        beforeLaunch: function() {
            //Have the tests start an instance of node
            require('../../../server/src/app');
        },
        // The timeout for each script run on the browser. This should be longer
        // than the maximum time your application needs to stabilize between tasks.
        allScriptsTimeout: 300000,
        // The sauce user and access key allow us to run our browser tests remotely on a SauceLabs VM
        sauceUser           : 'QuickBaseNS',
        sauceKey            : process.env.SAUCE_KEY,
        // We have to specify the selenium address to point locally so that we use the tunnel properly
        sauceSeleniumAddress: 'localhost:4445/wd/hub',
        // list of files / patterns to load in the browser
        specs: [
            baseE2EPath + 'qbapp/tests/reports/reportFacets.e2e.spec.js',
            baseE2EPath + 'qbapp/tests/reports/reportGroupingSortingViaIcon.e2e.spec.js'
        ],
        // Patterns to exclude.
        exclude: [baseE2EPath + 'qbapp/tests/reports/reportGroupingViaColumnHeader.e2e.spec.js',
            baseE2EPath + 'qbapp/tests/reports/reportSortingViaColumnHeader.e2e.spec.js'],
        // ----- The test framework -----
        //
        // Jasmine and Cucumber are fully supported as a test and assertion framework.
        // Mocha has limited beta support. You will need to include your own
        // assertion framework if working with mocha.
        framework: 'jasmine2',
        // ----- Options to be passed to minijasminenode -----
        //
        // See https://github.com/jasmine/jasmine-npm/blob/master/lib/jasmine.js
        // for the exact options available.
        jasmineNodeOpts: {
            // If true, print colors to the terminal.
            showColors: true,
            // Default time to wait in ms before a test fails.
            defaultTimeoutInterval: 150000
        },
        // Globally accessible variables (params is a property of the Protractor instance)
        // Used for running tests slower / faster if running in Sauce Labs
        params : {
            tinySleep : 1000,
            smallSleep : 5000,
            mediumSleep : 10000,
            largeSleep :30000,
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
            global.e2eConsts = requireCommon('common/e2eConsts');
            global.e2eUtils = requireCommon('common/e2eUtils')();
            global.consts = require('../../../common/src/constants');

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

                console.log('Setting browser size to ' + global.breakpointSize + ' breakpoint (' + global.browserWidth + ', ' + global.browserHeight + ')');
                browser.driver.manage().window().setSize(global.browserWidth, global.browserHeight);
            });

            // Third party library that lets us retry webdriver commands
            global.e2eRetry = require('webdriverjs-retry');
            e2eRetry.setDefaultTimeout(25000);

            // Add jasmine spec reporter
            var SpecReporter = require('jasmine-spec-reporter');
            jasmine.getEnv().addReporter(new SpecReporter({displayStacktrace: 'all', displaySpecDuration: true}));
        }
    };
}());
