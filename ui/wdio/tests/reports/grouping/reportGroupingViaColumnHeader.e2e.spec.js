(function() {
    'use strict';

    //Load the page Objects
    var newStackAuthPO = requirePO('newStackAuth');
    var e2ePageBase = requirePO('e2ePageBase');
    var reportSortingPO = requirePO('reportSortingGrouping');
    var reportContentPO = requirePO('reportContent');
    //include underScore js
    var _ = require('underscore');

    describe('Reports - Grouping via column header tests: ', function() {
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
                let sortList = [
                    {
                        "fieldId": 6,
                        "sortOrder": "asc",
                        "groupType": null
                    },
                    {
                        "fieldId": 12,
                        "sortOrder": "desc",
                        "groupType": null
                    },
                ];
                //Create a report with userField sorted in ascending then by %Complete(numeric field) by descending
                return e2eBase.reportService.createReportWithFidsAndSortList(app.id, app.tables[e2eConsts.TABLE1].id, [6, 7, 8, 9, 10, 11, 12], sortList, null, 'Test Grouping via columnHeader');
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
         * Data Provider for reports grouping testCases.
         * ['User Name Field', 'Text Field', 'Date Field', 'Duration Field'],
         */
        function groupingTestCases() {
            return [
                {
                    message: 'USER FIELD: A to Z',
                    fieldName: 'USER NAME',
                    groupDirection: 'Group A to Z',
                    expectedGroups: ['Angela Leon', 'Chris Baker', 'Jon Neil'],
                    expectedRecords: [
                        ['Planning', 'Workstation purchase', '03-21-2009', '04-10-2009', '-15250284452.47152052910053 weeks', '9900%'],
                        ['Planning', 'Server purchase', '03-16-2009', '04-10-2009', '-15250284452.47152052910053 weeks', '10000%'],
                        ['Development', 'Upgrade DBMS', '03-19-2009', '04-28-2009', '-15250284452.47152052910053 weeks', '9900%'],
                        ['Development', 'Install latest software', '03-31-2009', '04-28-2009', '-15250284452.47152052910053 weeks', '10000%']
                    ]
                },
                {
                    message: 'TEXT FIELD: Z to A',
                    fieldName: 'PROJECT PHASE',
                    groupDirection: 'Group Z to A',
                    expectedGroups: ['Planning', 'Development'],
                    expectedRecords: [
                        ['Angela Leon', 'Workstation purchase', '03-21-2009', '04-10-2009', '-15250284452.47152052910053 weeks', '9900%'],
                        ['Chris Baker', 'Server purchase', '03-16-2009', '04-10-2009', '-15250284452.47152052910053 weeks', '10000%'],
                        ['Chris Baker', 'Upgrade DBMS', '03-19-2009', '04-28-2009', '-15250284452.47152052910053 weeks', '9900%'],
                        ['Jon Neil', 'Install latest software', '03-31-2009', '04-28-2009', '-15250284452.47152052910053 weeks', '10000%']
                    ]
                },
                {
                    message: 'DATE FIELD: oldest to newest',
                    fieldName: 'FINISH DATE',
                    groupDirection: 'Group oldest to newest',
                    expectedGroups: ['04-10-2009', '04-28-2009'],
                    expectedRecords: [
                        ['Angela Leon', 'Planning', 'Workstation purchase', '03-21-2009', '-15250284452.47152052910053 weeks', '9900%'],
                        ['Chris Baker', 'Planning', 'Server purchase', '03-16-2009', '-15250284452.47152052910053 weeks', '10000%'],
                        ['Chris Baker', 'Development', 'Upgrade DBMS', '03-19-2009', '-15250284452.47152052910053 weeks', '9900%'],
                        ['Jon Neil', 'Development', 'Install latest software', '03-31-2009', '-15250284452.47152052910053 weeks', '10000%'],

                    ]
                },
                {
                    message: 'NUMERIC FIELD: Duration field lowest to highest',
                    fieldName: 'DURATION TAKEN',
                    groupDirection: 'Group lowest to highest',
                    expectedGroups: ['(Empty)'], //TODO report a bug on below. The header says empty after grouping
                    expectedRecords: [
                        ['Angela Leon', 'Planning', 'Workstation purchase', '03-21-2009', '04-10-2009', '9900%'],
                        ['Chris Baker', 'Planning', 'Server purchase', '03-16-2009', '04-10-2009', '10000%'],
                        ['Chris Baker', 'Development', 'Upgrade DBMS', '03-19-2009', '04-28-2009', '9900%'],
                        ['Jon Neil', 'Development', 'Install latest software', '03-31-2009', '04-28-2009', '10000%']
                    ]
                },
            ];
        }

        /*
         * Grouping Testcases
         */
        groupingTestCases().forEach(function(testCase) {
            it('Report without Facets: Sort By User Field asc and Group By ' + testCase.message, function() {

                //Step 2 - load the above created report in UI.
                e2ePageBase.loadReportByIdInBrowser(realmName, app.id, app.tables[e2eConsts.TABLE1].id, DEFAULT_REPORT_ID);

                reportSortingPO.expandColumnHeaderMenuAndSelectItem(testCase.fieldName, testCase.groupDirection);

                //Step 3 - get all table results which are expected to be sorted/grouped already via API
                var groupedUITableResults = reportSortingPO.getGroupedTableRows();

                //Step 5 - Verify grouped headers
                reportSortingPO.verifySortedResults(groupedUITableResults[0], testCase.expectedGroups);

                //Step 6 - Verify sorted and grouped records
                reportSortingPO.verifySortedResults(groupedUITableResults[1], testCase.expectedRecords);
            });
        });

        /*
         * Grouping Via UI column header on report with Facets
         */
        // Grab a random test case from the data provider
        var testCase = groupingTestCases()[Math.floor(Math.random() * groupingTestCases().length)];
        it('Report with Facets: Group By : ' + testCase.message, function() {
            let sortList = [
                {
                    "fieldId": 6,
                    "sortOrder": "asc",
                    "groupType": null
                },
                {
                    "fieldId": 12,
                    "sortOrder": "desc",
                    "groupType": null
                },
            ];

            //Create a report with facets [text field and checkbox field]
            browser.call(function() {
                return e2eBase.reportService.createReportWithFidsAndFacetsAndSortLists(app.id, app.tables[e2eConsts.TABLE1].id, [6, 7, 8, 9, 10, 11, 12], [6, 7], sortList, null).then(function(id) {
                    reportId = id;
                });
            });

            //Step 2 - load the above created report in UI.
            e2ePageBase.loadReportByIdInBrowser(realmName, app.id, app.tables[e2eConsts.TABLE1].id, reportId);

            reportSortingPO.expandColumnHeaderMenuAndSelectItem(testCase.fieldName, testCase.groupDirection);

            //Step 3 - get all table results which are expected to be sorted/grouped already via API
            var groupedUITableResults = reportSortingPO.getGroupedTableRows();

            //Step 5 - Verify grouped headers
            reportSortingPO.verifySortedResults(groupedUITableResults[0], testCase.expectedGroups);

            //Step 6 - Verify sorted and grouped records
            reportSortingPO.verifySortedResults(groupedUITableResults[1], testCase.expectedRecords);

        });

    });
}());
