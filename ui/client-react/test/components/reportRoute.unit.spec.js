import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import Fluxxor from 'fluxxor';
import ReportRoute  from '../../src/components/report/reportRoute';
import FacetSelections  from '../../src/components/facet/facetSelections';

describe('ReportRoute functions', () => {
    'use strict';

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

    let routeParams = {appId:1, tblId:2, rptId:3, format: true, offSet: offSet, numRows: numRows};
    let reportDataParams = {reportData: {selections: new FacetSelections(), data: {columns: [{field: "col_num", headerName: "col_num"}]}, offset: offSet, numRows: numRows}};
    let flux = new Fluxxor.Flux(stores);

    flux.actions = {
        selectTableId() {return;},
        loadReport() {return;},
        loadFields() {return;},
        hideTopNav() {return;}
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
        component = TestUtils.renderIntoDocument(<ReportRoute params={routeParams} reportData={reportDataParams.reportData} flux={flux}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test flux action loadTableHomePage is called with app data', () => {
        component = TestUtils.renderIntoDocument(<ReportRoute params={routeParams} reportData={reportDataParams.reportData} flux={flux}></ReportRoute>);
        expect(flux.actions.loadReport).toHaveBeenCalledWith(routeParams.appId, routeParams.tblId, routeParams.rptId, routeParams.format, routeParams.offSet, routeParams.numRows);
    });

    it('test flux action loadTableHomePage is not called on 2nd called with same app data', () => {
        var div = document.createElement('div');
        ReactDOM.render(<ReportRoute params={routeParams} reportData={reportDataParams.reportData} flux={flux}></ReportRoute>, div);
        expect(flux.actions.loadReport).toHaveBeenCalled();
        //  on subsequent call with same parameter data, the loadReport function is not called
        ReactDOM.render(<ReportRoute params={routeParams} reportData={reportDataParams.reportData} flux={flux}></ReportRoute>, div);
        expect(flux.actions.loadReport).not.toHaveBeenCalledWith();
    });

    it('test flux action loadTableHomePage is not called with missing app data', () => {
        routeParams.appId = null;
        component = TestUtils.renderIntoDocument(<ReportRoute params={routeParams} reportData={reportDataParams.reportData} flux={flux}></ReportRoute>);
        expect(flux.actions.loadReport).not.toHaveBeenCalled();
    });

});
