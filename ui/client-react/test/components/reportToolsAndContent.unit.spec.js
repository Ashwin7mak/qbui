import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import ReportToolsAndContent  from '../../src/components/report/reportToolsAndContent';
import FacetSelections  from '../../src/components/facet/facetSelections';

import Locale from '../../src/locales/locales';
var i18n = Locale.getI18nBundle();

describe('ReportToolsAndContent functions', () => {
    'use strict';

    let component;

    let flux = {
        actions:{
            selectTableId() {return;},
            loadReport() {return;},
            loadFields() {return;},
            hideTopNav() {return;},
            getFilteredRecords() {return;},
            filterSearchPending() {return;},
            filterSelectionsPending() {return;}
        }
    };

    let reportParams = {appId:1, tblId:2, rptId:3};
    let reportDataParams = {reportData: {selections: new FacetSelections(), data: {columns: [{field: "col_num", headerName: "col_num"}]}}};
    let ReportContentMock = React.createClass({
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
    });

    // it('test render of loader', () => {
    //     component = TestUtils.renderIntoDocument(<AGGrid actions={TableActionsMock} loading={fakeReportData_loading.loading} flux={flux}/>);
    //     expect(TestUtils.scryRenderedComponentsWithType(component, Loader).length).toEqual(1);
    //     expect(TestUtils.scryRenderedComponentsWithType(component, AGGridReact).length).toEqual(0);
    // });

    it('test render of report widget', () => {
        var div = document.createElement('div');
        component = ReactDOM.render(<ReportToolsAndContent flux={flux} params={reportParams} {...reportDataParams} />, div);

        //  test that the reportContentMock is rendered
        expect(TestUtils.scryRenderedComponentsWithType(component, ReportContentMock).length).toEqual(1);
    });

    it('test report is not rendered with missing app data', () => {
        var div = document.createElement('div');
        reportParams.appId = undefined;
        component = ReactDOM.render(<ReportToolsAndContent flux={flux} params={reportParams} {...reportDataParams} />, div);

        //  test that the reportContentMock is rendered
        expect(TestUtils.scryRenderedComponentsWithType(component, ReportContentMock).length).toEqual(0);
    });
});
