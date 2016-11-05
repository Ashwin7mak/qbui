import React from 'react';
import TestUtils, {Simulate} from 'react-addons-test-utils';

import AppNotFound from '../../src/components/app/appNotFound';

let component;
let appNotFoundElement;

let existingApp = '1234';
let nonExistingApp = 'abcd';

let testApps = [
    {id: '5678'},
    {id: existingApp},
    {id: '9101112'}
];

describe('AppNotFound', () => {

    it('displays an error message if the app does not exist', () => {
        component = TestUtils.renderIntoDocument(
            <AppNotFound apps={testApps} appsLoading={false} selectedAppId={nonExistingApp}/>
        );

        appNotFoundElement = TestUtils.findRenderedDOMComponentWithClass(component, 'appNotFound');
    });

    it('does not display an error message if the app exists', () => {
        component = TestUtils.renderIntoDocument(
            <AppNotFound apps={testApps} appsLoading={false} selectedAppId={existingApp}/>
        );

        appNotFoundElement = TestUtils.scryRenderedDOMComponentsWithClass(component, 'appNotFound');

        expect(appNotFoundElement.length).toEqual(0);
    });

    it('does not display an error message if the page is still loading', () => {
        component = TestUtils.renderIntoDocument(
            <AppNotFound apps={testApps} appsLoading={true} selectedAppId={nonExistingApp}/>
        );

        appNotFoundElement = TestUtils.scryRenderedDOMComponentsWithClass(component, 'appNotFound');

        expect(appNotFoundElement.length).toEqual(0);
    });
});
