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
            return reportBuilderPO.enterBuilderMode();
        });

        it('verify CANCEL', function() {
            // ReportBuilderContainer exists in the browser before clicking on cancel
            let isReportBuilderContainerPresent = reportBuilderPO.reportBuilderContainerIsExisting();
            expect(isReportBuilderContainerPresent).toEqual(true);
            // Clicks cancel after reportBuilder page opens
            reportBuilderPO.clickCancel();
            // ReportBuilderContainer should not exist in the browser after cancel is clicked
            let isReportBuilderContainerPresent1 = reportBuilderPO.reportBuilderContainerIsExisting();
            expect(isReportBuilderContainerPresent1).toEqual(false);
        });

        it('verify add column and click cancel', function() {
            // gets the column list before adding a column
            let columnsListInitial = reportBuilderPO.getColumnLabels();
            // adds a column
            reportBuilderPO.addColumnFromFieldsList();
            // gets the updated column labels after adding the new column
            let columnsListUpdated = reportBuilderPO.getColumnLabels();
            expect(columnsListInitial.length).toEqual(columnsListUpdated.length - 1);
            // clicks on cancel
            reportBuilderPO.clickCancel();
            // re-enters builderMode
            reportBuilderPO.enterBuilderMode();
            // column label list must be equal to the initial list without the added column
            let columnsAfterReopen = reportBuilderPO.getColumnLabels();
            expect(columnsListInitial.length).toEqual(columnsAfterReopen.length);
        });

        it('verify add column by add before', function() {
            // gets the column list before adding a column
            let columnsListInitial = reportBuilderPO.getColumnLabels();
            // adds a column by clicking on AddColumnBefore from headerMenu dropdown
            reportBuilderPO.headerMenuClick();
            reportBuilderPO.addColumnBeforeClick();
            reportBuilderPO.addColumnFromFieldsList();

            // gets the updated column labels after adding the new column
            let columnsListUpdated = reportBuilderPO.getColumnLabels();
            expect(columnsListInitial.length).toEqual(columnsListUpdated.length - 2);
            // clicks on cancel
            reportBuilderPO.clickCancel();
            // re-enters builderMode
            reportBuilderPO.enterBuilderMode();

            // column label list must be equal to the initial list without the added column
            let columnsAfterReopen = reportBuilderPO.getColumnLabels();
            expect(columnsListInitial.length).toEqual(columnsAfterReopen.length);
        });

        it('verify add column by add after', function() {
            // gets the column list before adding a column
            let columnsListInitial = reportBuilderPO.getColumnLabels();
            // adds a column by clicking on AddColumnAfter from headerMenu dropdown
            reportBuilderPO.headerMenuClick();
            reportBuilderPO.addColumnAfterClick();
            reportBuilderPO.addColumnFromFieldsList();
            // gets the updated column labels after adding the new column
            let columnsListUpdated = reportBuilderPO.getColumnLabels();
            expect(columnsListInitial.length).toEqual(columnsListUpdated.length - 2);
            // clicks on cancel
            reportBuilderPO.clickCancel();
            // re-enters builderMode
            reportBuilderPO.enterBuilderMode();

            // column label list must be equal to the initial list without the added column
            let columnsAfterReopen = reportBuilderPO.getColumnLabels();
            expect(columnsListInitial.length).toEqual(columnsAfterReopen.length);
        });
    });
}());
