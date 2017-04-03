(function() {
    'use strict';

    //Load the page Objects
    var newStackAuthPO = requirePO('newStackAuth');
    var e2ePageBase = requirePO('e2ePageBase');
    var reportSortingPO = requirePO('reportSortingGrouping');
    var reportContentPO = requirePO('reportContent');
    var _ = require('lodash');

    describe('Report Sorting Via Container Tests  -\n', function() {
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

        it("Verify sort/grp dialogue and the close dialogue functionality", function() {
            //Step 1 - load the above created report in UI.
            e2ePageBase.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, DEFAULT_REPORT_ID);

            //Step 2 - Click on sort/Grp Icon
            reportSortingPO.clickSortGroupIconOnReportsPage();
            reportSortingPO.sortBySettings.waitForVisible();

            //Step 3 - Verify sort/Grp button is enabled
            expect(browser.isEnabled('.settingsDialog .sortButtonSpan')).toBeTruthy();
            //Step 4 - Verify the title of the container
            expect(browser.element('.settingsDialog .overlayCenter').getAttribute('textContent')).toBe('Sort & Group');
            //Step 5 - verify close button is enabled
            expect(browser.isEnabled('.settingsDialog .btn-default')).toBeTruthy();
            //Step 6 - verify reset button is enabled
            expect(browser.isEnabled('.settingsDialog .reset')).toBeTruthy();
            //Step 7 - verify apply button is enabled
            expect(browser.isEnabled('.settingsDialog .apply')).toBeTruthy();
            //Step 8 - Verify title of GroupBy Container
            expect(browser.element('.groupBySettings .title').getAttribute('textContent')).toEqual('Group');
            //Step 9 - Verify title of SortBy Container
            expect(browser.element('.sortBySettings .title').getAttribute('textContent')).toEqual('Sort');
            //Step 10 - Click on close button of the sort/Grp dialogue
            reportSortingPO.clickContainerCloseBtn();
            //Step 11 - Verify sort/grp dialogue dissapered
            expect(browser.isVisible('.settingsDialog')).toBeFalsy();
        });

        it("Verify sort/grp btn functionality inside the sort/Grp dialogue", function() {
            //Step 1 - load the above created report in UI.
            e2ePageBase.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, DEFAULT_REPORT_ID);

            //Step 2 - Click on sort/Grp Icon
            reportSortingPO.clickSortGroupIconOnReportsPage();
            reportSortingPO.sortBySettings.waitForVisible();

            //Step 3 - Click on sort/Grp Btn
            reportSortingPO.sortGroupDlgBtn.click();

            //Step 4 - Verify sort/grp dialogue dissapered
            expect(browser.isVisible('.settingsDialog')).toBeFalsy();

        });

        it("Verify Reset btn functionality inside the sort/Grp dialogue", function() {
            var expectedFieldsInContainer = ['Text Field'];
            var sortedTableRecords;

            //Step 1 - Create report via API with just Text Field FID
            browser.call(function() {
                return e2eBase.reportService.createReportWithFids(testApp.id, testApp.tables[e2eConsts.TABLE1].id, [6], null, "Verify Reset").then(function(id) {
                    reportId = id;
                });
            });

            //Step 2 - load the above created report in UI.
            e2ePageBase.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, reportId);

            //Step 3 - Click on sort/Grp Icon
            reportSortingPO.clickSortGroupIconOnReportsPage();
            reportSortingPO.sortBySettings.waitForVisible();

            //Step 4 - Delete if any fields present
            reportSortingPO.deleteAllFieldsFromSrtGrpDlg(reportSortingPO.sortBySettings);

            //Step 5 - Add Text Field to sortBy
            expectedFieldsInContainer.forEach(function(field) {
                reportSortingPO.selectFieldsInSrtGrpDlg(reportSortingPO.sortBySettings, 'Choose a field to sort by', field);
            });

            //Step 6 - Click on Apply
            reportSortingPO.clickContainerApplyBtn();
            //wait until report rows in table are loaded
            reportContentPO.waitForReportContent();

            //Step 7 - Verify there is check mark present in column header
            reportSortingPO.expandColumnHeaderMenuAndVerifySelectedItem("Text Field", "Sort A to Z");

            //Step 8 - Get all table results after sorting via sortBy
            sortedTableRecords = reportContentPO.getAllRecordsFromTable();

            //Step 9 - Verify records are sorted in ascending order
            //Verify they are in ascending order
            expect(_.every(sortedTableRecords, function(value, index, array) {
                // either it is the first element, or otherwise this element should
                // not be smaller than the previous element.
                // spec requires string conversion
                return index === 0 || String(array[index - 1]) <= String(value);
            })).toBeTruthy();

            //Step 10 - Click on sort/Grp Icon
            reportSortingPO.clickSortGroupIconOnReportsPage();
            reportSortingPO.sortBySettings.waitForVisible();

            //Step 11 - Click on Reset Btn
            reportSortingPO.clickContainerResetBtn();
            //wait until report rows in table are loaded
            reportContentPO.waitForReportContent();

            //Step 12 - get all table results after reset
            actualTableRecords = reportContentPO.getAllRecordsFromTable();

            //Step 13 - Verify the records are not sorted now after reset
            expect(_.every(actualTableRecords, function(value, index, array) {
                // either it is the first element, or otherwise this element should
                // not be smaller than the previous element.
                // spec requires string conversion
                return index === 0 || String(array[index - 1]) <= String(value);
            })).toBeFalsy();


            //Step 14 - Verify reset also clears the fields in the container
            reportSortingPO.clickSortGroupIconOnReportsPage();
            reportSortingPO.sortBySettings.waitForVisible();
            var allNonEmptyFields = reportSortingPO.getAllNonEmptyFieldValues(reportSortingPO.sortBySettings);
            //Verify 'Text Field' is no longer there in the sortBy container after reset
            expect(allNonEmptyFields.indexOf('Text Field')).toBe(-1);
        });

        it("Verify sort/grp dialogue is pre filled with sortItems for report with sortFids already set.", function() {
            var expectedFieldsInContainer = ['Text Field', 'Numeric Field'];
            //Sort by Text field in asc order then by Numeric in desc
            var sortList = [
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
            ];

            //Step 1 - Creating a report with FIDS and SORTFIDS
            browser.call(function() {
                return e2eBase.reportService.createReportWithFidsAndSortList(testApp.id, testApp.tables[e2eConsts.TABLE1].id, [6, 7], sortList, null, "Verify Container Prefilled Report").then(function(id) {
                    reportId = id;
                });
            });

            //Step 2 - load the above created report in UI.
            e2ePageBase.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, reportId);

            //Step 3 - Click on sort/Grp Icon
            reportSortingPO.clickSortGroupIconOnReportsPage();

            //Step 4 - Verify the sort/grp dialogue is populated with sortFids and also verify each fields had delete btn, prefix, sort Btn enabled.
            reportSortingPO.verifyNonEmptyFieldsInSortGrpDlg(reportSortingPO.sortBySettings, expectedFieldsInContainer);

        });

        it("Verify you cannot select more than 5 items in sort setting dialogue", function() {
            var sortList = [
                {
                    "fieldId": 6,
                    "sortOrder": "asc",
                    "groupType": null
                },
                {
                    "fieldId": 7,
                    "sortOrder": "desc",
                    "groupType": null
                },
                {
                    "fieldId": 8,
                    "sortOrder": "desc",
                    "groupType": null
                },
                {
                    "fieldId": 9,
                    "sortOrder": "desc",
                    "groupType": null
                },
                {
                    "fieldId": 10,
                    "sortOrder": "desc",
                    "groupType": null
                }
            ];

            //Step 1 - Creating a report with 5 sortFIDS
            browser.call(function() {
                return e2eBase.reportService.createReportWithFidsAndSortList(testApp.id, testApp.tables[e2eConsts.TABLE1].id, [6, 7, 8, 9, 10], sortList, null, "Verify Max 5 fields Report").then(function(id) {
                    reportId = id;
                });
            });

            //Step 2 - load the above created report in UI.
            e2ePageBase.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, reportId);

            //Step 3 - Click on sort/Grp Icon
            reportSortingPO.clickSortGroupIconOnReportsPage();

            //Step 4 - Verify you cannot select more than 5 items.
            expect(browser.isVisible('.sortBySettings .fieldSelectorContainer .empty')).toBeFalsy();
        });

        it("Verify more fields and Cancel functionality in field panel of sortSettings", function() {
            var expectedMoreFields = ['Date Created', 'Record ID#', 'Record Owner', 'Last Modified By'];

            //Step 1 - load the above created report in UI.
            e2ePageBase.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, DEFAULT_REPORT_ID);

            //Step 2 - Click on sort/Grp Icon
            reportSortingPO.clickSortGroupIconOnReportsPage();

            //Step 3 - Click in empty field of SortBy Container
            reportSortingPO.clickInEmptyFieldInSortGrpDlg(reportSortingPO.sortBySettings, 'Choose a field to sort by');

            //Step 4 - Click on more fields
            reportSortingPO.ClickMoreFieldsLinkInFieldsPanel();

            //Step 5 - Get all field List items from panel
            var allFieldFromFieldsPanel = reportSortingPO.getAllFieldsFromFieldPanelValues();

            //Step 6 - Verify allFieldFromFieldsPanel also contain expectedMoreFields variable values
            expect(_.every(expectedMoreFields, function(val) {return allFieldFromFieldsPanel.indexOf(val) >= 0;})).toBeTruthy();

            //Step 7 - Click cancel button
            reportSortingPO.fieldsPanelCancel.click();

            //Step 8 - Verify panel not visible
            expect(browser.isVisible('.fieldsPanel')).toBeFalsy();
        });

        it("Verify Delete sort fields functionality", function() {
            var fieldToDelete = 'Numeric Field';
            var sortList = [
                {
                    "fieldId": 6,
                    "sortOrder": "desc",
                    "groupType": null
                },
                {
                    "fieldId": 7,
                    "sortOrder": "asc",
                    "groupType": null
                }
            ];
            var sortFids = [function(row) {return reportSortingPO.getSortValue(row, 6);}];
            var columnListToDisplayInReport = [6, 7];

            //Step 1 - Creating a report with FIDS and sortFIDS as in sortList
            browser.call(function() {
                return e2eBase.reportService.createReportWithFidsAndSortList(testApp.id, testApp.tables[e2eConsts.TABLE1].id, columnListToDisplayInReport, sortList, null, 'Verify Delete').then(function(id) {
                    reportId = id;
                });
            });

            //Step 2 - load the above created report in UI.
            e2ePageBase.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, reportId);

            //Step 3 - Click on sort/Grp Icon
            reportSortingPO.clickSortGroupIconOnReportsPage();

            //Step 4 - Delete a field from sort settings dialogue and also verify field got deleted
            reportSortingPO.deleteFieldsFromSrtGrpDlg(reportSortingPO.sortBySettings, fieldToDelete);

            //Step 5 - Click on Apply button
            reportSortingPO.clickContainerApplyBtn();
            //wait until report rows in table are loaded
            reportContentPO.waitForReportContent();

            //Step 6 - get all table results after deleting a field
            actualTableRecords = reportContentPO.getAllRecordsFromTable();

            //Step 7 - Using API get report records(results) from report 1 (List All report) then get FIDS(specific column) records specified and sort them using LoDash
            expectedRecords = reportSortingPO.getReportResultsAndSortFidsUsingLoDashAndVerify(testApp.id, testApp.tables[e2eConsts.TABLE1].id, DEFAULT_REPORT_ID, columnListToDisplayInReport, sortFids, ['desc']);

            //Step 8 - Verify the actual versus expected sorted records
            reportSortingPO.verifySortedResults(actualTableRecords, expectedRecords);

            //Step 9 - Finally verify if field item got deleted
            reportSortingPO.clickSortGroupIconOnReportsPage();
            var allNonEmptyFields = reportSortingPO.getAllNonEmptyFieldValues(reportSortingPO.sortBySettings);
            expect(allNonEmptyFields.indexOf(fieldToDelete)).toBe(-1);
        });

        //TODO should add other testcase for doing sorting via UI. Right now its a bug that sortOrder Icon not showing up.

    });
}());
