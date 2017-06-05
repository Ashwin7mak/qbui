/* eslint-disable babel/no-invalid-this */
import {UserActions, __RewireAPI__ as UserActionsRewireAPI} from '../../src/components/actions/userActions';
import React from  'react';
import {mount, shallow} from 'enzyme';
import TestUtils, {Simulate} from 'react-addons-test-utils';

const props = {
    selection: ['10000'],
    roleId: '12',
    appId: '0duiiaaaanc',
    selectedUserRows: [1],
    onEditSelected: () => {}
};

const unselectedProps = {
    selection: [],
    roleId: null,
    appId: null,
    selectedUserRows: [],
    onEditSelected: () => {}
};

describe('UserActions', () => {
    let component;
    beforeEach(() => {
        component = mount(<UserActions {...props}/>);
    });

    it('Should have all necessary elements', () => {
        expect(component.find('.actionIcons').length).toEqual(1);
        expect(component.find('.reportActions').length).toEqual(1);
        expect(component.find('.reportActionsBlock').length).toEqual(1);
        expect(component.find('a').length).toEqual(4);
        expect(component.find('.selectedRowsLabel').length).toEqual(1);

    });

    it('Selected Row label should have the correct number of selected Item', () => {
        expect(component.find('.selectedRowsLabel').text()).toEqual('1');
    });

    it('Action bar items should be disabled', () => {
        expect(component.find('.mail').childAt(0).hasClass('disabled')).toEqual(true);
        expect(component.find('.download-cloud').childAt(0).hasClass('disabled')).toEqual(true);
        expect(component.find('.settings').childAt(0).hasClass('disabled')).toEqual(true);
    });

    it('Should call unassignUsers when remove is clicked', () => {
        let mockUnassignUsers = {
            removeUsersFromAppRole() {
            }
        };

        spyOn(mockUnassignUsers, 'removeUsersFromAppRole');
        let clickProps = {
            selection: ['10000'],
            roleId: '12',
            appId: '0duiiaaaanc',
            selectedUserRows: [1],
            onEditSelected: () => {},
            actions:{unassignUsers: mockUnassignUsers.removeUsersFromAppRole}
        };
        component = mount(<UserActions {...clickProps}/>);
        component.find('.errorincircle-fill').simulate('click');
        expect(component.state().confirmDeletesDialogOpen).toEqual(true);
        let primaryButton = document.querySelector(`.qbModal .primaryButton`);
        Simulate.click(primaryButton);
        expect(component.state().confirmDeletesDialogOpen).toEqual(true);
        expect(mockUnassignUsers.removeUsersFromAppRole).toHaveBeenCalled();

    });

    it('Should not select a Row when an empty selection Props is passed', () => {
        let unselectedComponent = mount(<UserActions {...unselectedProps}/>);
        expect(unselectedComponent.find('.selectedRowsLabel').node.innerHTML).toEqual('0');
    });
});
