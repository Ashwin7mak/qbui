(function() {
    'use strict';

    //Load the page Objects
    var newStackAuthPO = requirePO('newStackAuth');
    var e2ePageBase = requirePO('e2ePageBase');
    var reportContentPO = requirePO('reportContent');
    var formsPO = requirePO('formsPage');

    describe('Edit Form Validation Tests :', function() {

        var realmName;
        var realmId;
        var testApp;

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
                throw new Error('Error during test setup beforeAll: ' + error.message);
            });
        });

        /**
         * Before each it block reload the list all report (can be used as a way to reset state between tests)
         */
        beforeEach(function() {
            // Load the List All report on Table 1
            return e2ePageBase.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 1);
        });

        it('Get into Error Form State, Validate Errors, Correct the errors and Verify Saving the record successfully', function() {
            var fieldTypes = ['allNumericFields', 'allDurationFields', 'allPhoneFields', 'allEmailFields'];
            var expectedErrorMessages = ['Numeric Field', 'Numeric Percent Field', 'Duration Field', 'Phone Number Field', 'Email Address Field'];
            //TODO verify why URL field is not throwing error when given special characters

            //Step 1 - Click on 2nd record edit pencil
            formsPO.clickRecordEditPencilInRecordActions(4);

            //Step 2 - Enter invalid values to get the form to error state
            fieldTypes.forEach(function(fieldType) {
                formsPO.enterInvalidFormValues(fieldType, '!@#$%^');
            });

            //Step 3 - Click Save on the form
            formsPO.clickFormSaveBtn();

            //Step 4 - Verify the required fields that the form complains
            formsPO.verifyErrorMessages(expectedErrorMessages);

            //Step 6 - Correct the errors
            fieldTypes.forEach(function(fieldType) {
                formsPO.enterFormValues(fieldType);
            });

            //Step 7 - Click Save & Add Another button on the form
            formsPO.clickFormSaveAndNextBtn();

            //Step 9 - Verify edit container is loaded after hitting
            formsPO.waitForEditFormsTableLoad();

            //Step 10 - Verify Record ID field has record 6 since we edited record 5. Clicking on 'Save and Next' button takes to next record
            expect(browser.element('div.numericField.viewElement').getText()).toBe('6');
        });

    });
}());
