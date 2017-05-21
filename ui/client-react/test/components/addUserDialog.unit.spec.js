import React from 'react';
import {mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import AddUserDialog from '../../src/components/user/addUserDialog';
import {Simulate} from 'react-addons-test-utils';
import TestUtils from 'react-addons-test-utils';
import {shallow} from 'enzyme';
import MultiStepDialog from '../../../reuse/client/src/components/multiStepDialog/multiStepDialog';
import {I18nMessage} from "../../src/utils/i18nMessage";

let component;
let domComponent;

const allUsers = [
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
const appId = '0duiiaaaazd';
const userRoleToAdd = 11;
const selectedApp = {
    name: 'Moz'
};
const userPanel =  {
    getSelectedUser: ()=>{}
};


const mockParentFunctions = {
    onCancel() {},
    onFinished() {},
    searchUsers() {},
    setRole() {},
    setUserRoleToAdd() {},
    toggleAddUserDialog() {},
    assignUserToApp() {
        return new Promise((resolve)=>{
            resolve('response')
        });
    },


};
//
// function buildMockParent() {
//     return React.createClass({
//         getInitialState() {
//             return {
//                 pageIndex: 0
//             };
//         },
//         render() {
//
//             return (
//                 <AddUserDialog allUsers={allUsers}
//                                searchUsers={mockParentFunctions.searchUsers}
//                                appRoles={appRoles}
//                                assignUserToApp={mockParentFunctions.assignUserToApp}
//                                setUserRoleToAdd={mockParentFunctions.setUserRoleToAdd}
//                                userRoleToAdd={userRoleToAdd}
//                                appId={appId}
//                                selectedApp={selectedApp}
//                                existingUsers={appUsers}
//                                addUserToAppDialogOpen={true}
//                                hideDialog={mockParentFunctions.toggleAddUserDialog}
//                 />
//             );
//         }
//     });
// }


// function buildMockParentComponent(options) {
//     return shallow(React.createElement(buildMockParent()));
// }

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

    // it('renders a AddUserDialog component', () => {
    //     component = buildMockParentComponent();
    //     domComponent = document.querySelector('.addUserDialog');
    //     expect(domComponent).not.toBeNull();
    // });
    it('should call hideModal on cancel', ()=>{
        spyOn(mockParentFunctions, 'toggleAddUserDialog');
        component = shallow(<AddUserDialog allUsers={allUsers}
                       searchUsers={mockParentFunctions.searchUsers}
                       appRoles={appRoles}
                                           assignUserToApp={mockParentFunctions.assignUserToApp}
                       setUserRoleToAdd={mockParentFunctions.setUserRoleToAdd}
                       userRoleToAdd={userRoleToAdd}
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
        component = shallow(<AddUserDialog allUsers={allUsers}
                                           searchUsers={mockParentFunctions.searchUsers}
                                           appRoles={appRoles}
                                           assignUserToApp={mockParentFunctions.assignUserToApp}
                                           setUserRoleToAdd={mockParentFunctions.setUserRoleToAdd}
                                           userRoleToAdd={userRoleToAdd}
                                           appId={appId}
                                           selectedApp={selectedApp}
                                           existingUsers={appUsers}
                                           addUserToAppDialogOpen={true}
                                           hideDialog={mockParentFunctions.toggleAddUserDialog}
        />);
        let content = component.find('MultiStepDialog');
        expect(component.length).toEqual(1);
        component.instance().isValid(false);
        expect(component.state().isValid).toEqual(false);
    });

    it('test onFinished function', ()=>{
        spyOn(mockParentFunctions, 'assignUserToApp');
        component = shallow(<AddUserDialog allUsers={allUsers}
                                           searchUsers={mockParentFunctions.searchUsers}
                                           appRoles={appRoles}
                                           assignUserToApp={mockParentFunctions.assignUserToApp}
                                           setUserRoleToAdd={mockParentFunctions.setUserRoleToAdd}
                                           userRoleToAdd={userRoleToAdd}
                                           appId={appId}
                                           selectedApp={selectedApp}
                                           existingUsers={appUsers}
                                           addUserToAppDialogOpen={true}
                                           hideDialog={mockParentFunctions.toggleAddUserDialog}
        />);
        let content = component.find('MultiStepDialog');
        expect(component.length).toEqual(1);
        component.instance().userPanel = userPanel
        component.instance().onFinished()
        expect(mockParentFunctions.assignUserToApp).toHaveBeenCalled();
    });

    //
    // it('calls the onFinished function', () => {
    //     component = buildMockParentComponent();
    //     domComponent = document.querySelector('.addUserDialog');
    //     let addButton = domComponent.querySelector('.finishedButton');
    //     Simulate.click(addButton);
    //     // component.removeChild(domComponent);
    // });
    //
    // it('cancels the AddUserDialog', () => {
    //     component = buildMockParentComponent();
    //     domComponent = document.querySelector('.addUserDialog');
    //     let cancelButton = domComponent.querySelector('.cancelButton');
    //     Simulate.click(cancelButton);
    //     let modalInDom = document.querySelector('.AddUserDialog');
    //     if (modalInDom) {
    //         modalInDom.parentNode.removeChild(modalInDom);
    //     }
    // });
});
