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
    let RequestSessionTicketPage = requirePO('requestSessionTicket');
    let ReportContentPO = requirePO('reportContent');

    describe('Tables - delete table tests: ', function() {
        let realmName;
        let realmId;
        let testApp;
        let EXISTING_TABLE_NAME_1 = 'Table 1';
        let EXISTING_TABLE_NAME_2 = 'Table 2';
        let userId;

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
            }).then(function() {
                // Create a user
                return e2eBase.recordBase.apiBase.createUser().then(function(userResponse) {
                    userId = JSON.parse(userResponse.body).id;
                });
            }).then(function() {
                // Add user to participant appRole
                return e2eBase.recordBase.apiBase.assignUsersToAppRole(testApp.id, e2eConsts.PARTICIPANT_ROLEID, [userId]);
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
            // Load the requestAppPage (shows a list of all the tables associated with an app in a realm)
            RequestAppsPage.get(e2eBase.getRequestAppPageEndpoint(realmName, testApp.id));
            return browser.element('.tablesList .leftNavLink .leftNavLabel').waitForVisible();
        });


        it('Verify that clicking on "dont delete" button closes the delete table dialogue without deleting the table', function() {

            //Get the original count of table links in the left nav
            let originalTableLinksCount = tableCreatePO.getAllTableLeftNavLinksList.value.length;

            //Select table to delete ('Table 1' here) and make sure it lands in reports page
            tableCreatePO.selectTable(EXISTING_TABLE_NAME_1);
            // wait for the report content to be visible
            ReportContentPO.waitForReportContent();

            //Click table settings Icon
            ReportContentPO.clickSettingsIcon();

            //Go to 'Table properties & settings'
            ReportContentPO.clickModifyTableSettings();

            //Click delete table action button
            tableCreatePO.clickDeleteTableActionButton();

            //Set the deletePromtTextField value to 'YES'
            tableCreatePO.setDeletePromtTextFieldValue('YES');

            //Click don't delete table button
            tableCreatePO.clickDontDeleteTableButton();

            //Click on go back to apps Link
            tableCreatePO.clickBackToAppsLink();

            //Make sure table is not deleted
            let newTableLinksCount = tableCreatePO.getAllTableLeftNavLinksList.value.length;
            //Verify the table links count is same as original
            expect(newTableLinksCount).toBe(originalTableLinksCount);
        });

        /**
         * Data provider for deletePromt textField value validation testCases.
         */
        function deletePromtTextFieldTestCases() {
            return [
                {
                    message: 'all lower case letters',
                    fieldValue: 'yes'
                },
                {
                    message: 'combination of lower and upper case letters',
                    fieldValue: 'Yes'
                },
                {
                    message: 'wrong string value',
                    fieldValue: 'no'
                },
                {
                    message: 'empty string',
                    fieldValue: ''
                }
            ];
        }

        deletePromtTextFieldTestCases().forEach(function(testCase) {

            it('Delete table negative test case with deletePromt TextField value is- ' + testCase.message, function()   {

                //Select table to delete ('Table 1' here) and make sure it lands in reports page
                tableCreatePO.selectTable(EXISTING_TABLE_NAME_1);
                // wait for the report content to be visible
                ReportContentPO.waitForReportContent();

                //Click table settings Icon
                ReportContentPO.clickSettingsIcon();

                //Go to 'Table properties & settings'
                ReportContentPO.clickModifyTableSettings();

                //Click delete table action button
                tableCreatePO.clickDeleteTableActionButton();

                //Set the deletePromtTextField value
                tableCreatePO.setDeletePromtTextFieldValue(testCase.fieldValue);

                //Make sure delete table button is disabled
                expect(browser.isEnabled('.modal-dialog .modal-footer .primaryButton')).toBeFalsy();
            });
        });

        it('Delete table', function()   {

            //get the original count of table links in the left nav
            let originalTableLinksCount = tableCreatePO.getAllTableLeftNavLinksList.value.length;

            //Select table to delete ('Table 2' here) and make sure it lands in reports page
            tableCreatePO.selectTable(EXISTING_TABLE_NAME_2);
            // wait for the report content to be visible
            ReportContentPO.waitForReportContent();

            //Click table settings Icon
            ReportContentPO.clickSettingsIcon();

            //Go to 'Table properties & settings'
            ReportContentPO.clickModifyTableSettings();

            //Click delete table action button
            tableCreatePO.clickDeleteTableActionButton();

            //Set the deletePromtTextField value to 'YES'
            tableCreatePO.setDeletePromtTextFieldValue('YES');

            //Delete table
            tableCreatePO.clickDeleteTableButton();

            //Wait until new table button visible
            tableCreatePO.newTableBtn.waitForVisible();

            //Make sure table is actually deleted
            let newTableLinksCount = tableCreatePO.getAllTableLeftNavLinksList.value.length;
            //Verify the table links count decreased by 1
            expect(newTableLinksCount).toBe(originalTableLinksCount - 1);
        });

        it('Verify that only ADMIN can delete a Table', function() {
            browser.call(function() {
                //get the user authentication
                return RequestSessionTicketPage.get(e2eBase.getSessionTicketRequestEndpoint(realmName, realmId, e2eBase.recordBase.apiBase.resolveUserTicketEndpoint() + '?uid=' + userId + '&realmId='));
            });

            browser.call(function() {
                // Load the app in the realm
                return RequestAppsPage.get(e2eBase.getRequestAppPageEndpoint(realmName, testApp.id));
            });

            ReportContentPO.waitForLeftNavLoaded();

            //Step 5 - Verify settings icon not available for user other than ADMIN
            expect(browser.isVisible(ReportContentPO.settingsIconName)).toBeFalsy();
        });

    });
}());
