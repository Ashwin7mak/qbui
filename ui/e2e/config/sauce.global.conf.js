// Protractor configuration
// https://github.com/angular/protractor/blob/master/referenceConf.js
(function() {
    'use strict';
    // Global properties file with params common to all Sauce lab config files

    // Needed for Protractor's DriverProvider to be able to run it's updateJob function
    // to let Sauce Labs know when the tests have completed
    var HttpsProxyAgent = require('https-proxy-agent');
    var agent = new HttpsProxyAgent('http://qypprdproxy02.ie.intuit.net:80');

    module.exports = {
        sauceAgent: agent,
        // The timeout for each script run on the browser. This should be longer
        // than the maximum time your application needs to stabilize between tasks.
        allScriptsTimeout: 300000,
        // The sauce user and access key allow us to run our browser tests remotely on a SauceLabs VM
        sauceUser           : 'sbg_qbse',
        sauceKey            : process.env.SAUCE_KEY,
        // We have to specify the selenium address to point locally so that we use the tunnel properly
        sauceSeleniumAddress: 'localhost:4445/wd/hub',
        // A base URL for your application under test will be passed in via grunt config so that we can use whatever url we please
        //baseUrl: process.env.DOMAIN,
        // list of files / patterns to load in the browser
        specs: [
            '../qbapp/reports/*.e2e.spec.js'
        ],
        // Patterns to exclude.
        exclude: [],
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
            largeSleep :30000
        },
        // This function is run once before any of the test files. Acts as a global test preparation step
        onPrepare: function(){
            // Lets Protractor know there is no Angular code to wait for
            browser.ignoreSynchronization = true;
            // Maximizes the browser window (known bug with Chrome)
            browser.driver.manage().window().maximize();
        }
    };
}());
