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

        it('drag a column without dropping, then drag back to original field, release & verify no change', function() {
            let originalColumns = reportBuilderPO.getColumnLabels();

            // drag 1st column onto 2nd
            let source = reportBuilderPO.getReportLocator(1);
            let target = reportBuilderPO.getReportLocator(3);

            // drag source to target without dropping
            browser.moveToObject(source);
            browser.buttonDown(0);
            browser.moveToObject(target);

            browser.pause(e2eConsts.shortWaitTimeMs);
            browser.moveToObject(source);
            browser.buttonUp(0);

            // verify original order
            let newColumns = reportBuilderPO.getColumnLabels();
            expect(reportBuilderPO.getColumnLabels()).toEqual(originalColumns);
            expect(newColumns[0]).toBe(originalColumns[0]);
            expect(newColumns[2]).toBe(originalColumns[2]);

            reportBuilderPO.clickCancel();
            reportBuilderPO.clickSaveChangesBeforeLeavingDontSaveButton();
            // ReportBuilderContainer should not exist in the browser after cancel is clicked
            let isReportBuilderContainerPresent1 = reportBuilderPO.reportBuilderContainerIsExisting();
            expect(isReportBuilderContainerPresent1).toEqual(false);
        });

        it('drag/drop a column & verify move', function() {
            let originalColumns = reportBuilderPO.getColumnLabels();

            let source = reportBuilderPO.getReportLocator(1);
            let target = reportBuilderPO.getReportLocator(2);

            // move the first column to second position
            browser.moveToObject(source);
            browser.buttonDown(0);
            browser.moveToObject(target);
            browser.buttonUp(0);

            // verify the new order
            let newColumns = reportBuilderPO.getColumnLabels();
            expect(reportBuilderPO.getColumnLabels().length).toBe(originalColumns.length);
            expect(newColumns[0]).toBe(originalColumns[1]);
            expect(newColumns[1]).toBe(originalColumns[0]);
            reportBuilderPO.clickCancel();
            reportBuilderPO.clickSaveChangesBeforeLeavingDontSaveButton();

            // ReportBuilderContainer should not exist in the browser after cancel is clicked
            let isReportBuilderContainerPresent1 = reportBuilderPO.reportBuilderContainerIsExisting();
            expect(isReportBuilderContainerPresent1).toEqual(false);
        });

    });

}());
