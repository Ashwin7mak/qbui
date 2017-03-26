/**
 * Created by rbeyer on 3/25/17.
 */
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import AppSettingsStage  from '../../../../src/components/app/settings/appSettingsStage';

describe('AppSettingsStage functions', () => {
    'use strict';

    const appUsers = {
        10: [
            {
                "firstName": "Steve",
                "lastName": "Rogers",
                "screenName": "Cap",
                "email": "imissthe40s@shield.com",
                "userId": "RDUII_UB"
            }
        ],
        11: [
            {
                "firstName": "Tony",
                "lastName": "Stark",
                "screenName": "ironman",
                "email": "arcreactor@stark.com",
                "userId": "RDUII_UC"
            }
        ],
        12: [
            {
                "firstName": "administrator",
                "lastName": "none",
                "screenName": "administrator",
                "email": "administrator@quickbase.com",
                "userId": "10000"
            }
        ]
    };
    const appRoles = [
        {
            "id": 9,
            "name": "none",
            "description": "",
            "access": "NONE"
        },
        {
            "id": 10,
            "name": "Viewer",
            "description": "",
            "access": "BASIC"
        },
        {
            "id": 11,
            "name": "Participant",
            "description": ""
        },
        {
            "id": 12,
            "name": "Administrator",
            "description": ""
        }
    ];
    const appOwner = {firstName: "Nic", lastName: "Cage", email: "stanleygoodspeed@fbi.gov"};
    const appOwnerNoEmail = {firstName: "Nic", lastName: "Cage"};
    const appOwnerName = `${appOwner.firstName} ${appOwner.lastName}`;
    it('test render of component', () => {
        let component = TestUtils.renderIntoDocument(<AppSettingsStage appUsers={appUsers}
                                                                     appRoles={appRoles}
                                                                     appOwner={appOwner}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test getAppOwnerName method with appOwner email', () => {
        let component = TestUtils.renderIntoDocument(<AppSettingsStage appUsers={appUsers}
                                                                     appRoles={appRoles}
                                                                     appOwner={appOwner}/>);
        let appOwnerNameResponse = component.getAppOwnerName();
        let mailTo = `mailto:${appOwner.email}`;
        expect(appOwnerNameResponse).toEqual(<a href={mailTo}>{appOwnerName}</a>);
    });

    it('test getAppOwnerName method with NO appOwner email', () => {
        let component = TestUtils.renderIntoDocument(<AppSettingsStage appUsers={appUsers}
                                                                     appRoles={appRoles}
                                                                     appOwner={appOwnerNoEmail}/>);
        let appOwnerNameResponse = component.getAppOwnerName();
        expect(appOwnerNameResponse).toEqual(appOwnerName);
    });
});
