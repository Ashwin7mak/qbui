import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import Fluxxor from 'fluxxor';
import ReportRoute, {__RewireAPI__ as ReportRouteRewireAPI}  from '../../src/components/report/reportRoute';
import FacetSelections  from '../../src/components/facet/facetSelections';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {Provider} from "react-redux";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

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

    let appId = 1;
    let tblId = 2;
    let rptId = 3;
    let offset = 0;
    let numRows = 10;

    let routeParams = {appId, tblId, rptId, format: true};
    let reportDataParams = {reportData: {selections: new FacetSelections(), data: {columns: [{field: "col_num", headerName: "col_num"}]}, pageOffset: offset, numRows: numRows}};
    let flux = new Fluxxor.Flux(stores);

    flux.actions = {
        selectTableId() {return;},
        loadReport() {return;},
        loadFields() {return;},
        hideTopNav() {return;},
        resetRowMenu() {return;}
    };

    const StageMock = React.createClass({
        render() {
            return <div className="stage-mock" />;
        }
    });

    const ReportToolsAndContentMock = React.createClass({
        render() {
            return <div className="report-mock" />;
        }
    });

    beforeEach(() => {
        spyOn(flux.actions, 'loadReport');
        spyOn(flux.actions, 'loadFields');
        spyOn(flux.actions, 'selectTableId');
        ReportRouteRewireAPI.__Rewire__('Stage', StageMock);
        ReportRouteRewireAPI.__Rewire__('ReportToolsAndContent', ReportToolsAndContentMock);
    });

    afterEach(() => {
        flux.actions.loadReport.calls.reset();
        flux.actions.loadFields.calls.reset();
        flux.actions.selectTableId.calls.reset();
        ReportRouteRewireAPI.__ResetDependency__('Stage');
        ReportRouteRewireAPI.__ResetDependency__('ReportToolsAndContent');
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

    describe('loadReport', () => {
        let loadReport = null;
        let initialState = {};
        let store = null;
        beforeEach(() => {
            loadReport = jasmine.createSpy('loadReport').and.callFake(() => {
                return {type: 'fake'};
            });
            ReportRouteRewireAPI.__Rewire__('loadReport', loadReport);

            store = mockStore(initialState);
        });

        afterEach(() => {
            ReportRouteRewireAPI.__ResetDependency__('loadReport');
        });

        it('loadReport is called with app data', () => {
            component = TestUtils.renderIntoDocument(
                <Provider store={store}>
                    <ReportRoute params={routeParams} reportData={reportDataParams.reportData} flux={flux} pendEdits={pendEdits}/>
                </Provider>);
            expect(loadReport).toHaveBeenCalledWith(
                jasmine.any(String),
                appId,
                tblId,
                rptId,
                true,
                offset,
                numRows
            );
        });

        it('loadReport is not called when appId is missing', () => {
            const missingRouteParams = Object.assign({}, routeParams, {appId: null});
            component = TestUtils.renderIntoDocument(
                <Provider store={store}>
                    <ReportRoute params={missingRouteParams} reportData={reportDataParams.reportData} flux={flux} pendEdits={pendEdits}/>
                </Provider>);
            expect(loadReport).not.toHaveBeenCalled();
        });

        it('loadReport is not called when tblId is missing', () => {
            const missingRouteParams = Object.assign({}, routeParams, {tblId: null});
            component = TestUtils.renderIntoDocument(
                <Provider store={store}>
                    <ReportRoute params={missingRouteParams} reportData={reportDataParams.reportData} flux={flux} pendEdits={pendEdits}/>
                </Provider>);
            expect(loadReport).not.toHaveBeenCalled();
        });

        it('loadReport is not called when rptId', () => {
            const missingRouteParams = Object.assign({}, routeParams, {rptId: null});
            component = TestUtils.renderIntoDocument(
                <Provider store={store}>
                    <ReportRoute params={missingRouteParams} reportData={reportDataParams.reportData} flux={flux} pendEdits={pendEdits}/>
                </Provider>);
            expect(loadReport).not.toHaveBeenCalled();
        });
    });
});
