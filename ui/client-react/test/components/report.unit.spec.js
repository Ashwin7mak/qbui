import Fluxxor from 'fluxxor';

import React from 'react/addons';
import ReportRoute from '../../src/components/report/reportRoute'

var TestUtils = React.addons.TestUtils;

var StageMock = React.createClass({
    render: function () {
        return <div className="stage-mock-component" />;
    }
});
var ReportStageMock = React.createClass({
    render: function () {
        return <div className="report-stage-mock-component" />;
    }
});
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
    "before": {
        appId: "abcd1",
        tblId: "xyz1",
        rptId: 1
    },
    "after": {
        appId: "abcd2",
        tblId: "xyz2",
        rptId: 2
    }
}


describe('Report functions', () => {
    'use strict';

    var component;

    let flux = {
        actions:{
            loadReport: function(){return;}
        }
    };

    beforeEach(() => {
        ReportRoute.__Rewire__('Stage', StageMock);
        ReportRoute.__Rewire__('ReportContent', ContentMock);
        spyOn(ReportRoute.prototype, 'loadReport').and.callThrough();
    });

    afterEach(() => {
        ReportRoute.__ResetDependency__('Stage', StageMock);
        ReportRoute.__ResetDependency__('ReportContent', ContentMock);
    });

    it('test render of report with empty data', () => {
        component = TestUtils.renderIntoDocument(<ReportRoute flux={flux} reportData={fakeReportData_Empty}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        expect(TestUtils.scryRenderedComponentsWithType(component, StageMock).length).toEqual(1);
        expect(TestUtils.scryRenderedComponentsWithType(component, ContentMock).length).toEqual(1);
    });

    it('test render of report with data', () => {
        component = TestUtils.renderIntoDocument(<ReportRoute flux={flux} reportData={fakeReportData}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        expect(TestUtils.scryRenderedComponentsWithType(component, StageMock).length).toEqual(1);
        expect(TestUtils.scryRenderedComponentsWithType(component, ContentMock).length).toEqual(1);
    });

    /* tests for missing params */
    it('test render of report with no app', () => {
        component = TestUtils.renderIntoDocument(<ReportRoute flux={flux} reportData={fakeReportData} params={params.noapp}/>);
        expect(ReportRoute.prototype.loadReport).not.toHaveBeenCalled();
    });
    it('test render of report with no tbl', () => {
        component = TestUtils.renderIntoDocument(<ReportRoute flux={flux} reportData={fakeReportData} params={params.notbl}/>);
        expect(ReportRoute.prototype.loadReport).not.toHaveBeenCalled();
    });
    it('test render of report with no rpt', () => {
        component = TestUtils.renderIntoDocument(<ReportRoute flux={flux} reportData={fakeReportData} params={params.norpt}/>);
        expect(ReportRoute.prototype.loadReport).not.toHaveBeenCalled();
    });
    it('test render of report with valid params', () => {
        component = TestUtils.renderIntoDocument(<ReportRoute flux={flux} reportData={fakeReportData} params={params.before}/>);
        expect(ReportRoute.prototype.loadReport).toHaveBeenCalled();
    });

    /* test for re-render */
    it('test re-render of report with params', () => {
        var TestParent = React.createFactory(React.createClass({
            getInitialState() {
                return { params: params.before };
            },
            render() {
                return <ReportRoute flux={flux} ref="refReport" reportData={fakeReportData} params={this.state.params}/>
            }
        }));

        var parent = TestUtils.renderIntoDocument(TestParent());

        parent.setState({
            params: params.after
        });

        expect(parent.refs.refReport.props.params).toEqual(params.after);
        expect(ReportRoute.prototype.loadReport).toHaveBeenCalled();//With(params.after.appId, params.after.tblId, params.after.rptId);
    });

});
