/**
 * E2E tests for add users from application
 */
(function() {
    'use strict';

    //Load the page Objects
    let e2ePageBase = requirePO('e2ePageBase');
    let NewStackAuthPO = requirePO('newStackAuth');
    let UsersTablePage = requirePO('usersTable');
    let ReportContentPO = requirePO('reportContent');
    let ReportTableActionsPO = requirePO('reportTableActions');
    let modalDialog = requirePO('/common/modalDialog');

    describe('Users - Add user(s) tests: ', function() {
        let realmName;
        let realmId;
        let testApp;
        let user1 = e2eConsts.user1;
        let user2 = e2eConsts.user2;
        let user3 = e2eConsts.user3;
        let user4 = e2eConsts.user4;
        let searchUserName = "spiderman";
        let searchFirstName = "Steve";
        let searchEmail = "super";
        let searchLastName = "King Sr.";
        let searchCrap = "asdfasdf";

        /**
         * Setup method. Creates test app then authenticates into the new stack
         */
        beforeAll(function() {
            browser.logger.info('beforeAll spec function - Generating test data and logging in');
            return e2eBase.createAppWithEmptyRecordsInTable().then(function(createdApp) {
                // Set your global objects to use in the test functions
                testApp = createdApp;
                realmName = e2eBase.recordBase.apiBase.realm.subdomain;
                realmId = e2eBase.recordBase.apiBase.realm.id;
            }).then(function() {
                // Auth into the new stack
                return NewStackAuthPO.realmLogin(realmName, realmId);
            }).then(function() {
                // // Create a user
                return e2eBase.recordBase.apiBase.createSpecificUser(user1).then(function(userResponse) {
                    user1 = JSON.parse(userResponse.body).id;
                });
            }).then(function() {
                // // Create a user
                return e2eBase.recordBase.apiBase.createSpecificUser(user2).then(function(userResponse) {
                    user2 = JSON.parse(userResponse.body).id;
                });
            }).then(function() {
                // // Create a user
                return e2eBase.recordBase.apiBase.createSpecificUser(user3).then(function(userResponse) {
                    user3 = JSON.parse(userResponse.body).id;
                });
            }).then(function() {
                // // Create a user
                return e2eBase.recordBase.apiBase.createSpecificUser(user4).then(function(userResponse) {
                    user4 = JSON.parse(userResponse.body).id;
                });
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
         * Adds a new user by Username, assigns role and verifies the user was added.
         */
        it('Add new user by "Screename" to application with default role "Participant" ', function() {

            // Click on add a new user button
            UsersTablePage.newUserBtn.click();
            expect(modalDialog.modalDialogContainer.isVisible()).toBe(true);
            var appName = testApp.name;
            expect(modalDialog.modalDialogTitlex).toContain(appName);
            // Search for known user
            UsersTablePage.selecthUser(searchUserName);
            // Select user
            UsersTablePage.userAddSearcMenu.click();
            // Click add user
            UsersTablePage.addUserBtn.click();
            // Click No Thanks to Share with User
            browser.pause(e2eConsts.shortWaitTimeMs);
            modalDialog.modalDialogNoThanksButton.click();
        });

        /**
         * Adds a new user by Username, assigns role and verifies the user was added.
         */
        it('Add new user by "First Name" to application with role "Viewer" ', function() {

            // Click on add a new user button
            UsersTablePage.newUserBtn.click();
            // Search for known user
            UsersTablePage.selecthUser(searchFirstName);
            // Select user
            UsersTablePage.userAddSearcMenu.click();
            // Select "Viewer" role
            modalDialog.selectItemFromModalDialogDropDownList(modalDialog.modalDialogRoleSelectorDropDownArrow, "Viewer");
            // Click add user
            UsersTablePage.addUserBtn.click();
            // Click to close the Share with User modal
            modalDialog.modalDialogCloseBtn.click();
        });

        /**
         * Adds a new user by Username, assigns role and verifies the user was added.
         */
        it('Add new user by "Email" to application with role "Administrator" ', function() {

            // Click on add a new user button
            UsersTablePage.newUserBtn.click();
            // Search for known user
            UsersTablePage.selecthUser(searchEmail);
            // Select user
            UsersTablePage.userAddSearcMenu.click();
            // Select "Viewer" role
            modalDialog.selectItemFromModalDialogDropDownList(modalDialog.modalDialogRoleSelectorDropDownArrow, "Administrator");
            // Click add user
            UsersTablePage.addUserBtn.click();
            // Click Copy link to Share with User
            expect(modalDialog.modalDialogCopyBtn.isExisting()).toBe(true);
        });

        /**
         * Adds a new user by Username, assigns role and verifies the user was added.
         */
        it('Add new user by "Last Name" to application with role "none" ', function() {

            // Click on add a new user button
            UsersTablePage.newUserBtn.click();
            // Search for known user
            UsersTablePage.selecthUser(searchLastName);
            // Select user
            UsersTablePage.userAddSearcMenu.click();
            // Select "Viewer" role
            modalDialog.selectItemFromModalDialogDropDownList(modalDialog.modalDialogRoleSelectorDropDownArrow, "None");
            // Click add user
            UsersTablePage.addUserBtn.click();
            // Click Email to Share with User
            expect(modalDialog.modalDialogMailBtn.isExisting()).toBe(true);
        });

        // /**
        //  * Adds a new user by Username, assigns role and verifies the user was added.
        //  */
        // it('Add new user by invalid user to application', function() {
        //
        //     // Click on add a new user button
        //     UsersTablePage.newUserBtn.click();
        //     // Search for known user
        //     UsersTablePage.selecthUser(searchCrap);
        //     expect(UsersTablePage.getNoUsersFound).toBe("No users match what you're looking for");

        // });

    });
}());
