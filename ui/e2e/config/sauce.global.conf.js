// Protractor configuration
// https://github.com/angular/protractor/blob/master/referenceConf.js
(function() {
    'use strict';
    // Global properties file with params common to all Sauce lab config files
    module.exports = {
        // The timeout for each script run on the browser. This should be longer
        // than the maximum time your application needs to stabilize between tasks.
        allScriptsTimeout: 300000,

        //The sauce user and access key allow us to run our browser tests remotely on a SauceLabs VM
        sauceUser           : 'sbg_qbse',
        sauceKey            : process.env.SAUCE_KEY,
        //we have to specify the selenium address to point locally so that we use the tunnel properly
        sauceSeleniumAddress: 'localhost:4445/wd/hub',

        // A base URL for your application under test will be passed in via grunt config so that we can use whatever url we please
        //baseUrl: process.env.DOMAIN,
        // list of files / patterns to load in the browser
        specs: [
            '../qbapp/**/*.e2e.spec.js'
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
        // See the full list at https://github.com/juliemr/minijasminenode
        jasmineNodeOpts: {
            defaultTimeoutInterval: 150000
        },
        // Globally accessible variables (params is a property of the Protractor instance)
        // Used for running tests slower / faster if running in Sauce Labs
        params : {
            tinySleep : 5000,
            smallSleep : 10000,
            mediumSleep : 30000,
            largeSleep :60000
        }
    };
}());