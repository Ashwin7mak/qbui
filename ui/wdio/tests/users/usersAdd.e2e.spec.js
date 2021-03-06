/**
 * E2E tests for add users from application
 */
(function() {
    'use strict';

    //Load the page Objects
    let e2ePageBase = requirePO('e2ePageBase');
    let NewStackAuthPO = requirePO('newStackAuth');
    let UsersTablePage = requirePO('usersTable');
    let modalDialog = requirePO('/common/modalDialog');

    describe('Users - Add user(s) tests: ', function() {
        let realmName;
        let realmId;
        let testApp;
        let user1 = e2eConsts.user1;
        let user2 = e2eConsts.user2;
        let user3 = e2eConsts.user3;
        let user4 = e2eConsts.user4;
        let UserName = "spiderman";
        let FirstName = "Steve";
        let Email = "super";
        let LastName = "King Sr.";
        let Crap = "asdfasdf";

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

        // it is a known issue that browser.keys does not work for E2E on safari and FF so they will not run these tests
        if (browserName === 'chrome' || browserName === 'MicrosoftEdge') {
            /**
            * Adds a new user by Username, assigns role and verifies the user was added.
            */
            it('Add new user by "User Name" to application with default role "Participant" ', function() {
                // Add User with Role to app
                UsersTablePage.addUserToApp(UserName);
            });

            /**
             * Adds a new user by Username, assigns role and verifies the user was added.
             */
            it('Add new user by "First Name" to application with role "Viewer" ', function() {
                // Add User with Role to app
                UsersTablePage.addUserWithRoleToApp(FirstName, "Viewer", false);
            });

            /**
             * Adds a new user by Username, assigns role and verifies the user was added.
             */
            it('Add new user by "Email" to application with role "Administrator" ', function() {
                // Add User with Role to app
                UsersTablePage.addUserWithRoleToApp(Email, "Administrator", false);
            });

            /**
             * Adds a new user by Username, assigns role and verifies the user was added.
             */
            it('Add new user by "Last Name" to application with role "none" ', function() {
                // Add User with Role to app
                UsersTablePage.addUserWithRoleToApp(LastName, "None", false);
            });

            /**
             * Attempts to add a invalid user and cancels
             */
            it('Add new user by invalid user to application and cancel', function() {
                // Add User with Role to app
                UsersTablePage.addUserWithRoleToApp(Crap, "None", true);
            });

            /**
             * Validates app name and add user button disabled
             */
            it('Should verify app name and add user button disabled', function() {
                // Click on add a new user button
                UsersTablePage.newUserBtn.click();
                expect(modalDialog.modalDialogContainer.isVisible()).toBe(true);
                expect(modalDialog.modalDialogTitle).toContain(testApp.name);
                // Verify Add new user button disabled
                expect(modalDialog.modalDialogDisabledBtn.isEnabled()).toBe(false);
                // Click Cancel
                modalDialog.clickOnModalDialogBtn(modalDialog.CANCEL_BTN);
            });
        }
    });
}());
