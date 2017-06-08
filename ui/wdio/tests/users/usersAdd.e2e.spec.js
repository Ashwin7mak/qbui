/**
 * E2E tests for add users from application
 */
(function() {
    'use strict';

    //Load the page Objects
    let e2ePageBase = requirePO('e2ePageBase');
    let NewStackAuthPO = requirePO('newStackAuth');
    let RequestAppsPage = requirePO('requestApps');
    let UsersTablePage = requirePO('usersTable');
    let ReportContentPO = requirePO('reportContent');
    let ReportTableActionsPO = requirePO('reportTableActions');

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
            RequestAppsPage.get(e2eBase.getRequestUsersEndpoint(realmName, testApp.id));
            //wait until user table rows are loaded
            ReportContentPO.waitForReportContent();
            //Wait until you see newUser button
            return UsersTablePage.newUserBtn.waitForVisible();
        });
        /**
         * Adds a new user by Username, assigns role and verifies the user was added.
         */
        it('Add new user to application with default role "Participant', function() {

            // Click on add a new user button
            UsersTablePage.newUserBtn.click();

            // Search for known user
            UsersTablePage.selecthUser(searchUserName);

            // Select user
            UsersTablePage.userAddSearcMenu.click();

            browser.pause(e2eConsts.shortWaitTimeMs);

            // Select role
            UsersTablePage.selectRole(UsersTablePage.userRoleSelection, "Viewer");



            // browser.selectByAttribute('id', 'react-select-7--value-item').click;
            // var trial=browser.elements('.Select-arrow-zone');
            // // browser.click(trial[1]);
            // console.log(trial);
            // console.log("qwerty")
            // browser.click('#react-select-7--value-item')

            // browser.selectByValue('.modal-dialog .Select-value-label, "Administrator"');
            // browser.element('.selectUser .Select-arrow-zone').waitForVisible();
            // browser.element('.selectUser .Select-arrow-zone').click();
            // browser.element('.Select-outer-menu').waitForVisible();
            // browser.keys(['admin'])
            // browser.element('.modal-dialog').click();

            // browser.element('.assignRole .Select-arrow-zone').waitForVisible();
            // browser.element('.assignRole .Select-arrow-zone').click();
            // browser.element('.Select-value').waitForVisible();
            // browser.element('.Select-value .Select-value-label').click();


            // console.log((results.getAttribute('index') == 1));
            // console.log("qwerty");
            // browser.click(results.getAttribute('index') == 1);

            // Click add user
            UsersTablePage.addUserBtn.click();

            browser.pause(e2eConsts.shortWaitTimeMs);

            // Share with user


            // Verify user was added to report with correct role







        });
    });
}());
