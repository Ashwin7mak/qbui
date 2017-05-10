import React from 'react';
import {shallow, mount} from 'enzyme';
///import createRouterContext from 'react-router-test-context';
import * as UrlConstants from '../../../../src/constants/urlConstants';
import AppSettingsHome  from '../../../../src/components/app/settings/appSettingsHome';
import {MemoryRouter} from 'react-router-dom';
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
    const settingsLinkWithParameter = `${UrlConstants.SETTINGS_ROUTE}/app/${appId}/${setting}`;
    const settingsLinkWithoutParameter = `${UrlConstants.SETTINGS_ROUTE}/app/${appId}/`;

    it('test render of component', () => {
        let component = mount(<MemoryRouter>
                                    <AppSettingsHome selectedApp={selectedApp}
                                               appId={appId}
                                               appUsers={appUsers}
                                               />
                                </MemoryRouter>);
        expect(component.find(AppSettingsHome).length).toEqual(1);
    });

    it('test constructSettingsLink method', () => {
        let component = shallow(
                <AppSettingsHome
                    selectedApp={selectedApp}
                    appId={appId}
                    appUsers={appUsers}
                />);
        const instance = component.instance();
        let result = instance.constructSettingsLink(setting);
        expect(result).toEqual(settingsLinkWithParameter);

        result = instance.constructSettingsLink("");
        expect(result).toEqual(settingsLinkWithoutParameter);
    });
});
