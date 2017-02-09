import React from 'react';
import TestUtils from 'react-addons-test-utils';
import AppSettingsRoute  from '../../../../src/components/app/settings/appSettingsRoute';
import HtmlUtils from '../../../../src/utils/htmlUtils';

describe('AppSettingsRoute functions', () => {
    'use strict';

    const selectedApp = {id: 1, name: 'Washington'};
    const appId = 1;
    const appUsers = [
        {userId: 1, firstName: 'Thor', lastName: 'Thor'},
        {userId: 2, firstName: 'Tony', lastName: 'Stark'},
        {userId: 3, firstName: 'Steve', lastName: 'Rogers'}
    ];

    it('test render of component', () => {
        let component = TestUtils.renderIntoDocument(<AppSettingsRoute selectedApp={selectedApp}
                                                                        params={appId}
                                                                        appUsers={appUsers}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });
});
