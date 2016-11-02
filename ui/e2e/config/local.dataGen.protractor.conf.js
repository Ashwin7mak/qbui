// Protractor configuration
// https://github.com/angular/protractor/blob/master/docs/referenceConf.js

(function() {
    'use strict';
    var globalLocalConfig = require('./local.protractor.conf.js').config;
    globalLocalConfig.specs = [
        '../qbapp/newDataGen.e2e.spec.js'
    ];
    globalLocalConfig.onComplete = function() {
        // We don't want to cleanup generated realms so override the local.protractor.conf.js
    };
    exports.config = globalLocalConfig;
}());
