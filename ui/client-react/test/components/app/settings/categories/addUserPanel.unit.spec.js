import React from 'react';
import {mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import AddUserPanel from '../../../../../src/components/app/settings/categories/addUserPanel';
import TestUtils from 'react-addons-test-utils';

let component;
const realmUsers = [
    {
        "id": "RDUII_UF2",
        "firstName": "Clara",
        "lastName": "Beck",
        "screenName": "CBeck",
        "email": "udaic@mudo.mn",
        "deactivated": false,
        "administrator": false,
        "realmUserFlags": 0
    },
    {
        "id": "RDUII_UHI",
        "firstName": "Clarence",
        "lastName": "Bridges",
        "screenName": "CBridges",
        "email": "ulo@bopitzus.cd",
        "deactivated": false,
        "administrator": false,
        "realmUserFlags": 0
    },
    {
        "id": "RDUII_UHZ",
        "firstName": "Clara",
        "lastName": "Dunn",
        "screenName": "CDunn",
        "email": "wenek@himdot.fo",
        "deactivated": false,
        "administrator": false,
        "realmUserFlags": 0
    },
];
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
const appUsersEmpty = [];
const appId = 1;
const userColumns = ['name', 'roleName', 'email', 'screenName'];
const selectedRows = [];

const mockParentFunctions = {
    setUserRoleToAdd() {},
    searchUsers() {},
    getRoles() {},
    updateRole() {},
};


describe('AddUserPanel', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('renders a AddUserPanel', () => {
        component = mount(<AddUserPanel appRoles={appRoles}
                                realmUsers={realmUsers}
                                searchUsers={mockParentFunctions.searchUsers}
                                isValid={true}
                                existingUsers={appUsers}
                                setUserRoleToAdd={mockParentFunctions.setUserRoleToAdd}
        />);
        expect(component.find('.assignRole')).toBePresent();
    });

    it('test getRoles method', () => {
        spyOn(mockParentFunctions, 'getRoles');
        component = TestUtils.renderIntoDocument(<AddUserPanel appRoles={appRoles}
                                        realmUsers={realmUsers}
                                        searchUsers={mockParentFunctions.searchUsers}
                                        isValid={true}
                                        existingUsers={appUsers}
                                        setUserRoleToAdd={mockParentFunctions.setUserRoleToAdd}
                                        />);
        let roles = component.getRoles();
        expect(roles.length).toEqual(4);
    });

    it('test updateRoles method', () => {
        spyOn(mockParentFunctions, 'getRoles');
        component = TestUtils.renderIntoDocument(<AddUserPanel appRoles={appRoles}
                                                               realmUsers={realmUsers}
                                                               searchUsers={mockParentFunctions.searchUsers}
                                                               isValid={true}
                                                               existingUsers={appUsers}
                                                               setUserRoleToAdd={mockParentFunctions.setUserRoleToAdd}
        />);
        let roles = component.updateRole(appRoles[1].id);
        expect(component.state.selectedRole).toEqual(10);
    });
});
