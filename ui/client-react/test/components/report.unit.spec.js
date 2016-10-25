import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import Report from '../../src/components/report/reportRoute';
import ReportToolbar from '../../src/components/report/reportToolbar';
import Stage from '../../src/components/stage/stage';
import ReportDataSearchStore from '../../src/stores/reportDataSearchStore';
import Fluxxor from 'fluxxor';

import Locale from '../../src/locales/locales';
var i18n = Locale.getI18nBundle();

describe('Report functions', () => {
    'use strict';

    let component;
    let reportDataParams = {reportData: {data: {columns: [{field: "col_num", headerName: "col_num", fieldDef: {}}]}}};

    let reportParams = {appId:1, tblId:2, rptId:3, format: true, offSet: null, numRows: null};
    let secondaryParams = {appId:4, tblId:5, rptId:6};

    let reportDataSearchStore = Fluxxor.createStore({
        getState() {
            return {searchStringInput: ''};
        }
    });

    let stores = {
        ReportDataSearchStore: new reportDataSearchStore()
    };

    let flux = new Fluxxor.Flux(stores);

    flux.actions = {
        loadReport() {return;},
        selectTableId() {return;},
        getFilteredRecords() {return;},
        hideTopNav() {return;},
        loadFields() {return;}
    };

    let ReportStageMock = React.createClass({
        render() {
            return <div className="stage-mock" />;
        }
    });
    let ReportContentMock = React.createClass({
        render() {
            return <div className="report-content-mock" />;
        }
    });
    let ReportHeaderMock = React.createClass({
        render() {
            return <div className="report-toolbar-mock" />;
        }
    });
    beforeEach(() => {
        Report.__Rewire__('ReportStage', ReportStageMock);
        Report.__Rewire__('ReportHeader', ReportHeaderMock);
        spyOn(flux.actions, 'loadReport');
        spyOn(flux.actions, 'getFilteredRecords');
    });

    afterEach(() => {
        Report.__ResetDependency__('ReportStage');
        Report.__ResetDependency__('ReportHeader');
        flux.actions.loadReport.calls.reset();
        flux.actions.getFilteredRecords.calls.reset();
    });

    it('test flux action loadReport is not called with no app data', () => {
        var div = document.createElement('div');
        ReactDOM.render(<Report {...i18n} flux={flux}  />, div);
        expect(flux.actions.loadReport).not.toHaveBeenCalled();
    });

    it('test flux action loadReport is called with app data', () => {
        var div = document.createElement('div');
        ReactDOM.render(<Report {...i18n} flux={flux} params={reportParams} {...reportDataParams} />, div);
        expect(flux.actions.loadReport).toHaveBeenCalledWith(reportParams.appId, reportParams.tblId, reportParams.rptId, reportParams.format, reportParams.offSet, reportParams.numRows);
    });

    it('test flux action loadReport is not called on 2nd called with same app data', () => {
        var div = document.createElement('div');
        ReactDOM.render(<Report {...i18n} flux={flux} params={reportParams} {...reportDataParams} />, div);
        expect(flux.actions.loadReport).toHaveBeenCalled();

        //  on subsequent call with same parameter data, the loadReport function is not called
        ReactDOM.render(<Report {...i18n} flux={flux} params={reportParams} {...reportDataParams}/>, div);
        expect(flux.actions.loadReport).not.toHaveBeenCalledWith();
    });

    it('test flux action loadReport is not called with missing app data', () => {
        var div = document.createElement('div');

        reportParams.appId = null;
        ReactDOM.render(<Report {...i18n} flux={flux} params={reportParams} {...reportDataParams}/>, div);
        expect(flux.actions.loadReport).not.toHaveBeenCalled();
    });

    it('test flux action loadReport is not called with app data while reportData loading is true', () => {

        var div = document.createElement('div');

        reportDataParams.reportData.loading = true;
        ReactDOM.render(<Report {...i18n} flux={flux} params={reportParams} {...reportDataParams} />, div);
        expect(flux.actions.loadReport).not.toHaveBeenCalled();
    });

});
