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
            //Create a app, table and report
            e2eBase.reportsBasicSetUp().then(function(appAndRecords) {
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
                return e2eBase.reportService.createReportWithFacets(app.id, app.tables[e2eConsts.TABLE1].id, [6, 15]);
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
         * ['Record ID#', 'Text Field', 'Numeric Field', 'Numeric Currency Field', 'Numeric Percent Field', 'Numeric Rating Field',
         'Date Field', 'Date Time Field', 'Time of Day Field', 'Duration Field', 'Checkbox Field', 'Phone Number Field',
         'Email Address Field', 'URL Field'],
         */
        function sortingTestCases() {
            return [
                {
                    message: 'Text Field',
                    ColumnName: 'Text Field',
                    ColumnId: 2,
                    AscItemText: 'Sort A to Z',
                    DescItemText:'Sort Z to A'

                },
                {
                    message: 'Numeric Field',
                    ColumnName: 'Numeric Field',
                    ColumnId: 3,
                    AscItemText:'Sort lowest to highest',
                    DescItemText: 'Sort highest to lowest'
                },
                {
                    message: 'Numeric Currency Field',
                    ColumnName: 'Numeric Currency Field',
                    ColumnId: 4,
                    AscItemText: 'Sort lowest to highest',
                    DescItemText: 'Sort highest to lowest'
                },
                {
                    message: 'Numeric Percent Field',
                    ColumnName: 'Numeric Percent Field',
                    ColumnId: 5,
                    AscItemText: 'Sort lowest to highest',
                    DescItemText: 'Sort highest to lowest'
                },
                {
                    message: 'Numeric Rating Field',
                    ColumnName: 'Numeric Rating Field',
                    ColumnId: 6,
                    AscItemText: 'Sort lowest to highest',
                    DescItemText: 'Sort highest to lowest'
                },
                {
                    message: 'Date Field',
                    ColumnName: 'Date Field',
                    ColumnId: 7,
                    AscItemText: 'Sort oldest to newest',
                    DescItemText: 'Sort newest to oldest'
                },
                // TODO: UI is not currently displaying the full year on the date so breaks sorting in the tests
                //{
                //    message: 'Date Time Field',
                //    ColumnName: 'Date Time Field',
                //    ColumnId: 8,
                //    AscItemText: 'Sort oldest to newest',
                //    DescItemText: 'Sort newest to oldest'
                //},
                {
                    message: 'Duration Field',
                    ColumnName: 'Duration Field',
                    ColumnId: 10,
                    AscItemText: 'Sort lowest to highest',
                    DescItemText: 'Sort highest to lowest'
                },
                {
                    message: 'Checkbox Field',
                    ColumnName: 'Checkbox Field',
                    ColumnId: 11,
                    AscItemText: 'Sort unchecked to checked',
                    DescItemText:'Sort checked to unchecked'
                },
                {
                    message: 'Phone Number Field',
                    ColumnName: 'Phone Number Field',
                    ColumnId: 12,
                    AscItemText: 'Sort lowest to highest',
                    DescItemText: 'Sort highest to lowest'
                },
                {
                    message: 'Email Address Field',
                    ColumnName: 'Email Address Field',
                    ColumnId: 13,
                    AscItemText: 'Sort A to Z',
                    DescItemText:'Sort Z to A'
                },
                {
                    message: 'URL Text Field',
                    ColumnName: 'URL Field',
                    ColumnId: 14,
                    AscItemText: 'Sort A to Z',
                    DescItemText:'Sort Z to A'
                }
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
            // Grab a random test case from the data provider
            var sortingTestcase = sortingTestCases()[Math.floor(Math.random() * sortingTestCases().length)];
            it('Ascending : ' + sortingTestcase.message, function(done) {
                var actualTableResults;
                var sortedTableResults;
                // Get the records from column before sorting
                reportSortingPage.getColumnRecords(sortingTestcase.ColumnId).then(function(actualResults) {
                    actualTableResults = actualResults;
                }).then(function() {
                    //expand column header menu and select the Item
                    reportSortingPage.expandColumnHeaderMenuAndSelectItem(sortingTestcase.ColumnName, sortingTestcase.AscItemText);
                }).then(function() {
                    // Get the records from column after sorting
                    reportSortingPage.getColumnRecords(sortingTestcase.ColumnId).then(function(sortedResults) {
                        sortedTableResults = sortedResults;
                    });
                }).then(function() {
                    //Finally verify both the arrays
                    reportSortingPage.verifyAscending(sortingTestcase.ColumnName, actualTableResults, sortedTableResults).then(function() {
                        done();
                    });
                });
            });

            /*
             * Descending Testcases
             */
            it('Descending : ' + sortingTestcase.message, function(done) {
                var actualTableResults;
                var sortedTableResults;
                // Get the records from column before sorting
                reportSortingPage.getColumnRecords(sortingTestcase.ColumnId).then(function(actualResults) {
                    actualTableResults = actualResults;
                }).then(function() {
                    //expand column header menu and select the Item
                    reportSortingPage.expandColumnHeaderMenuAndSelectItem(sortingTestcase.ColumnName, sortingTestcase.DescItemText);
                }).then(function() {
                    // Get the records from column after sorting
                    reportSortingPage.getColumnRecords(sortingTestcase.ColumnId).then(function(sortedResults) {
                        sortedTableResults = sortedResults;
                    });
                }).then(function() {
                    //Finally verify both the arrays
                    reportSortingPage.verifyDescending(sortingTestcase.message, actualTableResults, sortedTableResults).then(function() {
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
                reportServicePage.waitForElement(reportServicePage.agGridBodyEl).then(function() {
                    done();
                });
            });

            /*
             * Ascending Testcases
             */
            // Grab a random test case from the data provider
            var sortingTestcase = sortingTestCases()[Math.floor(Math.random() * sortingTestCases().length)];
            it('Ascending : ' + sortingTestcase.message, function(done) {
                var actualTableResults;
                var sortedTableResults;
                // Get the records from column before sorting
                reportSortingPage.getColumnRecords(sortingTestcase.ColumnId).then(function(actualResults) {
                    actualTableResults = actualResults;
                }).then(function() {
                    //expand column header menu and select the Item
                    reportSortingPage.expandColumnHeaderMenuAndSelectItem(sortingTestcase.ColumnName, sortingTestcase.AscItemText);
                }).then(function() {
                    // Get the records from column after sorting
                    reportSortingPage.getColumnRecords(sortingTestcase.ColumnId).then(function(sortedResults) {
                        sortedTableResults = sortedResults;
                    });
                }).then(function() {
                    //Finally verify both the arrays
                    reportSortingPage.verifyAscending(sortingTestcase.ColumnName, actualTableResults, sortedTableResults).then(function() {
                        done();
                    });
                });
            });

            /*
             * Descending Testcases
             */
            it('Descending : ' + sortingTestcase.message, function(done) {
                var actualTableResults;
                var sortedTableResults;
                // Get the records from column before sorting
                reportSortingPage.getColumnRecords(sortingTestcase.ColumnId).then(function(actualResults) {
                    actualTableResults = actualResults;
                }).then(function() {
                    //expand column header menu and select the Item
                    reportSortingPage.expandColumnHeaderMenuAndSelectItem(sortingTestcase.ColumnName, sortingTestcase.DescItemText);
                }).then(function() {
                    // Get the records from column after sorting
                    reportSortingPage.getColumnRecords(sortingTestcase.ColumnId).then(function(sortedResults) {
                        sortedTableResults = sortedResults;
                    });
                }).then(function() {
                    //Finally verify both the arrays
                    reportSortingPage.verifyDescending(sortingTestcase.ColumnName, actualTableResults, sortedTableResults).then(function() {
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
