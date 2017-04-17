import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {shallow} from 'enzyme';
import {MemoryRouter} from 'react-router-dom';
import * as UrlConstants from '../../../../src/constants/urlConstants';
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
    const settingsLinkWithParameter = `${UrlConstants.SETTINGS_ROUTE}/app/${appId}/${setting}`;
    const settingsLinkWithoutParameter = `${UrlConstants.SETTINGS_ROUTE}/app/${appId}/`;

    it('test render of component', () => {
        let component = TestUtils.renderIntoDocument(
            <MemoryRouter>
                <AppSettingsHome
                    selectedApp={selectedApp}
                    appId={appId}
                    appUsers={appUsers}
                />
            </MemoryRouter>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test constructSettingsLink method', () => {
        let component = shallow(
            <MemoryRouter>
                <AppSettingsHome
                    selectedApp={selectedApp}
                    appId={appId}
                    appUsers={appUsers}
                />
            </MemoryRouter>);
        const instance = component.dive().dive().instance();
        let result = instance.constructSettingsLink(setting);
        expect(result).toEqual(settingsLinkWithParameter);

        result = instance.constructSettingsLink("");
        expect(result).toEqual(settingsLinkWithoutParameter);
    });
});
