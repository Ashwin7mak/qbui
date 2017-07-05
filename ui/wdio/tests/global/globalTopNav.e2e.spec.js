/**
 * E2E tests to check for presence of topNav button on App/Table/Report/User homepage
 */
(function() {
    'use strict';
    let e2ePageBase = requirePO('e2ePageBase');
    let newStackAuthPO = requirePO('newStackAuth');
    let TopNavPO = requirePO('topNav');
    let leftNavPO = requirePO('leftNav');
    let reportContentPO = requirePO('reportContent');
    let tableCreatePO = requirePO('tableCreate');

    describe('Global - TopNav Tests: ', function() {
        let realmName;
        let realmId;
        let testApp;
        /**
         * Setup method. Creates test app then authenticates into the new stack
         */
        beforeAll(function() {
            browser.logger.info('beforeAll spec function - Generating test data and logging in');
            // Need to return here. beforeAll is completely async, need to return the Promise chain in any before or after functions!
            // No need to call done() anymore
            return e2eBase.basicAppSetup(null, 5).then(function(createdApp) {
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
            // Load the requestAppPage (shows a list of all the tables associated with an app in a realm)
            return e2ePageBase.loadAppByIdInBrowser(realmName, testApp.id);
        });

        /**
         * Test Method - checking for visibility of topNav on App homepage
         */
        it('Visibility of topNav on App homepage', function() {
            //Verify topNav
            TopNavPO.verifyTopNav(testApp, true, false, false, false);
        });

        /**
         * Test Method - checking for usability of topNav on Table homepage
         */
        it('Visibility of topNav on Table with tableHomepage set', function() {

            //Select table
            tableCreatePO.selectTable(testApp.tables[e2eConsts.TABLE1].name);
            // wait for the report content to be visible
            reportContentPO.waitForReportContent();

            //Verify topNav
            TopNavPO.verifyTopNav(testApp, false, true, false, false);
        });

        /**
         * Test Method - checking for visibility of topNav on Report homepage
         */
        it('Visibility of topNav on Report homepage', function() {

            //Go to reports page directly
            e2ePageBase.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 1);

            //Verify topNav
            TopNavPO.verifyTopNav(testApp, false, false, true, false);
        });

        /**
         * Test Method - checking for visibility of topNav on User homepage
         */
        it('Visibility of topNav on User homepage', function() {
            e2ePageBase.loadUsersInAnAppInBrowser(realmName, testApp.id);

            //Verify topNav
            TopNavPO.verifyTopNav(testApp, false, false, false, true);
        });
    });
}());

