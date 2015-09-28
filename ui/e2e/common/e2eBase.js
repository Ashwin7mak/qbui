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
        var e2eUtils = require('./e2eUtils.js');
        var appService = require('./services/appService.js');
        var recordService = require('./services/recordService.js');
        var tableService = require('./services/tableService.js');
        var reportService = require('./services/reportService.js');
        var init;
        if (config !== undefined) {
            init = recordBase.initialize();
        }
        var e2eBase = {
            //Delegate to recordBase to initialize
            recordBase : recordBase,
            initialize : function() {
                init = recordBase.initialize();
            },
            //Set the baseUrl we want to use to reach out for testing
            setBaseUrl : function(baseUrlConfig) {
                recordBase.setBaseUrl(baseUrlConfig);
            },
            //Initialize the service modules to use the same base class
            appService : appService(recordBase),
            recordService : recordService(recordBase),
            tableService : tableService(),
            reportService : reportService(recordBase),
            //Initialize the utils class
            e2eUtils : e2eUtils(),
            //Helper method to get the proper URL for loading the dashboard page containing a list of reports for an app
            getRequestReportPageEndpoint : function(realmName) {
                var requestReportPageEndPoint = e2eBase.recordBase.apiBase.generateFullRequest(realmName, '/qbapp#//');
                return requestReportPageEndPoint;
            },
            //Get the proper URL for loading the session ticket page in the browser
            getSessionTicketRequestEndpoint : function(realmName, realmId, ticketEndpoint) {
                var sessionTicketRequestEndPoint = e2eBase.recordBase.apiBase.generateFullRequest(realmName, ticketEndpoint + realmId);
                return sessionTicketRequestEndPoint;
            },
            //Checks for any JS errors in the browser, resets the browser window size and cleans up the test realm and app
            cleanup : function(done) {
                //Checks for any JS errors in the browser console
                browser.manage().logs().get('browser').then(function(browserLog) {
                    expect(browserLog.length).toEqual(0);
                    if (browserLog.length) {
                        console.error('browser log: ' + JSON.stringify(browserLog));
                    }
                });
                //Reset the browser size
                browser.driver.manage().window().maximize();
                //Cleanup the realm and app
                e2eBase.recordBase.apiBase.cleanup().then(function() {
                    done();
                });
            },
            //Helper method to sleep a specified number of seconds
            sleep: function(ms) {
                browser.driver.sleep(ms);
            }
        };
        return e2eBase;
    };
}());