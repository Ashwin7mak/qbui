(function() {
    'use strict';

    let newStackAuthPO = requirePO('newStackAuth');
    let loadingSpinner = requirePO('/common/loadingSpinner');
    let automationView = require('../../pages/automations/automationView.po');
    let appBuilder = require('../../../test_generators/app.builder.js');
    let emailAutomationEditView = require('../../pages/automations/emailAutomationEditView.po');
    let notificationContainer = require('../../pages/common/notificationContainer.po');
    let automationSettings = require('../../pages/automations/automationsSettings.po');


    describe('Automations - edit automation view', function() {

        const toAddress = 'toAddress';
        const fromAddress = 'fromAddress';
        const subject = 'subject';
        const body = 'body';
        let realmName;
        let realmId;
        let app;
        let appAutomations;

        let emailFlowNames = [e2eBase.automationsService.flowNameGenerator().next().value, e2eBase.automationsService.flowNameGenerator().next().value, e2eBase.automationsService.flowNameGenerator().next().value];

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
                let createdAutomations = [];
                let toAddressParameter = {
                    name: 'toAddress',
                    type: 'TEXT',
                    defaultValue: toAddress
                };
                let fromAddressParameter = {
                    name: 'fromAddress',
                    type: 'TEXT',
                    defaultValue: fromAddress
                };
                let subjectParameter = {
                    name: 'subject',
                    type: 'TEXT',
                    defaultValue: subject
                };
                let bodyParameter = {
                    name: 'body',
                    type: 'TEXT',
                    defaultValue: body
                };

                for (let flowName of emailFlowNames) {
                    let automation = {
                        name: flowName,
                        active: true,
                        type: 'EMAIL',
                        inputs: [toAddressParameter, fromAddressParameter, subjectParameter, bodyParameter]
                    };
                    createdAutomations.push(e2eBase.automationsService.createAutomation(app.id, automation));
                }

                return Promise.all(createdAutomations);
            }).then(function(createdAutomations) {
                appAutomations = createdAutomations;
            }).then(function() {
                return newStackAuthPO.realmLogin(realmName, realmId);
            }).catch(function(error) {
                browser.logger.error('Error in beforeAll function:' + JSON.stringify(error));
                return Promise.reject('Error in beforeAll function:' + JSON.stringify(error));
            });
        });

        it('Automation Edit can be accessed through direct url.', function() {
            let automation = appAutomations[0];

            e2ePageBase.navigateTo(e2eBase.automationsService.getAutomationEditViewUrl(realmName, app.id, automation.id));

            expect(emailAutomationEditView.to.text).toBe(automation.inputs[0].defaultValue);
            expect(emailAutomationEditView.subject.text).toBe(automation.inputs[2].defaultValue);
            expect(emailAutomationEditView.body.text).toBe(automation.inputs[3].defaultValue);
        });

        it('Automation Edit can be accessed through UI from Automation View.', function() {
            let automation = appAutomations[0];

            //navigate to single automation view
            e2ePageBase.navigateTo(e2eBase.automationsService.getAutomationViewUrl(realmName, app.id, automation.id));

            automationView.editButton.click();

            expect(emailAutomationEditView.to.text).toBe(automation.inputs[0].defaultValue);
            expect(emailAutomationEditView.subject.text).toBe(automation.inputs[2].defaultValue);
            expect(emailAutomationEditView.body.text).toBe(automation.inputs[3].defaultValue);
        });

        it('Automation Edit can be accessed through UI from Automations List.', function() {
            let automation = appAutomations[0];

            //navigate to single automation view
            e2ePageBase.navigateTo(e2eBase.automationsService.getAppAutomationsSettingsUrl(realmName, app.id, automation.id));

            loadingSpinner.waitUntilLoadingSpinnerGoesAway();

            automationSettings.automationsTable.automations[0].clickEditButton();

            loadingSpinner.waitUntilLoadingSpinnerGoesAway();

            expect(emailAutomationEditView.to.text).toBe(automation.inputs[0].defaultValue);
            expect(emailAutomationEditView.subject.text).toBe(automation.inputs[2].defaultValue);
            expect(emailAutomationEditView.body.text).toBe(automation.inputs[3].defaultValue);
        });

        it('Automation can be edited through Edit View.', function() {
            if (browser.desiredCapabilities.browserName === 'safari') {
                return;
            }

            const newToAddress = 'toAddress' + Math.random().toString(36).substring(7);
            const newSubject = 'subject' + Math.random().toString(36).substring(7);
            const newBody = 'body_' + Math.random().toString(36).substring(7);

            let automation = appAutomations[1];

            //navigate to single automation view
            e2ePageBase.navigateTo(e2eBase.automationsService.getAutomationEditViewUrl(realmName, app.id, automation.id));

            emailAutomationEditView.to.text = newToAddress;
            emailAutomationEditView.subject.text = newSubject;
            emailAutomationEditView.body.text = newBody;

            emailAutomationEditView.saveButton.click();
            notificationContainer.waitForSuccessNotification();
            e2ePageBase.navigateTo(e2eBase.automationsService.getAutomationEditViewUrl(realmName, app.id, automation.id));

            expect(emailAutomationEditView.to.text).toBe(newToAddress);
            expect(emailAutomationEditView.subject.text).toBe(newSubject);
            expect(emailAutomationEditView.body.text).toBe(newBody);
        });

        it('Cancel button does not save edits.', function() {
            const newToAddress = 'toAddress' + Math.random().toString(36).substring(7);
            const newSubjectAddress = 'subject' + Math.random().toString(36).substring(7);
            const newBodyAddress = 'body' + Math.random().toString(36).substring(7);
            let automation = appAutomations[2];

            //navigate to single automation view
            e2ePageBase.navigateTo(e2eBase.automationsService.getAutomationEditViewUrl(realmName, app.id, automation.id));

            emailAutomationEditView.to.text = newToAddress;
            emailAutomationEditView.subject.text = newSubjectAddress;
            emailAutomationEditView.body.text = newBodyAddress;

            emailAutomationEditView.cancelButton.click();
            e2ePageBase.navigateTo(e2eBase.automationsService.getAutomationEditViewUrl(realmName, app.id, automation.id));

            expect(emailAutomationEditView.to.text).toBe(automation.inputs[0].defaultValue);
            expect(emailAutomationEditView.subject.text).toBe(automation.inputs[2].defaultValue);
            expect(emailAutomationEditView.body.text).toBe(automation.inputs[3].defaultValue);
        });
    });

    describe('Automations - create automation view', function() {

        let realmName;
        let realmId;
        let app;

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
                return newStackAuthPO.realmLogin(realmName, realmId);
            }).catch(function(error) {
                browser.logger.error('Error in beforeAll function:' + JSON.stringify(error));
                return Promise.reject('Error in beforeAll function:' + JSON.stringify(error));
            });
        });

        it('Automation Create can be accessed through direct url.', function() {

            e2ePageBase.navigateTo(e2eBase.automationsService.getAutomationCreateViewUrl(realmName, app.id));

            expect(emailAutomationEditView.name.text).toBe('');
            expect(emailAutomationEditView.to.text).toBe('');
            expect(emailAutomationEditView.subject.text).toBe('');
            expect(emailAutomationEditView.body.text).toBe('');
        });

        it('Automation Create can be accessed through UI from Automations List.', function() {

            //navigate to single automation view
            e2ePageBase.navigateTo(e2eBase.automationsService.getAppAutomationsSettingsUrl(realmName, app.id));

            loadingSpinner.waitUntilLoadingSpinnerGoesAway();

            automationSettings.addButton.click();

            loadingSpinner.waitUntilLoadingSpinnerGoesAway();

            expect(emailAutomationEditView.name.text).toBe('');
            expect(emailAutomationEditView.to.text).toBe('');
            expect(emailAutomationEditView.subject.text).toBe('');
            expect(emailAutomationEditView.body.text).toBe('');
        });

        it('Automation can not be saved through Create View without a name.', function() {
            if (browser.desiredCapabilities.browserName === 'safari') {
                return;
            }

            const newToAddress = 'toAddress';
            const newSubject = 'subject';
            const newBody = 'body_';

            //navigate to single automation view
            e2ePageBase.navigateTo(e2eBase.automationsService.getAutomationCreateViewUrl(realmName, app.id));

            emailAutomationEditView.to.text = newToAddress;
            emailAutomationEditView.subject.text = newSubject;
            emailAutomationEditView.body.text = newBody;

            emailAutomationEditView.saveButton.click();
            notificationContainer.waitForErrorNotification();

        });

        it('Automation can be created through Edit View.', function() {
            if (browser.desiredCapabilities.browserName === 'safari') {
                return;
            }

            const newName = 'name_' + Math.random().toString(36).substring(7);
            const newToAddress = 'toAddress_' + Math.random().toString(36).substring(7);
            const newSubject = 'subject_' + Math.random().toString(36).substring(7);
            const newBody = 'body_' + Math.random().toString(36).substring(7);

            e2ePageBase.navigateTo(e2eBase.automationsService.getAutomationCreateViewUrl(realmName, app.id));

            emailAutomationEditView.name.text = newName;
            emailAutomationEditView.to.text = newToAddress;
            emailAutomationEditView.subject.text = newSubject;
            emailAutomationEditView.body.text = newBody;

            emailAutomationEditView.saveButton.click();
            notificationContainer.waitForSuccessNotification();

            //get the list of automations and retrieve the new one
            let newAutomation;
            e2eBase.automationsService.getAutomations(app.id).then(automations => {
                newAutomation = getAutomationByName(newName, automations);
            });
            e2ePageBase.navigateTo(e2eBase.automationsService.getAppAutomationsSettingsUrl(realmName, app.id));

            //validate automation properties
            expect(newAutomation).toBeTruthy();
            expect(newAutomation.name).toBe(newName);
            expect(newAutomation.type).toBe('EMAIL');
            expect(newAutomation.active).toBe(true);

            //verify that all inputs are as indicated during creation
            let toAddressParameter = {
                name: 'toAddress',
                type: 'TEXT',
                defaultValue: newToAddress
            };
            let fromAddressParameter = {
                name: 'fromAddress',
                type: 'TEXT',
                defaultValue: 'notify@quickbaserocks.com'
            };
            let subjectParameter = {
                name: 'subject',
                type: 'TEXT',
                defaultValue: newSubject
            };
            let bodyParameter = {
                name: 'body',
                type: 'TEXT',
                defaultValue: newBody
            };
            const expectedInputs = [toAddressParameter, fromAddressParameter, subjectParameter, bodyParameter];
            expect(expectedInputs.every(parameter => isInListOfInputs(parameter, newAutomation.inputs))).toBe(true);
        });

        function getAutomationByName(automationName, automations) {
            for (let automation of automations) {
                if (automation.name === automationName) {
                    return automation;
                }
            }
            return undefined;
        }

        function isInListOfInputs(input, inputs) {
            for (let inputFromList of inputs) {
                if (input.name === inputFromList.name) {
                    return input.type === inputFromList.type && input.defaultValue === inputFromList.defaultValue;
                }
            }
            return false;
        }
    });
}());
