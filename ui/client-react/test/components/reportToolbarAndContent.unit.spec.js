import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import ReportToolbarAndContent  from '../../src/components/report/reportToolbarAndContent';
import FacetSelections  from '../../src/components/facet/facetSelections';

import Locale from '../../src/locales/locales';
var i18n = Locale.getI18nBundle();

describe('ReportToolbarAndContent functions', () => {
    'use strict';

    let component;

    let flux = {
        actions:{
            selectTableId() {return;},
            loadReport() {return;},
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
        ReportToolbarAndContent.__Rewire__('ReportContent', ReportContentMock);
        spyOn(flux.actions, 'selectTableId');
        spyOn(flux.actions, 'loadReport');
        spyOn(flux.actions, 'hideTopNav');
        spyOn(flux.actions, 'getFilteredRecords');
        spyOn(flux.actions, 'filterSearchPending');
        spyOn(flux.actions, 'filterSelectionsPending');
    });

    afterEach(() => {
        ReportToolbarAndContent.__ResetDependency__('ReportContent');
        flux.actions.selectTableId.calls.reset();
        flux.actions.loadReport.calls.reset();
        flux.actions.hideTopNav.calls.reset();
        flux.actions.getFilteredRecords.calls.reset();
        flux.actions.filterSearchPending.calls.reset();
        flux.actions.filterSelectionsPending.calls.reset();
    });

    it('test render of report widget', () => {
        var div = document.createElement('div');
        component = ReactDOM.render(<ReportToolbarAndContent flux={flux} params={reportParams} {...reportDataParams} />, div);

        //  test that the reportContentMock is rendered
        expect(TestUtils.scryRenderedComponentsWithType(component, ReportContentMock).length).toEqual(1);
    });

    it('test flux action loadReport is called with app data', () => {
        var div = document.createElement('div');
        ReactDOM.render(<ReportToolbarAndContent {...i18n} flux={flux} params={reportParams} {...reportDataParams} />, div);
        expect(flux.actions.loadReport).toHaveBeenCalledWith(reportParams.appId, reportParams.tblId, reportParams.rptId, true);
    });

    it('test flux action loadReport is not called on 2nd called with same app data', () => {
        var div = document.createElement('div');
        ReactDOM.render(<ReportToolbarAndContent {...i18n} flux={flux} params={reportParams} {...reportDataParams} />, div);
        expect(flux.actions.loadReport).toHaveBeenCalled();

        //  on subsequent call with same parameter data, the loadReport function is not called
        ReactDOM.render(<ReportToolbarAndContent {...i18n} flux={flux} params={reportParams} {...reportDataParams}/>, div);
        expect(flux.actions.loadReport).not.toHaveBeenCalledWith();
    });

    it('test flux action loadReport is not called with missing app data', () => {
        var div = document.createElement('div');

        reportParams.appId = null;
        ReactDOM.render(<ReportToolbarAndContent {...i18n} flux={flux} params={reportParams} {...reportDataParams}/>, div);
        expect(flux.actions.loadReport).not.toHaveBeenCalled();
    });

    it('test flux action loadReport is not called with app data while reportData loading is true', () => {
        var div = document.createElement('div');

        reportDataParams.reportData.loading = true;
        ReactDOM.render(<ReportToolbarAndContent {...i18n} flux={flux} params={reportParams} {...reportDataParams} />, div);
        expect(flux.actions.loadReport).not.toHaveBeenCalled();
    });
});
