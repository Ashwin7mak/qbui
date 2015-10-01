// Protractor configuration
// https://github.com/angular/protractor/blob/master/referenceConf.js
(function() {
    'use strict';
    var globalSauceConfig = require('./sauce.global.conf.js');
    globalSauceConfig.capabilities = {
        browserName     : 'chrome',
        tunnelIdentifier: process.env.ENV_TUNNEL_NAME,
        name            : process.env.SAUCE_JOB_NAME + '_Linux_Chrome'
    };
    exports.config = globalSauceConfig;
}());
