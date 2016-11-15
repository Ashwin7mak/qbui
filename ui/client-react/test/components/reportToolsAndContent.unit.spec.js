import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReportToolsAndContent  from '../../src/components/report/reportToolsAndContent';
import FacetSelections  from '../../src/components/facet/facetSelections';

describe('ReportToolsAndContent functions', () => {
    'use strict';

    let component;

    const flux = {
        actions:{
            selectTableId() {return;},
            loadReport() {return;},
            loadFields() {return;},
            hideTopNav() {return;},
            getFilteredRecords() {return;},
            filterSearchPending() {return;},
            filterSelectionsPending() {return;},
            getNextReportPage() {return;},
            getPreviousReportPage() {return;},
        }
    };

    const rptId = '3';
    const reportParams = {appId: '1', tblId: '2', rptId: rptId, format: true, offset: 1, numRows: 10};
    const reportDataParams = {reportData: {loading:true, selections: new FacetSelections(), data: {columns: [{field: "col_num", headerName: "col_num"}]}}};

    const keyFieldName = 'Employee Number';
    const reportFields = {
        fields: {
            data: [
                {
                    id: 3,
                    keyField: true,
                    name: keyFieldName,
                },
                {
                    id: 1,
                    name: 'First Name'
                },
                {
                    id: 2,
                    name: 'Last Name'
                }
            ]
        }
    };

    const ReportContentMock = React.createClass({
        render() {
            return <div className="report-content-mock" />;
        }
    });

    beforeEach(() => {
        ReportToolsAndContent.__Rewire__('ReportContent', ReportContentMock);
        spyOn(flux.actions, 'selectTableId');
        spyOn(flux.actions, 'loadReport');
        spyOn(flux.actions, 'loadFields');
        spyOn(flux.actions, 'hideTopNav');
        spyOn(flux.actions, 'getFilteredRecords');
        spyOn(flux.actions, 'filterSearchPending');
        spyOn(flux.actions, 'filterSelectionsPending');
        spyOn(flux.actions, 'getNextReportPage');
        spyOn(flux.actions, 'getPreviousReportPage');
    });

    afterEach(() => {
        ReportToolsAndContent.__ResetDependency__('ReportContent');
        flux.actions.selectTableId.calls.reset();
        flux.actions.loadReport.calls.reset();
        flux.actions.loadFields.calls.reset();
        flux.actions.hideTopNav.calls.reset();
        flux.actions.getFilteredRecords.calls.reset();
        flux.actions.filterSearchPending.calls.reset();
        flux.actions.filterSelectionsPending.calls.reset();
        flux.actions.getNextReportPage.calls.reset();
        flux.actions.getPreviousReportPage.calls.reset();
    });

    it('test render of report widget', () => {
        var div = document.createElement('div');
        component = TestUtils.renderIntoDocument(<ReportToolsAndContent flux={flux} params={reportParams} {...reportDataParams} />, div);

        //  test that the reportContentMock is rendered
        expect(TestUtils.scryRenderedComponentsWithType(component, ReportContentMock).length).toEqual(1);
    });

    it('test report is not rendered with missing app data', () => {
        var div = document.createElement('div');
        let reportParamsWithUndefinedAppId = Object.assign({}, reportParams, {appId: undefined});
        component = TestUtils.renderIntoDocument(<ReportToolsAndContent flux={flux} params={reportParamsWithUndefinedAppId} {...reportDataParams} />, div);

        //  test that the reportContentMock is rendered
        expect(TestUtils.scryRenderedComponentsWithType(component, ReportContentMock).length).toEqual(0);
    });

    it('passes the uniqueIdentifier to child components', () => {
        let renderer = TestUtils.createRenderer();
        renderer.render(<ReportToolsAndContent rptId={rptId} fields={reportFields} flux={flux} params={reportParams} {...reportDataParams} />);

        let result = renderer.getRenderOutput();

        let reportContent = result.props.children.find(individualComponent => {
            return typeof individualComponent.type === 'function';
        });

        expect(reportContent).not.toBeNull();
        expect(reportContent).not.toBeUndefined();
        expect(reportContent.props.uniqueIdentifier).toEqual(keyFieldName);
    });
});
