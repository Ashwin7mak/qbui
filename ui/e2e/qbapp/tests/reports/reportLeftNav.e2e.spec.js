/**
 * E2E tests for the leftNav of the Reports page
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
    var ReportServicePage = new ReportServicePage();

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
                return ReportServicePage.waitForElement(ReportServicePage.appsListDivEl).then(function() {
                    // Select the app
                    return ReportServicePage.appLinksElList.get(0).click().then(function() {
                        e2eBase.sleep(1000).then(function() {
                            //Done callback to let Jasmine know we are done with our promise chain
                            done();
                        });
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
            ReportServicePage.waitForElement(ReportServicePage.tablesListDivEl).then(function() {
                done();
            });
        });

        /**
         * Test method. Tests the app toggle widget.
         */
        it('LeftNav Apps toggle should show / hide App Dashboard Links and Search widget', function() {
            ReportServicePage.tableLinksElList.then(function(links) {
                // Check we have the base links and two table links present
                expect(links.length).toBe(5);
                // Check that the app search widget is hidden
                expect(ReportServicePage.searchAppsDivEl.isPresent()).toBeFalsy();
                ReportServicePage.clickAppToggle();
                // Check that the app search widget is visible
                expect(ReportServicePage.searchAppsDivEl.isPresent()).toBeTruthy();
                ReportServicePage.clickAppToggle();
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
         * Test method. The leftNav should shrink responsively across the 4 breakpoints as the browser is re-sized
         */
        it('LeftNav should shrink responsively from xlarge to small breakpoints', function() {
            // Select the table
            ReportServicePage.tableLinksElList.get(3).click().then(function() {
                // Open the reports list
                ReportServicePage.reportHamburgersElList.get(0).click();
                // Select the report
                ReportServicePage.reportLinksElList.get(0).click();
                // Make sure the table report has loaded
                ReportServicePage.waitForElement(ReportServicePage.loadedContentEl).then(function() {
                    NavDimensionsDataProvider().forEach(function(testcase) {
                        // Resize browser at different widths to check responsiveness
                        e2eBase.resizeBrowser(testcase.browserWidth, e2eConsts.DEFAULT_HEIGHT).then(function() {
                            ReportServicePage.assertNavProperties(testcase.breakpointSize, testcase.open, testcase.clientWidth);
                        });
                    });
                    // Reset back to xlarge
                    e2eBase.resizeBrowser(e2eConsts.XLARGE_BP_WIDTH, e2eConsts.DEFAULT_HEIGHT);
                    ReportServicePage.reportsBackLinkEl.click();
                });
            });
        });

        /**
         * Test method. The leftNav should expand responsively across the 4 breakpoints as the browser is re-sized
         */
        it('LeftNav should expand responsively from small to xlarge breakpoints', function() {
            // Select the table
            ReportServicePage.tableLinksElList.get(3).click().then(function() {
                // Open the reports list
                ReportServicePage.reportHamburgersElList.get(0).click();
                // Select the report
                ReportServicePage.reportLinksElList.get(0).click();
                // Make sure the table report has loaded
                ReportServicePage.waitForElement(ReportServicePage.loadedContentEl).then(function() {
                    // Reverse the dataprovider to execute from small to xlarge
                    var reverseArray = NavDimensionsDataProvider().reverse();
                    reverseArray.forEach(function(testcase) {
                        // Resize browser at different widths to check responsiveness
                        e2eBase.resizeBrowser(testcase.browserWidth, e2eConsts.DEFAULT_HEIGHT).then(function() {
                            ReportServicePage.assertNavProperties(testcase.breakpointSize, testcase.open, testcase.clientWidth);
                        });
                    });
                });
            });
        });

        /**
         * Test method.Verify The elements present in leftNav across the 4 breakpoints as the browser is re-sized
         */
        it('Verify leftNav has 3 base links and 2 table links from xlarge to small breakpoints', function() {
            NavDimensionsDataProvider().forEach(function(testcase) {
                // Resize browser at different widths
                e2eBase.resizeBrowser(testcase.browserWidth, e2eConsts.DEFAULT_HEIGHT).then(function(tableLinksElList) {
                    (ReportServicePage.tableLinksElList).then(function(links) {
                        // Check we have the 3 base links and two table links present on left Nav
                        expect(links.length).toBe(5);
                        for (var i = 0; i < links.length; i++) {
                            expect(links[i].isDisplayed()).toBe(true);
                            // Verify elements present on leftNav with right dimensions
                            ReportServicePage.isElementInLeftNav(links[i], testcase.clientWidth);
                        }
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
