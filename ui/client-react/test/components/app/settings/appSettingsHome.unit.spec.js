import React from 'react';
import TestUtils from 'react-addons-test-utils';
import AppSettingsHome  from '../../../../src/components/app/settings/appSettingsHome';

describe('AppSettingsHome functions', () => {
    'use strict';


    const selectedApp = {id: 1, name: 'Washington'};
    const appId = 1;
    const appUsers = [
        {userId: 1, firstName: 'Thor', lastName: 'Thor'},
        {userId: 2, firstName: 'Tony', lastName: 'Stark'},
        {userId: 3, firstName: 'Steve', lastName: 'Rogers'}
    ];
    const setting = "users";
    const settingsLinkWithParameter = `/qbase/app/${appId}/${setting}`;
    const settingsLinkWithoutParameter = `/qbase/app/${appId}/`;

    it('test render of component', () => {
        let component = TestUtils.renderIntoDocument(<AppSettingsHome selectedApp={selectedApp}
                                                                        appId={appId}
                                                                        appUsers={appUsers}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test constructSettingsLink method', () => {
        let component = TestUtils.renderIntoDocument(<AppSettingsHome selectedApp={selectedApp}
                                                                      appId={appId}
                                                                      appUsers={appUsers}/>);
        let result = component.constructSettingsLink(setting);
        expect(result).toEqual(settingsLinkWithParameter);

        result = component.constructSettingsLink("");
        expect(result).toEqual(settingsLinkWithoutParameter);
    });
});
