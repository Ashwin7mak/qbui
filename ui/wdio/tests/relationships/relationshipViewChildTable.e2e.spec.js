(function() {
    'use strict';

    //Load the page Objects
    var newStackAuthPO = requirePO('newStackAuth');
    var e2ePageBase = requirePO('e2ePageBase');
    var reportContentPO = requirePO('reportContent');
    var relationshipsPO = requirePO('relationshipsPage');
    var reportInLineEditPO = requirePO('reportInLineEdit');

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
            expect(recordCount).toEqual('0 records');

            // Check there are no records in the child table by default
            browser.waitForExist('.qbTbody', true);
        });

        /**
         *  Create related child records and view them in the child table from the master record
         */
        it('Create related child records and view them in the child table', function() {
            //Step 1 - Go to report without any settings (LIST all report)
            e2ePageBase.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE4].id, 1);

            reportInLineEditPO.openRecordEditMenu(0);

            // Step 2 - Edit the Numeric Field of the first record
            reportInLineEditPO.editNumericField(0, 1);
            reportInLineEditPO.clickSaveChangesButton();

            reportInLineEditPO.openRecordEditMenu(1);

            // Step 2 - Edit the Numeric Field of the second record
            reportInLineEditPO.editNumericField(0, 1);
            reportInLineEditPO.clickSaveChangesButton();

            // Get values for text field
            var record1Text = reportContentPO.getRecordValues(0, 0);
            var record2Text = reportContentPO.getRecordValues(1, 0);

            // Navigate to Table 3, Report 1, Record 1, Relationship Id 1
            relationshipsPO.viewRecordWithChildTable(realmName, testApp.id, testApp.tables[e2eConsts.TABLE3].id, 1, 1, 1);

            // Do assertions on the child table form section
            let childTableFormSection = relationshipsPO.qbPanelFormSectionEl(1);

            let recordCount = relationshipsPO.recordsCountEl(childTableFormSection).getText();
            expect(recordCount).toEqual('2 records');

            // Check the number of related records (should be 1 by default in basicAppSetup)
            let rowCount = reportContentPO.getAllRows.value.length;
            expect(rowCount).toEqual(2);

            var childRecord1Text = reportContentPO.getRecordValues(0, 0);
            var childRecord2Text = reportContentPO.getRecordValues(1, 0);

            expect(record1Text).toEqual(childRecord1Text);
            expect(record2Text).toEqual(childRecord2Text);
        });
    });
}());
