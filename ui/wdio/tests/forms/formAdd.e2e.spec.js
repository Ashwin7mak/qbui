(function() {
    'use strict';

    //Load the page Objects
    var newStackAuthPO = requirePO('newStackAuth');
    var e2ePageBase = requirePO('e2ePageBase');
    var reportContentPO = requirePO('reportContent');
    var formsPO = requirePO('formsPage');
    var formBuilderPO = requirePO('formBuilder');
    var ReportInLineEditPO = requirePO('reportInLineEdit');

    describe('Forms - Add a record via form tests: ', function() {
        var realmName;
        var realmId;
        var testApp;
        var successMessage = 'Record added';

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

        /**
         * Test to add a record via form.
         * Fields Tested : text, url, phone, email, numeric, currency, duration, rating, date, dateTime, checkbox and userField.
         */
        it('Add a record via form', function() {
            var origRecordCount;
            var fieldTypes = ['allTextFields', 'allNumericFields',  'allDurationFields',  'allDateFields', 'allTimeFields'];
            var fieldTypes2 = ['allCheckboxFields', 'allPhoneFields', 'allEmailFields', 'allUrlFields', 'allUserField'];
            //Step 1 - Get the original records count in a report
            origRecordCount = formsPO.getRecordsCountInATable();

            //Step 2 - Click on Add Record Button on the report Stage
            reportContentPO.clickAddRecordBtnOnStage();

            //Step 3 - enter form values
            fieldTypes.forEach(function(fieldType) {
                formsPO.enterFormValues(fieldType);
            });
            fieldTypes2.forEach(function(fieldType) {
                formsPO.enterFormValues(fieldType);
            });
            //Step 4 - Click Save on the form
            formsPO.clickFormSaveBtn();
            //wait until report rows in table are loaded
            reportContentPO.waitForReportContent();

            //Step 5 - Verify new record got added on the top of the table and verify the expected field values
            var recordValues = reportContentPO.getRecordValues(0);
            formsPO.verifyFieldValuesInReportTable(recordValues);

            // Step 6 - Reload the report after saving row as the row is added at the last page
            e2ePageBase.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 1);

            // Step 7 - Verify the records count got increased by 1
            expect(formsPO.getRecordsCountInATable()).toBe(origRecordCount + 1);
        });

        it('add a field which is both REQUIRED and UNIQUE & verify appropriate errors while adding new record', function() {
            // click on a cell to view a record so that we can edit the form so that we can add new fields
            reportContentPO.clickOnRecordInReportTable(0);
            // add a new field for us to customize (avoiding dragNewFieldToForm for x-browser compatibility)
            formBuilderPO.open().selectFieldByIndex(1);
            formBuilderPO.addNewField("Text");
            // revise the UNIQUE property (i.e. click the unchecked checkbox to check it)
            formBuilderPO.setUniqueCheckboxState(true);
            // revise the REQUIRED property (i.e. click the unchecked checkbox to check it)
            formBuilderPO.setRequiredCheckboxState(true);
            // save the form & new field
            formBuilderPO.save();
            // click on ADD RECORD Button
            reportContentPO.clickAddRecordBtnOnStage();
            // click SAVE button
            formsPO.clickFormSaveBtn();
            // expect REQUIRED error
            expect(formsPO.formErrorMessageHeader.getText()).toBe('Please fix this field');
            let field = formsPO.getFieldByIndex(2);
            expect(formsPO.formErrorMessageContent.getText()).toBe(formBuilderPO.stripAsterisk(field.getText()));
            // dismiss the error
            formsPO.formErrorMessageContainerCloseBtn.click();
            // specify a value
            let testValue = 'test';
            formsPO.setFieldValueByIndex(2, testValue);
            // click SAVE button
            formsPO.clickFormSaveBtn();
            // click on ADD RECORD Button
            reportContentPO.clickAddRecordBtnOnStage();
            // specify the same value as the previous new record
            formsPO.setFieldValueByIndex(2, testValue);
            // click SAVE button
            formsPO.clickFormSaveBtn();
            // expect UNIQUE error
            expect(formsPO.formErrorMessageHeader.getText()).toBe('Please fix this field');
            field = formsPO.getFieldByIndex(2);
            expect(formsPO.formErrorMessageContent.getText()).toBe(formBuilderPO.stripAsterisk(field.getText()));
            // dismiss the error
            formsPO.formErrorMessageContainerCloseBtn.click();
            formsPO.formErrorMessageContainerEl.waitForExist(null, true);
            // make the value unique by appending the same value
            field = field.element('input');
            field.click();
            field.keys(["Command", "ArrowRight", "Command", testValue]);
            // click SAVE button
            formsPO.clickFormSaveBtn(); // needs to go to end of string to append, or something else...?
            // wait until edit form disappears (implicitly assert no error appears)
            formsPO.editFormContainerEl.waitForExist(null, true);
        });
    });
}());
