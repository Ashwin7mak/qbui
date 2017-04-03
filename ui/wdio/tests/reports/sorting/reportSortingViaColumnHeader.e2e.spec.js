(function() {
    'use strict';

    //Load the page Objects
    var newStackAuthPO = requirePO('newStackAuth');
    var e2ePageBase = requirePO('e2ePageBase');
    var reportSortingPO = requirePO('reportSortingGrouping');
    var reportContentPO = requirePO('reportContent');

    describe('Report Sorting Via Column Header Tests  - ', function() {
        var realmName;
        var realmId;
        var testApp;
        var reportId;
        var DEFAULT_REPORT_ID = 1;
        var actualTableRecords;
        var expectedRecords;

        /**
         * Setup method. Creates test app then authenticates into the new stack
         */
        beforeAll(function() {
            browser.logger.info('beforeAll spec function - Generating test data and logging in');
            // Need to return here. beforeAll is completely async, need to return the Promise chain in any before or after functions!
            // No need to call done() anymore
            return e2eBase.basicAppSetup('', 5).then(function(createdApp) {
                // Set your global objects to use in the test functions
                testApp = createdApp;
                realmName = e2eBase.recordBase.apiBase.realm.subdomain;
                realmId = e2eBase.recordBase.apiBase.realm.id;
            }).then(function() {
                // Auth into the new stack
                return newStackAuthPO.realmLogin(realmName, realmId);
            }).catch(function(error) {
                // Global catch that will grab any errors from chain above
                // Will appropriately fail the beforeAll method so other tests won't run
                browser.logger.error('Error in beforeAll function:' + JSON.stringify(error));
                return Promise.reject('Error in beforeAll function:' + JSON.stringify(error));
            });
        });


        /**
         * Data Provider for reports sorting testCases.
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
                    sortFids: [function(row) {return reportSortingPO.getSortValue(row, 6);}],
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
                    sortFids: [function(row) {return reportSortingPO.getSortValue(row, 6);}, function(row) {return reportSortingPO.getSortValue(row, 7);}],
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
            it(testcase.message + ' for report with FIDS, SORTLISTS and NO FACETS defined', function() {

                //Step 1 - Creating a report with FIDS and sortFIDS as described in dataProvider
                browser.call(function() {
                    return e2eBase.reportService.createReportWithFidsAndSortList(testApp.id, testApp.tables[e2eConsts.TABLE1].id, testcase.Fids, testcase.sortList, null, testcase.message).then(function(id) {
                        reportId = id;
                    });
                });

                //Step 2 - load the above created report in UI.
                e2ePageBase.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, reportId);

                //Step 3 - get all table results which are expected to be sorted already via API
                actualTableRecords = reportContentPO.getAllRecordsFromTable();

                //Step 4 - Using API get report records(results) from report 1 (List All report) then get FIDS(specific column) records specified and sort them using LoDash
                expectedRecords = reportSortingPO.getReportResultsAndSortFidsUsingLoDashAndVerify(testApp.id, testApp.tables[e2eConsts.TABLE1].id, DEFAULT_REPORT_ID, testcase.Fids, testcase.sortFids, testcase.sortOrder, actualTableRecords);

                //Step 5 - Verify the actual versus expected sorted records
                reportSortingPO.verifySortedResults(actualTableRecords, expectedRecords);

            });

        });

        it("Verify Text asc sort then by CheckBox Desc sort for report with FIDS, SORTLISTS and FACETS defined", function(done) {
            var Fids = [6, 15];
            var facetFids = [6, 15];
            var sortFids = [function(row) {return reportSortingPO.getSortValue(row, 6);}, function(row) {return reportSortingPO.getSortValue(row, 15);}];
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

            //Step 1 - Creating a report with FIDS , SORTFIDS and FACETS
            browser.call(function() {
                return e2eBase.reportService.createReportWithFidsAndFacetsAndSortLists(testApp.id, testApp.tables[e2eConsts.TABLE1].id, Fids, facetFids, sortList).then(function(id) {
                    reportId = id;
                });
            });

            //Step 2 - load the above created report in UI.
            e2ePageBase.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, reportId);

            //Step 3 - get all table results which are expected to be sorted already via API
            actualTableRecords = reportContentPO.getAllRecordsFromTable();

            //Step 4 - Using API get report records(results) from report 1 (List All report) then get FIDS(specific column) records specified and sort them using LoDash
            expectedRecords = reportSortingPO.getReportResultsAndSortFidsUsingLoDashAndVerify(testApp.id, testApp.tables[e2eConsts.TABLE1].id, DEFAULT_REPORT_ID, Fids, sortFids, ['asc', 'desc']);

            //Step 5 - Verify the actual versus expected sorted records
            reportSortingPO.verifySortedResults(actualTableRecords, expectedRecords);
        });

        it("Verify Sorting and Checkmark beside selected Item in column header for report WITHOUT SORTFIDS or FACETS", function(done) {

            //Step 1 - Creating a report with just FIDS and without SORTFIDS and FACETS
            browser.call(function() {
                return e2eBase.reportService.createReportWithFids(testApp.id, testApp.tables[e2eConsts.TABLE1].id, [6], null, 'Report with just Fids').then(function(id) {
                    reportId = id;
                });
            });

            //Step 2 - load the above created report in UI.
            e2ePageBase.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, reportId);

            //Step 3 - Expand 'Text Field' column header and select 'Sort Z to A'
            reportSortingPO.expandColumnHeaderMenuAndSelectItem("Text Field", "Sort Z to A");

            //Step 4 - Verify item got selected under column header menu i.e verify the check mark beside the item
            reportSortingPO.expandColumnHeaderMenuAndVerifySelectedItem("Text Field", "Sort Z to A");

            //Step 5 - get the sorted table results
            actualTableRecords = reportContentPO.getAllRecordsFromTable();

            //Step 6 - Using API get report records(results) from report 1 (List All report) then get FIDS(specific column) records specified and sort them using LoDash
            expectedRecords = reportSortingPO.getReportResultsAndSortFidsUsingLoDashAndVerify(testApp.id, testApp.tables[e2eConsts.TABLE1].id, DEFAULT_REPORT_ID, [6], [function(row) {return reportSortingPO.getSortValue(row, 6);}], ['desc']);

            //Step 7 - Verify the actual versus expected sorted records
            reportSortingPO.verifySortedResults(actualTableRecords, expectedRecords);
        });

        it("Verify Checkmark appears beside sorting menuItem for report with sortFids already set.", function(done) {
            var sortList = [
                {
                    "fieldId": 11,
                    "sortOrder": "desc",
                    "groupType": null
                }
            ];

            //Step 1 - Creating a report with FIDS and SORTFIDS
            browser.call(function() {
                return e2eBase.reportService.createReportWithFidsAndSortList(testApp.id, testApp.tables[e2eConsts.TABLE1].id, [6, 11], sortList, null, "Verify Item Selected Report").then(function(id) {
                    reportId = id;
                });
            });

            //Step 2 - load the above created report in UI.
            e2ePageBase.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, reportId);

            //Step 3 - Verify item got selected under column header menu i.e verify the check mark beside the item
            reportSortingPO.expandColumnHeaderMenuAndVerifySelectedItem("Date Field", "Sort newest to oldest");
        });

    });
}());
