/**
 * E2E tests for remove users from application
 */
(function() {
    'use strict';

    //Load the page Objects
    let e2ePageBase = requirePO('e2ePageBase');
    let NewStackAuthPO = requirePO('newStackAuth');
    let UsersTablePage = requirePO('usersTable');
    let modalDialog = requirePO('/common/modalDialog');
    let ReportTableActionsPO = requirePO('reportTableActions');

    describe('Users - Remove user(s) tests: ', function() {
        let realmName;
        let realmId;
        let testApp;
        /**
         * Setup method. Creates test app then authenticates into the new stack
         */
        beforeAll(function() {
            browser.logger.info('beforeAll spec function - Generating test data and logging in');
            return e2eBase.basicAppSetup().then(function(createdApp) {
                // Set your global objects to use in the test functions
                testApp = createdApp;
                realmName = e2eBase.recordBase.apiBase.realm.subdomain;
                realmId = e2eBase.recordBase.apiBase.realm.id;
            }).then(function() {
                // Auth into the new stack
                return NewStackAuthPO.realmLogin(realmName, realmId);
            }).catch(function(error) {
                // Global catch that will grab any errors from chain above
                // Will appropriately fail the beforeAll method so other tests won't run
                browser.logger.error('Error in beforeAll function:' + JSON.stringify(error));
                return Promise.reject('Error in beforeAll function:' + JSON.stringify(error));
            });
        });

        /**
         * Before each it block reload the user table (can be used as a way to reset state between tests)
         */
        beforeEach(function() {
            //load the users page
            return e2ePageBase.loadUsersInAnAppInBrowser(realmName, testApp.id);
        });

        /**
         * Selects a single user, clicks remove and checks the user count.
         */
        it('Should select remove a single user and check for the success message', function() {
            // Remove user from app
            UsersTablePage.removeUserFromApp(1, false);

            //TODO: MC-3410 - Need a better way to verify user was removed
            // Reload the user page
            // e2ePageBase.loadUsersInAnAppInBrowser(realmName, testApp.id);
            // Check that the user was removed
            // ReportTableActionsPO.selectAllRecordsCheckbox();
            // browser.pause(e2eConsts.shortWaitTimeMs);
            // expect(ReportTableActionsPO.getReportRecordsSelectedCount()).toBe("5");
        });

        /**
         * Selects a single user, clicks remove, cancels, and checks the user count.
         */
        it('Should select remove a single user and cancel ', function() {
            // Remove user from app and cancel
            UsersTablePage.removeUserFromApp(1, true);

            //TODO: MC-3410 - Need a better way to verify user was removed
            // Reload the user page
            // e2ePageBase.loadUsersInAnAppInBrowser(realmName, testApp.id);
            // Check for the user not removed
            // ReportTableActionsPO.selectAllRecordsCheckbox();
            // browser.pause(e2eConsts.shortWaitTimeMs);
            // expect(ReportTableActionsPO.getReportRecordsSelectedCount()).toBe("5");
        });

        /**
         * Selects multiple users, clicks remove and checks the user count.
         */
        it('Should select remove a multiple users and check for the success message', function() {
            // Select mulitple users and click on remove icon
            ReportTableActionsPO.selectMultipleRecordRowCheckboxes([1, 2]);
            UsersTablePage.clickUserRemoveIcon();
            browser.pause(e2eConsts.shortWaitTimeMs);

            // Click on remove button from the dialogue box
            expect(modalDialog.modalDialogTitle).toContain("Remove 2 users?");
            modalDialog.clickOnModalDialogBtn(modalDialog.REMOVE_BTN);
        });
    });
}());
