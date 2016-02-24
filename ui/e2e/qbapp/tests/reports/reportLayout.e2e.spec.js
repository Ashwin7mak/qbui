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
                // Get the appropriate fields out of the second table
                var nonBuiltInFields = e2eBase.tableService.getNonBuiltInFields(app.tables[1]);
                // Generate the record JSON objects
                var generatedRecords = e2eBase.recordService.generateRecords(nonBuiltInFields, 10);
                // Via the API create some records
                return e2eBase.recordService.addRecords(app, app.tables[1], generatedRecords);
            }).then(function() {
                //Create a new report
                return e2eBase.reportService.createReport(app.id, app.tables[1].id);
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
                    // Select the app
                    return reportServicePage.appLinksElList.get(0).click();
                });
            }).then(function() {
                return reportServicePage.waitForElement(reportServicePage.tablesListDivEl).then(function() {
                    // Select the table
                    return reportServicePage.tableLinksElList.get(3).click();
                });
            }).then(function() {
                // Open the reports list
                reportServicePage.reportHamburgersElList.get(0).click();
                // Wait for the report list to load
                reportServicePage.waitForElement(reportServicePage.reportGroupsDivEl).then(function() {
                    // Find and select the report
                    reportServicePage.selectReport('My Reports', 'Test Report');
                    done();
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
         * Data Provider for the different breakpoints. Also contains the state of the leftNav at each size for assertion
         */
        function NavDimensionsDataProvider() {
            return [
                {
                    browserWidth: e2eConsts.XLARGE_BP_WIDTH,
                    breakpointSize: 'xlarge',
                    open: true,
                    clientWidth: '399'
                },
                {
                    browserWidth: e2eConsts.LARGE_BP_WIDTH,
                    breakpointSize: 'large',
                    open: true,
                    clientWidth: '299'
                },
                {
                    browserWidth: e2eConsts.MEDIUM_BP_WIDTH,
                    breakpointSize: 'medium',
                    open: true,
                    clientWidth: '199'
                },
                {
                    browserWidth: e2eConsts.SMALL_BP_WIDTH,
                    breakpointSize: 'small',
                    open: false,
                    clientWidth: '39'
                }
            ];
        }

        /**
         * Layout test. Verify topNav is displayed above the report stage
         */
        NavDimensionsDataProvider().forEach(function(testcase) {
            it(testcase.breakpointSize + ': verify topNav is on top of report stage', function() {
                e2eBase.resizeBrowser(testcase.browserWidth, e2eConsts.DEFAULT_HEIGHT).then(function() {
                    reportServicePage.isElementOnTop(reportServicePage.topNavDivEl, reportServicePage.reportStageContentEl);
                });
            });
        });

        /**
         * Layout test. Verify report actions are displayed above the report content
         */
        NavDimensionsDataProvider().forEach(function(testcase) {
            it(testcase.breakpointSize + ': verify table actions Layout container is on top of report griddle container', function() {
                e2eBase.resizeBrowser(testcase.browserWidth, e2eConsts.DEFAULT_HEIGHT).then(function() {
                    reportServicePage.isElementOnTop(reportServicePage.tableActionsContainerEl, reportServicePage.griddleContainerEl);
                });
            });
        });

        /**
         * Layout test. Verify stage is displayed above the report actions container
         */
        NavDimensionsDataProvider().forEach(function(testcase) {
            it(testcase.breakpointSize + ': verify report Stage Layout container is on top of table actions container', function() {
                e2eBase.resizeBrowser(testcase.browserWidth, e2eConsts.DEFAULT_HEIGHT).then(function() {
                    reportServicePage.isElementOnTop(reportServicePage.reportStageContentEl, reportServicePage.tableActionsContainerEl);
                });
            });
        });

        /**
         * After all tests are done, run the cleanup function in the base class
         */
        afterAll(function(done) {
            e2eBase.cleanup(done);
        });
    });
}());
