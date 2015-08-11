// Protractor configuration
// https://github.com/angular/protractor/blob/master/referenceConf.js

'use strict';

exports.config = {
    // The timeout for each script run on the browser. This should be longer
    // than the maximum time your application needs to stabilize between tasks.
    allScriptsTimeout: 110000,

    //The sauce user and access key allow us to run our browser tests remotely on a SauceLabs VM
    sauceUser           : "sbg_qbse",
    sauceKey            : process.env.SAUCE_KEY,
    //we have to specify the selenium address to point locally so that we use the tunnel properly
    sauceSeleniumAddress: 'localhost:4445/wd/hub',

    // A base URL for your application under test will be passed in via grunt config so that we can use whatever url we please

    // list of files / patterns to load in the browser
    specs: [
        '../qbapp/**/*.spec.js'
    ],

    // Patterns to exclude.
    exclude: [],

    // ----- Capabilities to be passed to the webdriver instance ----
    //
    // For a full list of available capabilities, see
    // https://code.google.com/p/selenium/wiki/DesiredCapabilities
    // and
    // https://code.google.com/p/selenium/source/browse/javascript/webdriver/capabilities.js
    //
    // When we go to do multiple os's then we should have a look at this
    // http://www.ignoredbydinosaurs.com/2015/04/angular-protractor-tests-and-sauce-connect-config
    capabilities: {
        'browserName'     : 'chrome',
        'tunnelIdentifier': process.env.ENV_TUNNEL_NAME,
        'name'            : process.env.SAUCE_JOB_NAME
    },

    // ----- The test framework -----
    //
    // Jasmine and Cucumber are fully supported as a test and assertion framework.
    // Mocha has limited beta support. You will need to include your own
    // assertion framework if working with mocha.
    framework: 'jasmine',

    // ----- Options to be passed to minijasminenode -----
    //
    // See the full list at https://github.com/juliemr/minijasminenode
    jasmineNodeOpts: {
        defaultTimeoutInterval: 60000
    }
};