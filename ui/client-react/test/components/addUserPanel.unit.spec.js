import React from 'react';
import {mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import AddUserPanel from '../../src/components/app/settings/categories/addUserPanel';
import TestUtils from 'react-addons-test-utils';
import {shallow} from 'enzyme';

let component;

let tableInfo = {
    name: {value: 'Customers'},
    tableNoun: {value: 'customer'},
    description: {value: ''},
    tableIcon: {value: 'projects'}
};

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
const usersResolved = [
    {
        "firstName": "Steve",
        "lastName": "Rogers",
        "screenName": "Cap",
        "email": "imissthe40s@shield.com",
        "userId": "RDUII_UB",
        "roleName": "Viewer",
        "name": "Steve Rogers",
        "isSelected": false,
        "roleId": 10
    },
    {
        "firstName": "Tony",
        "lastName": "Stark",
        "screenName": "ironman",
        "email": "arcreactor@stark.com",
        "userId": "RDUII_UC",
        "roleName": "Participant",
        "name": "Tony Stark",
        "isSelected": false,
        "roleId": 11
    },
    {
        "firstName": "administrator",
        "lastName": "none",
        "screenName": "administrator",
        "email": "administrator@quickbase.com",
        "userId": "10000",
        "roleName": "Administrator",
        "name": "administrator none",
        "isSelected": false,
        "roleId": 12
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

    it('changes the role on change of the Role Select component', () => {
        spyOn(mockParentFunctions, 'updateRole');
        component = shallow(<AddUserPanel appRoles={appRoles}
                                        realmUsers={realmUsers}
                                        searchUsers={mockParentFunctions.searchUsers}
                                        isValid={true}
                                        existingUsers={appUsers}
                                        setUserRoleToAdd={mockParentFunctions.setUserRoleToAdd}
        />);
        const selectWrapper = component.find('.assignRole Select');
        expect(component.state().selectedRole).toEqual(11);
        selectWrapper.simulate('change');
        expect(component.state().selectedRole).toEqual(undefined);
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
