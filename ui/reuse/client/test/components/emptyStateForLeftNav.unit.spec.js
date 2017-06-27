import React from 'react';
import {shallow, mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import EmptyStateForLeftNav, {__RewireAPI__ as EmptyStateForLeftNavRewireAPI} from '../../src/components/sideNavs/emptyStateForLeftNav';

let component;
let mockFunc = {
    handleOnClick() {}
};

const mockLocale = {
    locale: {getMessage() {}}
};

describe('CreateNewItemButton', () => {
    beforeEach(() => {
        jasmineEnzyme();
        EmptyStateForLeftNavRewireAPI.__Rewire__('Locale', mockLocale.locale);

        spyOn(mockLocale.locale, 'getMessage').and.returnValue('mockLocaleMessage');
        spyOn(mockFunc, 'handleOnClick');
    });

    afterEach(() => {
        EmptyStateForLeftNavRewireAPI.__ResetDependency__('Locale');
    });

    it('will invoke the handleOnClick function when clicked', () => {
        component = shallow(<EmptyStateForLeftNav handleOnClick={mockFunc.handleOnClick}/>);

        let iconButton = component.find('.createNewIcon');
        iconButton.simulate('click');

        expect(mockFunc.handleOnClick).toHaveBeenCalled();
    });

    it('will return an empty Message when there are no elements ', () => {
        component = mount(<EmptyStateForLeftNav emptyMessage="mockEmptyMessage"/>);

        expect(component.props().emptyMessage).toEqual('mockEmptyMessage');
        expect(component.find('.emptyState p').text()).toEqual('mockLocaleMessage');
    });

    it('will return a functional area className are no elements', () => {
        component = shallow(<EmptyStateForLeftNav className="mockClassName"/>);

        expect(component.find('.emptyState').hasClass('mockClassName')).toEqual(true);
    });

    it('will return icon when there are no elements', () => {
        component = shallow(<EmptyStateForLeftNav icon="mockIcon"/>);

        expect(component.find('[icon="mockIcon"]'));
    });

    it('will return icon message when there are no elements', () => {
        component = mount(<EmptyStateForLeftNav iconMessage="mockIconMessage"/>);

        expect(component.props().iconMessage).toEqual('mockIconMessage');
        expect(component.find('.iconMessage').text()).toEqual('mockLocaleMessage');
    });
});
