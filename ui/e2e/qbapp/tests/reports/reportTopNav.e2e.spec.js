/**
 * E2E tests for the topNav of the Reports page
 * klabak 2/16/16
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

    describe('Report Page Top Nav Tests', function() {
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
                    return reportServicePage.appLinksElList.get(0).click().then(function() {
                        //Done callback to let Jasmine know we are done with our promise chain
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
         * Before each test starts just make sure the table list div has loaded
         */
        beforeEach(function(done) {
            reportServicePage.waitForElement(reportServicePage.tablesListDivEl).then(function() {
                done();
            });
        });

        /**
         * Test method to verify all elements present / hidden in topNav depending on breakpoint
         */
        it('Verify topNav elements display/not display depending on different breakpoints', function() {
            e2eConsts.NavDimensionsDataProvider().forEach(function(testcase) {
                e2eBase.resizeBrowser(testcase.browserWidth, e2eConsts.DEFAULT_HEIGHT).then(function() {
                    // Verify Icon link display in topNav and  no text associated for that icon.
                    reportServicePage.waitForElement(reportServicePage.topNavLeftDivEl).then(function() {
                        // Verify icon link is displayed in topNav
                        reportServicePage.isElementInTopNav(reportServicePage.topNavToggleHamburgerEl);
                        // Verify no text displayed beside icon link in topNav
                        expect(reportServicePage.topNavToggleHamburgerEl.getText()).toBeFalsy();
                    });
                    // Verify harmony icons display in topNav and no text associated to them.
                    reportServicePage.waitForElement(reportServicePage.topNavCenterDivEl).then(function() {
                        for (var i = 0; i < reportServicePage.topNavHarButtonsListEl.length; i++) {
                            // Verify Harmony Icons displayed in topNav
                            reportServicePage.isElementInTopNav(reportServicePage.topNavHarButtonsListEl[i]);
                            // Verify no text displayed beside Harmony Icons in topNav
                            expect(reportServicePage.topNavHarButtonsListEl[i].getText()).toBeFalsy();
                        }
                    });
                    // Verify right global icons display in topNav and verify text display depending on breakpoint.
                    reportServicePage.waitForElement(reportServicePage.topNavRightDivEl).then(function() {
                        reportServicePage.topNavGlobalActionsListEl.then(function(navActions) {
                            expect(navActions.length).toBe(2);
                            for (var i = 0; i < navActions.length; i++) {
                                var textEl = navActions[i].all(by.tagName('span')).last();
                                if (testcase.clientWidth === e2eConsts.XLARGE_BP_WIDTH || testcase.clientWidth === e2eConsts.LARGE_BP_WIDTH) {
                                    // Verify global action icons is displayed in topNav
                                    reportServicePage.isElementInTopNav(textEl);
                                    expect(reportServicePage.getGlobalNavTextEl(reportServicePage.topNavUserGlobActEl).getText()).toBe('User');
                                    expect(reportServicePage.getGlobalNavTextEl(reportServicePage.topNavHelpGlobActEl).getText()).toBe('Help');
                                }
                                if (testcase.clientWidth === e2eConsts.MEDIUM_BP_WIDTH || testcase.clientWidth === e2eConsts.SMALL_BP_WIDTH) {
                                    // Verify global action icons is not displayed in topNav
                                    reportServicePage.isElementInTopNav(textEl);
                                }
                            }
                        });
                    });
                    // Verify the drop down toggle icon present on all breakpoints
                    reportServicePage.waitForElement(reportServicePage.topNavCenterDivEl).then(function() {
                        // Verify  drop down toggle icon is displayed on topNav
                        reportServicePage.isElementInTopNav(reportServicePage.topNavDropdownEl);
                        // Verify no text displayed beside  drop down toggle
                        expect(reportServicePage.topNavDropdownEl.getText()).toBeFalsy();
                    });
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
