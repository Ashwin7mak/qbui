/**
 * E2E tests for error and invalid field validation when adding a new record via a Form.
 */
(function() {
    'use strict';
    //Load the page Objects
    var newStackAuthPO = requirePO('newStackAuth');
    var e2ePageBase = requirePO('e2ePageBase');
    var reportContentPO = requirePO('reportContent');
    var formsPO = requirePO('formsPage');

    describe('Forms - Add Record via Form Validation Tests: ', function() {

        var realmName;
        var realmId;
        var testApp;
        var expectedErrorMessages = ['Phone Number Field', 'Email Address Field'];

        /**
         * Setup method. Creates test app then authenticates into the new stack
         */
        beforeAll(function() {
            browser.logger.info('beforeAll spec function - Generating test data and logging in');
            // Need to return here. beforeAll is completely async, need to return the Promise chain in any before or after functions!
            // No need to call done() anymore
            return e2eBase.basicAppSetup(null, 5).then(function(createdApp) {
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
         * Before each it block reload the list all report (can be used as a way to reset state between tests)
         */
        beforeEach(function() {
            // Load the List All report on Table 1
            return e2ePageBase.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 1);
        });

        it('Validate correct the errors and Save the record by clicking Save and add another Button', function() {
            var origRecordCount;
            var fieldTypes = ['allPhoneFields', 'allEmailFields'];

            //Step 1 - Get the original records count in a report
            origRecordCount = formsPO.getRecordsCountInATable();

            //Step 2 - Click on Add Record Button on the report Stage
            reportContentPO.clickAddRecordBtnOnStage();

            //Step 2 - Enter invalid values to get the form to error state
            fieldTypes.forEach(function(fieldType) {
                formsPO.enterInvalidFormValues(fieldType, '2345-7');
            });

            //Step 4 - Click Save on the form
            formsPO.clickFormSaveBtn();

            //Step 5 - Verify all required fields throw error in the container
            formsPO.verifyErrorMessages(expectedErrorMessages);

            //Step 6 - Correct the errors
            fieldTypes.forEach(function(fieldType) {
                formsPO.enterFormValues(fieldType);
            });

            //Step 7 - Click Save & Add Another button on the form
            formsPO.clickFormSaveAndAddAnotherBtn();
            //Verify edit container is loaded
            formsPO.waitForEditFormsTableLoad();

            //Step 8 - verify text field is empty
            expect(browser.element('input.input.textField.cellEdit').getText()).toBe('');
            //verify numeric field is empty
            expect(browser.element('input.input.numericField.cellEdit').getText()).toBe('');

            // Step 9 - Reload the report after saving row as the row is added at the last page
            e2ePageBase.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 1);

            // Step 10 - Verify the records count got increased by 1
            expect(formsPO.getRecordsCountInATable()).toBe(origRecordCount + 1);
        });

        it('Verify error alert button functionality on form Footer', function() {
            //Step 1 - Click on Add Record Button on the report Stage
            reportContentPO.clickAddRecordBtnOnStage();

            //Step 2 - Enter invalid values to get the form to error state
            var fieldTypes = ['allPhoneFields', 'allEmailFields'];
            fieldTypes.forEach(function(fieldType) {
                //TODO change the empty string to special characters once MB-1970 is fixed.
                formsPO.enterInvalidFormValues(fieldType, '2345-7');
            });

            //Step 2 - Click on Save Button on the form without entering any values
            formsPO.clickFormSaveBtn();

            //Step 4 - Verify clicking on alert button on footer hides the error container
            formsPO.clickAlertBtnOnFormFooter();
            // By setting the true flag it will do the inverse of the function (in this case wait for it to be invisible)
            browser.waitForExist('.qbErrorMessageVisible', browser.waitforTimeout, true);

            //step 5 - Close the dirty form
            formsPO.clickFormCloseBtn();
        });

    });
}());
