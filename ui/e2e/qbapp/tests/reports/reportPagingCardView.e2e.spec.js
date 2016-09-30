(function() {
    'use strict';

    //Load the page Objects
    var ReportServicePage = requirePO('reportService');
    var RequestAppsPage = requirePO('requestApps');
    var RequestSessionTicketPage = requirePO('requestSessionTicket');
    var ReportCardViewPage = requirePO('reportCardView');
    var ReportSortingPage = requirePO('reportSorting');
    var ReportFacetsPage = requirePO('reportFacets');
    var reportServicePage = new ReportServicePage();
    var reportCardViewPage = new ReportCardViewPage();
    var reportSortingPage = new ReportSortingPage();
    var reportFacetsPage = new ReportFacetsPage();



    // Lodash utility library
    var _ = require('lodash');

    describe('Report Paging card View Tests', function() {

        var realmName;
        var realmId;
        var app;
        var recordList;
        var duplicateTextFieldValue;
        var table4NonBuiltInFields;

        /**
         * Setup method. Generates JSON for an app, a table, a set of records and a report.
         * Then creates them via the REST API.
         * Have to specify the done() callback at the end of the promise chain to let Jasmine know we are done with async calls
         */
        beforeAll(function(done) {
            e2eBase.reportsBasicSetUp(null, e2eConsts.MAX_PAGING_SIZE + 5).then(function(appAndRecords) {
                app = appAndRecords[0];
                recordList = appAndRecords[1];
                //Generate 40 duplicate records into table 4.
                var duplicateRecords = [];
                // Get the appropriate fields out of the Create App response (specifically the created field Ids)
                table4NonBuiltInFields = e2eBase.tableService.getNonBuiltInFields(app.tables[e2eConsts.TABLE4]);
                // Generate the record JSON objects
                var generatedRecords = e2eBase.recordService.generateRecords(table4NonBuiltInFields, 1);
                //Create 40 duplicate records
                var clonedArray = JSON.parse(JSON.stringify(generatedRecords));
                var dupRecord = clonedArray[0];
                for (var i = 0; i < 40; i++) {
                    // Add the new record back in to create
                    duplicateRecords.push(dupRecord);
                }

                //get the duplicate textField value
                dupRecord.forEach(function(field) {
                    if (field.id === 6) {
                        duplicateTextFieldValue = field.value;
                    }
                });
                //Add 60 duplicate records via bulk records API.
                return e2eBase.recordService.addBulkRecords(app, app.tables[e2eConsts.TABLE4], duplicateRecords);
            }).then(function() {
                // Generate the random record JSON objects into table 4
                var generatedRecords = e2eBase.recordService.generateRecords(table4NonBuiltInFields, 1);
                return e2eBase.recordService.addBulkRecords(app, app.tables[e2eConsts.TABLE4], generatedRecords);
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
            reportCardViewPage.clickPagingNavButton(reportCardViewPage.reportFooterNextBtn).then(function() {
                reportCardViewPage.reportCardRows.getText().then(function(records) {
                    expect(records.length).toBeLessThan(11);
                    expect(records[0]).toBe('21');
                    expect(reportCardViewPage.reportHeaderPreviousBtn.isDisplayed()).toBeTruthy();
                    done();
                });
            });
        });

        it('Verify paging nav previous button functionality', function(done) {
            reportCardViewPage.clickPagingNavButton(reportCardViewPage.reportHeaderPreviousBtn).then(function() {
                reportCardViewPage.reportCardRows.getText().then(function(records) {
                    expect(records.length).toBe(e2eConsts.MAX_PAGING_SIZE);
                    expect(records[0]).toBe('1');
                    expect(records[19]).toBe('20');
                    expect(reportCardViewPage.reportFooterNextBtn.isDisplayed()).toBeTruthy();
                    done();
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
                return reportServicePage.waitForElement(reportCardViewPage.reportRecordsCount).then(function() {
                    //verify the header and footer not displayed for records less than 20.
                    expect(reportCardViewPage.reportRecordsCount.getText()).toBe('19 records');
                    expect(reportCardViewPage.reportCardViewFooter.isPresent()).toBeFalsy();
                    expect(reportCardViewPage.reportCardViewHeader.isPresent()).toBeFalsy();
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
            e2eBase.reportService.createReportWithFidsAndSortList(app.id, app.tables[e2eConsts.TABLE1].id, [6], sortList, null, "Report with Fids and SortLists").then(function(repId) {
                reportId = repId;
            }).then(function() {
                //Go to report 2 which has sortFids set.
                return RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, reportId));
            }).then(function() {
                return reportServicePage.waitForElement(reportCardViewPage.loadedContentEl).then(function() {
                    e2eBase.sleep(browser.params.smallSleep);
                    //verify the original records count
                    reportCardViewPage.clickPagingNavButton(reportCardViewPage.reportFooterNextBtn).then(function() {
                        reportCardViewPage.reportCardRows.getText().then(function(records) {
                            expect(records.length).toBe(6);
                            expect(reportCardViewPage.reportHeaderPreviousBtn.isDisplayed()).toBeTruthy();
                        });
                    });
                });
            }).then(function() {
                //get the records from UI and verify they are sorted
                reportCardViewPage.reportCardRowFieldValues.getText().then(function(expectedRecords) {
                    //verify records are in descending order
                    reportSortingPage.verifyRecordsSortOrder(expectedRecords, "desc");
                    done();
                });
            });
        });

        //TODO search on card view gives error report error
        xit('Verify pagination for report with search results', function(done) {
            var reportId;
            //Create a report with Fids .
            e2eBase.reportService.createReportWithFids(app.id, app.tables[e2eConsts.TABLE4].id, [6], null, "Test Search Pagination").then(function(repId) {
                reportId = repId;
            }).then(function() {
                return RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE4].id, reportId));
            }).then(function() {
                return reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                    e2eBase.sleep(browser.params.smallSleep);
                    expect(reportCardViewPage.reportRecordsCount.getText()).toContain('41 records');
                });
            }).then(function() {
                //search the report
                return reportServicePage.waitForElementToBeClickable(reportCardViewPage.reportSearchBtn).then(function() {
                    reportCardViewPage.reportSearchBtn.click();
                    return reportServicePage.waitForElement(reportCardViewPage.reportSearchInput).then(function() {
                        reportCardViewPage.reportSearchInput.clear().sendKeys(duplicateTextFieldValue, protractor.Key.ENTER);
                    });
                });
            }).then(function() {
                return reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                    e2eBase.sleep(browser.params.smallSleep);
                    //verify the search records count
                    expect(reportCardViewPage.reportRecordsCount.getText()).toContain('40 of 41 records');
                    reportCardViewPage.reportCardRows.getText().then(function(uiRecords) {
                        // Check we have max records being displayed
                        expect(uiRecords.length).toBe(e2eConsts.MAX_PAGING_SIZE);
                    });
                });
            }).then(function() {
                //Click next button in pagination
                reportCardViewPage.clickPagingNavButton(reportCardViewPage.reportFooterNextBtn).then(function() {
                    reportCardViewPage.reportCardRows.getText().then(function(records) {
                        expect(records[0]).toBe('21');
                        expect(records[19]).toBe('40');
                        expect(reportCardViewPage.reportFooterNextBtn.isDisplayed()).toBeTruthy();
                        expect(reportCardViewPage.reportHeaderPreviousBtn.isDisplayed()).toBeTruthy();
                        done();
                    });
                });
            });
        });

        it('Verify pagination for report with facets defined', function(done) {
            var reportId;
            //Create a report with FacetFids
            e2eBase.reportService.createReportWithFacets(app.id, app.tables[e2eConsts.TABLE4].id, [6], null, "Test Facets Pagination").then(function(repId) {
                reportId = repId;
            }).then(function() {
                //Go to report page directly.
                return RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE4].id, reportId));
            }).then(function() {
                return reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                    e2eBase.sleep(browser.params.smallSleep);
                    //Select facets and verify pagination count
                    reportFacetsPage.waitForElementToBeClickable(reportFacetsPage.reportFacetFilterBtnCaret).then(function() {
                        reportFacetsPage.reportFacetFilterBtnCaret.click().then(function() {
                            // Select facet group and items
                            reportFacetsPage.selectGroupAndFacetItems("Text Field", [0]).then(function(facetSelections) {
                                // Get facet tokens from the reports toolbar and verify against selected items on reports toolbar
                                reportFacetsPage.reportFacetNameSelections.map(function(tokenName, tokenindex) {
                                    return tokenName.getText();
                                }).then(function(selections) {
                                    if (selections[0] !== duplicateTextFieldValue) {
                                        //verify the filtered records count
                                        expect(reportCardViewPage.reportRecordsCount.getText()).toContain('1 of 41 records');
                                        expect(reportCardViewPage.reportCardViewFooter.isPresent()).toBeFalsy();
                                        expect(reportCardViewPage.reportCardViewHeader.isPresent()).toBeFalsy();
                                        done();
                                    } else {
                                        //verify the filtered records count
                                        expect(reportCardViewPage.reportRecordsCount.getText()).toContain('40 of 41 records');
                                        expect(reportCardViewPage.reportFooterNextBtn.isDisplayed()).toBeTruthy();
                                        //Click next button in pagination
                                        reportCardViewPage.clickPagingNavButton(reportCardViewPage.reportFooterNextBtn).then(function() {
                                            reportCardViewPage.reportCardRows.getText().then(function(records) {
                                                expect(records[0]).toBe('21');
                                                expect(records[19]).toBe('40');
                                                expect(reportCardViewPage.reportFooterNextBtn.isDisplayed()).toBeTruthy();
                                                expect(reportCardViewPage.reportHeaderPreviousBtn.isDisplayed()).toBeTruthy();
                                                done();
                                            });
                                        });
                                    }
                                });
                            });
                        });
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
