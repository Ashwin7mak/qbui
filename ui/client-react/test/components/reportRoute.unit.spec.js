import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import Fluxxor from 'fluxxor';
import ReportRoute  from '../../src/components/report/reportRoute';
import FacetSelections  from '../../src/components/facet/facetSelections';
import configureMockStore from 'redux-mock-store';
import {Provider} from "react-redux";
const mockStore = configureMockStore();

describe('ReportRoute functions', () => {
    'use strict';
    const pendEdits = {showDTSErrorModal: false};
    let component;
    let reportDataSearchStore = Fluxxor.createStore({
        getState() {
            return {searchStringInput :''};
        }
    });

    let stores = {
        ReportDataSearchStore: new reportDataSearchStore()
    };

    let offSet = 0;
    let numRows = 10;

    let routeParams = {appId:1, tblId:2, rptId:3, format: true, pageOffSet: offSet, numRows: numRows};
    let reportDataParams = {reportData: {selections: new FacetSelections(), data: {columns: [{field: "col_num", headerName: "col_num"}]}, pageOffset: offSet, numRows: numRows}};
    let flux = new Fluxxor.Flux(stores);

    flux.actions = {
        selectTableId() {return;},
        loadReport() {return;},
        loadFields() {return;},
        hideTopNav() {return;},
        resetRowMenu() {return;}
    };

    beforeEach(() => {
        spyOn(flux.actions, 'loadReport');
        spyOn(flux.actions, 'loadFields');
        spyOn(flux.actions, 'selectTableId');
    });

    afterEach(() => {
        flux.actions.loadReport.calls.reset();
        flux.actions.loadFields.calls.reset();
        flux.actions.selectTableId.calls.reset();
    });

    it('test render of component with url params', () => {
        const initialState = {};
        const store = mockStore(initialState);

        component = TestUtils.renderIntoDocument(
            <Provider store={store}>
                <ReportRoute params={routeParams} reportData={reportDataParams.reportData} flux={flux} pendEdits={pendEdits}/>
            </Provider>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test flux action loadTableHomePage is called with app data', () => {
        const initialState = {};
        const store = mockStore(initialState);

        component = TestUtils.renderIntoDocument(
            <Provider store={store}>
                <ReportRoute params={routeParams} reportData={reportDataParams.reportData} flux={flux} pendEdits={pendEdits}/>
            </Provider>);
        expect(flux.actions.loadReport).toHaveBeenCalledWith(routeParams.appId, routeParams.tblId, routeParams.rptId, routeParams.format, routeParams.pageOffSet, routeParams.numRows);
    });

    it('test flux action loadTableHomePage is not called on 2nd called with same app data', () => {

        const initialState = {};
        const store = mockStore(initialState);
        const div = document.createElement('div');

        ReactDOM.render(
            <Provider store={store}>
                <ReportRoute params={routeParams} reportData={reportDataParams.reportData} flux={flux} pendEdits={pendEdits}></ReportRoute>
            </Provider>, div);
        expect(flux.actions.loadReport).toHaveBeenCalled();
        //  on subsequent call with same parameter data, the loadReport function is not called
        ReactDOM.render(
            <Provider store={store}>
                <ReportRoute params={routeParams} reportData={reportDataParams.reportData} flux={flux} pendEdits={pendEdits}></ReportRoute>
            </Provider>, div);
        expect(flux.actions.loadReport).not.toHaveBeenCalledWith();
    });

    it('test flux action loadTableHomePage is not called with missing app data', () => {
        const initialState = {};
        const store = mockStore(initialState);

        routeParams.appId = null;
        component = TestUtils.renderIntoDocument(
            <Provider store={store}>
                <ReportRoute params={routeParams} reportData={reportDataParams.reportData} flux={flux} pendEdits={pendEdits}/>
            </Provider>);
        expect(flux.actions.loadReport).not.toHaveBeenCalled();
    });

});
