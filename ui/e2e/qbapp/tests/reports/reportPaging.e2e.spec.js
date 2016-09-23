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
    var ReportFacetsPage = requirePO('reportFacets');
    var reportServicePage = new ReportServicePage();
    var reportPagingPage = new ReportPagingPage();
    var reportSortingPage = new ReportSortingPage();
    var reportFacetsPage = new ReportFacetsPage();

    // Lodash utility library
    var _ = require('lodash');

    describe('Report Paging Tests SetUp', function() {
        var realmName;
        var realmId;
        var app;
        var recordList;
        var table4NonBuiltInFields;
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
                var table3NonBuiltInFields = e2eBase.tableService.getNonBuiltInFields(app.tables[e2eConsts.TABLE3]);
                //generate less than 20 records into table 3 for negative testing
                // Generate the random records JSON objects into table 3
                var generatedRecords = e2eBase.recordService.generateRecords(table3NonBuiltInFields, 19);
                return e2eBase.recordService.addBulkRecords(app, app.tables[e2eConsts.TABLE3], generatedRecords);
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

                return reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                    e2eBase.sleep(browser.params.smallSleep);
                    done();
                });
            });

            // Verify paging component appears at the top in the report toolbar and in report footer
            it('Verify paging components', function(done) {
                // Verify pagination numbers
                expect(reportPagingPage.pagingToolbarPageNumbers.getText()).toBe('1 - 20');
                // Verify pagination nav buttons
                expect(reportPagingPage.getPagingPrevButtonDisabled(reportPagingPage.pagingToolbarPrevButton)).toBeTruthy();
                expect(reportPagingPage.getPagingNextButtonDisabled(reportPagingPage.pagingToolbarNextButton)).toBeFalsy();

                expect(reportPagingPage.pagingFooterPageNumbers.getText()).toBe('1 - 20');
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
                    expect(reportServicePage.getRecordValues(records[19], 0)).toBe('20');
                    done();
                });
            });

            it('Verify paging nav next button functionality', function(done) {
                reportPagingPage.clickPagingNavButton(reportPagingPage.pagingToolbarNextButton).then(function() {
                    reportServicePage.agGridRecordElList.then(function(records) {
                        expect(records.length).toBeLessThan(11);
                        expect(reportServicePage.getRecordValues(records[0], 0)).toBe('21');
                        expect(reportPagingPage.getPagingNextButtonDisabled(reportPagingPage.pagingFooterNextButton)).toBeTruthy();
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

            it('Negative Test to Verify pagination does not display for records less than 20.', function(done) {
                var reportId;
                //Create a report with FacetFids
                e2eBase.reportService.createReport(app.id, app.tables[e2eConsts.TABLE3].id, null, "Negative Test Report").then(function(repId) {
                    reportId = repId;
                }).then(function() {
                    //Go to report page directly.
                    return RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE3].id, reportId));
                }).then(function() {
                    //verify the original records count
                    return reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                        e2eBase.sleep(browser.params.smallSleep);
                        expect(reportPagingPage.pagingToolbarContainer.isPresent()).toBeFalsy();
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
                    //verify the original records count
                    return reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                        e2eBase.sleep(browser.params.smallSleep);
                        expect(reportServicePage.reportRecordsCount.getText()).toContain('26 records');
                        expect(reportPagingPage.pagingToolbarPageNumbers.getText()).toBe('1 - 20');
                        //Click next button in pagination
                        reportPagingPage.clickPagingNavButton(reportPagingPage.pagingToolbarNextButton).then(function() {
                            reportServicePage.agGridRecordElList.then(function(records) {
                                expect(reportPagingPage.pagingToolbarPageNumbers.getText()).toBe('21 - 26');
                                expect(reportPagingPage.getPagingNextButtonDisabled(reportPagingPage.pagingFooterNextButton)).toBeTruthy();
                                expect(reportPagingPage.getPagingPrevButtonDisabled(reportPagingPage.pagingToolbarPrevButton)).toBeFalsy();
                            });
                        });
                    });
                }).then(function() {
                    var expectedRecords = [];
                    //get the records from UI and verify they are sorted
                    reportServicePage.getRecordValues(reportServicePage.agGridRecordElList).then(function(uiRecords) {
                        for (var i = 0; i < uiRecords.length; i++) {
                            expectedRecords.push(uiRecords[i].replace(/\n/g, ","));
                        }
                        //verify records are in descending order
                        reportSortingPage.verifyRecordsSortOrder(expectedRecords, "desc");
                        done();
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
                                            expect(reportServicePage.reportRecordsCount.getText()).toContain('1 of 41 records');
                                            expect(reportPagingPage.pagingToolbarContainer.isPresent()).toBeFalsy();
                                            done();
                                        } else {
                                            //verify the filtered records count
                                            expect(reportServicePage.reportRecordsCount.getText()).toContain('40 of 41 records');
                                            expect(reportPagingPage.pagingToolbarPageNumbers.getText()).toBe('1 - 20');
                                            //Click next button in pagination
                                            reportPagingPage.clickPagingNavButton(reportPagingPage.pagingToolbarNextButton).then(function() {
                                                reportServicePage.agGridRecordElList.then(function(records) {
                                                    //verify the pagination count after going to next page
                                                    expect(reportServicePage.reportRecordsCount.getText()).toContain('41 records');
                                                    expect(reportPagingPage.pagingToolbarPageNumbers.getText()).toBe('21 - 41');
                                                    expect(reportPagingPage.getPagingNextButtonDisabled(reportPagingPage.pagingFooterNextButton)).toBeTruthy();
                                                    expect(reportPagingPage.getPagingPrevButtonDisabled(reportPagingPage.pagingToolbarPrevButton)).toBeFalsy();
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

            it('Verify pagination for report with search results', function(done) {
                var reportId;
                //Create a report with Fids .
                e2eBase.reportService.createReportWithFids(app.id, app.tables[e2eConsts.TABLE4].id, [6], null, "Test Search Pagination").then(function(repId) {
                    reportId = repId;
                }).then(function() {
                    return RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE4].id, reportId));
                }).then(function() {
                    return reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                        e2eBase.sleep(browser.params.smallSleep);
                        expect(reportServicePage.reportRecordsCount.getText()).toContain('41 records');
                        expect(reportPagingPage.pagingToolbarPageNumbers.getText()).toBe('1 - 20');
                    });
                }).then(function() {
                    //search the report
                    return reportServicePage.waitForElementToBeClickable(reportServicePage.reportFilterSearchBox).then(function() {
                        reportServicePage.reportFilterSearchBox.clear().sendKeys(duplicateTextFieldValue, protractor.Key.ENTER);
                    });
                }).then(function() {
                    return reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                        e2eBase.sleep(browser.params.smallSleep);
                        //verify the search records count
                        expect(reportServicePage.reportRecordsCount.getText()).toContain('40 of 41 records');
                        expect(reportPagingPage.pagingToolbarPageNumbers.getText()).toBe('1 - 20');
                    });
                }).then(function() {
                    //Click next button in pagination
                    reportPagingPage.clickPagingNavButton(reportPagingPage.pagingToolbarNextButton).then(function() {
                        reportServicePage.agGridRecordElList.then(function(records) {
                            //verify the pagination count after going to next page
                            expect(reportServicePage.reportRecordsCount.getText()).toContain('41 records');
                            expect(reportPagingPage.pagingToolbarPageNumbers.getText()).toBe('21 - 41');
                            expect(reportPagingPage.getPagingNextButtonDisabled(reportPagingPage.pagingFooterNextButton)).toBeTruthy();
                            expect(reportPagingPage.getPagingPrevButtonDisabled(reportPagingPage.pagingToolbarPrevButton)).toBeFalsy();
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
    });
}());
