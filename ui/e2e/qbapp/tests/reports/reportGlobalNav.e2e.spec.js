/**
 * E2E tests for the Report layout
 * based on reportService created by klabak on 6/1/15,
 * cmartinez2 6/21/15
 */
// jscs:disable requireDotNotation
// jshint sub: true
(function() {
    'use strict';

    //Bluebird Promise library
    var promise = require('bluebird');
    //Load the page Objects
    var ReportServicePage = requirePO('reportService');
    var requestAppsPage = requirePO('requestApps');
    var requestSessionTicketPage = requirePO('requestSessionTicket');
    var reportServicePage = new ReportServicePage();

    describe('Table Report Global Nav Tests', function() {
        var app;
        var recordList;

        /**¶
         * Setup method. Generates JSON for an app, a table, a set of records and a report. Then creates them via the REST API.
         * Have to specify the done() callback at the end of the promise chain, otherwise Protractor will not wait
         * for the promises to be resolved
         */
        beforeAll(function(done) {
            e2eBase.reportsBasicSetUp().then(function(appAndRecords) {
                app = appAndRecords[0];
                recordList = appAndRecords[1];

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
            e2eBase.resizeBrowser(e2eConsts.XLARGE_BP_WIDTH, e2eConsts.DEFAULT_HEIGHT).then(function(){
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
            e2eBase.resizeBrowser(e2eConsts.LARGE_BP_WIDTH, e2eConsts.DEFAULT_HEIGHT).then(function() {
                reportServicePage.waitForElement(reportServicePage.topNavGlobalActDivEl).then(function() {
                    reportServicePage.assertGlobalNavTextVisible(true);
                });
            });
        });

        /**
         * Test method.
         */
        it('Medium breakpoint: Global Nav actions should only show icon', function() {
            e2eBase.resizeBrowser(e2eConsts.MEDIUM_BP_WIDTH, e2eConsts.DEFAULT_HEIGHT).then(function(){
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
            e2eBase.resizeBrowser(e2eConsts.SMALL_BP_WIDTH, e2eConsts.DEFAULT_HEIGHT).then(function(){
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
