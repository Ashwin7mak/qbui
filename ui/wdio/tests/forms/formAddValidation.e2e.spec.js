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

    describe('Add Form Validation Tests: ', function() {

        var realmName;
        var realmId;
        var testApp;
        var expectedErrorMessages = ['Numeric Field', 'Numeric Percent Field', 'Duration Field', 'Phone Number Field', 'Email Address Field', 'URL Field'];

        /**
         * Setup method. Creates test app then authenticates into the new stack
         */
        beforeAll(function() {
            browser.logger.info('beforeAll spec function - Generating test data and logging in');
            // Need to return here. beforeAll is completely async, need to return the Promise chain in any before or after functions!
            // No need to call done() anymore
            return e2eBase.basicAppSetup().then(function(createdApp) {
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
                Promise.reject(new Error('Error during test setup beforeAll: ' + error.message));
            });
        });

        /**
         * Before each it block reload the list all report (can be used as a way to reset state between tests)
         */
        beforeEach(function() {
            // Load the List All report on Table 1
            return e2ePageBase.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 1);
        });

        it('Validate for all required fields and correct the errors and Save the record by clicking Save and add another Button', function() {
            var origRecordCount;
            var fieldTypes = ['allTextFields', 'allPhoneFields', 'allEmailFields', 'allUrlFields', 'allDurationFields', 'allNumericFields', 'allDateFields', 'allTimeFields', 'allCheckboxFields', 'allUserField'];

            //Step 1 - Get the original records count in a report
            origRecordCount = formsPO.getRecordsCountInATable();

            //Step 2 - Click on Add Record Button on the report Stage
            formsPO.clickAddRecordBtnOnStage();

            //Step 4 - Click Save on the form
            formsPO.clickFormSaveBtn();

            //Step 5 - Verify all required fields throw error in the container
            formsPO.verifyErrorMessages(expectedErrorMessages);

            //Step 6 - Correct the errors
            for (var i = 0; i < fieldTypes.length; i++) {
                formsPO.enterFormValues(fieldTypes[i]);
            }

            //Step 7 - Click Save & Add Another button on the form
            formsPO.clickFormSaveAndAddAnotherBtn();
            //Verify edit container is loaded
            formsPO.waitForEditFormsTableLoad();

            //Step 10 - Verify Record ID field is empty. Clicking on 'Save and Add Another' button takes to new record
            expect(browser.element('div.numericField.viewElement').getText()).toBe('');
            //verify text field is empty
            expect(browser.element('input.input.textField.borderOnError.cellEdit').getText()).toBe('');
            //verify numeric field is empty
            expect(browser.element('input.input.numericField.borderOnError.cellEdit').getText()).toBe('');

            // Step 8 - Reload the report after saving row as the row is added at the last page
            e2ePageBase.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 1);

            // Step 9 - Verify the records count got increased by 1
            expect(formsPO.getRecordsCountInATable()).toBe(origRecordCount + 1);
        });

        it('Verify error alert button functionality on form Footer', function() {

            //Step 1 - Click on Add Record Button on the report Stage
            formsPO.clickAddRecordBtnOnStage();

            //Step 2 - Click on Save Button on the form without entering any values
            formsPO.clickFormSaveBtn();

            //Step 4 - Verify clicking on alert button on footer hides the error container
            formsPO.clickAlertBtnOnFormFooter();
            // By setting the true flag it will do the inverse of the function (in this case wait for it to be invisible)
            browser.waitForExist('.qbErrorMessageVisible', browser.waitforTimeout, true);
        });

    });
}());
