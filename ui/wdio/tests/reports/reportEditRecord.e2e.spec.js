/**
 * E2E tests for Editing Records In-line via the Table Report page
 * Created by klabak on 6/1/15
 */
(function() {
    'use strict';
    //Load the page Objects
    var e2ePageBase = require('../../pages/e2ePageBase.po');
    var NewStackAuthPO = require('../../pages/newStackAuth.po');
    var ReportContentPO = require('../../pages/reportContent.po');
    var ReportInLineEditPO = require('../../pages/reportInLineEdit.po');
    var ReportPagingPO = require('../../pages/reportPaging.po');


    describe('Report Page Edit Record Tests', function() {
        var realmName;
        var realmId;
        var testApp;
        beforeAll(function() {
            browser.logger.info('beforeAll spec function - Generating test data and logging in');
            // // Need to return here. beforeAll is completely async, need to return the Promise chain in any before or after functions!
            // // No need to call done() anymore
            return e2eBase.basicAppSetup().then(function(createdApp) {
                // Set your global objects to use in the test functions
                testApp = createdApp;
                realmName = e2eBase.recordBase.apiBase.realm.subdomain;
                realmId = e2eBase.recordBase.apiBase.realm.id;
            }).then(function() {
                // Auth into the new stack
                return NewStackAuthPO.realmLogin(realmName, realmId);
            }).catch(function(error) {
                // Global catch that will grab any errors from chain above
                // Will appropriately fail the beforeAll method so other tests won't run
                Promise.reject(new Error('Error during test setup beforeAll: ' + error.message));
            });
        });


        /**
         * Before each test starts just make sure the report has loaded with records visible
         */
        beforeEach(function() {
            e2ePageBase.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 1);
            return ReportContentPO.waitForReportContent();
        });

        /**
         * Test Method - In-line edit menu should have three actions
         */

        // it('In-line edit menu should have three actions (save, save and add new, cancel)', function() {
        //
        //     browser.logger.info('it spec function - Running the test');
        //
        //     //Step 1 -  Open the in-line edit menu for the first record in the report
        //     ReportInLineEditPO.openRecordEditMenu(0);
        //
        //     //Step 2 -  Check that the three buttons are visible
        //     ReportInLineEditPO.assertInlineEditMenuButtonsTobeTrue();
        //
        //     //step 3 - Close the edit menu
        //     ReportInLineEditPO.clickCancelButton();
        // });

        /**
         * Test Method. Record in-line editing test on a report.
         */
        // it('Should allow you to in-line edit multiple fields in a report record', function() {
        //
        //     //Variable declarations
        //     var textToEnter = 'My new text';
        //     var dateToEnter = '03-11-1985';
        //     var dateToExpect = '03-12-1985';
        //     var successMessage = 'Record saved';
        //
        //     //Step 1 - Open the in-line edit menu for the first record in the report
        //     ReportInLineEditPO.openRecordEditMenu(0);
        //
        //     // Step 2 - Edit the Text Field
        //     ReportInLineEditPO.editTextField(0, textToEnter);
        //
        //     // Steps 3 - Edit the Date Field
        //     // Set the value of the input box so the calendar widget will be set
        //     ReportInLineEditPO.editDateField(0, dateToEnter);
        //     // Open the calendar widget and advance the present date by 1 day
        //     if (browserName !== 'safari') {
        //         ReportInLineEditPO.openDateFieldCalWidget(0);
        //         ReportInLineEditPO.advanceCurrentlySelectedDate(0);
        //     }
        //
        //     // Step 4 - Save the edit
        //     ReportInLineEditPO.clickSaveChangesButton();
        //     //TODO: See if we can handle this a different way so it will work 100%. Would like to have this assertion
        //     //ReportInLineEditPO.assertSuccessMessage(successMessage);
        //     expect(browser.isVisible('.qbRow.editing .saveRecord')).toBeFalsy();
        //     expect(browser.isVisible('.qbRow.editing .cancelSelection')).toBeFalsy();
        //     expect(browser.isVisible('.qbRow.editing .addRecord')).toBeFalsy();
        //
        //     // Step 5 - Reload the report after saving
        //     e2ePageBase.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 1);
        //
        //     // Step 6 - Check for the edited value at the edited row
        //     var recordValues = ReportContentPO.getRecordValues(0);
        //     expect(recordValues[1]).toBe(textToEnter, 'Expected Text is not present');
        //
        //     //If browser is safari then we are not advancing the present date by 1 day
        //     if (browserName !== 'safari') {
        //         expect(recordValues[6]).toBe(dateToExpect, 'Expected date is not present');
        //     } else {
        //         expect(recordValues[6]).toBe(dateToEnter, 'Expected date is not present');
        //     }
        //
        // });
        //
        /**
         * Test Method. Tests in-line editing with Pagination.
         */
        it('Should allow you to in-line edit a record on the second page', function() {
            //Variable declarations
            var textToEnter = 'My new text on page 2';
            var successMessage = 'Record saved';

            // Steps 1- Go to the second page of records
            ReportPagingPO.clickPagingNavButton(ReportPagingPO.pagingToolbarNextButton);

            // Step 2 - Open the in-line edit menu for the first record on that page
            ReportInLineEditPO.openRecordEditMenu(0);

            // Step 3 - Edit the Text Field
            ReportInLineEditPO.editTextField(0, textToEnter);

            // Step 4 - Save the edit
            ReportInLineEditPO.clickSaveChangesButton();
            // browser.waitForText(textToEnter);
            expect(browser.isVisible('.qbRow.editing .saveRecord')).toBeFalsy();
            expect(browser.isVisible('.qbRow.editing .cancelSelection')).toBeFalsy();
            expect(browser.isVisible('.qbRow.editing .addRecord')).toBeFalsy();

            // Step 5 - Check for the success message 'Record added'
            //TODO: See if we can handle this a different way so it will work 100%. Would like to have this assertion
            //ReportInLineEditPO.assertSuccessMessage(successMessage);

            // Step 6 - Check that the edit persisted on the report
            var recordValues = ReportContentPO.getRecordValues(0);
            expect(recordValues[1]).toBe(textToEnter);

            // Step 7 - Go back to the first page of records
            ReportPagingPO.clickPagingNavButton(ReportPagingPO.pagingToolbarPrevButton);
        });
        //
        // /**
        //  * Test Method. Cancel button test for in-line editing.
        //  */
        // it('Cancel button should not save edit updates to a record', function() {
        //     //Note this is not working on safari
        //     if (browserName !== 'safari') {
        //         var textToEnter = 'My new text 2';
        //
        //         //Step 1 - Get the original value of the text field on the second record
        //         var fieldValues = ReportContentPO.getRecordValues(1);
        //         var originalText = fieldValues[1];
        //
        //         //Step 2 - Open the in-line edit menu for the second record
        //         ReportInLineEditPO.openRecordEditMenu(1);
        //
        //         // Step 3 - Edit the Text Field
        //         ReportInLineEditPO.editTextField(0, textToEnter);
        //
        //         // Step 4 - Click the cancel button
        //         ReportInLineEditPO.clickCancelButton();
        //
        //         //Step 5 - Extra Assertions for inline Edit to be invisible
        //         expect(browser.isVisible('.qbRow.editing .saveRecord')).toBeFalsy();
        //         expect(browser.isVisible('.qbRow.editing .cancelSelection')).toBeFalsy();
        //         expect(browser.isVisible('.qbRow.editing .addRecord')).toBeFalsy();
        //
        //         // Check that the edit was not persisted on report
        //         var fieldValues2 = ReportContentPO.getRecordValues(1);
        //         expect(fieldValues2[1]).toBe(originalText);
        //     }
        // });
        //
        //
        // //TODO: Required field test, Need to extend setup data for this
        //
        // //TODO: Invalid input value tests (text in a date field)
        //
        // //TODO: Check that record ID isn't editable
    });
}());
