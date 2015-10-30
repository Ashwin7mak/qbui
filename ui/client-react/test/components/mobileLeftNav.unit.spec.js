import React from 'react';
import TestUtils from 'react-addons-test-utils';
import Fluxxor from 'fluxxor';
import ReactDOM from 'react-dom';
import {Link} from 'react-router';
import {Glyphicon} from 'react-bootstrap';
import MobileLeftNav from '../../src/components/nav/mobileLeftNav';

var I18nMessageMock = React.createClass({
    render: function() {
        return (
            <div>mock message</div>
        );
    }
});

let test_navitem1 = {
    id: 1,
    key: "testKey1",
    link: "testLink1",
    name: "testName1",
    icon: "testIcon"
};
let test_navitem2 = {
    id: 2,
    link: "testLink2",
    name: "testName2"
};
let test_headingitem = {
    id: 3,
    heading: true,
    link: "testLink3",
    key: "testKey3"
};

let testdata_navitem = {
    reportData: {
        list: [test_navitem1]
    }
};
let testdata_navitemlist = {
    reportData: {
        list: [test_navitem1, test_navitem2]
    }
};
let testdata_items = {
    items: [test_headingitem, test_navitem1, test_navitem2]
};

describe('Mobile Left Nav functions', () => {
    'use strict';

    var component;
    let flux = {
        actions: {
            toggleLeftNav: function() {
                return;
            }
        }
    };

    beforeEach(() => {
        MobileLeftNav.__Rewire__('I18nMessage', I18nMessageMock);
        spyOn(flux.actions, 'toggleLeftNav');
    });

    afterEach(() => {
        MobileLeftNav.__ResetDependency__('I18nMessage');
    });

    it('test render of component', () => {
        component = TestUtils.renderIntoDocument(<MobileLeftNav flux={flux} open={true}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test doesnt render default reports heading item when there is no report data', () => {
        component = TestUtils.renderIntoDocument(<MobileLeftNav flux={flux} open={true}/>);
        let headingItem = TestUtils.scryRenderedDOMComponentsWithClass(component, "mobileHeading");
        expect(headingItem.length).toEqual(0);
    });

    it('test renders default reports heading item when there is report data', () => {
        component = TestUtils.renderIntoDocument(<MobileLeftNav flux={flux} open={true}
                                                                reportsData={testdata_navitem.reportData}/>);
        let headingItem = TestUtils.scryRenderedDOMComponentsWithClass(component, "mobileHeading");
        expect(headingItem.length).toEqual(1);
    });

    it('test renders nav item', () => {
        component = TestUtils.renderIntoDocument(<MobileLeftNav flux={flux} open={true}
                                                                reportsData={testdata_navitem.reportData}/>);
        let navLink = TestUtils.scryRenderedDOMComponentsWithClass(component, "leftNavLink");
        expect(navLink.length).toEqual(1);
    });

    it('test renders nav item with key', () => {
        component = TestUtils.renderIntoDocument(<MobileLeftNav flux={flux}
                                                                reportsData={testdata_navitem.reportData}/>);
        let navLink = TestUtils.scryRenderedDOMComponentsWithClass(component, "leftNavLink");
        expect(navLink.length).toEqual(1);
        expect(navLink[0].textContent).toMatch(testdata_navitem.reportData.list[0].key);
    });

    it('test renders nav item with name', () => {
        let reportData = {
            list: [test_navitem2]
        };
        component = TestUtils.renderIntoDocument(<MobileLeftNav flux={flux} reportsData={reportData}/>);
        let navLink = TestUtils.scryRenderedDOMComponentsWithClass(component, "leftNavLink");
        expect(navLink.length).toEqual(1);
        expect(navLink[0].textContent).toMatch(test_navitem2.name);
    });

    it('test renders nav item with default icon', () => {
        component = TestUtils.renderIntoDocument(<MobileLeftNav flux={flux}
                                                                reportsData={testdata_navitemlist.reportData}/>);
        let navLink = TestUtils.scryRenderedComponentsWithType(component, Link);
        expect(navLink.length).toEqual(2);
        let icon = TestUtils.scryRenderedDOMComponentsWithClass(navLink[1], "glyphicon");
        expect(icon[0].className).toContain("glyphicon-th-list");
    });

    it('test renders nav item with icon if provided', () => {
        component = TestUtils.renderIntoDocument(<MobileLeftNav flux={flux}
                                                                reportsData={testdata_navitemlist.reportData}/>);
        let navLink = TestUtils.scryRenderedComponentsWithType(component, Link);
        expect(navLink.length).toEqual(2);
        let icon = TestUtils.scryRenderedDOMComponentsWithClass(navLink[0], "glyphicon");
        expect(icon[0].className).toContain("testIcon");
    });

    it('test highlights selected report', () => {
        component = TestUtils.renderIntoDocument(<MobileLeftNav flux={flux}
                                                                reportsData={testdata_navitemlist.reportData}
                                                                reportID={2}/>);
        let selectedReportLink = TestUtils.scryRenderedDOMComponentsWithClass(component, "selected");
        expect(selectedReportLink.length).toEqual(1);
        let navLink = selectedReportLink[0].querySelector(".leftNavLink");
        expect(navLink.textContent).toMatch(testdata_navitemlist.reportData.list[1].name);

    });

    it('test toggles nav on report selection', () => {
        component = TestUtils.renderIntoDocument(<MobileLeftNav flux={flux}
                                                                reportsData={testdata_navitemlist.reportData}/>);
        let navLink = TestUtils.scryRenderedDOMComponentsWithClass(component, "leftNavLink");
        TestUtils.Simulate.click(navLink[1]);
        expect(flux.actions.toggleLeftNav).toHaveBeenCalled();
    });

    it('test renders open heading item', () => {
        component = TestUtils.renderIntoDocument(<MobileLeftNav flux={flux} open={true} items={testdata_items.items}/>);
        let navLink = TestUtils.scryRenderedDOMComponentsWithClass(component, "leftNavLink");
        expect(navLink.length).toEqual(2);
        let headings = TestUtils.scryRenderedDOMComponentsWithClass(component, "mobileHeading");
        expect(headings.length).toEqual(1);
        expect(headings[0].textContent).toMatch("mock message");
    });

    it('test renders closed heading item', () => {
        component = TestUtils.renderIntoDocument(<MobileLeftNav flux={flux} open={false}
                                                                items={testdata_items.items}/>);
        let headings = TestUtils.scryRenderedDOMComponentsWithClass(component, "mobileHeading");
        expect(headings.length).toEqual(1);
        expect(headings[0].textContent).toMatch("");
    });

});
