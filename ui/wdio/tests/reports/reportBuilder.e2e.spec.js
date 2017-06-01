(function() {
    'use strict';

    let newStackAuthPO = requirePO('newStackAuth');
    let e2ePageBase = requirePO('e2ePageBase');
    let reportBuilderPO = requirePO('reportBuilder');

    let realmName;
    let realmId;
    let testApp;

    describe('Report Builder Tests: ', function() {
        beforeAll(function() {
            /**
             * Setup method. Creates test app then authenticates into the new stack
             */
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

        beforeEach(function() {
            // open first table
            e2ePageBase.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 1);
            // invoke report builder
            return reportBuilderPO.open();
        });

        xit('verify CANCEL', function() {
            reportBuilderPO.cancel();
        });

        it('hide a column and verify it is hidden', () => {
            // store the list of columns before hiding
            let originalColumns = reportBuilderPO.getHeaderLabels();
            // store the first column label
            let toBeHiddenColumnLabel = originalColumns[0];
            // open the first headerMenu
            reportBuilderPO.clickHeaderMenu();
            // click hide option on menu
            reportBuilderPO.clickHideMenuOption();
            // store the list of columns after hiding
            let hiddenColumns = reportBuilderPO.getHeaderLabels();
            // verify that the hidden columns has one less column that original
            expect(originalColumns.length - 1).toEqual(hiddenColumns.length);
            // verify that the correct hidden column was removed
            expect(hiddenColumns).not.toContain(toBeHiddenColumnLabel);
        });

        xit('hide a column and verify it is visible after CANCEL', () => {
            // store the list of columns before hiding
            let originalColumns = reportBuilderPO.getHeaderLabels();
            // store the first column label
            let toBeHiddenColumnLabel = originalColumns[0];
            // open the first headerMenu
            reportBuilderPO.clickHeaderMenu();
            // click hide option on menu
            reportBuilderPO.clickHideMenuOption();
            // click cancel
            reportBuilderPO.cancel();
            // click don't save
            reportBuilderPO.clickSaveChangesBeforeLeavingDontSaveButton();
            // store the list of columns after hiding and canceling
            let columnsAfterHideAndCancel = reportBuilderPO.getHeaderLabels();
            // verify that columns are the same length
            expect(originalColumns.length).toEqual(columnsAfterHideAndCancel.length);
            // verify that the hidden column is visible after canceling
            expect(columnsAfterHideAndCancel).toContain(toBeHiddenColumnLabel);
        });
    });

}());
