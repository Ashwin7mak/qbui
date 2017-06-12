(function() {
    'use strict';

    let appToolbar = requirePO('/app/appTopToolbar');
    let appSettingsList = requirePO('/app/appSettings');
    let automationSettings = requirePO('/automations/automationsSettings');
    let appBuilder = require('../../../test_generators/app.builder.js');
    let newStackAuthPO = requirePO('newStackAuth');
    let leftNavPO = requirePO('leftNav');

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

        let emailFlowNames = [flowNameGenerator().next().value, flowNameGenerator().next().value, flowNameGenerator().next().value];
        let notEmailFlowNames = [flowNameGenerator().next().value, flowNameGenerator().next().value, flowNameGenerator().next().value];

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
                let createAutomations = [];
                for (let flowName of emailFlowNames) {
                    let automation = {
                        name: flowName,
                        active: true,
                        type: 'EMAIL'
                    };
                    createAutomations.push(e2eBase.automationsService.createAutomation(app.id, automation));
                }

                for (let flowName of notEmailFlowNames) {
                    let automation = {
                        name: flowName,
                        active: true,
                    };
                    createAutomations.push(e2eBase.automationsService.createAutomation(app.id, automation));
                }

                return Promise.all(createAutomations);
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

        it('should contain a list of only EMAIL automations for application', function() {

            //click 'Settings' button and validate that the 'Automation' item is available on the setting list
            appToolbar.appSettingsBtn.click();
            appSettingsList.automationSettingsBtn.click();

            //validate header text
            expect(automationSettings.automationsTable.header.cells[0]).toBe('Name');

            //get the list of automations from table
            let counter = 0;
            let actualFlows = [];
            for (let row of automationSettings.automationsTable.rows) {
                actualFlows[counter] = row.cells[0];
                counter++;
            }

            //verify that the list of automation in table is equal to the list of EMAIL automations that were created.
            //currently it's only EMAIL automations that will be showed to user
            let isFlowsListEqual = (emailFlowNames.length === actualFlows.length) && emailFlowNames.every(function(element) {
                return actualFlows.includes(element);
            });

            assert.ok(isFlowsListEqual, 'Lists of automation expected to be equal. Expected list: ' + emailFlowNames.toString() + ' List from UI: ' + actualFlows.toString());
        });
    });
}());
