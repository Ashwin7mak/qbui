(function() {
    'use strict';

    //Load the page Objects
    var ReportServicePage = requirePO('reportService');
    var RequestAppsPage = requirePO('requestApps');
    var RequestSessionTicketPage = requirePO('requestSessionTicket');
    var ReportCardViewPage = requirePO('reportCardView');
    var reportServicePage = new ReportServicePage();
    var reportCardViewPage = new ReportCardViewPage();



    // Lodash utility library
    var _ = require('lodash');

    describe('Report Paging card View Tests', function() {

        var realmName;
        var realmId;
        var app;
        var recordList;
        var duplicateTextFieldValue;

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
                //generate less than 20 records into table 3 for negative testing
                // Get the appropriate fields out of the Create App response (specifically the created field Ids)
                var table3NonBuiltInFields = e2eBase.tableService.getNonBuiltInFields(app.tables[e2eConsts.TABLE3]);
                // Generate the random records JSON objects into table 3
                var generatedRecords = e2eBase.recordService.generateRecords(table3NonBuiltInFields, 19);
                return e2eBase.recordService.addBulkRecords(app, app.tables[e2eConsts.TABLE3], generatedRecords);
            }).then(function() {
                // Get a session ticket for that subdomain and realmId (stores it in the browser)
                realmName = e2eBase.recordBase.apiBase.realm.subdomain;
                realmId = e2eBase.recordBase.apiBase.realm.id;
                return RequestSessionTicketPage.get(e2eBase.getSessionTicketRequestEndpoint(realmName, realmId, e2eBase.ticketEndpoint));
            }).then(function() {
                //// Load the requestAppsPage (shows a list of all the apps and tables in a realm)
                //return RequestAppsPage.get(e2eBase.getRequestAppsPageEndpoint(realmName));
                // Go to report page directly
                return RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, "1"));
            }).then(function() {
                return reportServicePage.waitForElement(reportCardViewPage.loadedContentEl).then(function() {
                    e2eBase.sleep(browser.params.smallSleep);
                    done();
                });
            });
        });

        //Set the browser size to card View before running tests
        beforeAll(function(done) {
            return e2eBase.resizeBrowser(e2eConsts.SMALL_BP_WIDTH, e2eConsts.DEFAULT_HEIGHT).then(function() {
                e2eBase.sleep(browser.params.smallSleep);
                return reportServicePage.waitForElement(reportCardViewPage.loadedContentEl).then(function() {
                    done();
                });
            });
        });

        it('Verify number of records per page in report and record IDs', function(done) {
            reportCardViewPage.reportCardRows.getText().then(function(uiRecords) {
                expect(reportCardViewPage.reportRecordsCount.getText()).toBe('26 records');
                // Check we have max records being displayed
                expect(uiRecords.length).toBe(e2eConsts.MAX_PAGING_SIZE);
                // Check the record ID of first record
                expect(uiRecords[0]).toBe('1');
                // Check the record ID last record
                expect(uiRecords[19]).toBe('20');
                done();
            });
        });

        it('Verify paging nav next button functionality', function(done) {
            reportCardViewPage.reportFooterNextBtn.click().then(function() {
                reportServicePage.waitForElement(reportCardViewPage.reportRecordsCount).then(function() {
                    e2eBase.sleep(browser.params.smallSleep);
                    reportCardViewPage.reportCardRows.getText().then(function(records) {
                        expect(records.length).toBeLessThan(11);
                        expect(records[0]).toBe('21');
                        expect(reportCardViewPage.reportHeaderPreviousBtn.isDisplayed()).toBeTruthy();
                        done();
                    });
                });
            });
        });

        it('Verify paging nav previous button functionality', function(done) {
            reportCardViewPage.reportHeaderPreviousBtn.click().then(function() {
                reportServicePage.waitForElement(reportCardViewPage.reportRecordsCount).then(function() {
                    e2eBase.sleep(browser.params.smallSleep);
                    reportCardViewPage.reportCardRows.getText().then(function(records) {
                        expect(records.length).toBe(e2eConsts.MAX_PAGING_SIZE);
                        expect(records[0]).toBe('1');
                        expect(records[19]).toBe('20');
                        expect(reportCardViewPage.reportFooterNextBtn.isDisplayed()).toBeTruthy();
                        done();
                    });
                });
            });
        });

        it('Negative Test to Verify pagination does not display for records less than 20.', function(done) {
            var reportId;
            //Create a report with FacetFids
            e2eBase.reportService.createReport(app.id, app.tables[e2eConsts.TABLE3].id, null, "Negative Test Report").then(function(repId) {
                reportId = repId;
            }).then(function() {
                //Go to report page directly.
                return RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE3].id, reportId));
            }).then(function() {
                //verify the header and footer not displayed for records less than 20.
                reportServicePage.waitForElement(reportCardViewPage.reportRecordsCount).then(function() {
                    e2eBase.sleep(browser.params.smallSleep);
                    expect(reportCardViewPage.reportRecordsCount.getText()).toBe('19 records');
                    expect(reportCardViewPage.reportCardViewFooter.isPresent()).toBeFalsy();
                    expect(reportCardViewPage.reportCardViewHeader.isPresent()).toBeFalsy();
                    done();
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
