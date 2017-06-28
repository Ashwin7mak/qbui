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

describe('EmptyStateForLeftNav', () => {
    beforeEach(() => {
        jasmineEnzyme();
        EmptyStateForLeftNavRewireAPI.__Rewire__('Locale', mockLocale.locale);

        spyOn(mockLocale.locale, 'getMessage').and.returnValue('mockLocaleMessage');
        spyOn(mockFunc, 'handleOnClick');
    });

    afterEach(() => {
        EmptyStateForLeftNavRewireAPI.__ResetDependency__('Locale');
    });

    it('renders default empty state', () => {
        component = shallow(<EmptyStateForLeftNav handleOnClick={mockFunc.handleOnClick}/>);

        expect(component.find({icon: "add-new-filled"})).toBePresent();
    });

    it('will invoke the handleOnClick function when clicked', () => {
        component = shallow(<EmptyStateForLeftNav handleOnClick={mockFunc.handleOnClick}/>);

        let iconButton = component.find('.createNewIcon');
        iconButton.simulate('click');

        expect(mockFunc.handleOnClick).toHaveBeenCalled();
    });

    it('optionally has an empty message above the add button ', () => {
        component = mount(<EmptyStateForLeftNav emptyMessage="mockEmptyMessage" handleOnClick={mockFunc.handleOnClick}/>);

        expect(component.props().emptyMessage).toEqual('mockEmptyMessage');
        expect(component.find('.emptyState p').text()).toEqual('mockLocaleMessage');
    });

    it('optionally has an className', () => {
        component = shallow(<EmptyStateForLeftNav className="mockClassName" handleOnClick={mockFunc.handleOnClick}/>);

        expect(component.find('.emptyState').hasClass('mockClassName')).toEqual(true);
    });

    it('optionally has a different icon', () => {
        component = shallow(<EmptyStateForLeftNav icon="mockIcon" handleOnClick={mockFunc.handleOnClick}/>);

        expect(component.find('[icon="mockIcon"]'));
    });

    it('optionally has an icon message below the add button', () => {
        component = mount(<EmptyStateForLeftNav iconMessage="mockIconMessage" handleOnClick={mockFunc.handleOnClick}/>);

        expect(component.props().iconMessage).toEqual('mockIconMessage');
        expect(component.find('.iconMessage').text()).toEqual('mockLocaleMessage');
    });
});
