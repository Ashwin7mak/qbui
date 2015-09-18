/**
 * e2e base module that initializes the domain service modules as well as the base class defined in the server layer
 * Currently recordApi.base.js is the server module which communicates with the Java API.
 * This module needs to be 'required' by all Protractor tests (make sure to run the initialize function and set the baseUrl).
 * Created by klabak on 9/17/15.
 */
(function() {
    'use strict';
    module.exports = function(config) {
        var recordBase = require('../../server/api/test/recordApi.base.js')(config);
        var appService = require('./appService.js');
        var recordService = require('./recordService.js');
        var tableService = require('./tableService.js');
        var reportService = require('./reportService.js');
        var init;
        if (config !== undefined) {
            init = recordBase.initialize();
        }
        var e2eBase = {
            recordBase : recordBase,
            //delegate to recordBase to initialize
            initialize: function() {
                init = recordBase.initialize();
            },
            //set the baseUrl we want to use to reach out for testing
            setBaseUrl: function(baseUrlConfig) {
                recordBase.setBaseUrl(baseUrlConfig);
            },
            // Initialize the service modules to use the same base class
            appService : appService(recordBase),
            recordService : recordService(recordBase),
            tableService : tableService(),
            reportService : reportService(recordBase)
        };
        return e2eBase;
    };
}());