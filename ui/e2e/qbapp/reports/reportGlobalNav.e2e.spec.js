/**
 * E2E tests for the Report layout
 * based on reportService created by klabak on 6/1/15,
 * cmartinez2 6/21/15
 */
// jscs:disable requireDotNotation
// jshint sub: true
(function() {
    'use strict';

    //Require the e2e base class and constants modules
    var e2eBase = require('../../common/e2eBase.js')();
    var e2eConsts = require('../../common/e2eConsts.js');
    var consts = require('../../../server/api/constants.js');
    //Bluebird Promise library
    var promise = require('bluebird');
    //Load the page objects
    var requestSessionTicketPage = require('./requestSessionTicket.po.js');
    var requestAppsPage = require('./requestApps.po.js');
    var ReportServicePage = require('./reportService.po.js');
    var reportServicePage = new ReportServicePage();

    describe('Table Report Global Nav Tests', function() {
        var heightTest = 1441;
        e2eBase.setBaseUrl(browser.baseUrl);
        e2eBase.initialize();
        var app;

        /**
         * Setup method. Generates JSON for an app, a table, a set of records and a report. Then creates them via the REST API.
         * Have to specify the done() callback at the end of the promise chain, otherwise Protractor will not wait
         * for the promises to be resolved
         */
        beforeAll(function(done) {
            //Create the table schema (map object) to pass into the app generator
            var tableToFieldToFieldTypeMap = {};
            tableToFieldToFieldTypeMap['table 1'] = {};
            tableToFieldToFieldTypeMap['table 1']['Text Field'] = {fieldType: consts.SCALAR, dataType: consts.TEXT};
            tableToFieldToFieldTypeMap['table 1']['Rating Field'] = {fieldType: consts.SCALAR, dataType : consts.RATING};
            tableToFieldToFieldTypeMap['table 1']['Phone Number Field'] = {fieldType: consts.SCALAR, dataType : consts.PHONE_NUMBER};
            tableToFieldToFieldTypeMap['table 1']['Numeric'] = {fieldType: consts.SCALAR, dataType: consts.NUMERIC};
            tableToFieldToFieldTypeMap['table 1']['Currency'] = {fieldType: consts.SCALAR, dataType : consts.CURRENCY};
            tableToFieldToFieldTypeMap['table 1']['Percent'] = {fieldType: consts.SCALAR, dataType: consts.PERCENT};
            tableToFieldToFieldTypeMap['table 1']['Url'] = {fieldType: consts.SCALAR, dataType: consts.URL};
            tableToFieldToFieldTypeMap['table 1']['Duration'] = {fieldType: consts.SCALAR, dataType : consts.DURATION};
            tableToFieldToFieldTypeMap['table 1']['Email'] = {fieldType: consts.SCALAR, dataType : consts.EMAIL_ADDRESS};
            tableToFieldToFieldTypeMap['table 1']['Rating 2'] = {fieldType: consts.SCALAR, dataType: consts.RATING};

            //Call the basic app setup function
            e2eBase.basicSetup(tableToFieldToFieldTypeMap, 10).then(function(results) {
                //Set your global objects to use in the test functions
                app = results[0];

                // Get a session ticket for that subdomain and realmId (stores it in the browser)
                // Gather the necessary values to make the requests via the browser
                var realmName = e2eBase.recordBase.apiBase.realm.subdomain;
                var realmId = e2eBase.recordBase.apiBase.realm.id;
                requestSessionTicketPage.get(e2eBase.getSessionTicketRequestEndpoint(realmName, realmId, e2eBase.ticketEndpoint));
                // Load the requestAppsPage (shows a list of all the apps and tables in a realm)
                requestAppsPage.get(e2eBase.getRequestAppsPageEndpoint(realmName));

                // Wait for the left nav to load
                reportServicePage.waitForElement(reportServicePage.appsListDivEl).then(function() {
                    // Select the app
                    reportServicePage.appLinksElList.get(0).click();
                    // Select the table
                    reportServicePage.tableLinksElList.get(3).click();
                    // Open the reports list
                    reportServicePage.reportHamburgersElList.get(0).click();
                    // Wait for the report list to load
                    reportServicePage.waitForElement(reportServicePage.reportsListDivEl).then(function() {
                        // Select the report
                        reportServicePage.reportLinksElList.get(0).click();
                        // Make sure the table report has loaded
                        reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                            done();
                        });
                    });
                });
            });
        });

        /**
         * Before each test starts just make sure the topNav has loaded
         */
        beforeEach(function(done){
            reportServicePage.waitForElement(reportServicePage.topNavDivEl).then(function() {
                done();
            });
        });

        /**
         * Test method.
         */
        it('X-large breakpoint: Global Nav actions should show icon and text', function() {
            e2eBase.resizeBrowser(e2eConsts.XLARGE_BREAKPOINT_WIDTH, heightTest).then(function(){
                expect(reportServicePage.topNavGlobalActDivEl.isDisplayed()).toBe(true);
                reportServicePage.topNavGlobalActionsListEl.then(function(navActions){
                    expect(navActions.length).toBe(2);
                });
                expect(reportServicePage.getGlobalNavTextEl(reportServicePage.topNavUserGlobActEl).getText()).toBe('User');
                expect(reportServicePage.getGlobalNavTextEl(reportServicePage.topNavHelpGlobActEl).getText()).toBe('Help');
            });
        });

        /**
         * Test method.
         */
        it('Large breakpoint: Global Nav actions should show icon and text', function() {
            e2eBase.resizeBrowser(e2eConsts.LARGE_BREAKPOINT_WIDTH, heightTest).then(function() {
                reportServicePage.waitForElement(reportServicePage.topNavGlobalActDivEl).then(function() {
                    reportServicePage.assertGlobalNavTextVisible(true);
                });
            });
        });

        /**
         * Test method.
         */
        it('Medium breakpoint: Global Nav actions should only show icon', function() {
            e2eBase.resizeBrowser(e2eConsts.MEDIUM_BREAKPOINT_WIDTH, heightTest).then(function(){
                reportServicePage.waitForElement(reportServicePage.topNavGlobalActDivEl).then(function() {
                    expect(reportServicePage.topNavGlobalActDivEl.isDisplayed()).toBe(true);
                    reportServicePage.topNavGlobalActionsListEl.then(function(navActions){
                        expect(navActions.length).toBe(2);
                    });
                    reportServicePage.assertGlobalNavTextVisible(false);
                });
            });
        });

        /**
         * Test method.
         */
        it('Small breakpoint: Global Nav actions should only show icon', function() {
            e2eBase.resizeBrowser(e2eConsts.SMALL_BREAKPOINT_WIDTH, heightTest).then(function(){
                reportServicePage.waitForElement(reportServicePage.topNavGlobalActDivEl).then(function() {
                    expect(reportServicePage.topNavGlobalActDivEl.isDisplayed()).toBe(true);
                    reportServicePage.topNavGlobalActionsListEl.then(function(navActions){
                        expect(navActions.length).toBe(2);
                    });
                    reportServicePage.assertGlobalNavTextVisible(false);
                });
            });
        });

        //TODO: On Small breakpoint verify the global actions also appear in the left nav div

        /**
         * After all tests are done, run the cleanup function in the base class
         */
        afterAll(function(done) {
            e2eBase.cleanup(done);
        });
    });
}());
