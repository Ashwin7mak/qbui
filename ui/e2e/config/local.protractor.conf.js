// Protractor configuration
// https://github.com/angular/protractor/blob/master/docs/referenceConf.js

(function() {
    'use strict';
    exports.config = {
        // The timeout for each script run on the browser. This should be longer
        // than the maximum time your application needs to stabilize between tasks.
        allScriptsTimeout: 120000,
        // A base URL for your application under test will be passed in via grunt config so that we can use whatever url we please
        baseUrl: process.env.DOMAIN,
        // list of files / patterns to load in the browser
        specs: [
            '../qbapp/reports/*.e2e.spec.js'
        ],
        // Patterns to exclude.
        exclude: [],
        // ----- Capabilities to be passed to the webdriver instance ----
        //
        // For a full list of available capabilities, see
        // https://code.google.com/p/selenium/wiki/DesiredCapabilities
        // and
        // https://code.google.com/p/selenium/source/browse/javascript/webdriver/capabilities.js
        capabilities: {
            browserName: 'chrome'
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
            largeSleep: 5000
        },
        // This function is run once before any of the test files. Acts as a global test preparation step
        onPrepare: function(){
            // Lets Protractor know there is no Angular code to wait for
            browser.ignoreSynchronization = true;
            // Add jasmine spec reporter
            var SpecReporter = require('jasmine-spec-reporter');
            jasmine.getEnv().addReporter(new SpecReporter({displayStacktrace: 'all'}));
        }
    };
}());
