import React from 'react';
import {mount} from 'enzyme';
import Tabs from 'rc-tabs';
import jasmineEnzyme from 'jasmine-enzyme';
import TabbedSideNav from 'REUSE/components/sideNavs/tabbedSideMenu';

let component;
let mockTabs = [
    {
        key: 'tabOne',
        title: 'tab one title',
        content:'Random Content inside of tab one'
    },
    {
        key: 'tabTwo',
        title: 'tab two title',
        content: 'Random content inside of tab two'
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

    it('will invoke the props onTabChanged && onTabClicked when a tab is clicked', () => {
        component = mount(<TabbedSideNav onTabChanged={mockPropsFunc.onTabChanged}
                                         onTabClicked={mockPropsFunc.onTabClicked}
                                         tabs={mockTabs} />);

        let tabs = component.find('.rc-tabs-tab').at(1);
        tabs.simulate('click');

        expect(mockPropsFunc.onTabChanged).toHaveBeenCalledWith(mockTabs[1].key);
        expect(mockPropsFunc.onTabClicked).toHaveBeenCalledWith(mockTabs[1].key);
    });

    it('will not invoke the props onTabChanged && onTabClicked if they are not passed in when a tab is clicked ', () => {
        component = mount(<TabbedSideNav tabs={mockTabs}/>);

        let tabs = component.find('.rc-tabs-tab').at(1);
        tabs.simulate('click');

        expect(mockPropsFunc.onTabChanged).not.toHaveBeenCalled();
        expect(mockPropsFunc.onTabClicked).not.toHaveBeenCalled();
    });

    it('will set defaultActiveKey to passed in defaultTab prop ', () => {
        component = mount(<TabbedSideNav defaultTab={1} />);
        let tabs = component.find(Tabs);

        expect(tabs.props().defaultActiveKey).toEqual(1);
    });

    it('will set defaultActiveKey to null if no defaultProp or tabs are passed in', () => {
        component = mount(<TabbedSideNav />);
        let tabs = component.find(Tabs);

        expect(tabs.props().defaultActiveKey).toEqual(null);
    });

    it('will set defaultActiveKey to the first tab if tabs are passed in with no defaultTab props', () => {
        component = mount(<TabbedSideNav tabs={mockTabs} />);
        let tabs = component.find(Tabs);

        expect(tabs.props().defaultActiveKey).toEqual(mockTabs[0].key);
    });

    it('will hide the tabs on menu collapse', () => {
        component = mount(<TabbedSideNav tabs={mockTabs} isCollapsed={true}/>);
        let tabs = component.find('.hideTabs');

        expect(tabs).toBePresent();
    });

    it('will not hide the tabs if the menu is not collapsed', () => {
        component = mount(<TabbedSideNav tabs={mockTabs} isCollapsed={false}/>);
        let tabs = component.find('.hideTabs');

        expect(tabs).not.toBePresent();
    });
});
