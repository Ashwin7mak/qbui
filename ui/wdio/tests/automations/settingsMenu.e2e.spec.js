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

        /**
         * Before each it block reload the list all report (can be used as a way to reset state between tests)
         */
        beforeEach(function() {
            return e2ePageBase.loadAppByIdInBrowser(realmName, app.id);
        });

        it('should contains menu item that leads to automations settings', function() {

            //validate the 'Settings' button is visible
            expect(appToolbar.appSettingsBtn.isVisible).toBe(true);

            //click 'Settings' button and validate that the 'Automation' item is available on the setting list
            appToolbar.appSettingsBtn.click();

            //click 'Automations' button on settings list
            appSettingsList.automationSettingsBtn.click();

            //verify that 'Automations button leads to table of automations
            expect(automationSettings.pageTitle.text).toBe('Automations');
            expect(automationSettings.automationsTable.isVisible).toBe(true);
        });
    });
}());
