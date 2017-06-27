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

    describe('Users - Change user(s) role tests: ', function() {
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
         * Selects a single user, clicks change user role, and selects role
         */
        it('Should select a single user, change role to "Viewer"', function() {

            // Select the checkbox and click on change role icon
            ReportTableActionsPO.selectRecordRowCheckbox(1);
            UsersTablePage.clickChangeUserRoleIcon();
            browser.pause(e2eConsts.shortWaitTimeMs);

            // Select user role from the drop down
            expect(modalDialog.modalDialogTitle).toContain('Change the role of');
            UsersTablePage.selectRole("Viewer");
            // Wait for modal to disappear
            browser.pause(e2eConsts.shortWaitTimeMs);

            // Click on change role button from the dialogue box
            modalDialog.clickOnModalDialogBtn(modalDialog.CHANGE_ROLE_BTN);

        });

        /**
         * Selects a single user, clicks change user role, and cancels
         */
        it('Should select a single user, change role and cancel', function() {

            // Select the checkbox and click on change role icon
            ReportTableActionsPO.selectRecordRowCheckbox(1);
            UsersTablePage.clickChangeUserRoleIcon();
            browser.pause(e2eConsts.shortWaitTimeMs);

            // Click on cancel button from the dialogue box
            modalDialog.clickOnModalDialogBtn(modalDialog.CANCEL_BTN);
        });
    });
}());
