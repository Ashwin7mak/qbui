(function() {
    'use strict';

    //Load the page Objects
    var newStackAuthPO = requirePO('newStackAuth');
    var e2ePageBase = requirePO('e2ePageBase');
    var reportContentPO = requirePO('reportContent');
    var formsPO = requirePO('formsPage');

    var realmName;
    var realmId;
    var testApp;
    var recordList;

    describe('Edit a record Via Form Tests :', function() {
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
         * Test to Edit a particular record from the GRID edit pencil via form.
         * Fields Tested : text, url, phone, email, numeric, currency, duration, rating, date, dateTime, checkbox and userField.
         */
        it('Edit a record via record actions edit pencil In a Grid', function() {
            var origRecordCount;
            var fieldTypes = ['allTextFields', 'allPhoneFields', 'allEmailFields', 'allUrlFields', 'allDurationFields', 'allNumericFields', 'allDateFields', 'allTimeFields', 'allCheckboxFields', 'allUserField'];

            //Step 1 - Go to report without any settings (LIST all report)
            e2ePageBase.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 1);

            //Step 2 - Get the original records count in a report
            origRecordCount = formsPO.getRecordsCountInATable();

            //Step 3 - Click on 3rd record edit pencil
            formsPO.clickRecordEditPencilInRecordActions(1);

            //Step 4 - Edit values
            fieldTypes.forEach(function(fieldType) {
                formsPO.enterFormValues(fieldType);
            });

            //Step 5 - Click Save on the form
            formsPO.clickFormSaveBtn();
            //wait until report rows in table are loaded
            reportContentPO.waitForReportContent();

            //Step 6 - Verify new record got added on the top of the table and verify the expected field values
            var recordValues = reportContentPO.getRecordValues(1);
            formsPO.verifyFieldValuesInReportTable(recordValues);

            // Step 7 - Reload the report after saving row as the row is added at the last page
            e2ePageBase.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 1);

            // Step 8 - Verify the records count not increased
            expect(formsPO.getRecordsCountInATable()).toBe(origRecordCount);
        });

        /**
         * Test to Edit a particular record from the TABLE edit pencil via form.
         * Fields Tested : text, url, phone, email, numeric, currency, duration, rating, date, dateTime, checkbox and userField.
         */
        it('Edit a record via table actions edit pencil above the table grid', function() {
            var origRecordCount;
            var fieldTypes = ['allTextFields', 'allPhoneFields', 'allEmailFields', 'allUrlFields', 'allDurationFields', 'allNumericFields', 'allDateFields', 'allTimeFields', 'allCheckboxFields', 'allUserField'];

            //Step 1 - Go to report without any settings (LIST all report)
            e2ePageBase.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 1);

            //Step 2 - Get the original records count in a report
            origRecordCount = formsPO.getRecordsCountInATable();

            //Step 3 - Click on 3rd record edit pencil
            formsPO.clickRecordEditPencilInTableActions(2);

            //Step 4 - Edit values
            fieldTypes.forEach(function(fieldType) {
                formsPO.enterFormValues(fieldType);
            });

            //Step 5 - Click Save on the form
            formsPO.clickFormSaveBtn();
            //Verify you land in table view since you edited from table view page
            reportContentPO.waitForReportContent();

            //Step 6 - Verify new record got added on the top of the table and verify the expected field values
            var recordValues = reportContentPO.getRecordValues(2);
            formsPO.verifyFieldValuesInReportTable(recordValues);

            // Step 7 - Reload the report after saving row as the row is added at the last page
            e2ePageBase.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 1);

            // Step 8 - Verify the records count not increased
            expect(formsPO.getRecordsCountInATable()).toBe(origRecordCount);
        });

        /**
         * Test to Edit a particular record from the View Form edit pencil.
         * Fields Tested : text, url, phone, email, numeric, currency, duration, rating, date, dateTime, checkbox and userField.
         */
        it('Edit a record via View Form edit pencil', function() {
            var actualNumbersArray = ['4', '33.33', '$33.33', '33.33'];
            var expectedNumbersArray;
            var fieldTypes = ['allTextFields', 'allPhoneFields', 'allEmailFields', 'allUrlFields', 'allDurationFields', 'allNumericFields', 'allDateFields', 'allTimeFields', 'allCheckboxFields', 'allUserField'];

            //Step 1 - Go to report without any settings (LIST all report)
            e2ePageBase.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 1);

            //Step 2 - Click on 4th(the records count start from 0) record edit pencil
            formsPO.clickRecordEditPencilInViewForm(3);

            //Step 3 - Edit values
            fieldTypes.forEach(function(fieldType) {
                formsPO.enterFormValues(fieldType);
            });

            //Step 4 - Click Save on the form
            formsPO.clickFormSaveBtn();
            //verify You land in view form since you edited a record from View form after saving
            formsPO.waitForViewFormsTableLoad();
            //Verify the record Id is 4 in view form since we edited 4th record
            expectedNumbersArray = browser.elements('div.numericField.viewElement').getText();
            //compare 2 arrays
            expect(actualNumbersArray).toEqual(expectedNumbersArray);
        });

        //TODO add a test to edit null fields and save
    });
}());
