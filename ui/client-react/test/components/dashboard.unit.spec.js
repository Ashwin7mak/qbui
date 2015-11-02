import React from 'react';
import TestUtils from 'react-addons-test-utils';
import Dashboard from '../../src/components/dashboard/dashboardRoute';


var ContentMock = React.createClass({
    render: function() {
        return <div className="datatable-mock-component" />;
    }
});

const fakeReportData_Empty = {
    data: {
        name: "",
        records: [],
        columns: []
    }
};

const fakeReportData = {
    data: {
        name: "test",
        records: [],
        columns: []
    }
};

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
    },
    "changed": {
        appId: "abcd2",
        tblId: "xyz2",
        rptId: 2
    }
};


describe('Dashboard functions', () => {
    'use strict';

    var component;

    let flux = {
        actions:{
            loadReport: function() {return;}
        }
    };

    beforeEach(() => {
        Dashboard.__Rewire__('ReportContent', ContentMock);
        spyOn(flux.actions, 'loadReport');
    });

    afterEach(() => {
        Dashboard.__ResetDependency__('ReportContent', ContentMock);
        flux.actions.loadReport.calls.reset();
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
        expect(flux.actions.loadReport).not.toHaveBeenCalled();
    });
    it('test render of report with no tbl', () => {
        component = TestUtils.renderIntoDocument(<Dashboard flux={flux} reportData={fakeReportData} params={params.notbl}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        expect(TestUtils.scryRenderedComponentsWithType(component, ContentMock).length).toEqual(4);
        expect(flux.actions.loadReport).not.toHaveBeenCalled();
    });
    it('test render of report with no rpt', () => {
        component = TestUtils.renderIntoDocument(<Dashboard flux={flux} reportData={fakeReportData} params={params.norpt}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        expect(TestUtils.scryRenderedComponentsWithType(component, ContentMock).length).toEqual(4);
        expect(flux.actions.loadReport).not.toHaveBeenCalled();
    });
    it('test render of report with valid params', () => {
        component = TestUtils.renderIntoDocument(<Dashboard flux={flux} reportData={fakeReportData} params={params.valid}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        expect(TestUtils.scryRenderedComponentsWithType(component, ContentMock).length).toEqual(4);
        expect(flux.actions.loadReport).not.toHaveBeenCalled();
    });

    it('test render of report with updated params', () => {
        var TestParent = React.createFactory(React.createClass({
            getInitialState() {
                return {
                    params: params.valid
                };
            },
            render() {
                return <Dashboard flux={flux} reportData={fakeReportData} params={this.state.params}/>;
            }
        }));

        var parent = TestUtils.renderIntoDocument(TestParent());

        parent.setState({
            params: params.changed
        });

        expect(flux.actions.loadReport).toHaveBeenCalledWith(params.changed.appId, params.changed.tblId, params.changed.rptId, true);
    });
});
