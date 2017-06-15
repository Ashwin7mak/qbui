/**
 * E2E tests for the reportSearch of the Reports page
 * cperikal 05/03/2017
 */
(function() {
    'use strict';

    let newStackAuthPO = requirePO('newStackAuth');
    let reportContentPO = requirePO('reportContent');
    let _ = require('lodash');

    describe('Reports Page - Report Search Tests: ', function() {
        let realmName;
        let realmId;
        let testApp;
        let DEFAULT_REPORT_ID = 1;
        let sampleText = "reportA";
        let actualRecords;
        let randomRecord;

        /**
         * Setup method. Creates test app then authenticates into the new stack
         */
        beforeAll(function() {
            browser.logger.info('beforeAll spec function - Generating test data and logging in');
            // Need to return here. beforeAll is completely async, need to return the Promise chain in any before or after functions!
            // No need to call done() anymore
            return e2eBase.basicAppSetup(null, 5).then(function(createdApp) {
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
         * Before each it block reloads the report and selects the random record(can be used as a way to reset state between tests)
         */
        beforeEach(function() {
            e2ePageBase.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, DEFAULT_REPORT_ID);
            let reportEndpoint = e2eBase.recordBase.apiBase.resolveReportsResultsEndpoint(testApp.id, testApp.tables[e2eConsts.TABLE1].id, DEFAULT_REPORT_ID);
            browser.call(function() {
                return e2eBase.recordBase.apiBase.executeRequest(reportEndpoint, consts.GET).then(function(reportResult) {
                    let results = JSON.parse(reportResult.body);
                    actualRecords = results.records;
                });
            });
            let math = Math.floor(Math.random() * (actualRecords.length - 1));
            randomRecord = actualRecords[math];
        });

        /**
         * Test methods to verify various kinds of input types in search box
         */

        it("Verify the search box and clear button", function() {

            //Step 1 - Verify if the search box is visible
            reportContentPO.reportFilterSearchBox.waitForVisible();

            //Step 2 - Verify the no.of displayed records
            let rowsBeforeClear = reportContentPO.reportDisplayedRecordCount();

            //Step 3 - Verify to enter the text in the searchBox
            reportContentPO.reportFilterSearchBox.setValue(sampleText);

            //Step 4 - Verify if the clear(X) search button is clickable
            reportContentPO.clearSearch.click();

            //Step 5 - Verify the no.of records after clearing search
            let rowsAfterClear = reportContentPO.reportDisplayedRecordCount();

            //Step 6 - Verify no.of records before and after clear search to be equal
            expect(rowsBeforeClear).toEqual(rowsAfterClear);
        });

        it('Verify search results for Text', function() {

            //Step 1 - Enter the value into search box

            let textValue = _.find(randomRecord, {id: 6}).value ;
            reportContentPO.reportSearchEnterValues(textValue);

            //Step 2 - Get the actual table value
            let searchedTableRecords = reportContentPO.getAllRecordsFromTable();

            //Step 3 - Verify the Value present in each of the searchedTableRecords
            expect(searchedTableRecords.length).toBeGreaterThan(0);
            searchedTableRecords.forEach(function(expectedRecord) {
                expect(expectedRecord).toContain(textValue);
            });
        });

        it('Verify search results for Numeric', function() {

            //Step 1 - Enter the value into search box
            let numericValue = JSON.stringify(_.find(randomRecord, {id: 7}).value);
            reportContentPO.reportSearchEnterValues(numericValue);

            //Step 2 - Get the actual table value
            let searchedTableRecords = reportContentPO.getAllRecordsFromTable();

            //Step 3 - Verify the Value
            expect(searchedTableRecords.length).toBeGreaterThan(0);
            searchedTableRecords.forEach(function(expectedRecord) {
                expect(expectedRecord).toContain(numericValue);
            });
        });

        it('Verify search results for Currency', function() {

            //Step 1 - Enter the value into search box
            let currencyValue = JSON.stringify(_.find(randomRecord, {id: 8}).value);
            reportContentPO.reportSearchEnterValues(currencyValue);

            //Step 2 - Get the actual table value
            let searchedTableRecords = reportContentPO.getAllRecordsFromTable();

            //Step 3 - Verify the Value
            expect(searchedTableRecords.length).toBeGreaterThan(0);
            searchedTableRecords.forEach(function(expectedRecord) {
                expect(expectedRecord).toContain('$' + currencyValue);
            });
        });

        it('Verify search results for Percentage', function() {

            //Step 1 - Enter the value into search box
            let percentageValue = JSON.stringify(_.find(randomRecord, {id: 9}).value);
            reportContentPO.reportSearchEnterValues(percentageValue);

            //Step 2 - Get the actual table value
            let searchedTableRecords = reportContentPO.getAllRecordsFromTable();

            //Step 3 - Verify the Value
            expect(searchedTableRecords.length).toBeGreaterThan(0);
            searchedTableRecords.forEach(function(expectedRecord) {
                expect(expectedRecord).toContain((percentageValue * 100) + '%');
            });
        });
    });
}());
