/* eslint-disable babel/no-invalid-this */

import UserRowActions from '../../../../../src/components/app/settings/categories/userRowActions';
import React from  'react';
import {mount} from 'enzyme';

const props = {
    rowId: '10000',
    roleId: 12,
    isSelected:  true,
    onClickToggleSelectedRow: () => {}
};

describe('UserRowActions', () => {
    let component;
    let spy;
    beforeEach(() => {
        spy = spyOn(UserRowActions.propTypes, 'onClickToggleSelectedRow');
        component = mount(<UserRowActions {...props}/>);
    });

    it('Should have all necessary element', () => {
        expect(component.find('.actionsCol').length).toEqual(1);
        expect(component.find('.selectRowCheckbox').length).toEqual(1);
    });

    it('Should call onClickToggleSelectedRow when checkbox is clicked', () => {
        component.find('.selectRowCheckbox').simulate('click');
        expect(component.state().checked).toEqual(true);
        expect(spy).toHaveBeenCalled();
    });
});
