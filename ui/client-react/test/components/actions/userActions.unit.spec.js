/* eslint-disable babel/no-invalid-this */
import {UserActions, __RewireAPI__ as UserActionsRewireAPI} from '../../../src/components/actions/userActions';
import React from  'react';
import {mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import Locale from '../../../../reuse/client/src/locales/locale';
import {Simulate} from 'react-addons-test-utils';

const mockActions = {
    removeUsersFromAppRole() {return Promise.resolve([1]);}
};

const props = {
    selection: ['10000'],
    roleId: '12',
    appId: '0duiiaaaanc',
    selectedUserRows: [1],
    onEditSelected: () => {},
    removeUsersFromAppRole: mockActions.removeUsersFromAppRole
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
    let instance;
    beforeEach(() => {
        jasmineEnzyme();
        component = mount(<UserActions {...props}/>);
        instance = component.instance();
        spyOn(mockActions, 'removeUsersFromAppRole');
    });
    afterEach(() => {
        mockActions.removeUsersFromAppRole.calls.reset();
        component.unmount();
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

    it('Confirm qbModal dialog appears when remove is clicked', () => {
        let clickProps = {
            selection: ['10000'],
            roleId: '12',
            appId: '0duiiaaaanc',
            selectedUserRows: [1],
            onEditSelected: () => {}
        };
        component = mount(<UserActions {...clickProps}/>);
        component.find('.iconUISturdy-errorincircle-fill').simulate('click');
        expect(component.state().confirmDeletesDialogOpen).toEqual(true);

    });

    it('Should not select a Row when an empty selection Props is passed', () => {
        let unselectedComponent = mount(<UserActions {...unselectedProps}/>);
        expect(unselectedComponent.find('.selectedRowsLabel').node.innerHTML).toEqual('0');
    });

    it('test cancelBulkDelete', () => {
        instance.cancelBulkDelete();
        expect(component.state().confirmDeletesDialogOpen).toEqual(false);
    });

    it('test handleBulkDelete', () => {
        instance.handleBulkDelete();
        expect(component.state().confirmDeletesDialogOpen).toEqual(false);
    });

    it('test getEmailBody', () => {
        expect(instance.getEmailBody()).toEqual(Locale.getMessage('app.users.emailBody'));
    });

    it('test getEmailSubject', () => {
        expect(instance.getEmailSubject()).toEqual(Locale.getMessage('app.users.emailSubject'));
    });
});
