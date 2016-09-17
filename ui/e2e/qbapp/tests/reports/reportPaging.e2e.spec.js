/**
 * E2E Paging tests on the Reports page
 * Created by klabak on 10/08/06
 */
(function() {
    'use strict';

    //Load the page Objects
    var ReportServicePage = requirePO('reportService');
    var RequestAppsPage = requirePO('requestApps');
    var RequestSessionTicketPage = requirePO('requestSessionTicket');
    var ReportPagingPage = requirePO('reportPaging');
    var ReportSortingPage = requirePO('reportSorting');
    var reportServicePage = new ReportServicePage();
    var reportPagingPage = new ReportPagingPage();
    var reportSortingPage = new ReportSortingPage();

    // Lodash utility library
    var _ = require('lodash');

    describe('Report Paging Test Setup', function() {
        var realmName;
        var realmId;
        var app;
        var recordList;

        /**
         * Setup method. Generates JSON for an app, a table, a set of records and a report.
         * Then creates them via the REST API.
         * Have to specify the done() callback at the end of the promise chain to let Jasmine know we are done with async calls
         */
        beforeAll(function(done) {
            e2eBase.reportsBasicSetUp(null, e2eConsts.MAX_PAGING_SIZE + 5).then(function(appAndRecords) {
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
                reportServicePage.waitForElement(reportServicePage.appsListDivEl).then(function() {
                    done();
                });
            });

        });

        /*
         * Paging Test Cases
         */
        describe('Report Paging Tests', function() {
            /**
             * Before each test starts just make sure the table list div has loaded
             */
            beforeAll(function(done) {
                // Go to report page directly
                RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, "1"));

                // Safari is being flaky waiting for this element so retry
                e2eRetry.ignoring().run(function() {
                    return reportServicePage.waitForElement(reportServicePage.agGridContainerEl);
                }).then(function() {
                    done();
                });
            });

            // Verify paging component appears at the top in the report toolbar and in report footer
            it('Verify paging components', function(done) {
                // Verify pagination numbers
                expect(reportPagingPage.pagingToolbarPageNumbers.getText()).toBe('1 - 50');
                // Verify pagination nav buttons
                expect(reportPagingPage.getPagingPrevButtonDisabled(reportPagingPage.pagingToolbarPrevButton)).toBeTruthy();
                expect(reportPagingPage.getPagingNextButtonDisabled(reportPagingPage.pagingToolbarNextButton)).toBeFalsy();

                expect(reportPagingPage.pagingFooterPageNumbers.getText()).toBe('1 - 50');
                expect(reportPagingPage.getPagingPrevButtonDisabled(reportPagingPage.pagingFooterPrevButton)).toBeTruthy();
                expect(reportPagingPage.getPagingNextButtonDisabled(reportPagingPage.pagingFooterNextButton)).toBeFalsy();
                done();
            });

            it('Verify number of records per page in report and record IDs', function(done) {
                reportServicePage.agGridRecordElList.then(function(records) {
                    // Check we have max records being displayed
                    expect(records.length).toBe(e2eConsts.MAX_PAGING_SIZE);
                    // Check the record ID of first record
                    expect(reportServicePage.getRecordValues(records[0], 0)).toBe('1');
                    // Check the record ID last record
                    expect(reportServicePage.getRecordValues(records[49], 0)).toBe('50');
                    done();
                });
            });

            it('Verify paging nav next button functionality', function(done) {
                reportPagingPage.clickPagingNavButton(reportPagingPage.pagingToolbarNextButton).then(function() {
                    reportServicePage.agGridRecordElList.then(function(records) {
                        expect(records.length).toBeLessThan(11);
                        expect(reportServicePage.getRecordValues(records[0], 0)).toBe('51');
                        //TODO: Bug next button is not being disabled in footer
                        //expect(reportPagingPage.getPagingNextButtonDisabled(reportPagingPage.pagingFooterNextButton)).toBeTruthy();
                        expect(reportPagingPage.getPagingPrevButtonDisabled(reportPagingPage.pagingToolbarPrevButton)).toBeFalsy();
                        done();
                    });
                });
            });

            it('Verify paging nav previous button functionality', function(done) {
                reportPagingPage.clickPagingNavButton(reportPagingPage.pagingFooterPrevButton).then(function() {
                    reportServicePage.agGridRecordElList.then(function(records) {
                        expect(records.length).toBe(e2eConsts.MAX_PAGING_SIZE);
                        expect(reportServicePage.getRecordValues(records[0], 0)).toBe('1');
                        expect(reportPagingPage.getPagingNextButtonDisabled(reportPagingPage.pagingToolbarNextButton)).toBeFalsy();
                        expect(reportPagingPage.getPagingPrevButtonDisabled(reportPagingPage.pagingFooterPrevButton)).toBeTruthy();
                        done();
                    });
                });
            });

            it('Verify pagination for report with sorting defined', function(done) {
                var reportId;
                var sortList = [
                    {
                        "fieldId": 6,
                        "sortOrder": "desc",
                        "groupType": null
                    },
                ];
                //Create a report with Fids and sortFids.
                e2eBase.reportService.createReportWithFidsAndSortList(app.id, app.tables[e2eConsts.TABLE1].id, [6], sortList, null, "Verify Item Selected Report").then(function(repId) {
                    reportId = repId;
                }).then(function() {
                    //Go to report 2 which has sortFids set.
                    return RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, reportId));
                }).then(function() {
                    return reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                        e2eBase.sleep(browser.params.smallSleep);
                        //Click next button in pagination
                        reportPagingPage.clickPagingNavButton(reportPagingPage.pagingToolbarNextButton).then(function() {
                            reportServicePage.agGridRecordElList.then(function(records) {
                                expect(reportPagingPage.pagingToolbarPageNumbers.getText()).toBe('51 - 56');
                                //TODO: Bug next button is not being disabled in footer
                                //expect(reportPagingPage.getPagingNextButtonDisabled(reportPagingPage.pagingFooterNextButton)).toBeTruthy();
                                expect(reportPagingPage.getPagingPrevButtonDisabled(reportPagingPage.pagingToolbarPrevButton)).toBeFalsy();
                            });
                        });
                    });
                }).then(function() {
                    //Verify sorting item is selected is column header
                    return reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                        e2eBase.sleep(browser.params.smallSleep);
                        //finally verify item got selected
                        reportSortingPage.expandColumnHeaderMenuAndVerifySelectedItem("Text Field", "Sort Z to A");
                    });
                }).then(function() {
                    var expectedRecords = [];
                    //get the records from UI
                    reportServicePage.getRecordValues(reportServicePage.agGridRecordElList).then(function(uiRecords) {
                        for (var i = 0; i < uiRecords.length; i++) {
                            expectedRecords.push(uiRecords[i].replace(/\n/g, ","));
                        }
                        //verify records are in descending order
                        _.every(expectedRecords, function(value, index, array) {
                            // either it is the first element, or otherwise this element should
                            // not be greater than the previous element.
                            // spec requires string conversion
                            return index === 0 || String(array[index - 1]) >= String(value);
                        });
                        done();
                    });
                });
            });


            //TODO: Should add a test for counting records text to appear (need to fix bulk add first most likely)
        });

        /**
         * After all tests are done, run the cleanup function in the base class
         */
        afterAll(function(done) {
            e2eBase.cleanup(done);
        });
    });
}());
