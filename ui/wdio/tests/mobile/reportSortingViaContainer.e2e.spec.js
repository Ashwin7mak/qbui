(function() {
    'use strict';

    //Load the page Objects
    let newStackAuthPO = requirePO('newStackAuth');
    let e2ePageBase = requirePO('e2ePageBase');
    let reportSortingPO = requirePO('reportSortingGrouping');
    let reportContentPO = requirePO('reportContent');
    let _ = require('lodash');
    var assert = require('assert');

    describe('Reports - Sorting Via Container Tests: ', function() {
        let realmName;
        let realmId;
        let testApp;
        let reportId;
        let DEFAULT_REPORT_ID = 1;
        let actualTableRecords = [];

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

        it('Sorting via UI', function() {
            //var sortFieldsInUI = ['Text Field', 'Numeric Field']

            var sortFieldsInUI = [{fieldType : 'Text Field', sortOrder: 'asc'}, {fieldType : 'Numeric Field', sortOrder: 'desc'}];

            //Step 1 - Create a report with just TextField and NumericField
            browser.call(function() {
                return e2eBase.reportService.createReportWithFidsAndSortList(testApp.id, testApp.tables[e2eConsts.TABLE1].id, [6, 7], null, null, "Verify Sorting via UI").then(function(id) {
                    reportId = id;
                });
            });

            //Step 2 - load the above created report in UI.
            reportContentPO.loadReportByIdInBrowserSB(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, reportId);

            //Step 3 - Click on sort/Grp Icon
            reportSortingPO.clickSortGroupIconOnReportsPage();
            reportSortingPO.sortBySettings.waitForVisible();

            //Step 4 - Delete date modified sort which is already in there as default
            reportSortingPO.deleteFieldsFromSrtGrpDlg(reportSortingPO.sortBySettings, 'Date Modified');

            //Step 5 - Choose sort fields in sort/grp container
            sortFieldsInUI.forEach(function(field) {
                reportSortingPO.selectFieldsInSrtGrpDlg(reportSortingPO.sortBySettings, 'Choose a field to sort by', field.fieldType);
            });

            //Step 6 - Assign sort Order to the fields in sort/grp container
            sortFieldsInUI.forEach(function(field) {
                reportSortingPO.sortFieldsFromSrtGrpDlg(field.fieldType, field.sortOrder);
            });

            //Step 7 - Click on Apply button
            browser.element('.settingsDialog .applyButton').waitForVisible();
            browser.element('.settingsDialog .applyButton').click();
            //wait until report rows in table are loaded
            reportContentPO.waitForReportContentSB();

            //Step 8 - Get all records from the report table
            reportContentPO.getAllRowsCellValuesSB.value.filter(function(elm) {
                actualTableRecords.push(elm.getText());
            });

            //Step 9 - Using API get report records(results) from report 1 (List All report) then get FIDS(specific column) records specified and sort them using LoDash
            var lodashResults = reportSortingPO.getReportResultsAndSortFidsUsingLoDashAndVerify(testApp.id, testApp.tables[e2eConsts.TABLE1].id, DEFAULT_REPORT_ID, [6, 7], [function(row) {return reportSortingPO.getSortValue(row, 6);}, function(row) {return reportSortingPO.getSortValue(row, 7);}], ['asc', 'desc']);

            //Step 10 - Verify actual table records versus expected lodash sorted records
            reportSortingPO.verifySortedResults(actualTableRecords, lodashResults);
        });

        it("Verify sort/grp dialogue and the close dialogue functionality", function() {
            //Step 1 - load the defaulr report 'List-All Reposrt'
            reportContentPO.loadReportByIdInBrowserSB(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, DEFAULT_REPORT_ID);

            //Step 2 - Click on sort/Grp Icon
            reportSortingPO.clickSortGroupIconOnReportsPage();
            reportSortingPO.sortBySettings.waitForVisible();

            //Step 3 - Verify the title of the container is in the center
            expect(browser.element('.settingsDialog .overlayCenter').getAttribute('textContent')).toBe('Sort & Group');

            //TODO .overlayLeft is same for both apply and close button
            //Step 4 - verify close button is left side and is enabled
            expect(browser.isEnabled('.settingsDialog .smallHeader .btn-default')).toBeTruthy();
            //Step 5 - verify apply button is right side and is enabled
            expect(browser.isEnabled('.settingsDialog .applyButton')).toBeTruthy();

            //Step 6 - verify reset button is on the bottom on the dialogueBand and is enabled
            expect(browser.isEnabled('.settingsDialog .dialogBand .reset')).toBeTruthy();

            //Step 7 - Verify title of GroupBy Container
            expect(browser.element('.groupBySettings .title').getAttribute('textContent')).toEqual('Group');
            //Step 8 - Verify title of SortBy Container
            expect(browser.element('.sortBySettings .title').getAttribute('textContent')).toEqual('Sort');

            //Step 9 - Click on close button of the sort/Grp dialogue
            browser.element('.settingsDialog .smallHeader .btn-default').click();
            //Step 10 - Verify sort/grp dialogue dissapered
            expect(browser.isVisible('.settingsDialog')).toBeFalsy();
        });
    });
}());
