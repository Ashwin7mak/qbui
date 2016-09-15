(function() {
    'use strict';

    //Load the page Objects
    var ReportServicePage = requirePO('reportService');
    var RequestAppsPage = requirePO('requestApps');
    var RequestSessionTicketPage = requirePO('requestSessionTicket');
    var ReportSortingPage = requirePO('reportSorting');
    var reportServicePage = new ReportServicePage();
    var reportSortingPage = new ReportSortingPage();


    describe('Report Sorting', function() {
        var realmName;
        var realmId;
        var app;
        var records;
        var r;
        var keyValue = [];
        var actualRecords = [];
        var sortedTableResults = [];
        var sortedExpectedRecords = [];

        /**
         * Setup method. Generates JSON for an app, a table, a set of records and a report.
         * Then creates them via the REST API.
         * Have to specify the done() callback at the end of the promise chain to let Jasmine know we are done with async calls
         */

        /**
         * Setup method. Generates JSON for an app, a table with different fields, and 10 records with different field types.
         */
        beforeAll(function(done) {
            //Create a app, table and report
            e2eBase.reportsBasicSetUp().then(function(appAndRecords) {
                // Set your global objects to use in the test functions
                app = appAndRecords[0];
                records = appAndRecords[1];
                actualRecords = records;
            }).then(function() {
                // Generate 1 empty record
                // Get the appropriate fields out of the table 1
                var nonBuiltInFields = e2eBase.tableService.getNonBuiltInFields(app.tables[e2eConsts.TABLE1]);
                var generatedEmptyRecords = e2eBase.recordService.generateEmptyRecords(nonBuiltInFields, 1);
                var clonedArray = JSON.parse(JSON.stringify(generatedEmptyRecords));
                var emptyRecord = clonedArray[0];
                emptyRecord.forEach(function(field) {
                    if (field.id === 15) {
                        field.value = 'false';
                    }
                });
                actualRecords.push(emptyRecord);
                return e2eBase.recordService.addRecords(app, app.tables[e2eConsts.TABLE1], generatedEmptyRecords);
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

        beforeEach(function(done) {
            ////delete a report
            //var reportsEndpoint = e2eBase.recordBase.apiBase.resolveReportsEndpoint(app.id, app.tables[e2eConsts.TABLE1].id);
            //e2eBase.recordBase.apiBase.executeRequest(reportsEndpoint + r, 'DELETE');
            keyValue = [];
            sortedTableResults = [];
            sortedExpectedRecords = [];
            done();
        });


        /**
         * Function that will get the sorted records from the UI dataGrid.
         *
         */
        var getSortedTableResults = function() {
            //Load the report in the UI
            reportServicePage.waitForElement(reportServicePage.griddleWrapperEl).then(function() {
                //sleep for loading of table to finish
                e2eBase.sleep(browser.params.smallSleep);
                reportServicePage.waitForElement(reportServicePage.agGridContainerEl).then(function() {
                    reportServicePage.getRecordValues(reportServicePage.agGridRecordElList).then(function(uiRecords) {
                        for (var i = 0; i < uiRecords.length; i++) {
                            sortedTableResults.push(uiRecords[i].replace(/\n/g, ","));
                        }
                    });
                });
            });
        };

        /**
         * Function that will sort the records using lodash in asked order
         *@parms Fids, sortFids and sortOrder
         */
        var getExpectedSortedResultsUsingLoDashSort = function(Fids, sortFids, sortOrder) {
            var sortedRecords;
            // Sort the actual records using lodash _.orderby
            sortedRecords = reportSortingPage.sortRecords(actualRecords, sortFids, sortOrder);
            for (var i = 0; i < sortedRecords.length; i++) {
                for (var j = 0; j < Fids.length; j++) {
                    keyValue.push(reportSortingPage.getSortValue(sortedRecords[i], Fids[j]));
                }
            }
            sortedExpectedRecords.push(keyValue.join());
        };

        /**
         * Function that will verify the actual versus expected sorted records
         *@parms actualSortedResults, expectedsortedResults
         */
        var verifyResults = function(actualSortedResults, expectedsortedResults) {
            expect(actualSortedResults.join()).toEqual(expectedsortedResults.join());
        };


        /**
         * Data Provider for reports sorting testCases.
         * ['Record ID#', 'Text Field', 'Numeric Field', 'Numeric Currency Field', 'Numeric Percent Field', 'Numeric Rating Field',
         'Date Field', 'Date Time Field', 'Time of Day Field', 'Duration Field', 'Checkbox Field', 'Phone Number Field',
         'Email Address Field', 'URL Field'],
         */
        function sortingTestCases() {
            return [
                {
                    //the below are for UI calls
                    message: 'Sort by Text field in ascending order',
                    ColumnName: ['Text Field'],
                    SortOrderItem: ['Sort A to Z'],
                    //the below are for backend calls
                    Fids: [6],
                    sortFids: [function(row) {return reportSortingPage.getSortValue(row, 6);}],
                    sortOrder: ['asc'],
                    sortList: [
                        {
                            "fieldId": 6,
                            "sortOrder": "asc",
                            "groupType": null
                        }
                    ]
                },
                {
                    //the below are for UI calls
                    message: 'Sort by Text field in asc order then by Numeric in desc',
                    ColumnName: ['Text Field', 'Numeric Field'],
                    SortOrderItem: ['Sort A to Z', 'Sort highest to lowest'],
                    //the below are for backend calls
                    Fids: [6, 7],
                    sortFids: [function(row) {return reportSortingPage.getSortValue(row, 6);}, function(row) {return reportSortingPage.getSortValue(row, 7);}],
                    sortOrder: ['asc', 'desc'],
                    sortList: [
                        {
                            "fieldId": 6,
                            "sortOrder": "asc",
                            "groupType": null
                        },
                        {
                            "fieldId": 7,
                            "sortOrder": "desc",
                            "groupType": null
                        }
                    ]
                },
            ];
        }

        sortingTestCases().forEach(function(testcase) {
            it(testcase.message + ' for report without facets', function(done) {
                //Create a report with Fids and sortFids.
                return e2eBase.reportService.createReportWithFidsAndSortList(app.id, app.tables[e2eConsts.TABLE1].id, testcase.Fids, testcase.sortList, null, testcase.message).then(function(reportId) {
                    r = reportId;
                }).then(function() {
                    getExpectedSortedResultsUsingLoDashSort(testcase.Fids, testcase.sortFids, testcase.sortOrder);
                }).then(function() {
                    //Go to created sorted report page directly.
                    return RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, r));
                }).then(function() {
                    return reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                        e2eBase.sleep(browser.params.smallSleep);
                        //Verify table sorted results on UI with lodash sorted expected results.
                        getSortedTableResults();
                    });
                }).then(function() {
                    verifyResults(sortedTableResults, sortedExpectedRecords);
                    done();
                }).catch(function(error) {
                    // Global catch that will grab any errors from chain above
                    done.fail(+error.message);
                });
            });
        });

        it("Verify Text asc sort then by CheckBox Desc sort for report with Facets", function(done) {
            var Fids = [6, 15];
            var facetFids = [6, 15];
            var sortFids = [function(row) {return reportSortingPage.getSortValue(row, 6);}, function(row) {return reportSortingPage.getSortValue(row, 15);}];
            var sortList = [
                {
                    "fieldId": 6,
                    "sortOrder": "asc",
                    "groupType": null
                },
                {
                    "fieldId": 15,
                    "sortOrder": "desc",
                    "groupType": null
                }
            ];
            //Create a report with Fids, FacetFids and sortFids
            return e2eBase.reportService.createReportWithFidsAndFacetsAndSortLists(app.id, app.tables[e2eConsts.TABLE1].id, Fids, facetFids, sortList).then(function(reportId) {
                r = reportId;
            }).then(function() {
                getExpectedSortedResultsUsingLoDashSort(Fids, sortFids, ['asc', 'desc']);
            }).then(function() {
                //Go to created sorted report page directly.
                return RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, r));
            }).then(function() {
                return reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                    e2eBase.sleep(browser.params.smallSleep);
                    //Verify table sorted results on UI with lodash sorted expected results.
                    getSortedTableResults();
                });
            }).then(function() {
                verifyResults(sortedTableResults, sortedExpectedRecords);
                done();
            }).catch(function(error) {
                // Global catch that will grab any errors from chain above
                done.fail(+error.message);
            });
        });

        it("Verify Sorting and Checkmark beside selected Item for report without sortFids or facets", function(done) {
            //Create a report with just Fids
            return e2eBase.reportService.createReportWithFids(app.id, app.tables[e2eConsts.TABLE1].id, [6], null, 'Report with just Fids').then(function(reportId) {
                r = reportId;
            }).then(function() {
                //Go to created sorted report page directly.
                return RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, r));
            }).then(function() {
                //select the item from drop down menu
                return reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                    e2eBase.sleep(browser.params.smallSleep);
                    reportSortingPage.expandColumnHeaderMenuAndSelectItem("Text Field", "Sort A to Z");
                });
            }).then(function() {
                //finally verify item got selected
                return reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                    reportSortingPage.expandColumnHeaderMenuAndVerifySelectedItem("Text Field", "Sort A to Z");
                });
            }).then(function() {
                getExpectedSortedResultsUsingLoDashSort([6], [function(row) {return reportSortingPage.getSortValue(row, 6);}], ['asc']);
            }).then(function() {
                return reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                    e2eBase.sleep(browser.params.smallSleep);
                    //Verify table sorted results on UI with lodash sorted expected results.
                    getSortedTableResults();
                });
            }).then(function() {
                verifyResults(sortedTableResults, sortedExpectedRecords);
                done();
            }).catch(function(error) {
                // Global catch that will grab any errors from chain above
                done.fail(+error.message);
            });
        });

        it("Verify Checkmark appears beside sorting menuItem for report with sortFids already set.", function(done) {
            var sortList = [
                {
                    "fieldId": 11,
                    "sortOrder": "desc",
                    "groupType": null
                },
            ];
            //Create a report with Fids and sortFids.
            return e2eBase.reportService.createReportWithFidsAndSortList(app.id, app.tables[e2eConsts.TABLE1].id, [6, 11], sortList, null, "Verify Item Selected Report").then(function(reportId) {
                r = reportId;
            }).then(function() {
                //Go to report 2 which has sortFids set.
                return RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, r));
            }).then(function() {
                return reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                    e2eBase.sleep(browser.params.smallSleep);
                    //finally verify item got selected
                    reportSortingPage.expandColumnHeaderMenuAndVerifySelectedItem("Date Field", "Sort newest to oldest");
                    done();
                });
            }).catch(function(error) {
                // Global catch that will grab any errors from chain above
                done.fail(+error.message);
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
