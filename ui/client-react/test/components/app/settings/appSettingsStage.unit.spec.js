/**
 * Created by rbeyer on 3/25/17.
 */
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {AppSettingsStage}  from '../../../../src/components/app/settings/appSettingsStage';
import {shallow, mount} from 'enzyme';

describe('AppSettingsStage functions', () => {
    'use strict';
    let component;
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
    const mockFunction = {
        changeStageSelectedRoleId: ()=>{}
    };

    it('test render of component', () => {
        component = shallow(<AppSettingsStage
                                appUsers={appUsers}
                                appRoles={appRoles}
                                appOwner={appOwner}
                            />);
        expect(component.length).toEqual(1);
    });

    it('test getAppOwnerName method with appOwner email', () => {
        component = mount(<AppSettingsStage
                            appUsers={appUsers}
                            appRoles={appRoles}
                            appOwner={appOwner}
                        />);
        let appOwnerNameResponse = component.instance().getAppOwnerName();
        let mailTo = `mailto:${appOwner.email}`;
        expect(appOwnerNameResponse).toEqual(<a href={mailTo}>{appOwnerName}</a>);
    });

    it('test getAppOwnerName method with NO appOwner email', () => {
        component = TestUtils.renderIntoDocument(<AppSettingsStage
                                                    appUsers={appUsers}
                                                    appRoles={appRoles}
                                                    appOwner={appOwnerNoEmail}
                                                />);
        let appOwnerNameResponse = component.getAppOwnerName();
        expect(appOwnerNameResponse).toEqual(appOwnerName);
    });

    it('calls changeStageSelectedRoleId on click of a role', () => {
        spyOn(mockFunction, 'changeStageSelectedRoleId');
        component = shallow(<AppSettingsStage
                                appUsers={appUsers}
                                appRoles={appRoles}
                                appOwner={appOwnerNoEmail}
                                changeStageSelectedRoleId={mockFunction.changeStageSelectedRoleId}
                            />);
        const roleSelector = component.find('.selectable').first();
        roleSelector.simulate('click');
        expect(mockFunction.changeStageSelectedRoleId).toHaveBeenCalledWith(10);
    });

    it('calls changeStageSelectedRoleId with null on click of selected role', () => {
        spyOn(mockFunction, 'changeStageSelectedRoleId');
        component = shallow(<AppSettingsStage
                                appUsers={appUsers}
                                appRoles={appRoles}
                                appOwner={appOwnerNoEmail}
                                stageSelectedRoleId={10}
                                changeStageSelectedRoleId={mockFunction.changeStageSelectedRoleId}
                            />);
        const roleSelector = component.find('.selectable').first();
        roleSelector.simulate('click');
        expect(mockFunction.changeStageSelectedRoleId).toHaveBeenCalledWith(null);
    });
});
