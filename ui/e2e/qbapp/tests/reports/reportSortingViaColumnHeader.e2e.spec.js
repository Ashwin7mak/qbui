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
        var sortedRecords;
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
            }).then(function() {
                // Generate 1 empty record
                // Get the appropriate fields out of the third table
                var nonBuiltInFields = e2eBase.tableService.getNonBuiltInFields(app.tables[e2eConsts.TABLE1]);
                var generatedEmptyRecords = e2eBase.recordService.generateEmptyRecords(nonBuiltInFields, 1);
                records.push(generatedEmptyRecords);
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


        /*
         * This function gets the value in the record parameter (array of field value pairs), where id matches the fid specified in the parameter
         * Function is a custom sort function used by lodash from within the sortRecords function
         * @Returns The value that lodash should sort on
         */
        var getSortValue = function(record, fid) {
            // By default returns nothing if not found
            var val = [];
            // loop through the columns (fields) in the record
            record.forEach(function(col) {
                // find the column we are sorting on and return its value
                if (col.id === fid) {
                    val.push(col.value);
                }
            });
            return val;
        };

        /**
         * Function that will verify the filtered rows are contained in actual record list.
         * @param facets Group
         */
        var verifySortedTableResults = function(expectedSortedTableResults) {
            var sortedTableResults = [];
            //Load the report in the UI
            reportServicePage.waitForElement(reportServicePage.griddleWrapperEl).then(function() {
                //sleep for loading of table to finish
                e2eBase.sleep(browser.params.smallSleep);
                reportServicePage.waitForElement(reportServicePage.agGridContainerEl).then(function() {
                    reportServicePage.agGridRecordElList.getText().then(function(uiRecords) {
                        for (var i = 1; i < uiRecords.length; i++) {
                            sortedTableResults.push(uiRecords[i].replace(/\n/g, ","));
                        }
                        expect(sortedTableResults.join()).toEqual(expectedSortedTableResults.join());
                    });
                });
            });
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
                    sortFids: [function(row) {return getSortValue(row, 6);}],
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
                    sortFids: [function(row) {return getSortValue(row, 6);}, function(row) {return getSortValue(row, 7);}],
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
                {
                    //the below are for UI calls
                    message: 'Sort by Text field in desc order then by Numeric in asc order then by date in desc order',
                    ColumnName: ['Text Field', 'Numeric Field', 'Date Field'],
                    SortOrderItem: ['Sort Z to A', 'Sort lowest to highest', 'Sort newest to oldest'],
                    //the below are for backend calls
                    Fids: [6, 7, 11],
                    sortFids: [function(row) {return getSortValue(row, 6);}, function(row) {return getSortValue(row, 7);}, function(row) {return getSortValue(row, 11);}],
                    sortOrder: ['desc', 'asc', 'desc'],
                    sortList: [
                        {
                            "fieldId": 6,
                            "sortOrder": "desc",
                            "groupType": null
                        },
                        {
                            "fieldId": 7,
                            "sortOrder": "asc",
                            "groupType": null
                        },
                        {
                            "fieldId": 11,
                            "sortOrder": "desc",
                            "groupType": null
                        }
                    ]
                },
            ];
        }

        describe('Report Sorting without Facets/Filters Report', function() {
            sortingTestCases().forEach(function(testcase) {
                it(testcase.message, function(done) {
                    var r;
                    var keyValue = [];

                    //Create a report
                    var reportsEndpoint = e2eBase.recordBase.apiBase.resolveReportsEndpoint(app.id, app.tables[0].id);
                    var reportToCreate = {
                        name: testcase.message,
                        type: 'TABLE',
                        tableId: app.tables[0].id,
                        fids  : testcase.Fids,
                        sortList: testcase.sortList
                    };
                    //Create a report with testcase fids and sortLists
                    e2eBase.recordBase.apiBase.executeRequest(reportsEndpoint, 'POST', reportToCreate).then(function(report) {
                        r = JSON.parse(report.body);
                        //Verify that the report is created
                        expect(r.id, 2);
                    }).then(function() {
                        // Sort the actual records using lodash _.orderby
                        sortedRecords = reportSortingPage.sortRecords(records, testcase.sortFids, testcase.sortOrder);

                        for (var i = 1; i < sortedRecords.length; i++) {
                            for (var j = 0; j < testcase.Fids.length; j++) {
                                keyValue.push(getSortValue(sortedRecords[i], testcase.Fids[j]));
                            }
                        }
                        sortedExpectedRecords.push(keyValue.join());
                    }).then(function() {
                        //Go to created sorted report page directly.
                        return RequestAppsPage.get(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, app.tables[e2eConsts.TABLE1].id, r.id));
                    }).then(function() {
                        return reportServicePage.waitForElement(reportServicePage.loadedContentEl).then(function() {
                            e2eBase.sleep(browser.params.smallSleep);
                            //Verify table sorted results on UI with lodash sorted expected results.
                            verifySortedTableResults(sortedExpectedRecords);
                        });
                    }).then(function() {
                        sortedExpectedRecords = [];
                        done();
                    });
                });
            });

        });

        ////Verify the appropriate sorting sub-menu got selected in the header popup
        //for (var i = 0; i < testcase.ColumnName.length; i++) {
        //    reportSortingPage.expandColumnHeaderMenuAndVerifySelectedItem(testcase.ColumnName[i], testcase.SortOrderItem[i]);
        //}
        //console.log("the sorted expected results are: "+JSON.stringify(sortedExpectedRecords));

        /**
         * After all tests are done, run the cleanup function in the base class
         */
        afterAll(function(done) {
            e2eBase.cleanup(done);
        });
    });
}());
