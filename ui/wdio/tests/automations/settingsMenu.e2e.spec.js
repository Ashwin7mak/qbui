(function() {
    'use strict';

    let appToolbar = requirePO('/app/appTopToolbar');
    let appSettingsList = requirePO('/app/appSettings');
    let automationSettings = requirePO('/automations/automationsSettings');
    let newStackAuthPO = requirePO('newStackAuth');

    describe('Automations - application settings ', function() {
        let realmName;
        let realmId;
        let app;

        /**
         * Setup method. Creates test app then authenticates into the new stack
         */
        beforeAll(function() {
            browser.logger.info('beforeAll spec function - Generating test data and logging in');
            // Need to return here. beforeAll is completely async, need to return the Promise chain in any before or after functions!
            // No need to call done() anymore
            return e2eBase.basicAppSetup(null, 0).then(function(createdApp) {
                // Set your global objects to use in the test functions
                app = createdApp;
                realmName = e2eBase.recordBase.apiBase.realm.subdomain;
                realmId = e2eBase.recordBase.apiBase.realm.id;
            }).then(function() {
                // Auth into the new stack
                return newStackAuthPO.realmLogin(realmName, realmId);
            }).catch(function(error) {
                // Global catch that will grab any errors from chain above
                // Will appropriately fail the beforeAll method so other tests won't run
                browser.logger.error('Error in beforeAll function, code:' + error.code);

                browser.logger.error('Error in beforeAll function:' + JSON.stringify(error));
                return Promise.reject('Error in beforeAll function:' + JSON.stringify(error));
            });
        });

        it('should contains menu item that leads to automations settings', function() {
            e2ePageBase.navigateTo(e2eBase.getAppPageEndpoint(realmName, app.id));

            expect(appToolbar.appSettingsBtn).toBeTruthy();

            appToolbar.appSettingsBtn.click();
            expect(appSettingsList.automationSettingsBtn.isVisible).toBeTruthy();

            appSettingsList.automationSettingsBtn.click();

            expect(automationSettings.pageTitle.getText()).toBe('Automations');
            expect(automationSettings.automationsTable.isVisible).toBeTruthy();
        });
    });
}());
