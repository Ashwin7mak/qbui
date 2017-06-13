/**
 * E2E tests for the topNav of the Reports page
 * cperikal 5/22/2017
 */
(function() {
    'use strict';

    let newStackAuthPO = requirePO('newStackAuth');
    let e2ePageBase = requirePO('e2ePageBase');
    let formsPO = requirePO('formsPage');

    describe('Forms - Add Record Tests: ', function() {
        let realmName;
        let realmId;
        let testApp;

        /**
         * Setup method. Creates test app then authenticates into the new stack
         */

        beforeAll(function() {
            browser.logger.info('beforeAll spec function - Generating test data and logging in');
            // Need to return here. beforeAll is completely async, need to return the Promise chain in any before or after functions!
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

        beforeEach(function() {
            //Navigate to tables home page
            return e2ePageBase.navigateTo(e2eBase.getRequestReportsPageEndpoint(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 0));
        });

        it('Add a record via form', function() {

            let fieldTypes = ['allTextFields', 'allPhoneFields', 'allEmailFields', 'allUrlFields', 'allDurationFields', 'allNumericFields', 'allTimeFields', 'allCheckboxFields', 'allUserField'];

            // Get the original records count in a report
            let origRecordCount = formsPO.getRecordsCountInATable();

            // Click on Add Record Button
            formsPO.clickAddRecordOnSBP();

            // Enter form values
            fieldTypes.forEach(function(fieldType) {
                formsPO.enterFormValues(fieldType);
            });

            // Click Save on the form
            formsPO.clickFormSaveBtn();

            // Verify new record got added and count got increased by 1
            let newRecordCount = formsPO.getRecordsCountInATable();
            expect(newRecordCount).toBe(origRecordCount + 1);
        });

        it('Click on close button on form', function() {

            // Get the original records count in a report
            let origRecordCount = formsPO.getRecordsCountInATable();

            // Click on Add Record Button
            formsPO.clickAddRecordOnSBP();

            // Click cancel on the form
            formsPO.clickFormCloseBtn();

            // Verify the new record count is same as original record count
            let newRecordCount = formsPO.getRecordsCountInATable();
            expect(newRecordCount).toBe(origRecordCount);
        });
    });
}());
