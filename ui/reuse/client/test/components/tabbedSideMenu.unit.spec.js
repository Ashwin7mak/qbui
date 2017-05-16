import React from 'react';
import {mount} from 'enzyme';
import Tabs from 'rc-tabs';
import jasmineEnzyme from 'jasmine-enzyme';
import TabbedSideNav from 'REUSE/components/sideNavs/tabbedSideMenu';

let component;

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
    });

    afterEach(() => {
    });

    it('will invoke props onTabChanged && onTabClicked when a tab is clicked', () => {
        component = mount(<TabbedSideNav onTabChanged={mockPropsFunc.onTabChanged()}
                                         onTabClicked={mockPropsFunc.onTabClicked()}
                                         tabs={mockTabs} />);
        let tabs = component.find(TabbedSideNav);
        tabs.simulate('click');

        expect(mockPropsFunc.onTabChanged).toHaveBeenCalled();
        expect(mockPropsFunc.onTabClicked).toHaveBeenCalled();
    });

    it('will not invoke onTabChanged && onTabClicked if no props are passed in when a tab is clicked ', () => {
        component = mount(<TabbedSideNav />);
        let tabs = component.find(TabbedSideNav);
        tabs.simulate('click');

        expect(mockPropsFunc.onTabChanged).not.toHaveBeenCalled();
        expect(mockPropsFunc.onTabClicked).not.toHaveBeenCalled();
    });

    it('will defaultTab Prop ', () => {
        component = mount(<TabbedSideNav defaultTab={1} />);
        let tabs = component.find(Tabs);

        expect(tabs.props().defaultActiveKey).toEqual(1);
    });

    it('will set defautlActiveKey to null if no defaultProp or tabs are passed in', () => {
        component = mount(<TabbedSideNav />);
        let tabs = component.find(Tabs);

        expect(tabs.props().defaultActiveKey).toEqual(null);
    });

    it('will set defautlActiveKey to the first tab if tabs are passed in with no defaultTab props', () => {
        component = mount(<TabbedSideNav tabs={mockTabs} />);
        let tabs = component.find(Tabs);

        expect(tabs.props().defaultActiveKey).toEqual('tab one');
    });
});
