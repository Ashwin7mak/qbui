// Protractor configuration
// https://github.com/angular/protractor/blob/master/docs/referenceConf.js
(function() {
    'use strict';
    var globalSauceConfig = require('./sauce.global.protractor.conf.js');
    var baseE2EPath = '../../../e2e/';
    // Overwrite sauce.global.protractor.conf spec files since that's all we need to change to run the smoke test
    globalSauceConfig.specs = [
        baseE2EPath + 'qbapp/tests/reports/prodSmokeTest.e2e.spec.js'
    ];
    // Set the capability object to use for Sauce Labs
    globalSauceConfig.multiCapabilities = [
        {
            platform : 'OS X 10.11',
            browserName     : 'chrome',
            tunnelIdentifier: process.env.ENV_TUNNEL_NAME,
            name            : process.env.SAUCE_JOB_NAME + '_OSX_Chrome',
            screenResolution : '1600x1200',
            //Timeout in seconds for Sauce Labs to wait for another command (bumped this for sleeps in tests)
            idleTimeout: '180',
            maxDuration: 10800,
            breakpointSize: 'large'
        }
    ];
    exports.config = globalSauceConfig;
}());
