/**
 * E2E tests for tableDelete
 * Created by agade on 4/25/17.
 */

(function() {
    'use strict';

    //Load the page Objects
    let newStackAuthPO = requirePO('newStackAuth');
    let e2ePageBase = requirePO('e2ePageBase');
    let RequestAppsPage = requirePO('requestApps');
    let tableCreatePO = requirePO('tableCreate');
    let formsPO = requirePO('formsPage');
    let RequestSessionTicketPage = requirePO('requestSessionTicket');
    let rawValueGenerator = require('../../../test_generators/rawValue.generator');
    let ReportContentPO = requirePO('reportContent');

    describe('Tables - delete table tests: ', function() {
        let realmName;
        let realmId;
        let testApp;

        /**
         * Setup method. Creates test app then authenticates into the new stack
         */
        beforeAll(function() {
            browser.logger.info('beforeAll spec function - Generating test data and logging in');
            // Need to return here. beforeAll is completely async, need to return the Promise chain in any before or after functions!
            return e2eBase.basicAppSetup(null, 5).then(function(createdApp) {
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
         * Before each it block reload the list all report (can be used as a way to reset state between tests)
         */
        beforeEach(function() {
            return e2ePageBase.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 1);
        });

        xit('Delete table', function()   {

            //Step 1 - get the original count of table links in the left nav
            let originalTableLinksCount = tableCreatePO.getAllTableLeftNavLinksList.value.length;

            //Step 2 - Select table to delete ('Table 1' here) and make sure it lands in reports page
            tableCreatePO.selectTable('Table 1');
            // wait for the report content to be visible
            ReportContentPO.waitForReportContent();

            //Step 3 - Click table settings Icon
            ReportContentPO.clickSettingsIcon();

            //Step 4 - Go to 'Table properties & settings'
            ReportContentPO.clickModifyTableSettings();

            //Step 5 - Click delete table action button
            ReportContentPO.clickDeleteTableActionButton();

            //Step 6 - Delete table
            ReportContentPO.clickDeleteTableButton();

            //Step 7 - Make sure table is actually deleted
            let newTableLinksCount = tableCreatePO.getAllTableLeftNavLinksList.value.length;
            //Verify the table links count decreased by 1
            expect(newTableLinksCount).toBe(originalTableLinksCount - 1);
        });

        xit('Verify that clicking on "dont delete" button closes the delete table dialogue without deleting the table', function() {

            //Step 1 - get the original count of table links in the left nav
            let originalTableLinksCount = tableCreatePO.getAllTableLeftNavLinksList.value.length;

            //Step 2 - Select table to delete ('Table 1' here) and make sure it lands in reports page
            tableCreatePO.selectTable('Table 1');
            // wait for the report content to be visible
            ReportContentPO.waitForReportContent();

            //Step 3 - Click table settings Icon
            ReportContentPO.clickSettingsIcon();

            //Step 4 - Go to 'Table properties & settings'
            ReportContentPO.clickModifyTableSettings();

            //Step 5 - Click delete table action button
            ReportContentPO.clickDeleteTableActionButton();

            //Step 6 - Click don't delete table button
            ReportContentPO.clickDontDeleteTableButton();

            //step 7 - go back to the tables page
            RequestAppsPage.get(e2eBase.getRequestTableEndpoint(realmName, testApp.id, testApp.tables[0].id));

            //Step 8 - Make sure table is not deleted
            let newTableLinksCount = tableCreatePO.getAllTableLeftNavLinksList.value.length;
            //Verify the table links count is same as original
            expect(newTableLinksCount).toBe(originalTableLinksCount);
        });

        xit('Verify that only ADMIN can delete a Table', function() {
            let userId;

            //Create a user
            browser.call(function() {
                return e2eBase.recordBase.apiBase.createUser().then(function(userResponse) {
                    userId = JSON.parse(userResponse.body).id;
                });
            });

            //Add user to participant appRole
            browser.call(function() {
                return e2eBase.recordBase.apiBase.assignUsersToAppRole(testApp.id, "11", [userId]);
            });

            //get the user authentication
            browser.call(function() {
                return RequestSessionTicketPage.get(e2eBase.getSessionTicketRequestEndpoint(realmName, realmId, e2eBase.recordBase.apiBase.resolveUserTicketEndpoint() + '?uid=' + userId + '&realmId='));
            });

            //Go to Tables Page
            RequestAppsPage.get(e2eBase.getRequestTableEndpoint(realmName, testApp.id, testApp.tables[0].id));

            //Verify settings icon not available for user other than ADMIN
            expect(browser.isVisible('.qbIcon.iconUISturdy-settings')).toBeFalsy();
        });


    });
}());
