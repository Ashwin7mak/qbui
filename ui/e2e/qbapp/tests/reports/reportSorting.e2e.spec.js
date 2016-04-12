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
        var recordList;

        /**
         * Setup method. Generates JSON for an app, a table, a set of records and a report.
         * Then creates them via the REST API.
         * Have to specify the done() callback at the end of the promise chain to let Jasmine know we are done with async calls
         */
        beforeAll(function(done) {
            var tableToFieldToFieldTypeMap = {};
            tableToFieldToFieldTypeMap['table 1'] = {};
            tableToFieldToFieldTypeMap['table 1']['Text'] = {fieldType: consts.SCALAR, dataType: consts.TEXT};
            tableToFieldToFieldTypeMap['table 1']['Numeric'] = {fieldType: consts.SCALAR, dataType: consts.NUMERIC};
            tableToFieldToFieldTypeMap['table 1']['Date'] = {fieldType: consts.SCALAR, dataType: consts.DATE};
            tableToFieldToFieldTypeMap['table 1']['Checkbox'] = {fieldType: consts.SCALAR, dataType: consts.CHECKBOX};
            tableToFieldToFieldTypeMap['table 1']['Date Time'] = {fieldType: consts.SCALAR, dataType: consts.DATE_TIME};
            tableToFieldToFieldTypeMap['table 1']['Email'] = {fieldType: consts.SCALAR, dataType: consts.EMAIL_ADDRESS};

            e2eBase.basicSetup(tableToFieldToFieldTypeMap, 10).then(function(appAndRecords) {
                // Set your global objects to use in the test functions
                app = appAndRecords[0];
                recordList = appAndRecords[1];
            }).then(function() {
                // Generate 1 empty record
                // Get the appropriate fields out of the third table
                var nonBuiltInFields = e2eBase.tableService.getNonBuiltInFields(app.tables[e2eConsts.TABLE1]);
                var generatedEmptyRecords = e2eBase.recordService.generateEmptyRecords(nonBuiltInFields, 1);
                return e2eBase.recordService.addRecords(app, app.tables[e2eConsts.TABLE1], generatedEmptyRecords);
            }).then(function() {
                //Create a report with facets [text field and checkbox field]
                return e2eBase.reportService.createReportWithFacets(app.id, app.tables[e2eConsts.TABLE1].id, [6, 9]);
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

        /**
         * Data Provider for reports sorting Ascending testCases.
         */
        function sortingAscendingTestCases() {
            return [
                {
                    message: 'Verify text sorting',
                    ColumnName: 'Text',
                    ColumnId: 2,
                    ItemText: 'Sort A to Z'
                },
                {
                    message: 'Verify Numeric sorting',
                    ColumnName: 'Numeric',
                    ColumnId: 3,
                    ItemText: 'Sort lowest to highest'
                },
                {
                    message: 'Verify Date sorting',
                    ColumnName: 'Date',
                    ColumnId: 4,
                    ItemText: 'Sort oldest to newest'
                },
                {
                    message: 'Verify Checkbox sorting',
                    ColumnName: 'Checkbox',
                    ColumnId: 5,
                    ItemText: 'Sort uncheck to check'
                },
            ];
        }

        /**
         * Data Provider for reports sorting Descending testCases.
         */
        function sortingDescendingTestCases() {
            return [
                {
                    message: 'Verify text sorting',
                    ColumnName: 'Text',
                    ColumnId: 2,
                    ItemText: 'Sort Z to A'
                },
                {
                    message: 'Verify Numeric sorting',
                    ColumnName: 'Numeric',
                    ColumnId: 3,
                    ItemText: 'Sort highest to lowest'
                },
                {
                    message: 'Verify Date sorting',
                    ColumnName: 'Date',
                    ColumnId: 4,
                    ItemText: 'Sort newest to oldest'
                },
                {
                    message: 'Verify Checkbox sorting',
                    ColumnName: 'Checkbox',
                    ColumnId: 5,
                    ItemText: 'Sort check to uncheck'
                },
            ];
        }

        describe('Report Sorting without Facets', function() {

            beforeAll(function(done) {
                //go to report page directly
                e2eBase.resizeBrowser(e2eConsts.XLARGE_BP_WIDTH, e2eConsts.DEFAULT_HEIGHT).then(function() {
                    RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, '1'));
                    done();
                });
            });

            /**
             * Before each test starts just make sure the report list has loaded
             */
            beforeEach(function(done) {
                reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                    done();
                });
            });

            /*
             * Ascending Testcases
             */
            sortingAscendingTestCases().forEach(function(sortingTestcase) {
                it('Ascending : ' + sortingTestcase.message, function(done) {
                    var actualTableResults;
                    var sortedTableResults;
                    // Get the records from column before sorting
                    reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                        reportSortingPage.getColumnRecords(sortingTestcase.ColumnId).then(function(actualResults) {
                            actualTableResults = actualResults;
                        });
                    }).then(function() {
                        reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                            //open the Column Header PopUp Menu
                            reportSortingPage.openColumnHeaderMenu(sortingTestcase.ColumnName);
                        });
                    }).then(function() {
                        reportSortingPage.waitForElement(element(by.className('ag-menu-list'))).then(function() {
                            //Select the sort order Item to be Ascending (eg:A to Z , small to Large, lower to highest etc)
                            reportSortingPage.selectItems(sortingTestcase.ItemText);
                        });
                    }).then(function() {
                        // Get the records from column after sorting
                        reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                            reportSortingPage.getColumnRecords(sortingTestcase.ColumnId).then(function(sortedResults) {
                                sortedTableResults = sortedResults;
                            });
                        });
                    }).then(function() {
                        //Finally verify both the arrays
                        reportSortingPage.verifyAscending(sortingTestcase.ColumnName, actualTableResults, sortedTableResults);
                        done();
                    });
                });
            });

            /*
             * Descending Testcases
             */
            sortingDescendingTestCases().forEach(function(sortingTestcase) {
                it('Descending : ' + sortingTestcase.message, function(done) {
                    var actualTableResults;
                    var sortedTableResults;
                    // Get the records from column before sorting
                    reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                        reportSortingPage.getColumnRecords(sortingTestcase.ColumnId).then(function(actualResults) {
                            actualTableResults = actualResults;
                        });
                    }).then(function() {
                        reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                            //open the Column Header PopUp Menu
                            reportSortingPage.openColumnHeaderMenu(sortingTestcase.ColumnName);
                        });
                    }).then(function() {
                        reportSortingPage.waitForElement(element(by.className('ag-menu-list'))).then(function() {
                            //Select the sort order Item to be Ascending (eg:A to Z , small to Large etc)
                            reportSortingPage.selectItems(sortingTestcase.ItemText);
                        });
                    }).then(function() {
                        // Get the records from column after sorting
                        reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                            reportSortingPage.getColumnRecords(sortingTestcase.ColumnId).then(function(sortedResults) {
                                sortedTableResults = sortedResults;
                            });
                        });
                    }).then(function() {
                        //Finally verify both the arrays
                        reportSortingPage.verifyDescending(sortingTestcase.ColumnName, actualTableResults, sortedTableResults);
                    }).then(function() {
                        //finally clean both arrays
                        actualTableResults = [];
                        sortedTableResults = [];
                        done();
                    });
                });
            });
        });

        describe('Report Sorting with Facets', function() {

            beforeAll(function(done) {
                //go to report page directly
                e2eBase.resizeBrowser(e2eConsts.XLARGE_BP_WIDTH, e2eConsts.DEFAULT_HEIGHT).then(function() {
                    RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, '2'));
                    done();
                });
            });

            /**
             * Before each test starts just make sure the report list has loaded
             */
            beforeEach(function(done) {
                reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                    done();
                });
            });

            /*
             * Ascending Testcases
             */
            sortingAscendingTestCases().forEach(function(sortingTestcase) {
                it('Ascending : ' + sortingTestcase.message, function(done) {
                    var actualTableResults;
                    var sortedTableResults;
                    // Get the records from column before sorting
                    reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                        reportSortingPage.getColumnRecords(sortingTestcase.ColumnId).then(function(actualResults) {
                            actualTableResults = actualResults;
                        });
                    }).then(function() {
                        reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                            //open the Column Header PopUp Menu
                            reportSortingPage.openColumnHeaderMenu(sortingTestcase.ColumnName);
                        });
                    }).then(function() {
                        reportSortingPage.waitForElement(element(by.className('ag-menu-list'))).then(function() {
                            //Select the sort order Item to be Ascending (eg:A to Z , small to Large, lower to highest etc)
                            reportSortingPage.selectItems(sortingTestcase.ItemText);
                        });
                    }).then(function() {
                        // Get the records from column after sorting
                        reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                            reportSortingPage.getColumnRecords(sortingTestcase.ColumnId).then(function(sortedResults) {
                                sortedTableResults = sortedResults;
                            });
                        });
                    }).then(function() {
                        //Finally verify both the arrays
                        reportSortingPage.verifyAscending(sortingTestcase.ColumnName, actualTableResults, sortedTableResults);
                    }).then(function() {
                        //finally clean both arrays
                        actualTableResults = [];
                        sortedTableResults = [];
                        done();
                    });
                });
            });

            /*
             * Descending Testcases
             */
            sortingDescendingTestCases().forEach(function(sortingTestcase) {
                it('Descending : ' + sortingTestcase.message, function(done) {
                    var actualTableResults;
                    var sortedTableResults;
                    // Get the records from column before sorting
                    reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                        reportSortingPage.getColumnRecords(sortingTestcase.ColumnId).then(function(actualResults) {
                            actualTableResults = actualResults;
                        });
                    }).then(function() {
                        reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                            //open the Column Header PopUp Menu
                            reportSortingPage.openColumnHeaderMenu(sortingTestcase.ColumnName);
                        });
                    }).then(function() {
                        reportSortingPage.waitForElement(element(by.className('ag-menu-list'))).then(function() {
                            //Select the sort order Item to be Ascending (eg:A to Z , small to Large etc)
                            reportSortingPage.selectItems(sortingTestcase.ItemText);
                        });
                    }).then(function() {
                        //get the column records after sorting
                        reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                            reportSortingPage.getColumnRecords(sortingTestcase.ColumnId).then(function(sortedResults) {
                                sortedTableResults = sortedResults;
                            });
                        });
                    }).then(function() {
                        //Finally verify both the arrays
                        reportSortingPage.verifyDescending(sortingTestcase.ColumnName, actualTableResults, sortedTableResults);
                    }).then(function() {
                        //finally clean both arrays
                        actualTableResults = [];
                        sortedTableResults = [];
                        done();
                    });
                });
            });
        });

        //TODO add a negative testcase for other breakpoints once Claire completes small breakpoint stuff

        /**
         * After all tests are done, run the cleanup function in the base class
         */
        afterAll(function(done) {
            e2eBase.cleanup(done);
        });
    });
}());
