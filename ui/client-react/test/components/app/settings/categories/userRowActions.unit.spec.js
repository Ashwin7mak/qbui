/* eslint-disable babel/no-invalid-this */

import UserRowActions from '../../../../../src/components/app/settings/categories/userRowActions';
import React from  'react';
import {mount, shallow} from 'enzyme';

const props = {
    rowId: '10000',
    roleId: 12,
    isSelected:  true,
    onClickToggleSelectedRow: () => {}
};

describe('UserRowActions', () => {
    let component;
    let spy;
    let spyReceiveProps;
    beforeEach(() => {
        spy = spyOn(UserRowActions.propTypes, 'onClickToggleSelectedRow');
        spyReceiveProps = spyOn(UserRowActions.prototype, "componentWillReceiveProps");
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
    it('should call componentWillReceiveProps when component receives props', ()=>{
        component.setProps({isSelected: false});
        expect(spyReceiveProps).toHaveBeenCalled();
    });
});
