/**
 * E2E small breakpoint tests for navigating from a child record to the parent record
 *
 * Created by klabak on 6/05/17.
 */
(function() {
    'use strict';

    //Load the page Objects
    let newStackAuthPO = requirePO('newStackAuth');
    let e2ePageBase = requirePO('e2ePageBase');
    let reportContentPO = requirePO('reportContent');
    let relationshipsPO = requirePO('relationshipsPage');

    // Global vars used throughout the it blocks
    let realmName;
    let realmId;
    let testApp;

    describe('Relationships - Nav to parent from child record for small breakpoint: ', function() {
        /**
         * Setup method. Creates test app then authenticates into the new stack
         */
        beforeAll(function() {
            browser.logger.info('beforeAll spec function - Generating test data and logging in');
            return e2eBase.basicAppSetup(null).then(function(createdApp) {
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
            // Load the child record directly
            // Navigate to Table 4, Report 1, Record 1
            reportContentPO.openRecordInViewMode(realmName, testApp.id, testApp.tables[e2eConsts.TABLE4].id, 1, 1);
        });

        /**
         * Test method
         */
        it('Navigate to related parent from child record via link', function() {
            // Navigate to parent to collect record values
            reportContentPO.openRecordInViewMode(realmName, testApp.id, testApp.tables[e2eConsts.TABLE3].id, 1, 1);
            let expectedParentRecordValues = relationshipsPO.getValuesFromFormSection(relationshipsPO.getFormSectionEl());

            // Load the child record directly
            // Navigate to Table 4, Report 1, Record 1
            reportContentPO.openRecordInViewMode(realmName, testApp.id, testApp.tables[e2eConsts.TABLE4].id, 1, 1);

            // Click on link to parent (via related Numeric Field)
            relationshipsPO.clickOnFormFieldLinkToParent(relationshipsPO.getFormSectionEl());

            // Slidey uppy comes up
            // Check you are on the right parent container
            let actualParentRecordValues = relationshipsPO.getValuesFromFormSection(relationshipsPO.getFormSectionEl(true));
            expect(actualParentRecordValues).toEqual(expectedParentRecordValues);
        });
    });
}());

