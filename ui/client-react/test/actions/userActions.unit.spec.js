/* eslint-disable babel/no-invalid-this */

import {UserActions} from '../../src/components/actions/userActions';
import React from  'react';
import {mount, shallow} from 'enzyme';

const props = {
    selection: ['10000'],
    roleId: 12,
    appId: '0duiiaaaanc',
    onEditSelected: () => {}
};

describe('Manages user account', () => {
    let component;
    beforeEach(() => {
        component = mount(<UserActions {...props}/>);
    });

    it('Should have all necessary element', () => {
        expect(component.find('.actionIcons').length).toEqual(1);
        expect(component.find('a').length).toEqual(4);
        expect(component.find('.selectedRowsLabel').length).toEqual(1);
    });

    it('Selected Row label should have the correct number of selected Item', () => {
        expect(component.find('.selectedRowsLabel').text()).toEqual('1');
    });

    it('Action bar items should be disabled', () => {
        expect(component.find('.iconUISturdy-mail').hasClass('disabled')).toEqual(true);
        expect(component.find('.iconUISturdy-download-cloud').hasClass('disabled')).toEqual(true);
        expect(component.find('.iconUISturdy-settings').hasClass('disabled')).toEqual(true);
    });

    it('Should call handleDelete when remove is clicked', () => {
        component.find('.icon-errorincircle-fill').simulate('click');
        expect(component.state().confirmDeletesDialogOpen).toEqual(true);
    });
});
