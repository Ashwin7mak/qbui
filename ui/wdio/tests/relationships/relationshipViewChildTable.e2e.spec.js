(function() {
    'use strict';

    //Load the page Objects
    var newStackAuthPO = requirePO('newStackAuth');
    var e2ePageBase = requirePO('e2ePageBase');
    var reportContentPO = requirePO('reportContent');
    var relationshipsPO = requirePO('relationshipsPage');

    var realmName;
    var realmId;
    var testApp;

    describe('Relationships - View Child Table on Form Tests: ', function() {
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
                browser.logger.error('Error in beforeAll function:' + JSON.stringify(error));
                return Promise.reject('Error in beforeAll function:' + JSON.stringify(error));
            });
        });

        /**
         * Navigate to a record (view form) and assert that the form section containing a child table / w records is displayed
         */
        it('View Child Table when viewing a Record', function() {
            // Navigate to Table 3, Report 1, Record 1, Relationship Id 1
            relationshipsPO.viewRecordWithChildTable(realmName, testApp.id, testApp.tables[e2eConsts.TABLE3].id, 1, 1, 1);

            // Do assertions on the child table form section
            let childTableFormSection = relationshipsPO.qbPanelFormSectionEl(1);

            let sectionText =  relationshipsPO.qbPanelHeaderTitleTextEl(childTableFormSection).getText();
            expect(sectionText).toEqual('Child Table A');

            let recordCount = relationshipsPO.recordsCountEl(childTableFormSection).getText();
            expect(recordCount).toEqual('1 record');

            // Check the number of related records (should be 1 by default in basicAppSetup)
            let rowCount = reportContentPO.getAllRows.value.length;
            expect(rowCount).toEqual(1);
        });
    });
}());
