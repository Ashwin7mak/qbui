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
    exports.config = globalSauceConfig;
}());
