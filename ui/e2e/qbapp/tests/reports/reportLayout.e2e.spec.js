/**
 * E2E tests for the layout of the Reports page
 * Tests locations and layout of divs and elements in relation to each other
 * cmartinez2 6/21/15
 * klabak on 2/16/16
 */
// jscs:disable requireDotNotation
// jshint sub: true
(function() {
    'use strict';

    // Bluebird Promise library
    var Promise = require('bluebird');
    // Load the Page Objects
    var ReportServicePage = requirePO('reportService');
    var RequestAppsPage = requirePO('requestApps');
    var RequestSessionTicketPage = requirePO('requestSessionTicket');
    var reportServicePage = new ReportServicePage();

    describe('Report Page Layout Tests', function() {
        var realmName;
        var realmId;
        var app;
        var recordList;

        /**
         * Setup method. Calls reportsBasicSetup which will generate two tables, a set of records and a report for each.
         * Then creates them via the JAVA REST API.
         * In setup have to specify the done() callback at the end of the promise chain to let Jasmine know we are finished with async calls.
         */
        beforeAll(function(done) {
            e2eBase.reportsBasicSetUp().then(function(appAndRecords) {
                // Set your global objects to use in the test functions
                app = appAndRecords[0];
                recordList = appAndRecords[1];
            }).then(function() {
                // Get a session ticket for that subdomain and realmId (stores it in the browser)
                realmName = e2eBase.recordBase.apiBase.realm.subdomain;
                realmId = e2eBase.recordBase.apiBase.realm.id;
                return RequestSessionTicketPage.get(e2eBase.getSessionTicketRequestEndpoint(realmName, realmId, e2eBase.ticketEndpoint));
            }).then(function() {
                // Load the requestAppsPage (shows a list of all the apps and tables in a realm)
                return RequestAppsPage.get(e2eBase.getRequestAppsPageEndpoint(realmName));
            }).then(function() {
                // Wait for the leftNav to load
                return reportServicePage.waitForElement(reportServicePage.appsListDivEl).then(function() {
                    //go to report page directly.
                    RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, "1"));
                    // Make sure the table report has loaded
                    reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                        done();
                    });
                });
            }).catch(function(error) {
                // Global catch that will grab any errors from chain above
                // Will appropriately fail the beforeAll method so other tests won't run
                done.fail('Error during test setup: ' + error.message);
            });
        });

        /**
         * Before each test starts just make sure the report content has loaded
         */
        beforeEach(function(done) {
            reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                done();
            });
        });

        /**
         * Layout test. Verify topNav is displayed above the report stage
         */
        it('verify topNav is on top of report stage', function() {
            reportServicePage.isElementOnTop(reportServicePage.topNavDivEl, reportServicePage.reportStageContentEl);
        });

        /**
         * Layout test. Verify report actions are displayed above the report content
         */
        it('verify table actions Layout container is on top of report container', function() {
            reportServicePage.isElementOnTop(reportServicePage.reportToolbarContainerEl, reportServicePage.agGridContainerEl);
        });

        /**
         * Layout test. Verify stage is displayed above the report actions container
         */
        it('verify report Stage Layout container is on top of table actions container', function() {
            reportServicePage.isElementOnTop(reportServicePage.reportStageContentEl, reportServicePage.reportToolbarContainerEl);
        });

        //TODO: Tests for small breakpoint size

        /**
         * After all tests are done, run the cleanup function in the base class
         */
        afterAll(function(done) {
            e2eBase.cleanup(done);
        });
    });
}());
