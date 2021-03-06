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
        allScriptsTimeout: 600000,
        // The sauce user and access key allow us to run our browser tests remotely on a SauceLabs VM
        sauceUser           : 'QuickBaseNS',
        sauceKey            : process.env.SAUCE_KEY,
        // We have to specify the selenium address to point locally so that we use the tunnel properly
        // sauceSeleniumAddress: 'localhost:4445/wd/hub',
        // list of files / patterns to load in the browser
        specs: [
            baseE2EPath + 'qbapp/tests/forms/formAdd.e2e.spec.js',
            baseE2EPath + 'qbapp/tests/forms/formAddValidation.e2e.spec.js',
            baseE2EPath + 'qbapp/tests/forms/formEdit.e2e.spec.js',
            baseE2EPath + 'qbapp/tests/forms/formPermissionsViewerRole.e2e.spec.js',
            baseE2EPath + 'qbapp/tests/reports/reportFacets.e2e.spec.js',
            baseE2EPath + 'qbapp/tests/reports/reportSortingViaColumnHeader.e2e.spec.js'
        ],
        // Patterns to exclude.
        exclude: [
            baseE2EPath + 'qbapp/tests/reports/reportGroupingSortingViaIcon.e2e.spec.js',
            baseE2EPath + 'qbapp/tests/reports/reportGroupingViaColumnHeader.e2e.spec.js',
            baseE2EPath + 'qbapp/tests/reports/tableHomePage.e2e.spec.js'
        ],
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
            defaultTimeoutInterval: 600000,
            grep:'@smoke'
        },
        // Globally accessible variables (params is a property of the Protractor instance)
        // Used for running tests slower / faster if running in Sauce Labs
        params : {
            tinySleep : 1000,
            smallSleep : 5000,
            mediumSleep : 10000,
            largeSleep :30000,
            // Constant for protractors ExpectedConditions functions (see e2ePageBase)
            ecTimeout: 15000
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

            // Initialize the base classes
            // Get an instance of e2eBase (which gives you an instance of recordApi.base and api.base)
            // e2eBase then uses the instance of recordApi.base and initializes the services classes with this instance
            global.e2eBase = requireCommon('common/e2eBase')();
            // api.base will use the DOMAIN param set in your config as the baseUrl if you pass a config object down through the stack
            // browser is a global object setup by protractor. baseUrl is a param that can be passed in via IntelliJ config or via grunt
            // since we aren't passing a config object set it here
            e2eBase.setBaseUrl(browser.baseUrl);
            // recordApi.base will not initialize itself (and api.base) if you don't pass in a config object
            // Initialize your recordApi.base (because we aren't passing in a config object in the above call)
            // This call creates you your test realm down in api.base
            e2eBase.initialize();
            global.consts = require('../../../common/src/constants');
            global.e2eUtils = requireCommon('common/e2eUtils')();
            global.e2eConsts = requireCommon('common/e2eConsts');

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
            e2eRetry.setDefaultTimeout(25000);

            // Add jasmine spec reporter
            var SpecReporter = require('jasmine-spec-reporter');
            jasmine.getEnv().addReporter(new SpecReporter({displayStacktrace: 'all', displaySpecDuration: true}));
        },
        // Function will run on completion of test specs. If running in parallel or with multi-capabilities it will run more than once
        onComplete: function() {
            return e2eBase.cleanup();
        }
    };
}());
