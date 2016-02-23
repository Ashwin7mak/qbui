import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import ReportManager from '../../src/components/report/reportManager';

var I18nMessageMock = React.createClass({
    render: function() {
        return (
            <div>{this.props.message}</div>
        );
    }
});

let reportsTestData = {

    list: [
        {
            id: 1,
            name: 'List All',
            link: '/app/app1/table/table1/report/1'
        },
        {
            id: 2,
            name: 'List Changes',
            link: '/app/app1/table/table1/report/2'
        }
    ]
};

describe('Report Manager functions', () => {
    'use strict';

    var component;

    beforeEach(() => {
        component = TestUtils.renderIntoDocument(<ReportManager reportsData={reportsTestData}
                                                                onSelectReport={()=>{}} />);
    });

    it('test render opened with report list', () => {

        let reportItems = TestUtils.scryRenderedDOMComponentsWithClass(component, "reportItems");
        expect(reportItems.length).toBeGreaterThan(0);

        // 2 reports * 3 sections = 6 links
        let reportLinks = TestUtils.scryRenderedDOMComponentsWithClass(component, "reportLink");
        expect(reportLinks.length).toEqual(6);
    });

    it('test searching report list', () => {

        let searchInputBox = TestUtils.findRenderedDOMComponentWithTag(component, "input");
        searchInputBox.value = "Changes";
        TestUtils.Simulate.change(searchInputBox);

        let reportItems = TestUtils.scryRenderedDOMComponentsWithClass(component, "reportItems");
        expect(reportItems.length).toBeGreaterThan(0);

        // 1 filtered report * 3 sections = 3 links
        let reportLinks = TestUtils.scryRenderedDOMComponentsWithClass(component, "reportLink");
        expect(reportLinks.length).toEqual(3);
    });
});
