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

    describe('Table Report Top Nav Tests', function() {
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
        beforeEach(function(done) {
            reportServicePage.waitForElement(reportServicePage.topNavDivEl).then(function() {
                done();
            });
        });

        function topNavDataProvider() {
            return [
                {
                    msg: 'X-large breakpoint: Top Nav actions show text and icon',
                    clientWidth: e2eConsts.XLARGE_BP_WIDTH,
                    textVisibility: true,
                    iconVisibility: true
                },
                {
                    msg: 'large breakpoint: Top Nav actions show text and icon',
                    clientWidth: e2eConsts.LARGE_BP_WIDTH,
                    textVisibility: true,
                    iconVisibility: true
                },
                {
                    msg: 'medium breakpoint: Top Nav actions show only icon',
                    clientWidth: e2eConsts.MEDIUM_BP_WIDTH,
                    textVisibility: false,
                    iconVisibility: true
                },
                {
                    msg: 'small breakpoint: Top Nav actions show only icon',
                    clientWidth: e2eConsts.SMALL_BP_WIDTH,
                    textVisibility: false,
                    iconVisibility: true
                },
            ];
        }


        /**
         * Test method to verify all top Nav elements
         */

        topNavDataProvider().forEach(function(testcase) {
            it(testcase.msg, function(done) {
                e2eBase.resizeBrowser(testcase.clientWidth, e2eConsts.DEFAULT_HEIGHT).then(function() {
                    reportServicePage.waitForElement(reportServicePage.topNavLeftDivEl).then(function() {
                            //Verify Left Icon link display, no text display and location of icon on topNav
                        reportServicePage.assertTopLeftNavElements(testcase.iconVisibility, testcase.textVisibility);
                    });

                        // Verify harmony icons display , no text display and location of icons on top Nav
                    reportServicePage.waitForElement(reportServicePage.topNavCenterDivEl).then(function() {
                        reportServicePage.assertTopCenterNavElements(testcase.iconVisibility, testcase.textVisibility);
                    });

                        //Verify right global icons display, text display and location on topNav
                    reportServicePage.waitForElement(reportServicePage.topNavRightDivEl).then(function() {

                        if (testcase.clientWidth === e2eConsts.XLARGE_BP_WIDTH || testcase.clientWidth === e2eConsts.LARGE_BP_WIDTH) {
                                //very text and icon visible for large and x-large breakpoints
                                reportServicePage.assertTopRightNavElements(testcase.iconVisibility);
                                expect(reportServicePage.getGlobalNavTextEl(reportServicePage.topNavUserGlobActEl).getText()).toBe('User');
                                expect(reportServicePage.getGlobalNavTextEl(reportServicePage.topNavHelpGlobActEl).getText()).toBe('Help');
                            }

                        if (testcase.clientWidth === e2eConsts.MEDIUM_BP_WIDTH || testcase.clientWidth === e2eConsts.SMALL_BP_WIDTH) {
                                //verify icon and text hidden for medium and small breakpoints
                                reportServicePage.assertTopRightNavElements(false);
                                expect(reportServicePage.getGlobalNavTextEl(reportServicePage.topNavUserGlobActEl).getText()).toBe('');
                                expect(reportServicePage.getGlobalNavTextEl(reportServicePage.topNavHelpGlobActEl).getText()).toBe('');
                            }

                    });

                        //Verify the drop down toggle icon present on all breakpoints
                    reportServicePage.waitForElement(reportServicePage.topNavCenterDivEl).then(function() {
                        reportServicePage.assertTopNavDropDown(testcase.iconVisibility, false);
                    });

                });
                done();
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
