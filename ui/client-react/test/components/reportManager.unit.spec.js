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

    let component;

    const flux = {
        actions: {
            filterReportsByName: () => {return;}
        }
    };

    beforeEach(() => {
        spyOn(flux.actions, 'filterReportsByName');
    });

    afterEach(() => {
        flux.actions.filterReportsByName.calls.reset();
    });

    it('test render opened with report list', () => {
        component = TestUtils.renderIntoDocument(<ReportManager flux={flux}
                                                                reportsData={reportsTestData}
                                                                onSelectReport={()=>{}} />);

        let reportItems = TestUtils.scryRenderedDOMComponentsWithClass(component, "reportItems");
        expect(reportItems.length).toBeGreaterThan(0);

        // 2 reports * 3 sections = 6 links
        let reportLinks = TestUtils.scryRenderedDOMComponentsWithClass(component, "reportLink");
        expect(reportLinks.length).toEqual(2);
    });

    it('test searching report list', () => {
        component = TestUtils.renderIntoDocument(<ReportManager flux={flux}
                                                                filterReportsName="Changes"
                                                                reportsData={reportsTestData}
                                                                onSelectReport={()=>{}} />);

        let reportItems = TestUtils.scryRenderedDOMComponentsWithClass(component, "reportItems");
        expect(reportItems.length).toBeGreaterThan(0);

        // 1 filtered report
        let reportLinks = TestUtils.scryRenderedDOMComponentsWithClass(component, "reportLink");
        expect(reportLinks.length).toEqual(1);

        let searchInputBox = TestUtils.findRenderedDOMComponentWithTag(component, "input");
        searchInputBox.value = "Changes";
        TestUtils.Simulate.change(searchInputBox);

        expect(flux.actions.filterReportsByName).toHaveBeenCalledWith("Changes");
    });
});
