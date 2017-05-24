(function() {
    'use strict';

    let appToolbar = requirePO('/app/appTopToolbar');
    let appSettingsList = requirePO('/app/appSettings');
    let automationSettings = requirePO('/automations/automationsSettings');
    let newStackAuthPO = requirePO('newStackAuth');
    let appBuilder = require('../../../test_generators/app.builder.js');

    describe('Automations - application settings ', function() {
        let realmName;
        let realmId;
        let app;

        /**
         * Setup method. Creates test app then authenticates into the new stack
         */
        beforeAll(function() {
            browser.logger.info('beforeAll spec function - Generating test data and logging in');
            let builderInstance = appBuilder.builder();
            builderInstance.withName('myName');
            let appToCreate = builderInstance.build();

            return e2eBase.createApp(appToCreate).then(function(createdApp) {
                app = createdApp;
                realmName = e2eBase.recordBase.apiBase.realm.subdomain;
                realmId = e2eBase.recordBase.apiBase.realm.id;
            }).then(function() {
                return newStackAuthPO.realmLogin(realmName, realmId);
            }).catch(function(error) {
                browser.logger.error('Error in beforeAll function:' + JSON.stringify(error));
                return Promise.reject('Error in beforeAll function:' + JSON.stringify(error));
            });
        });

        it('should contains menu item that leads to automations settings', function() {
            e2ePageBase.navigateTo(e2eBase.getRequestAppPageEndpoint(realmName, app.id));

            expect(appToolbar.appSettingsBtn).toBeTruthy();

            appToolbar.appSettingsBtn.click();
            expect(appSettingsList.automationSettingsBtn.isVisible).toBeTruthy();

            appSettingsList.automationSettingsBtn.click();

            expect(automationSettings.pageTitle.getText()).toBe('Automations');
            expect(automationSettings.automationsTable.isVisible).toBeTruthy();
        });
    });
}());
