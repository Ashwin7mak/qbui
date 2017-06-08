(function() {
    'use strict';

    //Load the page Objects
    var newStackAuthPO = requirePO('newStackAuth');
    var e2ePageBase = requirePO('e2ePageBase');
    var formsPO = requirePO('formsPage');
    let reportContentPO = requirePO('reportContent');
    let formBuilderPO = requirePO('formBuilder');

    const PARENT_TABLE_WITHOUT_TITLE_FIELD = 'Parent Table A';
    const CHILD_TABLE = 'Child Table A';
    const RECORD_TITLE_FIELD_NAME = '* Record title';
    const GET_ANOTHER_RECORD = 'Get another record';

    describe('Relationships - Create relationship Negative Tests: ', function() {
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
            //Go to report (LIST all report) for child table a in UI which is created via API
            reportContentPO.openRecordInViewMode(realmName, testApp.id, testApp.tables[e2eConsts.TABLE4].id, 1, 1);
            //wait until view form is visible
            return formsPO.viewFormContainerEl.waitForVisible();
        });

        it('Verify title field does not show up with table created via API', function() {

            //Select settings -> modify this form
            formBuilderPO.open();

            //Verify the record title field is not visible for a table created via api.
            let fieldsOnForm = formBuilderPO.getFieldLabels();
            expect(fieldsOnForm.indexOf(RECORD_TITLE_FIELD_NAME) === -1).toBe(true);

            //Click on forms Cancel button
            formsPO.clickFormCancelBtn();
        });

        it('Verify create relationship button is visible even tough there is no parent table with title field', function() {

            //Select settings -> modify this form
            formBuilderPO.open();

            //Verify that the create relationship button is not visible.
            let newFieldsOnForm = formBuilderPO.getNewFieldLabels();
            expect(newFieldsOnForm.includes(GET_ANOTHER_RECORD)).toBe(true);

            //Click on forms Cancel button
            formsPO.clickFormCancelBtn();

        });


        if (browserName === 'chrome' || browserName === 'MicrosoftEdge') {
            it('Verify only recordId shows up in the field list of Add another record relationship modal dialog when there is no parent table with title field', function() {

                let expectedTablesList = ['Table 1', 'Table 2', 'Parent Table A'];
                let expectedFieldsList = ['Record ID#'];

                //Select settings -> modify this form
                formBuilderPO.open();

                //Click on add a new record button
                formBuilderPO.addNewFieldToFormByDoubleClicking(GET_ANOTHER_RECORD);

                //Verify all dialog contents and functionality
                formBuilderPO.verifyGetAnotherRecordRelationshipDialog(expectedTablesList, PARENT_TABLE_WITHOUT_TITLE_FIELD, CHILD_TABLE, expectedFieldsList);
            });
        }


    });
}());
