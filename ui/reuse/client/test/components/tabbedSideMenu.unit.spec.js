import React from 'react';
import {mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import TabbedSideNav from 'REUSE/components/sideNavs/tabbedSideMenu';

let component;
let instance;

let mockTabs = [
    {
        key: 'tab one',
        title: 'tab one title',
        content:'Random Content inside of tab one'
    },
    {
        key: 'tab two',
        title: 'tab two title',
        content: 'random content inside of tab two'
    }
];

let mockPropsFunc = {
    onTabChanged() {},
    onTabClicked() {},
    getDefaultTab() {}
};

describe('tabbedSideMenu', () => {
    beforeEach(() => {
        jasmineEnzyme();
        spyOn(mockPropsFunc, 'onTabChanged');
        spyOn(mockPropsFunc, 'onTabClicked');
        spyOn(mockPropsFunc, 'getDefaultTab');
    });

    afterEach(() => {
    });

    it('will invoke ', () => {
        component = mount(<TabbedSideNav onTabChanged={mockPropsFunc.onTabChanged()}
                                         onTabClicked={mockPropsFunc.onTabClicked()}
                                         getDefaultTab={mockPropsFunc.getDefaultTab()}
                                         tabs={mockTabs} />);
        let tabs = component.find(TabbedSideNav);
        tabs.simulate('click');
        // console.log('tabs: ', tabs);
        // instance = component.instance();
        expect(mockPropsFunc.onTabChanged).toHaveBeenCalled();
        expect(mockPropsFunc.onTabClicked).toHaveBeenCalled();
        expect(mockPropsFunc.getDefaultTab).toHaveBeenCalled();
    });
});
