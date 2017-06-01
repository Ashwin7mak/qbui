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
        let searchText = "spiderman";

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
         * Adds a new user, assigns role and verifies the user was added in report.
         */
        it('Add new user to application', function() {

            //Click on add a new user button
            UsersTablePage.newUserBtn.click();

            // Click on select user search
            // UsersTablePage.userAddSearchBoxSelect.click();
            // browser.element('.Select.Select--single.is-searchable .Select-control .Select-placeholder').click();
            // browser.element('.selectUser .Select-placeholder').click();
            //browser.element('.Select.Select--single.is-searchable').click();

            UsersTablePage.clickUserSearchbox();

            // browser.element('.combobox').waitForVisible();
            // browser.element('.selectUser .Select-input').click();
            browser.setValue('.Select-input', "asdfasdf");

            // Search for known user
            UsersTablePage.selectUserFromSearch(searchText);
            // UsersTablePage.userAddSearchBox.setValue(searchText);

            // Select user

            // Click on select user role

            // Select role

            // Click Add

            // Verify user was added to report



        });
    });
}());
