// Protractor configuration
// https://github.com/angular/protractor/blob/master/docs/referenceConf.js
(function() {
    'use strict';
    var globalSauceConfig = require('./sauce.global.protractor.xlargeBP.conf.js');
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
            platform : 'OS X 10.11',
            browserName     : 'chrome',
            tunnelIdentifier: process.env.ENV_TUNNEL_NAME,
            name            : 'aws_' + process.env.SAUCE_JOB_NAME + '_OSX_Chrome',
            screenResolution : '1600x1200',
            //Timeout in seconds for Sauce Labs to wait for another command (bumped this for sleeps in tests)
            idleTimeout: '180',
            maxDuration: 10800,
            breakpointSize : 'xlarge',
            shardTestFiles: true,
            maxInstances: 2
        }, {
            platform: 'OS X 10.11',
            browserName: 'safari',
            tunnelIdentifier: process.env.ENV_TUNNEL_NAME,
            name: 'aws_' + process.env.SAUCE_JOB_NAME + '_OSX_Safari',
            screenResolution : '1600x1200',
            //Timeout in seconds for Sauce Labs to wait for another command (bumped this for sleeps in tests)
            idleTimeout: '180',
            maxDuration: 10800,
            breakpointSize : 'xlarge',
            shardTestFiles: true,
            maxInstances: 2
        },
        {
            platform: 'OS X 10.11',
            browserName: 'firefox',
            version: '45.0',
            tunnelIdentifier: process.env.ENV_TUNNEL_NAME,
            name: 'aws_' + process.env.SAUCE_JOB_NAME + '_OSX_Firefox',
            screenResolution : '1600x1200',
            //Timeout in seconds for Sauce Labs to wait for another command (bumped this for sleeps in tests)
            idleTimeout: '180',
            maxDuration: 10800,
            breakpointSize : 'xlarge',
            shardTestFiles: true,
            maxInstances: 2
        }
    ];
    exports.config = globalSauceConfig;
}());
