(function() {
    'use strict';

    //Load the page Objects
    var newStackAuthPO = requirePO('newStackAuth');
    var e2ePageBase = requirePO('e2ePageBase');
    var reportSortingPO = requirePO('reportSortingGrouping');
    var reportContentPO = requirePO('reportContent');
    //include underScore js
    var _ = require('underscore');

    describe('Report Grouping Via Column Header Tests  - ', function() {
        var realmName;
        var realmId;
        var app;
        var groupedViaLODASHResults;
        var reportId;
        var DEFAULT_REPORT_ID = 1;
        var testCreatedFormattedRecords = [];
        var durationMax = '9223372036854775807';

        var user1 = {
            id: null,
            firstName: 'Chris',
            lastName: 'Baker',
            screenName: 'Chris_Baker@example.com',
            email: 'Chris_Baker@example.com',
            challengeQuestion: 'who is your favorite scrum team?',
            challengeAnswer: 'blue',
            password: 'quickbase'
        };
        var user2 = {
            id: null,
            firstName: 'Chris',
            lastName: 'Baker',
            screenName: 'Gregory_Baxter@example.com',
            email: 'Gregory_Baxter@example.com',
            challengeQuestion: 'who is your favorite scrum team?',
            challengeAnswer: 'blue',
            password: 'quickbase'
        };
        var user3 = {
            id: null,
            firstName: 'Angela',
            lastName: 'Leon',
            screenName: 'Angela_Leon@example.com',
            email: 'Angela_Leon@example.com',
            challengeQuestion: 'who is your favorite scrum team?',
            challengeAnswer: 'blue',
            password: 'quickbase'
        };
        var user4 = {
            id: null,
            firstName: 'Jon',
            lastName: 'Neil',
            screenName: 'Jon_Neil@example.com',
            email: 'Jon_Neil@example.com',
            challengeQuestion: 'who is your favorite scrum team?',
            challengeAnswer: 'blue',
            password: 'quickbase'
        };

        /**
         * Setup method. Creates test app with table fields specified, Create records that are specified and then authenticates into the new stack
         */
        beforeAll(function() {
            browser.logger.info('beforeAll spec function - Generating test data and logging in');
            var testRecord1;
            var testRecord2;
            var testRecord3;
            var testRecord4;

            var tableToFieldToFieldTypeMap = {};
            tableToFieldToFieldTypeMap['table 1'] = {};
            tableToFieldToFieldTypeMap['table 1']['User Name'] = {fieldType: consts.SCALAR, dataType: consts.USER};
            tableToFieldToFieldTypeMap['table 1']['Project Phase'] = {fieldType: consts.SCALAR, dataType: consts.TEXT};
            tableToFieldToFieldTypeMap['table 1']['Task Name'] = {fieldType: consts.SCALAR, dataType: consts.TEXT};
            tableToFieldToFieldTypeMap['table 1']['Start Date'] = {fieldType: consts.SCALAR, dataType: consts.DATE};
            tableToFieldToFieldTypeMap['table 1']['Finish Date'] = {fieldType: consts.SCALAR, dataType: consts.DATE};
            tableToFieldToFieldTypeMap['table 1']['Duration Taken'] = {fieldType: consts.SCALAR, dataType: consts.DURATION};
            tableToFieldToFieldTypeMap['table 1']['% Completed'] = {fieldType: consts.SCALAR, dataType: consts.PERCENT};
            
            return e2eBase.createAppWithEmptyRecordsInTable(tableToFieldToFieldTypeMap).then(function(createdApp) {
                // Set your global objects to use in the test functions
                app = createdApp;
                realmName = e2eBase.recordBase.apiBase.realm.subdomain;
                realmId = e2eBase.recordBase.apiBase.realm.id;
            }).then(function() {
                return e2eBase.recordBase.apiBase.createSpecificUser(user1).then(function(userResponse) {
                    testRecord1 = [[{'id': 6, 'value': JSON.parse(userResponse.body).id}, {'id': 7, 'value': 'Development'}, {'id': 8, 'value': 'Upgrade DBMS'}, {'id': 9, 'value': '2009-03-19'}, {'id': 10, 'value': '2009-04-28'}, {'id': 11, 'value': +durationMax}, {'id': 12, 'value': 99.00}]];
                    return e2eBase.recordService.addRecords(app, app.tables[e2eConsts.TABLE1], testRecord1);
                });
            }).then(function() {
                return e2eBase.recordBase.apiBase.createSpecificUser(user2).then(function(userResponse) {
                    testRecord2 = [[{'id': 6, 'value': JSON.parse(userResponse.body).id}, {'id': 7, 'value': 'Planning'}, {'id': 8, 'value': 'Server purchase'}, {'id': 9, 'value': '2009-03-16'}, {'id': 10, 'value': '2009-04-10'}, {'id': 11, 'value': +durationMax}, {'id': 12, 'value': 100.00}]];
                    return e2eBase.recordService.addRecords(app, app.tables[e2eConsts.TABLE1], testRecord2);
                });
            }).then(function() {
                return e2eBase.recordBase.apiBase.createSpecificUser(user3).then(function(userResponse) {
                    testRecord3 = [[{'id': 6, 'value': JSON.parse(userResponse.body).id}, {'id': 7, 'value': 'Planning'}, {'id': 8, 'value': 'Workstation purchase'}, {'id': 9, 'value': '2009-03-21'}, {'id': 10, 'value': '2009-04-10'}, {'id': 11, 'value': +durationMax}, {'id': 12, 'value': 99.00}]];
                    return e2eBase.recordService.addRecords(app, app.tables[e2eConsts.TABLE1], testRecord3);
                });
            }).then(function() {
                return e2eBase.recordBase.apiBase.createSpecificUser(user4).then(function(userResponse) {
                    testRecord4 = [[{'id': 6, 'value': JSON.parse(userResponse.body).id}, {'id': 7, 'value': 'Development'}, {'id': 8, 'value': 'Install latest software'}, {'id': 9, 'value': '2009-03-31'}, {'id': 10, 'value': '2009-04-28'}, {'id': 11, 'value': +durationMax}, {'id': 12, 'value': 100.00}]];
                    return e2eBase.recordService.addRecords(app, app.tables[e2eConsts.TABLE1], testRecord4);
                });
            }).then(function() {
                //Create a report
                return e2eBase.reportService.createReportWithFids(app.id, app.tables[e2eConsts.TABLE1].id, [6, 7, 8, 9, 10, 11, 12], null, 'Test Grouping');
            }).then(function() {
                // Auth into the new stack
                return newStackAuthPO.realmLogin(realmName, realmId);
            }).catch(function(error) {
                // Global catch that will grab any errors from chain above
                // Will appropriately fail the beforeAll method so other tests won't run
                Promise.reject(new Error('Error during test setup beforeAll: ' + error.message));
            });
        });

        /**
         * Setup method. Get the report records via PAI and then formatt them as you see in UI to verify against UI
         */
        beforeAll(function() {
            var reportRecordsViaAPI;
            //report Endpoint
            var reportEndpoint = e2eBase.recordBase.apiBase.resolveReportsEndpoint(app.id, app.tables[e2eConsts.TABLE1].id, DEFAULT_REPORT_ID);
            //GET report results
            browser.call(function() {
                return e2eBase.recordBase.apiBase.executeRequest(reportEndpoint, consts.GET).then(function(reportResult) {
                    var results = JSON.parse(reportResult.body);
                    reportRecordsViaAPI = results.records;

                    //Format the key value 6 which is userName to be be just firstName lastName
                    reportRecordsViaAPI.forEach(function(record) {
                        //Extract the value of key 6
                        var userName = _.find(record, {id: 6});
                        //replace value with just firstName lastName . The actual object value is in format ({"userId":"RBDXQ3V_UD","firstName":"Angela","lastName":"Leon","screenName":"Angela_Leon@example.com","email":"Angela_Leon@example.com"})
                        userName.value = userName.value.firstName + " " + userName.value.lastName;

                        //extract key 11
                        var durationTaken = _.find(record, {id: 11});
                        durationTaken.value = '-15250284452.47152052910053 weeks';

                        //extract key 12
                        var percentage = _.find(record, {id: 12});
                        percentage.value = percentage.value + '00%';

                        //extract start date(format as in UI ie mm-dd-yyy)
                        var startDate = _.find(record, {id: 9});
                        var sDate = startDate.value.split('-');
                        startDate.value = sDate[1] + "-" + sDate[2] + "-" + sDate[0];

                        //extract end date(format as in UI ie mm-dd-yyy)
                        var endDate = _.find(record, {id: 10});
                        var eDate = endDate.value.split('-');
                        endDate.value = eDate[1] + "-" + eDate[2] + "-" + eDate[0];

                        //remove key 3 (which is record ID). UI dose not show this
                        record = record.slice(1);
                        testCreatedFormattedRecords.push(record);
                    });
                });
            });
        });


        var getGroupedTableRows = (function() {
            var groupHeaders = [];
            var recordRows;

            //get all group headers
            reportSortingPO.getAllGroupHeadersList.value.filter(function(header) {
                return groupHeaders.push(header.getAttribute('textContent'));
            });

            //get all rows in the table
            recordRows = reportContentPO.getAllRecordsFromTable();

            return [groupHeaders, recordRows];
        });

        /**
         * Data Provider for reports grouping testCases.
         * ['User Name Field', 'Text Field', 'Date Field', 'Duration Field'],
         */
        function groupingTestCases() {
            return [
                {
                    message: 'USER FIELD: User Field(asc)',
                    //the below are for backend calls
                    sortFids: [function(row) {return reportSortingPO.getSortValue(row, 6);}],
                    sortOrder: ['asc'],
                    groupFids: 6,
                    sortList: [
                        {
                            "fieldId": 6,
                            "sortOrder": "asc",
                            "groupType": "EQUALS"
                        }
                    ],
                },
                {
                    message: 'TEXT FIELD: Project Phase(desc)',
                    //the below are for backend calls
                    sortFids: [function(row) {return reportSortingPO.getSortValue(row, 7);}],
                    sortOrder: ['desc'],
                    groupFids: 7,
                    sortList: [
                        {
                            "fieldId": 7,
                            "sortOrder": "desc",
                            "groupType": "EQUALS"
                        }
                    ],
                },
                {
                    message: 'DATE FIELD: Start Date(desc)',
                    //the below are for backend calls
                    sortFids: [function(row) {return reportSortingPO.getSortValue(row, 9);}],
                    sortOrder: ['desc'],
                    groupFids: 9,
                    sortList: [
                        {
                            "fieldId": 9,
                            "sortOrder": "desc",
                            "groupType": "EQUALS"
                        }
                    ],
                },
                //TODO report a bug on below. The header says empty after grouping
                //{
                //    message: 'NUMERIC FIELD: Duration field(desc)',
                //    //the below are for backend calls
                //    sortFids: [function(row) {return reportSortingPO.getSortValue(row, 11);}],
                //    sortOrder: ['desc'],
                //    groupFids: 11,
                //    sortList: [
                //        {
                //            "fieldId": 11,
                //            "sortOrder": "desc",
                //            "groupType": "EQUALS"
                //        }
                //    ],
                //},
            ];
        }

            /*
             * Grouping Testcases
             */
        groupingTestCases().forEach(function(testCase) {
            it('Group By ' + testCase.message, function() {

                    //Step 1 - Creating a report with FIDS and sortFIDS as described in dataProvider
                browser.call(function() {
                    return e2eBase.reportService.createReportWithFidsAndSortList(app.id, app.tables[e2eConsts.TABLE1].id, [6, 7, 8, 9, 10, 11, 12], testCase.sortList, '', 'Group By ' + testCase.message).then(function(id) {
                        reportId = id;
                    });
                });

                    //Step 2 - load the above created report in UI.
                e2ePageBase.loadReportByIdInBrowser(realmName, app.id, app.tables[e2eConsts.TABLE1].id, reportId);

                    //Step 3 - get all table results which are expected to be sorted/grouped already via API
                var groupedUITableResults = getGroupedTableRows();

                    //Step 4 - Sort and Group the testCreated Formatted records using loDash
                groupedViaLODASHResults = reportSortingPO.SortAndGroupFidsUsingLoDash(testCreatedFormattedRecords, testCase.sortFids, testCase.sortOrder, testCase.groupFids);

                    //Step 5 - Verify grouped headers
                reportSortingPO.verifySortedResults(groupedUITableResults[0], groupedViaLODASHResults[0]);

                    //Step 6 - Verify sorted and grouped records
                reportSortingPO.verifySortedResults(groupedUITableResults[1], groupedViaLODASHResults[1]);

            });
        });

            /*
             * Grouping Via UI column header
             */
        it('Verify Sorting Project Phase(textField desc) then GroupBy User Field Via UI column Header', function() {
            var sortFids = [function(row) {return reportSortingPO.getSortValue(row, 6);}];
            var sortOrder = ['desc'];
            var groupFids = 6;

                //Step 1 - Go to report 1 which dosent have any grouping
            e2ePageBase.loadReportByIdInBrowser(realmName, app.id, app.tables[e2eConsts.TABLE1].id, DEFAULT_REPORT_ID);

                //Step 2 - Expand 'Project Phase' column header and select 'Sort Z to A'
            reportSortingPO.expandColumnHeaderMenuAndSelectItem("User Name", "Sort Z to A");

                //Step 2 - Expand 'User Name' column header and select 'Group Z to A'
            reportSortingPO.expandColumnHeaderMenuAndSelectItem("User Name", "Group Z to A");

                //Step 4 - get all table results which are expected to be sorted/grouped already via API
            var groupedUITableResults = getGroupedTableRows();

                //Step 5 - Sort and Group the testCreated Formatted records using loDash
            groupedViaLODASHResults = reportSortingPO.SortAndGroupFidsUsingLoDash(testCreatedFormattedRecords, sortFids, sortOrder, groupFids);

                //Step 6 - Verify grouped headers
            reportSortingPO.verifySortedResults(groupedUITableResults[0], groupedViaLODASHResults[0]);

                //Step 7 - Verify sorted and grouped records
            reportSortingPO.verifySortedResults(groupedUITableResults[1], groupedViaLODASHResults[1]);
        });

        /*
         * Grouping Via UI column header on report with Facets
         */
        it('Verify GroupBy User Field  Via UI column Header on report with facets', function() {
            var sortFids = [function(row) {return reportSortingPO.getSortValue(row, 6);}];
            var sortOrder = ['desc'];
            var groupFids = 6;

            //Create a report with facets [text field and checkbox field]
            browser.call(function() {
                return e2eBase.reportService.createReportWithFidsAndFacetsAndSortLists(app.id, app.tables[e2eConsts.TABLE1].id, [6, 7, 8, 9, 10, 11, 12], [6, 7], null).then(function(id) {
                    reportId = id;
                });
            });

            //Step 1 - Go to report 1 which dosent have any grouping
            e2ePageBase.loadReportByIdInBrowser(realmName, app.id, app.tables[e2eConsts.TABLE1].id, reportId);

            //Step 2 - Expand 'Project Phase' column header and select 'Sort Z to A'
            reportSortingPO.expandColumnHeaderMenuAndSelectItem("User Name", "Sort Z to A");

            //Step 2 - Expand 'User Name' column header and select 'Group Z to A'
            reportSortingPO.expandColumnHeaderMenuAndSelectItem("User Name", "Group Z to A");

            //Step 4 - get all table results which are expected to be sorted/grouped already via API
            var groupedUITableResults = getGroupedTableRows();

            //Step 5 - Sort and Group the testCreated Formatted records using loDash
            groupedViaLODASHResults = reportSortingPO.SortAndGroupFidsUsingLoDash(testCreatedFormattedRecords, sortFids, sortOrder, groupFids);

            //Step 6 - Verify grouped headers
            reportSortingPO.verifySortedResults(groupedUITableResults[0], groupedViaLODASHResults[0]);

            //Step 7 - Verify sorted and grouped records
            reportSortingPO.verifySortedResults(groupedUITableResults[1], groupedViaLODASHResults[1]);

        });

    });
}());
