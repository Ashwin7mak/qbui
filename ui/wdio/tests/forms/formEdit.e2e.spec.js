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

    describe('Forms - Edit a record via form tests: ', function() {
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
         * Test to Edit a particular record from the GRID edit pencil via form.
         * Fields Tested : text, url, phone, email, numeric, currency, duration, rating, date, dateTime, checkbox and userField.
         */
        it('Edit a NULL values record via record actions edit pencil In a Grid', function() {
            var origRecordCount;
            var fieldTypes = ['allTextFields', 'allNumericFields',  'allDurationFields',  'allDateFields', 'allTimeFields'];
            var fieldTypes2 = ['allCheckboxFields', 'allPhoneFields', 'allEmailFields', 'allUrlFields', 'allUserField'];

            //Get the original records count in a report
            origRecordCount = formsPO.getRecordsCountInATable();

            //Click on 5th record (which is NULL values record) edit pencil. Count starts from 0
            reportContentPO.clickRecordEditPencilInRecordActions(4);

            //Edit values
            fieldTypes.forEach(function(fieldType) {
                formsPO.enterFormValues(fieldType);
            });
            fieldTypes2.forEach(function(fieldType) {
                formsPO.enterFormValues(fieldType);
            });

            //Click Save on the form
            formsPO.clickFormSaveBtn();
            //wait until report rows in table are loaded
            reportContentPO.waitForReportContent();

            //Verify record got Edited
            var recordValues = reportContentPO.getRecordValues(4);
            formsPO.verifyFieldValuesInReportTable(recordValues);

            //Reload the report after saving row as the row is added at the last page
            e2ePageBase.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 1);

            //Verify the records count not increased
            expect(formsPO.getRecordsCountInATable()).toBe(origRecordCount);
        });

        /**
         * Test to Edit a particular record from the TABLE edit pencil via form.
         * Fields Tested : text, url, phone, email, numeric, currency, duration, rating, date, dateTime, checkbox and userField.
         */
        it('Edit a record via table actions edit pencil above the table grid', function() {
            var fieldTypes = ['allTextFields', 'allNumericFields',  'allDurationFields',  'allDateFields', 'allTimeFields'];
            var fieldTypes2 = ['allCheckboxFields', 'allPhoneFields', 'allEmailFields', 'allUrlFields', 'allUserField'];

            //Get the original records count in a report
            let origRecordCount = formsPO.getRecordsCountInATable();

            //Click on 1st record edit pencil
            reportContentPO.clickRecordEditPencilInTableActions(1);

            //Edit values
            fieldTypes.forEach(function(fieldType) {
                formsPO.enterFormValues(fieldType);
            });
            fieldTypes2.forEach(function(fieldType) {
                formsPO.enterFormValues(fieldType);
            });

            //Click Save on the form
            formsPO.clickFormSaveBtn();
            //Verify you land in table view since you edited from table view page
            reportContentPO.waitForReportContent();

            //Verify record got Edited
            var recordValues = reportContentPO.getRecordValues(0);
            formsPO.verifyFieldValuesInReportTable(recordValues);
        });

        /**
         * Test to Edit a particular record from the View Form edit pencil.
         * Fields Tested : text, url, phone, email, numeric, currency, duration, rating, date, dateTime, checkbox and userField.
         */
        it('Edit a record via View Form edit pencil', function() {
            //
            //***** These tests don't run in safari browser as 'scrollIntoView' is not supported by safari.
            //
            if (browserName !== 'safari') {
                var actualNumbersArray = ['33.33', '$33.33', '33.33'];
                var expectedNumbersArray;
                var fieldTypes = ['allNumericFields', 'allDurationFields', 'allPhoneFields'];

                //Get the original records count in a report
                let origRecordCount = formsPO.getRecordsCountInATable();

                //Click on 4th(the records count start from 0) record edit pencil
                //click on the record to open in view form mode
                reportContentPO.clickOnRecordInReportTable(0);
                formsPO.viewFormContainerEl.waitForVisible();
                //click on the edit pencil on the view form
                formsPO.clickRecordEditPencilInViewForm(3);

                //Edit values
                fieldTypes.forEach(function(fieldType) {
                    formsPO.enterFormValues(fieldType);
                });

                //Click Save on the form
                formsPO.clickFormSaveBtn();
                //verify You land in view form since you edited a record from View form after saving
                formsPO.waitForViewFormsTableLoad();
                //Verify the we landed in edited record after saving
                expectedNumbersArray = browser.elements('div.numericField.viewElement').getText();
                //compare 2 arrays
                expect(actualNumbersArray).toEqual(expectedNumbersArray);
            }
        });

    });
}());
