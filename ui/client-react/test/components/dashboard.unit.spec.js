import Fluxxor from 'fluxxor';

import React from 'react/addons';
import Dashboard from '../../src/components/dashboard/dashboardRoute'

var TestUtils = React.addons.TestUtils;

var ContentMock = React.createClass({
    render: function () {
        return <div className="datatable-mock-component" />;
    }
});

const fakeReportData_Empty = {
    data: {
        name: "",
        records: [],
        columns: []
    }
}

const fakeReportData = {
    data: {
        name: "test",
        records: [],
        columns: []
    }
}

const params = {
    "noapp": {
        tblId: "xyz1",
        rptId: 1
    },
    "notbl": {
        appId: "abcd1",
        rptId: 1
    },
    "norpt": {
        appId: "abcd1",
        tblId: "xyz1"
    },
    "valid": {
        appId: "abcd1",
        tblId: "xyz1",
        rptId: 1
    }
}


describe('Dashboard functions', () => {
    'use strict';

    var component;

    let flux = {
        actions:{
        }
    };

    beforeEach(() => {
        Dashboard.__Rewire__('ReportContent', ContentMock);
    });

    afterEach(() => {
        Dashboard.__ResetDependency__('ReportContent', ContentMock);
    });

    it('test render of component', () => {
        component = TestUtils.renderIntoDocument(<Dashboard flux={flux} reportData={fakeReportData_Empty}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        expect(TestUtils.scryRenderedComponentsWithType(component, ContentMock).length).toEqual(4);
    });

    /* tests for missing params */
    it('test render of report with no app', () => {
        component = TestUtils.renderIntoDocument(<Dashboard flux={flux} reportData={fakeReportData} params={params.noapp}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        expect(TestUtils.scryRenderedComponentsWithType(component, ContentMock).length).toEqual(4);
    });
    it('test render of report with no tbl', () => {
        component = TestUtils.renderIntoDocument(<Dashboard flux={flux} reportData={fakeReportData} params={params.notbl}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        expect(TestUtils.scryRenderedComponentsWithType(component, ContentMock).length).toEqual(4);
    });
    it('test render of report with no rpt', () => {
        component = TestUtils.renderIntoDocument(<Dashboard flux={flux} reportData={fakeReportData} params={params.norpt}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        expect(TestUtils.scryRenderedComponentsWithType(component, ContentMock).length).toEqual(4);
    });
    it('test render of report with valid params', () => {
        component = TestUtils.renderIntoDocument(<Dashboard flux={flux} reportData={fakeReportData} params={params.valid}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        expect(TestUtils.scryRenderedComponentsWithType(component, ContentMock).length).toEqual(4);
    });

});
