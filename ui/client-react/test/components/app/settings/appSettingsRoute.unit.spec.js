import React from 'react';
import {shallow} from 'enzyme';
import {MemoryRouter} from 'react-router-dom';
import AppSettingsRoute  from '../../../../src/components/app/settings/appSettingsRoute';

describe('AppSettingsRoute functions', () => {
    'use strict';

    const selectedApp = {id: 1, name: 'Washington'};
    const appId = 1;
    const appUsers = [
        {userId: 1, firstName: 'Thor', lastName: 'Thor'},
        {userId: 2, firstName: 'Tony', lastName: 'Stark'},
        {userId: 3, firstName: 'Steve', lastName: 'Rogers'}
    ];
    const match = {params: {appId: appId}};

    it('test render of component', () => {
        let component = shallow(
            <MemoryRouter>
                <AppSettingsRoute
                    selectedApp={selectedApp}
                    match={match}
                    appUsers={appUsers}
                />
            </MemoryRouter>);
        expect(component.find(AppSettingsRoute).length).toEqual(1);
    });
});
