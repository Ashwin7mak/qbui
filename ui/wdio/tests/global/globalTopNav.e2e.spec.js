/**
 * E2E tests to check for presence of topNav button on App/Table/Report/User homepage
 */
(function() {
    'use strict';
    var e2ePageBase = requirePO('e2ePageBase');
    let newStackAuthPO = requirePO('newStackAuth');
    let TopNavPO = requirePO('topNav');
    let reportContentPO = requirePO('reportContent');
    var RequestAppsPage = requirePO('requestApps');
    var tableCreatePO = requirePO('tableCreate');

    describe('Global - TopNav Tests: ', function() {
        var realmName;
        var realmId;
        var testApp;
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
            RequestAppsPage.get(e2eBase.getRequestAppPageEndpoint(realmName, testApp.id));
            return browser.element('.tablesList .leftNavLink .leftNavLabel').waitForVisible();
        });

        /**
         * Test Method - checking for usability of topNav on Table homepage
         */
        it('Visibility and usability of topNav on Table homepage', function() {
            //select table
            tableCreatePO.selectTable(testApp.tables[e2eConsts.TABLE1].name);
            reportContentPO.waitForLeftNavLoaded();
            TopNavPO.topNavToggleHamburgerEl.waitForVisible();
            //Step1: Verify if the global icons are displayed
            TopNavPO.topNavGlobalActDivEl.waitForVisible();
            reportContentPO.settingsIcon.waitForVisible();
            //Step2: Verify the no.of global action icons
            expect(TopNavPO.topNavGlobalActionsListEl.value.length).toBe(4);
            //Step3: Verify the presence of Feedback and Report issue buttons
            TopNavPO.feedbackBtn.click();
            expect(TopNavPO.feedbackMenuButton.isExisting()).toBeTruthy();
            expect(TopNavPO.reportFeedBackButton.isExisting()).toBeTruthy();
            //Step4: Verify the Settings option in the gear
            reportContentPO.clickSettingsIcon();
            expect(TopNavPO.settingsDropdownHeader.getText()).toEqual("Settings");
            //Step5: Verify that Users button displays the correct app name and has sign out button
            TopNavPO.usersButton.click();
            expect(TopNavPO.userDropdownAppName.getAttribute('textContent')).toEqual(testApp.name);
            expect(TopNavPO.signOutButton.isExisting()).toBeTruthy();
            //Step6: Verify the help button is clickable
            TopNavPO.helpButton.click();
        });

        /**
         * Test Method - checking for visibility of topNav on Report homepage
         */
        it('Visibility of topNav on Report homepage', function() {
            //select report
            e2ePageBase.loadReportByIdInBrowser(realmName, testApp.id, testApp.tables[e2eConsts.TABLE1].id, 1);

            TopNavPO.topNavToggleHamburgerEl.waitForVisible();
            //Step1: Verify if the global icons are displayed
            TopNavPO.topNavGlobalActDivEl.waitForVisible();
            reportContentPO.settingsIcon.waitForVisible();
            //Step2: Verify the no.of global action icons
            expect(TopNavPO.topNavGlobalActionsListEl.value.length).toBe(4);
        });

        //TODO: To enable these when topNav is added to User/App homepage MC-2646
        /**
         * Test Method - checking for visibility of topNav on User homepage
         */
        xit('Visibility of topNav on User homepage', function() {
            RequestAppsPage.get(e2eBase.getRequestUsersEndpoint(realmName, testApp.id));
            TopNavPO.topNavToggleHamburgerEl.waitForVisible();
            //Step1: Verify if the global icons are displayed
            TopNavPO.topNavGlobalActDivEl.waitForVisible();
            reportContentPO.settingsIcon.waitForVisible();
            //Step2: Verify the no.of global action icons
            expect(TopNavPO.topNavGlobalActionsListEl.value.length).toBe(4);
        });

        //TODO: To enable these when topNav is added to User/App homepage MC-2646
        /**
         * Test Method - checking for visibility of topNav on App homepage
         */
        xit('Visibility of topNav on App homepage', function() {
            RequestAppsPage.get(e2eBase.getRequestAppsPageEndpoint(realmName, testApp.id));
            TopNavPO.topNavToggleHamburgerEl.waitForVisible();
            //Step1: Verify if the global icons are displayed
            TopNavPO.topNavGlobalActDivEl.waitForVisible();
            reportContentPO.settingsIcon.waitForVisible();
            //Step2: Verify the no.of global action icons
            expect(TopNavPO.topNavGlobalActionsListEl.value.length).toBe(4);

        });
    });
}());

