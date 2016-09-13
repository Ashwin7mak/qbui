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
    var reportServicePage = new ReportServicePage();
    var reportPagingPage = new ReportPagingPage();

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
            var nonBuiltInFields;
            e2eBase.reportsBasicSetUp(null, 55).then(function(appAndRecords) {
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
            }).catch(function(error) {
                // Global catch that will grab any errors from chain above
                // Will appropriately fail the beforeAll method so other tests won't run
                done.fail('Error during test setup beforeAll: ' + error.message);
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

            //beforeEach(function(done) {
            //    e2eRetry.ignoring().run(function() {
            //        return reportServicePage.waitForElement(reportServicePage.agGridBodyEl);
            //    }).then(function() {
            //        done();
            //    });
            //});

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

            it('Verify number of records per page in report and record IDs 1-50', function(done) {
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

            it('Verify paging nav next functionality', function(done) {
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

            it('Verify paging nav prev functionality', function(done) {
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
        });
        /**
         * After all tests are done, run the cleanup function in the base class
         */
        afterAll(function(done) {
            e2eBase.cleanup(done);
        });
    });
}());
