import React from 'react';
import {shallow,mount} from 'enzyme';
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
        spyOn(mockFunc, 'handleOnClick');
        spyOn(mockLocale, 'locale').and.returnValue('mockLocaleMessage');
        EmptyStateForLeftNavRewireAPI.__Rewire__('Locale', mockLocale.locale);
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

    fit('will return an empty Message when there are no elements ', () => {
        component = mount(<EmptyStateForLeftNav apps={[]} emptyMessage="mockEmptyMessage"/>);

        expect(component.props().emptyMessage).to.equal('mockEmptyMessage');
        expect(component.find('.emptyState').text().toEqual('mockLocaleMessage'));
    });

    it('will return an empty Message when there are no elements', () => {
        component = shallow(<EmptyStateForLeftNav className="mockClassName"/>);

        expect(component.find('.emptyMessage').text().toEqual('mockClassName'));
    });

    it('will return icon when there are no elements', () => {
        component = shallow(<EmptyStateForLeftNav icon="mockIcon"/>);

        expect(component.find('.addNewIcon').text().toEqual('mockIcon'));
    });

    it('will return icon message when there are no elements', () => {
        component = shallow(<EmptyStateForLeftNav iconMessage="mockIconMessage"/>);

        expect(component.find('.iconMessage').text().toEqual('mockLocaleMessage'));
    });
});

