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

    it('it will invoke the handleOnClick function when clicked', () => {
        component = mount(<EmptyStateForLeftNav emptyMessage="mockEmptyMessage"
                                                handleOnClick={mockFunc.handleOnClick}
                                                className="mockClassName"
                                                icon="mockIcon"
                                                iconMessage="mockClass"/>);

        let iconButton = component.find('.emptyStateIcon');
        iconButton.simulate('click');

        expect(mockFunc.handleOnClick).toHaveBeenCalled();
        expect(component.props().emptyMessage).toBe('mockEmptyMessage');
        expect(component.props().className).toBe('mockClassName');
        expect(component.props().icon).toBe('mockIcon');
        expect(component.props().iconMessage).toBe('mockClass');
    });
});
