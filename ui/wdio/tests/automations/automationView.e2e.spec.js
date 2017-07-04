(function() {
    'use strict';

    let automationSettings = requirePO('/automations/automationsSettings');
    let newStackAuthPO = requirePO('newStackAuth');
    let loadingSpinner = requirePO('/common/loadingSpinner');
    let automationView = require('../../pages/automations/automationView.po');
    let appBuilder = require('../../../test_generators/app.builder.js');

    describe('Automations - single automation view', function() {
        const emailActionDescription = 'Send an email';
        let realmName;
        let realmId;
        let app;
        let automation;

        /**
         * Setup method. Creates test app then authenticates into the new stack
         */
        beforeAll(function() {
            browser.logger.info('beforeAll spec function - Generating test data and logging in');
            let builderInstance = appBuilder.builder();
            builderInstance.withName('app_name' + Math.random().toString(36).substring(7));
            let appToCreate = builderInstance.build();

            return e2eBase.createApp(appToCreate).then(function(createdApp) {
                app = createdApp;
                realmName = e2eBase.recordBase.apiBase.realm.subdomain;
                realmId = e2eBase.recordBase.apiBase.realm.id;
            }).then(function() {
                let automationToCreate = {
                    name: 'flowName_' + Math.random().toString(36).substring(7),
                    active: true,
                    type: 'EMAIL'
                };

                return e2eBase.automationsService.createAutomation(app.id, automationToCreate).then(function(createdAutomation) {
                    automation = createdAutomation;
                });
            }).then(function() {
                return newStackAuthPO.realmLogin(realmName, realmId);
            }).catch(function(error) {
                browser.logger.error('Error in beforeAll function:' + JSON.stringify(error));
                return Promise.reject('Error in beforeAll function:' + JSON.stringify(error));
            });
        });

        it('Automation view can be accessed with direct url.', function() {
            //navigate to single automation view
            e2ePageBase.navigateTo(e2eBase.automationsService.getAutomationViewUrl(realmName, app.id, automation.id));

            //validate automation name
            expect(automationView.automationName.text).toBe(automation.name);

            //validate action description
            expect(automationView.actionDescription.text).toBe(emailActionDescription);
        });

        it('Automation view can be accessed with from Automations List.', function() {
            if (browser.desiredCapabilities.browserName === 'safari') {
                return;
            }

            //navigate to Application Automations Settings page directly with URL
            e2ePageBase.navigateTo(e2eBase.automationsService.getAppAutomationsSettingsUrl(realmName, app.id));
            loadingSpinner.waitUntilLoadingSpinnerGoesAway();

            //click on the automation row to open Automation View
            automationSettings.automationsTable.automations[0].click();

            loadingSpinner.waitUntilLoadingSpinnerGoesAway();

            //validate automation name
            expect(automationView.automationName.text).toBe(automation.name);

            //validate action description
            expect(automationView.actionDescription.text).toBe(emailActionDescription);
        });
    });
}());
