(function() {
    'use strict';

    let appToolbar = requirePO('/app/appTopToolbar');
    let appSettingsList = requirePO('/app/appSettings');
    let automationSettings = requirePO('/automations/automationsSettings');
    let appBuilder = require('../../../test_generators/app.builder.js');
    let newStackAuthPO = requirePO('newStackAuth');

    let assert = require('assert');

    describe('Automations - application settings ', function() {
        let realmName;
        let realmId;
        let app;

        function* flowNameGenerator() {
            for (;;) {
                yield 'flow_name_' + Math.random().toString(36).substring(7);
            }
        }

        let flowNames = [flowNameGenerator().next().value, flowNameGenerator().next().value, flowNameGenerator().next().value];

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

                for (let flowName of flowNames) {
                    let automation = {
                        name: flowName,
                        active: true
                    };
                    e2eBase.automationsService.createAutomation(app.id, automation);
                }
            }).then(function() {
                return newStackAuthPO.realmLogin(realmName, realmId);
            }).catch(function(error) {
                browser.logger.error('Error in beforeAll function:' + JSON.stringify(error));
                return Promise.reject('Error in beforeAll function:' + JSON.stringify(error));
            });
        });

        it('should contain a list of automations for application', function() {
            e2eBase.automationsService.getAutomations(app.id);

            e2ePageBase.navigateTo(e2eBase.getRequestAppPageEndpoint(realmName, app.id));
            appToolbar.appSettingsBtn.click();
            appSettingsList.automationSettingsBtn.click();

            expect(automationSettings.automationsTable.header.cells[0]).toBe('Name');

            let counter = 0;
            let actualFlows = [];
            for (let row of automationSettings.automationsTable.rows) {
                actualFlows[counter] = row.cells[0];
                counter++;
            }

            let isFlowsListEqual = (flowNames.length === actualFlows.length) && flowNames.every(function(element) {
                return actualFlows.includes(element);
            });

            assert.ok(isFlowsListEqual, 'Lists of automation expected to be equal. Expected list: ' + flowNames.toString() + ' List from UI: ' + actualFlows.toString());
        });
    });
}());
