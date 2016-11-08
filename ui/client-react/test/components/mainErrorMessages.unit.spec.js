import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';

import MainErrorMessages from '../../src/components/nav/mainErrorMessages';

describe('MainErrorMessages', () => {
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

    let testCases = [
        {
            description: 'does not display messages if the apps are still loading',
            apps: [],
            appsLoading: true,
            selectedAppId: null,
            expectation: ''
        },
        {
            description: 'displays an error message if there are no apps',
            apps: [],
            appsLoading: false,
            selectedAppId: null,
            expectation: 'There are no apps in Mercury. Contact betaprogram@quickbase.com to add apps.'
        },
        {
            description: 'does not display an error message if there are apps',
            apps: testApps,
            appsLoading: false,
            selectedAppId: existingAppWithTables,
            expectation: ''
        },
        {
            description: 'displays an error message if the currently selected app does not exist in Mercury',
            apps: testApps,
            appsLoading: false,
            selectedAppId: nonExistingApp,
            expectation: 'The app is not available in Mercury right now. Open the app  in QuickBase Classic. '
        },
        {
            description: 'does not display an error message if the currently selected app exists in Mercury',
            apps: testApps,
            appsLoading: false,
            selectedAppId: existingAppWithTables,
            expectation: ''
        },
        {
            description: 'displays an error message if there are no tables in the currently selected app',
            apps: testApps,
            appsLoading: false,
            selectedAppId: existingApp,
            expectation: 'There are no tables in the app. Create tables in QuickBase Classic.'
        },
        {
            description: 'does not display an error message if the currently selected app has tables',
            apps: testApps,
            appsLoading: false,
            selectedAppId: existingAppWithTables,
            expectation: ''
        }
    ];

    testCases.forEach(testCase => {
        it(testCase.description, () => {
            component = TestUtils.renderIntoDocument(<MainErrorMessages apps={testCase.apps}
                                                                        appsLoading={testCase.appsLoading}
                                                                        selectedAppId={testCase.selectedAppId} />);

            domComponent = ReactDOM.findDOMNode(component);

            expect(domComponent.innerText).toEqual(testCase.expectation);
        });
    });
});
