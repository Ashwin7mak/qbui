(function() {
    'use strict';

    //Load the page Objects
    var newStackAuthPO = requirePO('newStackAuth');
    var e2ePageBase = requirePO('e2ePageBase');
    var reportSortingPO = requirePO('reportSortingGrouping');
    var reportContentPO = requirePO('reportContent');
    //include underScore js
    var _ = require('underscore');

    describe('Reports - Grouping via container tests: ', function() {
        var realmName;
        var realmId;
        var app;
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
                        "fieldId": 3,
                        "sortOrder": "desc",
                        "groupType": null
                    },
                ];
                //Create a report
                return e2eBase.reportService.createReportWithFidsAndSortList(app.id, app.tables[e2eConsts.TABLE1].id, [6, 7, 8, 9, 10, 11, 12], sortList, null, 'Test Grouping Via Container');
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
         * Setup method. Get the report records via PAI and then formatt them as you see in UI to verify against UI
         */
        beforeAll(function() {
            var reportRecordsViaAPI;
            //report Endpoint
            var reportEndpoint = e2eBase.recordBase.apiBase.resolveReportsResultsEndpoint(app.id, app.tables[e2eConsts.TABLE1].id, DEFAULT_REPORT_ID);
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

        //TODO the below test Disabled due to MC-1518
        xit("Verify Reset btn functionality inside the sort/Grp dialogue", function() {
            var sortList = [
                {
                    "fieldId": 6,
                    "sortOrder": "asc",
                    "groupType": null
                }
            ];
            var groupedTableRecords;
            var tableRecordsAfterReset;
            var expectedFieldsInContainer = ['Project Phase'];

            //Step 1 - Create report via API with User Name as sorting ascending
            browser.call(function() {
                return e2eBase.reportService.createReportWithFidsAndSortList(app.id, app.tables[e2eConsts.TABLE1].id, [6, 7, 8], sortList, null, "Verify Reset").then(function(id) {
                    reportId = id;
                });
            });

            //Step 2 - load the above created report in UI.
            e2ePageBase.loadReportByIdInBrowser(realmName, app.id, app.tables[e2eConsts.TABLE1].id, reportId);

            //Step 4 - Click on sort/Grp Icon
            reportSortingPO.clickSortGroupIconOnReportsPage();
            reportSortingPO.groupBySettings.waitForVisible();

            //Step 6 - Add User Field to groupBy
            expectedFieldsInContainer.forEach(function(field) {
                reportSortingPO.selectFieldsInSrtGrpDlg(reportSortingPO.groupBySettings, 'Choose a field to group by', field);
            });

            //Step 7 - Click on Apply
            reportSortingPO.clickContainerApplyBtn();
            //wait until report rows in table are loaded
            reportContentPO.waitForReportContent();

            //Step 3 - Verify there is check mark present in column header for sorting as it is set via API
            reportSortingPO.expandColumnHeaderMenuAndVerifySelectedItem("User Name", "Sort A to Z");

            //Step 8 - Verify 'Project Phase' column is dissapeard from report table headers since we are grouping by 'Project Phase'
            var reportColumnHeaders = reportContentPO.getReportColumnHeaders();
            expect(reportColumnHeaders.indexOf('Project Phase')).toBe(-1);

            //Step 9 - Get all table results after grouping via groupBy
            groupedTableRecords = reportSortingPO.getGroupedTableRows();

            //Verify grouping headers
            expect(groupedTableRecords[0]).toEqual(['Development', 'Planning']);

            //Step 11 - Click on sort/Grp Icon
            reportSortingPO.clickSortGroupIconOnReportsPage();
            reportSortingPO.groupBySettings.waitForVisible();

            //Step 12 - Click on Reset Btn
            reportSortingPO.clickContainerResetBtn();
            //wait until report rows in table are loaded
            reportContentPO.waitForReportContent();

            //Step 13 - get all table results after reset
            tableRecordsAfterReset = reportSortingPO.getGroupedTableRows();

            //Step 14 - Verify the records are not grouped now after reset
            expect(tableRecordsAfterReset[0].length).toBe(0);

            //Step 15 - Verify reset also clears the fields in the container
            reportSortingPO.clickSortGroupIconOnReportsPage();
            reportSortingPO.groupBySettings.waitForVisible();
            var allNonEmptyFields = reportSortingPO.getAllNonEmptyFieldValues(reportSortingPO.groupBySettings);
            //Verify 'Project Phase' is no longer there in the sortBy container after reset
            expect(allNonEmptyFields.indexOf('Project Phase')).toBe(-1);
        });

        it("Verify sort/grp dialogue is pre filled with groupItems for report with groupFids already set.", function() {
            var expectedFieldsInContainer = ['User Name', 'Project Phase'];
            //Sort by Text field in asc order then by Numeric in desc
            var sortList = [
                {
                    "fieldId": 6,
                    "sortOrder": "asc",
                    "groupType": "EQUALS"
                },
                {
                    "fieldId": 7,
                    "sortOrder": "desc",
                    "groupType": "EQUALS"
                }
            ];

            //Step 1 - Creating a report with FIDS and SORTFIDS
            browser.call(function() {
                return e2eBase.reportService.createReportWithFidsAndSortList(app.id, app.tables[e2eConsts.TABLE1].id, [6, 7], sortList, null, "Verify Container Prefilled Report").then(function(id) {
                    reportId = id;
                });
            });

            //Step 2 - load the above created report in UI.
            e2ePageBase.loadReportByIdInBrowser(realmName, app.id, app.tables[e2eConsts.TABLE1].id, reportId);

            //Step 3 - Click on sort/Grp Icon
            reportSortingPO.clickSortGroupIconOnReportsPage();

            //Step 4 - Verify the sort/grp dialogue is populated with sortFids and also verify each fields had delete btn, prefix, sort Btn enabled.
            reportSortingPO.verifyNonEmptyFieldsInSortGrpDlg(reportSortingPO.groupBySettings, expectedFieldsInContainer);

        });

        it("Verify you cannot select more than 3 items in group setting dialogue", function() {
            var sortList = [
                {
                    "fieldId": 6,
                    "sortOrder": "asc",
                    "groupType": "EQUALS"
                },
                {
                    "fieldId": 7,
                    "sortOrder": "desc",
                    "groupType": "EQUALS"
                },
                {
                    "fieldId": 8,
                    "sortOrder": "desc",
                    "groupType": "EQUALS"
                },
            ];

            //Step 1 - Creating a report with 5 sortFIDS
            browser.call(function() {
                return e2eBase.reportService.createReportWithFidsAndSortList(app.id, app.tables[e2eConsts.TABLE1].id, [6, 7, 8, 9, 10], sortList, null, "Verify Max 3 fields Report").then(function(id) {
                    reportId = id;
                });
            });

            //Step 2 - load the above created report in UI.
            e2ePageBase.loadReportByIdInBrowser(realmName, app.id, app.tables[e2eConsts.TABLE1].id, reportId);

            //Step 3 - Click on sort/Grp Icon
            reportSortingPO.clickSortGroupIconOnReportsPage();

            //Step 4 - Verify you cannot select more than 3 items.
            expect(browser.isVisible('.groupBySettings .fieldSelectorContainer .empty')).toBe(false);
        });

        it("Verify more fields and Cancel functionality in field panel of groupSettings", function() {
            var expectedMoreFields = ['Date Created', 'Record ID#', 'Record Owner', 'Last Modified By'];

            //Step 1 - load the above created report in UI.
            e2ePageBase.loadReportByIdInBrowser(realmName, app.id, app.tables[e2eConsts.TABLE1].id, DEFAULT_REPORT_ID);

            //Step 2 - Click on sort/Grp Icon
            reportSortingPO.clickSortGroupIconOnReportsPage();

            //Step 3 - Click in empty field of SortBy Container
            reportSortingPO.clickInEmptyFieldInSortGrpDlg(reportSortingPO.groupBySettings, 'Choose a field to group by');

            //Step 4 - Click on more fields
            reportSortingPO.ClickMoreFieldsLinkInFieldsPanel();

            //Step 5 - Get all field List items from panel
            var allFieldFromFieldsPanel = reportSortingPO.getAllFieldsFromFieldPanelValues();

            //Step 6 - Verify allFieldFromFieldsPanel also contain expectedMoreFields variable values
            expect(_.intersection(allFieldFromFieldsPanel, expectedMoreFields).length > 0).toBe(true);

            //Step 7 - Click cancel button
            reportSortingPO.fieldsPanelCancel.click();

            //Step 8 - Verify panel not visible
            expect(browser.isVisible('.fieldsPanel')).toBe(false);
        });

        it("Verify 3 level deep grouping", function() {
            var groupFields = ['User Name', 'Project Phase', 'Start Date'];
            var groupedTableRecords;
            var expectedHeaders = ['Angela Leon', 'Planning', '03-21-2009', 'Chris Baker', 'Development', '03-19-2009', 'Planning', '03-16-2009', 'Jon Neil', 'Development', '03-31-2009'];
            var expectedRecords = [
                ['Workstation purchase', '04-10-2009', '-15250284452.47152052910053 weeks', '9900%'],
                ['Upgrade DBMS', '04-28-2009', '-15250284452.47152052910053 weeks', '9900%'],
                ['Server purchase', '04-10-2009', '-15250284452.47152052910053 weeks', '10000%'],
                ['Install latest software', '04-28-2009', '-15250284452.47152052910053 weeks', '10000%']
            ];

            //Step 1 - load the above created report in UI.
            e2ePageBase.loadReportByIdInBrowser(realmName, app.id, app.tables[e2eConsts.TABLE1].id, DEFAULT_REPORT_ID);

            //Step 2 - Click on sort/Grp Icon
            reportSortingPO.clickSortGroupIconOnReportsPage();

            //Step 3 - GroupBy User Field then by Text then by date fields
            groupFields.forEach(function(field) {
                reportSortingPO.selectFieldsInSrtGrpDlg(reportSortingPO.groupBySettings, 'Choose a field to group by', field);
            });

            //Step 4 - Click on Apply
            reportSortingPO.clickContainerApplyBtn();
            //wait until report rows in table are loaded
            reportContentPO.waitForReportContent();

            //Step 5 - Get all table results after grouping via groupBy
            groupedTableRecords = reportSortingPO.getGroupedTableRows();

            //Step 6 - Verify grouped headers
            reportSortingPO.verifySortedResults(groupedTableRecords[0], expectedHeaders);

            //Step 7 - Verify sorted and grouped records
            reportSortingPO.verifySortedResults(groupedTableRecords[1], expectedRecords);


        });

        xit("Verify Delete group fields functionality", function() {
            var fieldToDelete = 'Project Phase';
            var actualGroupedTableRecords;
            var groupedViaLODASHResults;
            var sortList = [
                {
                    "fieldId": 6,
                    "sortOrder": "desc",
                    "groupType": "EQUALS"
                },
                {
                    "fieldId": 3,
                    "sortOrder": "desc",
                    "groupType": null
                },
                {
                    "fieldId": 7,
                    "sortOrder": "asc",
                    "groupType": "EQUALS"
                }
            ];
            var sortFids = [function(row) {return reportSortingPO.getSortValue(row, 6);}, function(row) {return reportSortingPO.getSortValue(row, 3);}];
            var sortOrder = ['desc', 'desc'];
            var groupFids = 6;

            //Step 1 - Creating a report with FIDS and sortFIDS as in sortList
            browser.call(function() {
                return e2eBase.reportService.createReportWithFidsAndSortList(app.id, app.tables[e2eConsts.TABLE1].id, null, sortList, null, 'Verify Delete').then(function(id) {
                    reportId = id;
                });
            });

            //Step 2 - load the above created report in UI.
            e2ePageBase.loadReportByIdInBrowser(realmName, app.id, app.tables[e2eConsts.TABLE1].id, reportId);

            //Step 3 - Click on sort/Grp Icon
            reportSortingPO.clickSortGroupIconOnReportsPage();

            //Step 4 - Delete a field from sort settings dialogue and also verify field got deleted
            reportSortingPO.deleteFieldsFromSrtGrpDlg(reportSortingPO.groupBySettings, fieldToDelete);

            //Step 5 - Click on Apply button
            reportSortingPO.clickContainerApplyBtn();
            //wait until report rows in table are loaded
            reportContentPO.waitForReportContent();

            //Step 6 - get all table results after deleting a field
            actualGroupedTableRecords = reportSortingPO.getGroupedTableRows();

            groupedViaLODASHResults = reportSortingPO.SortAndGroupFidsUsingLoDash(testCreatedFormattedRecords, sortFids, sortOrder, groupFids);

            //Step 6 - Verify grouped headers
            reportSortingPO.verifySortedResults(actualGroupedTableRecords[0], groupedViaLODASHResults[0]);

            //Step 7 - Verify sorted and grouped records
            reportSortingPO.verifySortedResults(actualGroupedTableRecords[1], groupedViaLODASHResults[1]);

            //Step 9 - Finally verify if field item got deleted
            reportSortingPO.clickSortGroupIconOnReportsPage();
            var allNonEmptyFields = reportSortingPO.getAllNonEmptyFieldValues(reportSortingPO.groupBySettings);
            expect(allNonEmptyFields.indexOf(fieldToDelete)).toBe(-1);
        });

        it("Verify fields selected for grp/Srt will not be present in fieldsPanel anymore", function() {
            var groupFields = ['User Name', 'Project Phase', 'Start Date'];

            //Step 1 - load the above created report in UI.
            e2ePageBase.loadReportByIdInBrowser(realmName, app.id, app.tables[e2eConsts.TABLE1].id, DEFAULT_REPORT_ID);

            //Step 2 - Click on sort/Grp Icon
            reportSortingPO.clickSortGroupIconOnReportsPage();

            //Step 3 - GroupBy User Field then by Text then by date fields
            groupFields.forEach(function(field) {
                reportSortingPO.selectFieldsInSrtGrpDlg(reportSortingPO.groupBySettings, 'Choose a field to group by', field);
            });

            //Step 4 - Click on sortBy to add a field
            reportSortingPO.clickInEmptyFieldInSortGrpDlg(reportSortingPO.sortBySettings, 'Choose a field to sort by');

            //Verify the panel dosen't have fields Items already selected
            var allFieldFromFieldsPanel = reportSortingPO.getAllFieldsFromFieldPanelValues();

            //Step 6 - Verify allFieldFromFieldsPanel also contain expectedMoreFields variable values
            expect(_.every(groupFields, function(val) {return allFieldFromFieldsPanel.indexOf(val) === -1;})).toBe(true);
        });
    });
}());
