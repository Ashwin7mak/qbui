/**
 * E2E tests for Adding a Record via Inline 'Save and Add New Row' Button on Reports page.
 * Created by klabak on 10/29/2016
 */
(function() {
    'use strict';

    //Load the page Objects
    var NewStackAuthPO = require('../pages/newStackAuth.po');
    var ReportContentPO = require('../pages/reportContent.po');
    var ReportInLineEditPO = require('../pages/reportInLineEdit.po');
    var ReportPagingPO = require('../pages/reportPaging.po');

    describe('Reports Page - Add Record Tests', function() {
        var realmName;
        var realmId;
        var testApp;

        /**
         * Setup method. Creates test app then authenticates into the new stack
         */
        beforeAll(function() {
            console.log('beforeAll function - Generating test data and logging in');
            // Need to return here. beforeAll is completely async, need to return the Promise chain in any before or after functions!
            // No need to call done() anymore
            return e2eBase.defaultAppSetup().then(function(createdApp) {
                // Set your global objects to use in the test functions
                testApp = createdApp;
                realmName = e2eBase.recordBase.apiBase.realm.subdomain;
                realmId = e2eBase.recordBase.apiBase.realm.id;
            }).then(function() {
                // Auth into the new stack
                return NewStackAuthPO.realmLogin(realmName, realmId);
            }).then(function() {
                // Load the List All report on Table 1
                return e2eBase.reportService.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 1);
            }).catch(function(error) {
                // Global catch that will grab any errors from chain above
                // Will appropriately fail the beforeAll method so other tests won't run
                Promise.reject(new Error('Error during test setup beforeAll: ' + error.message));
            });
        });

        it('Click Save and Add a New Record Button, Add a new Record, Assert record is added to the last page', function() {
            console.log('Running the test!');
            browser.waitForVisible('.ag-body-container');

            var textToEnter = 'SaveAndAddANewRow';
            var numToEnter = 20;
            var dateToEnter = '03-11-1985';
            var dateToExpect = '03-12-1985';
            var successMessage = 'Record added';

            // Step 1- Double click on a record to enter inline edit mode and then 'Save and Add a New Row' button
            ReportInLineEditPO.openRecordEditMenu(3);
            ReportInLineEditPO.clickSaveAddNewRowButton();

            // Step 2 - Add new row - Text field, num field, date field
            ReportInLineEditPO.editTextField(0, textToEnter);
            ReportInLineEditPO.editNumericField(0, numToEnter);
            ReportInLineEditPO.editDateField(0, dateToEnter);

            // Step 3 - Open the calendar widget and Advance the date ahead 1 day
            ReportInLineEditPO.openDateFieldCalWidget(0);
            ReportInLineEditPO.advanceCurrentlySelectedDate(0);

            // Step 4 - Save the new added row
            ReportInLineEditPO.clickSaveChangesButton();

            // Step 5 - Check for the success message 'Record added'
            ReportInLineEditPO.assertSuccessMessage(successMessage);

            // Step 6 - Reload the report after saving row as the row is added at the last page
            e2eBase.reportService.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 1);
            browser.waitForVisible('.ag-body-container');

            // Step 7 - Go to the second page to check that the record is added at the last row (due to sorting)
            ReportPagingPO.clickPagingNavButton(ReportPagingPO.pagingToolbarNextButton);
            var numOfRows = ReportContentPO.reportDisplayedRecordCount();
            var recordValues = ReportContentPO.getRecordValues(numOfRows - 1);
            expect(recordValues[1]).toBe(textToEnter);
            expect(recordValues[6]).toBe(dateToExpect);
        });

        //TODO: Editing a row after pressing 'Save and Add new row' button
    });
}());
