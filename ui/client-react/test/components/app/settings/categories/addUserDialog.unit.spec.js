import React from 'react';
import jasmineEnzyme from 'jasmine-enzyme';
import {AddUserDialog, __RewireAPI__ as AddUserDialogAPI} from '../../../../../src/components/app/settings/categories/addUserDialog';
import {shallow} from 'enzyme';
import MultiStepDialog from '../../../../../../reuse/client/src/components/multiStepDialog/multiStepDialog';

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
const appId = '0duiiaaaazd';
const userRoleIdToAdd = 11;
const selectedApp = {
    name: 'Moz'
};
const userPanel =  {
    getSelectedUser: ()=>{return 1;}
};

const mockParentFunctions = {
    onCancel() {},
    onFinished() {},
    searchUsers() {},
    setRole() {},
    setUserRoleToAdd() {},
    toggleAddUserDialog() {},
    assignUserToAppRole() {return Promise.resolve("response");}
};

describe('AddUserDialog', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    afterEach(() => {
        // Remove modal from the dom after every test to reset
        let modalInDom = document.querySelector('.AddUserDialog');
        if (modalInDom) {
            modalInDom.parentNode.removeChild(modalInDom);
        }
    });

    it('should call hideModal on cancel', ()=>{
        spyOn(mockParentFunctions, 'toggleAddUserDialog');
        component = shallow(<AddUserDialog realmUsers={realmUsers}
                       searchUsers={mockParentFunctions.searchUsers}
                       appRoles={appRoles}
                       assignUserToApp={mockParentFunctions.assignUserToApp}
                       setUserRoleToAdd={mockParentFunctions.setUserRoleToAdd}
                       userRoleIdToAdd={userRoleIdToAdd}
                       appId={appId}
                       selectedApp={selectedApp}
                       existingUsers={appUsers}
                       addUserToAppDialogOpen={true}
                       hideDialog={mockParentFunctions.toggleAddUserDialog}
        />);
        let content = component.find('MultiStepDialog');
        expect(component.length).toEqual(1);
        component.instance().onCancel();
        expect(mockParentFunctions.toggleAddUserDialog).toHaveBeenCalled();
    });

    it('test isValid function', ()=>{
        spyOn(mockParentFunctions, 'toggleAddUserDialog');
        component = shallow(<AddUserDialog realmUsers={realmUsers}
                                           searchUsers={mockParentFunctions.searchUsers}
                                           appRoles={appRoles}
                                           assignUserToApp={mockParentFunctions.assignUserToApp}
                                           setUserRoleToAdd={mockParentFunctions.setUserRoleToAdd}
                                           userRoleIdToAdd={userRoleIdToAdd}
                                           appId={appId}
                                           selectedApp={selectedApp}
                                           existingUsers={appUsers}
                                           addUserToAppDialogOpen={true}
                                           hideDialog={mockParentFunctions.toggleAddUserDialog}
        />);
        let content = component.find('MultiStepDialog');
        expect(component.length).toEqual(1);
        component.instance().setValid(false);
        expect(component.state().isValid).toEqual(false);
    });

    it('test onFinished function', ()=>{
        spyOn(mockParentFunctions, 'assignUserToAppRole').and.callThrough();
        component = shallow(<AddUserDialog realmUsers={realmUsers}
                                           searchUsers={mockParentFunctions.searchUsers}
                                           appRoles={appRoles}
                                           assignUserToAppRole={mockParentFunctions.assignUserToAppRole}
                                           setUserRoleToAdd={mockParentFunctions.setUserRoleToAdd}
                                           userRoleIdToAdd={userRoleIdToAdd}
                                           appId={appId}
                                           selectedApp={selectedApp}
                                           existingUsers={appUsers}
                                           addUserToAppDialogOpen={true}
                                           hideDialog={mockParentFunctions.toggleAddUserDialog}
        />);
        expect(component.length).toEqual(1);
        component.instance().userPanel = userPanel;
        component.instance().onFinished();
        expect(mockParentFunctions.assignUserToAppRole).toHaveBeenCalled();
    });
});
