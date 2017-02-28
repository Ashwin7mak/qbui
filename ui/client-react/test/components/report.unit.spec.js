import React from 'react';
import ReactDOM from 'react-dom';
import Report, {__RewireAPI__ as ReportRewireAPI} from '../../src/components/report/reportRoute';
import Constants from '../../../common/src/constants';
import Fluxxor from 'fluxxor';
import {Provider} from "react-redux";
import configureMockStore from 'redux-mock-store';

import Locale from '../../src/locales/locales';
var i18n = Locale.getI18nBundle();

const mockStore = configureMockStore();

describe('Report functions', () => {
    'use strict';
    const pendEdits = {showDTSErrorModal: false};
    let component;
    let reportDataParams = {reportData: {data: {columns: [{field: "col_num", headerName: "col_num", fieldDef: {}}]}}};

    let reportParams = {appId:1, tblId:2, rptId:3, format: true, offSet: Constants.PAGE.DEFAULT_OFFSET, numRows: Constants.PAGE.DEFAULT_NUM_ROWS};
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
        loadFields() {return;},
        resetRowMenu() {return;}
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
        ReportRewireAPI.__Rewire__('ReportStage', ReportStageMock);
        ReportRewireAPI.__Rewire__('ReportHeader', ReportHeaderMock);
        spyOn(flux.actions, 'loadReport');
        spyOn(flux.actions, 'getFilteredRecords');
    });

    afterEach(() => {
        ReportRewireAPI.__ResetDependency__('ReportStage');
        ReportRewireAPI.__ResetDependency__('ReportHeader');
        flux.actions.loadReport.calls.reset();
        flux.actions.getFilteredRecords.calls.reset();
    });

    it('test flux action loadReport is not called with no app data', () => {
        const initialState = {};
        const store = mockStore(initialState);
        const div = document.createElement('div');
        ReactDOM.render(<Provider store={store}><Report {...i18n} flux={flux}  /></Provider>, div);
        expect(flux.actions.loadReport).not.toHaveBeenCalled();
    });

    it('test flux action loadReport is called with app data', () => {
        const initialState = {};
        const store = mockStore(initialState);

        var div = document.createElement('div');
        ReactDOM.render(
            <Provider store={store}>
                <Report {...i18n} flux={flux} params={reportParams} {...reportDataParams} pendEdits={pendEdits} />
            </Provider>, div);
        expect(flux.actions.loadReport).toHaveBeenCalledWith(reportParams.appId, reportParams.tblId, reportParams.rptId, reportParams.format, reportParams.offSet, reportParams.numRows);
    });

    it('test flux action loadReport is not called on 2nd called with same app data', () => {
        const initialState = {};
        const store = mockStore(initialState);
        const div = document.createElement('div');

        ReactDOM.render(
            <Provider store={store}>
                <Report {...i18n} flux={flux} params={reportParams} {...reportDataParams}  pendEdits={pendEdits}/>
            </Provider>, div);
        expect(flux.actions.loadReport).toHaveBeenCalled();

        //  on subsequent call with same parameter data, the loadReport function is not called
        ReactDOM.render(
            <Provider store={store}>
                <Report {...i18n} flux={flux} params={reportParams} {...reportDataParams}  pendEdits={pendEdits}/>
            </Provider>, div);
        expect(flux.actions.loadReport).not.toHaveBeenCalledWith();
    });

    it('test flux action loadReport is not called with missing app data', () => {

        const initialState = {};
        const store = mockStore(initialState);
        const div = document.createElement('div');

        reportParams.appId = null;
        ReactDOM.render(
            <Provider store={store}>
                <Report {...i18n} flux={flux} params={reportParams} {...reportDataParams}  pendEdits={pendEdits}/>
            </Provider>, div);
        expect(flux.actions.loadReport).not.toHaveBeenCalled();
    });

    it('test flux action loadReport is not called with app data while reportData loading is true', () => {

        const initialState = {};
        const store = mockStore(initialState);
        const div = document.createElement('div');

        reportDataParams.reportData.loading = true;
        ReactDOM.render(
            <Provider store={store}>
                <Report {...i18n} flux={flux} params={reportParams} {...reportDataParams} pendEdits={pendEdits}/>
            </Provider>, div);
        expect(flux.actions.loadReport).not.toHaveBeenCalled();
    });

});
