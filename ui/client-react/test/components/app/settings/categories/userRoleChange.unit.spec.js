import React from 'react';
import jasmineEnzyme from 'jasmine-enzyme';
import {UserRoleChange, __RewireAPI__ as UserRoleChangeAPI} from '../../../../../src/components/app/settings/categories/userRoleChange';
import {shallow, mount} from 'enzyme';
import TestUtils, {Simulate} from 'react-addons-test-utils';

let component;
let domComponent;

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
const roleId = 11;
const selectedApp = {
    name: 'Moz'
};
const selectedUserRows = [
	{id: 'RDUII_UB', roleId: '10'}
];

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
    assignUserToAppRole() {return Promise.resolve("response");},
    clearSelectedUserRows() {},
    getSelectionTip() {},
    removeUsersFromAppRole() {},
    toggleChangeUserRoleDialog() {},
};


function buildMockParent() {
    return React.createClass({
        render() {
            return (
				<UserRoleChange
					appRoles={appRoles}
					appId={appId}
					roleId={roleId}
					selectedUserRows={selectedUserRows}
					clearSelectedUserRows={mockParentFunctions.clearSelectedUserRows}
					getSelectionTip={mockParentFunctions.getSelectionTip}
					changeUserRoleDialog={true}
					removeUsersFromAppRole={mockParentFunctions.removeUsersFromAppRole}
					toggleChangeUserRoleDialog={mockParentFunctions.toggleChangeUserRoleDialog}
				/>
            );
        }
    });
}

function buildMockParentComponent(options) {
    return TestUtils.renderIntoDocument(React.createElement(buildMockParent()));
}


describe('UserRoleChange', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    afterEach(() => {
		// Remove modal from the dom after every test to reset
        let modalInDom = document.querySelector('.userRoleChange');
        if (modalInDom) {
            modalInDom.parentNode.removeChild(modalInDom);
        }
    });

    it('should render the component', ()=>{
        component = shallow(<UserRoleChange
								appRoles={appRoles}
								appId={appId}
								roleId={roleId}
								selectedUserRows={selectedUserRows}
								clearSelectedUserRows={mockParentFunctions.clearSelectedUserRows}
								getSelectionTip={mockParentFunctions.getSelectionTip}
								changeUserRoleDialog={true}
							/>);
        let content = component.find('MultiStepDialog');
        expect(component.length).toEqual(1);
    });

    it('should call removeUsersFromAppRole on click of change Role', ()=>{
        spyOn(mockParentFunctions, 'removeUsersFromAppRole').and.callFake(function() {
            return new Promise((resolve)=>{
                resolve("done");
            });
        });
        component = buildMockParentComponent();
        domComponent = document.querySelector('.userRoleChange');
        let changeRole = domComponent.querySelector('.finishedButton');
        Simulate.click(changeRole);
        expect(mockParentFunctions.removeUsersFromAppRole).toHaveBeenCalled();
    });

    let cancelAndClose = [{test: 'cancel', class: '.cancelButton'}, {test: 'close', class: '.closeButton'}];
    cancelAndClose.forEach((testCase)=>{
        it(`should call toggleChangeUserRoleDialog on click of ${testCase.test}`, ()=>{
            spyOn(mockParentFunctions, 'toggleChangeUserRoleDialog');
            component = buildMockParentComponent();
            domComponent = document.querySelector('.userRoleChange');
            let cancel = domComponent.querySelector(testCase.class);
            Simulate.click(cancel);
            expect(mockParentFunctions.toggleChangeUserRoleDialog).toHaveBeenCalled();
        });
    });
});
