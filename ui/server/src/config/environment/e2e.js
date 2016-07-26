
// Local configuration to use only when running Protractor E2E tests locally on your dev machine
// Node needs to be run at a different node port than the local.js config since the tests start up their own instance
// ===========================

(function() {
    'use strict';

    // Import your local config for your env
    var localJsConfig = require('./local.js');

    // Override the local.js config file to what we need to run e2e tests in parallel
    module.exports = Object.assign(localJsConfig, {
        // Set these node port values to something different than your local.js
        port: 9001,
        DOMAIN: 'http://localhost:9001',
        // Set notHotLoad true to disable hotloading (Protractor sometimes has issues when using this)
        noHotLoad : true,
        // walkme java script (Takes focus away from Protractor when running e2e tests with this enabled)
        walkmeJSSnippet : ''
    });

}());
