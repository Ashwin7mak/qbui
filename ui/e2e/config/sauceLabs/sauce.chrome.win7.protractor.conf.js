// Protractor configuration
// https://github.com/angular/protractor/blob/master/docs/referenceConf.js
(function() {
    'use strict';
    var globalSauceConfig = require('./sauce.global.protractor.conf.js');
    globalSauceConfig.capabilities = {
        platform : 'Windows 7',
        browserName     : 'chrome',
        tunnelIdentifier: process.env.ENV_TUNNEL_NAME,
        name            : 'aws_' + process.env.SAUCE_JOB_NAME + '_Win7_Chrome',
        //Timeout in seconds for Sauce Labs to wait for another command (bumped this for sleeps in tests)
        idleTimeout: '120',
        screenResolution : '1680x1050',
        maxDuration: 10800,
        breakpointSize: 'large',
        shardTestFiles: true,
        maxInstances: 2
    };
    exports.config = globalSauceConfig;
}());
