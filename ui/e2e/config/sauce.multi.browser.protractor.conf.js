// Protractor configuration
// https://github.com/angular/protractor/blob/master/referenceConf.js
(function() {
    'use strict';
    var globalSauceConfig = require('./sauce.global.conf.js');
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
    globalSauceConfig.multiCapabilities = [
        {
            platform : 'Windows 10',
            browserName     : 'chrome',
            tunnelIdentifier: process.env.ENV_TUNNEL_NAME,
            name            : process.env.SAUCE_JOB_NAME + '_Win10_Chrome',
            //Timeout in seconds for Sauce Labs to wait for another command (bumped this for sleeps in tests)
            idleTimeout: '120'
        }, {
            browserName     : 'firefox',
            tunnelIdentifier: process.env.ENV_TUNNEL_NAME,
            name            : process.env.SAUCE_JOB_NAME + '_Linux_FF',
            //Timeout in seconds for Sauce Labs to wait for another command (bumped this for sleeps in tests)
            idleTimeout: '120'
        }, {
            platform: 'OS X 10.11',
            browserName: 'safari',
            version: '8.1',
            tunnelIdentifier: process.env.ENV_TUNNEL_NAME,
            name: process.env.SAUCE_JOB_NAME + '_OSX10.11_Safari',
            //Timeout in seconds for Sauce Labs to wait for another command (bumped this for sleeps in tests)
            idleTimeout: '120'
        }
    ];
    exports.config = globalSauceConfig;
}());