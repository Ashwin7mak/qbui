import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';

import TempMainErrorMessages from '../../src/components/nav/tempMainErrorMessages';

describe('TempMainErrorMessages', () => {
    let component;
    let domComponent;

    let existingApp = '007';
    let existingAppWithTables = '90210';
    let nonExistingApp = 'abcd';

    let testApps = [
        {id: '5678'},
        {id: existingApp, tables: []},
        {id: existingAppWithTables, tables: [1, 2, 3]}
    ];

    let noAppsErrorMessageId = 'noAppsErrorMessage';
    let appNotFoundErrorMessageId = 'appNotFoundErrorMessage';
    let noTablesErrorMessageId = 'noTablesErrorMessage';

    let testCases = [
        {
            description: 'does not display messages if the apps are still loading',
            apps: [],
            appsLoading: true,
            selectedAppId: null,
            expectMessagesToBeDisplayed: [],
            expectMessagesToBeHidden: [noAppsErrorMessageId, appNotFoundErrorMessageId, noTablesErrorMessageId]
        },
        {
            description: 'displays an error message if there are no apps',
            apps: [],
            appsLoading: false,
            selectedAppId: null,
            expectMessagesToBeDisplayed: [noAppsErrorMessageId],
            expectMessagesToBeHidden: [appNotFoundErrorMessageId, noTablesErrorMessageId]
        },
        {
            description: 'does not display an error message if there are apps',
            apps: testApps,
            appsLoading: false,
            selectedAppId: existingAppWithTables,
            expectMessagesToBeDisplayed: [],
            expectMessagesToBeHidden: [noAppsErrorMessageId, appNotFoundErrorMessageId, noTablesErrorMessageId]
        },
        {
            description: 'displays an error message if the currently selected app does not exist in Mercury',
            apps: testApps,
            appsLoading: false,
            selectedAppId: nonExistingApp,
            expectMessagesToBeDisplayed: [appNotFoundErrorMessageId],
            expectMessagesToBeHidden: [noAppsErrorMessageId, noTablesErrorMessageId]
        },
        {
            description: 'does not display an error message if the currently selected app exists in Mercury',
            apps: testApps,
            appsLoading: false,
            selectedAppId: existingAppWithTables,
            expectMessagesToBeDisplayed: [],
            expectMessagesToBeHidden: [noAppsErrorMessageId, appNotFoundErrorMessageId, noTablesErrorMessageId]
        },
        {
            description: 'does not display an "App Not Found" error message if there is not a currently selected app',
            apps: testApps,
            appsLoading: false,
            selectedAppId: null,
            expectMessagesToBeDisplayed: [],
            expectMessagesToBeHidden: [noAppsErrorMessageId, appNotFoundErrorMessageId, noTablesErrorMessageId]
        },
        {
            description: 'displays an error message if there are no tables in the currently selected app',
            apps: testApps,
            appsLoading: false,
            selectedAppId: existingApp,
            expectMessagesToBeDisplayed: [noTablesErrorMessageId],
            expectMessagesToBeHidden: [noAppsErrorMessageId, appNotFoundErrorMessageId]
        },
        {
            description: 'does not display an error message if the currently selected app has tables',
            apps: testApps,
            appsLoading: false,
            selectedAppId: existingAppWithTables,
            expectMessagesToBeDisplayed: [],
            expectMessagesToBeHidden: [noAppsErrorMessageId, appNotFoundErrorMessageId, noTablesErrorMessageId]
        }
    ];

    testCases.forEach(testCase => {
        it(testCase.description, () => {
            component = TestUtils.renderIntoDocument(<TempMainErrorMessages apps={testCase.apps}
                                                                        appsLoading={testCase.appsLoading}
                                                                        selectedAppId={testCase.selectedAppId} />);

            domComponent = ReactDOM.findDOMNode(component);

            testCase.expectMessagesToBeDisplayed.forEach(message => {
                expect(domComponent.querySelector(`#${message}`)).not.toBeNull();
            });

            testCase.expectMessagesToBeHidden.forEach(message => {
                expect(domComponent.querySelector(`#${message}`)).toBeNull();
            });
        });
    });
});
