// Protractor configuration
// https://github.com/angular/protractor/blob/master/referenceConf.js

(function() {
    'use strict';

    exports.config = {
        // The timeout for each script run on the browser. This should be longer
        // than the maximum time your application needs to stabilize between tasks.
        allScriptsTimeout: 120000,

        //The sauce user and access key allow us to run our browser tests remotely on a SauceLabs VM
        sauceUser           : 'sbg_qbse',
        sauceKey            : process.env.SAUCE_KEY,
        //we have to specify the selenium address to point locally so that we use the tunnel properly
        sauceSeleniumAddress: 'localhost:4445/wd/hub',

        // A base URL for your application under test will be passed in via grunt config so that we can use whatever url we please

        // list of files / patterns to load in the browser
        specs: [
            '../qbapp/**/*.e2e.spec.js'
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
        // Resource on running multiCapabilities
        // http://www.ignoredbydinosaurs.com/2015/04/angular-protractor-tests-and-sauce-connect-config
        //
        // Resource on how to figure out the parameters for your specific configuration
        // https://docs.saucelabs.com/reference/platforms-configurator/#/
        // If you do not specify 'platform' it will run Linux by default
        // Not specifying 'version' will run the latest non beta / dev version of the browser
        multiCapabilities: [{
            platform : 'Windows 10',
            browserName     : 'chrome',
            tunnelIdentifier: process.env.ENV_TUNNEL_NAME,
            name            : process.env.SAUCE_JOB_NAME + '_Win10_Chrome'
        }, {
            browserName     : 'firefox',
            tunnelIdentifier: process.env.ENV_TUNNEL_NAME,
            name            : process.env.SAUCE_JOB_NAME + '_Linux_FF'
        }, {
            platform: 'OS X 10.11',
            browserName: 'safari',
            version: '8.1',
            tunnelIdentifier: process.env.ENV_TUNNEL_NAME,
            name: process.env.SAUCE_JOB_NAME + '_OSX10.11_Safari'
        }],

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
            defaultTimeoutInterval: 90000
        }
    };
}());
