import React from 'react';
import {mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import EmptyStateForLeftNav from '../../src/components/sideNavs/emptyStateForLeftNav';

let component;
let mockFunc = {
    handleOnClick() {}
};

describe('CreateNewItemButton', () => {
    beforeEach(() => {
        jasmineEnzyme();
        spyOn(mockFunc, 'handleOnClick');
    });

    it('will invoke the handleOnClick function when clicked', () => {
        component = mount(<EmptyStateForLeftNav emptyMessage="mockEmptyMessage"
                                                handleOnClick={mockFunc.handleOnClick}
                                                className="mockClassName"
                                                icon="mockIcon"
                                                iconMessage="mockClass"/>);

        let iconButton = component.find('.createNewIcon');
        iconButton.simulate('click');

        expect(mockFunc.handleOnClick).toHaveBeenCalled();
        expect(component).toHaveProp('emptyMessage', 'mockEmptyMessage');
        expect(component).toHaveProp('className', 'mockClassName');
        expect(component).toHaveProp('icon', 'mockIcon');
        expect(component).toHaveProp('iconMessage', 'mockClass');
    });
});
