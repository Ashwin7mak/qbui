import React from 'react';
import {shallow, mount} from 'enzyme';
import Fluxxor from 'fluxxor';
import {MemoryRouter} from 'react-router-dom';

import ReportRoute, {
    ReportRoute as UnconnectedReportRoute,
    __RewireAPI__ as ReportRouteRewireAPI
}  from '../../src/components/report/reportRoute';
import FacetSelections  from '../../src/components/facet/facetSelections';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {Provider} from "react-redux";
import ReportSaveOrCancelFooter from '../../src/components/reportBuilder/reportSaveOrCancelFooter';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('ReportRoute', () => {
    'use strict';
    const pendEdits = {};
    let component;
    let mockFluxStore = Fluxxor.createStore({
        getState() {
            return {};
        }
    });

    let props = {
        clearSearchInput: () => {},
        loadFields: (app, tbl) => {},
        loadReport: (context, appId, tblId, rptId, format, offset, rows) => {},
        loadDynamicReport: (context, appId, tblId, rptId, format, filter, queryParams) => {},
        reportBuilder: {
            isInBuilderMode: true,
            isCollapsed: true,
            addBeforeColumn: null,
            availableColumns: []
        },
        hideTopNav: () => {}
    };

    let appId = 1;
    let tblId = 2;
    let rptId = 3;
    let offset = 0;
    let numRows = 10;

    let routeParams = {
        params: {appId, tblId, rptId, format: true}
    };
    let reportDataParams = {reportData: {selections: new FacetSelections(), data: {columns: [{field: "col_num", headerName: "col_num"}]}, pageOffset: offset, numRows: numRows}};

    let stores = {
        FluxStore: new mockFluxStore()
    };
    let flux = new Fluxxor.Flux(stores);

    flux.actions = {
        selectTableId() {return;}
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

    class mockReportFieldSelectMenu extends React.Component {
        render() {
            return <div />;
        }
    }

    class mockReportSaveOrCancelFooter extends React.Component {
        render() {
            return <div />;
        }
    }

    beforeEach(() => {
        spyOn(flux.actions, 'selectTableId');
        spyOn(props, 'clearSearchInput');
        spyOn(props, 'loadFields');
        spyOn(props, 'loadReport');
        spyOn(props, 'loadDynamicReport');
        ReportRouteRewireAPI.__Rewire__('Stage', StageMock);
        ReportRouteRewireAPI.__Rewire__('ReportToolsAndContent', ReportToolsAndContentMock);
        ReportRouteRewireAPI.__Rewire__('ReportFieldSelectMenu', mockReportFieldSelectMenu);
        ReportRouteRewireAPI.__Rewire__('ReportSaveOrCancelFooter', mockReportSaveOrCancelFooter);
    });

    afterEach(() => {
        flux.actions.selectTableId.calls.reset();
        props.clearSearchInput.calls.reset();
        props.loadFields.calls.reset();
        props.loadReport.calls.reset();
        props.loadDynamicReport.calls.reset();
        ReportRouteRewireAPI.__ResetDependency__('Stage');
        ReportRouteRewireAPI.__ResetDependency__('ReportToolsAndContent');
        ReportRouteRewireAPI.__ResetDependency__('ReportFieldSelectMenu');
        ReportRouteRewireAPI.__ResetDependency__('ReportSaveOrCancelFooter');
    });

    it('renders a component', () => {
        const initialState = {};
        const store = mockStore(initialState);

        component = mount(
            <Provider store={store}>
                <MemoryRouter>
                    <ReportRoute {...props} reportData={reportDataParams.reportData} flux={flux} pendEdits={pendEdits}/>
                </MemoryRouter>
            </Provider>);
        expect(component.find(ReportRoute).length).toEqual(1);
    });

    it('renders a report container with route match', () => {
        const initialState = {};
        const store = mockStore(initialState);

        component = mount(
            <Provider store={store}>
                <UnconnectedReportRoute
                    {...props}
                    match={routeParams}
                    reportData={reportDataParams.reportData}
                    flux={flux}
                    pendEdits={pendEdits}
                />
            </Provider>);
        expect(component.find('.reportContainer').length).toEqual(1);
    });

    describe('loadReport', () => {
        let initialState = {};
        let store = null;
        beforeEach(() => {
            store = mockStore(initialState);
        });

        it('loadReport is called with app data on mount', () => {
            component = mount(
                <Provider store={store}>
                    <UnconnectedReportRoute {...props} match={routeParams} reportData={reportDataParams.reportData} flux={flux} pendEdits={pendEdits}/>
                </Provider>);
            expect(props.loadReport).toHaveBeenCalledWith(jasmine.any(String), appId, tblId, rptId, true, offset, numRows);

        });

        it('loadReport is not called when appId is missing', () => {
            const missingRouteParams = Object.assign({}, routeParams, {params: {appId: null}});
            component = mount(
                <Provider store={store}>
                    <UnconnectedReportRoute {...props} match={missingRouteParams} reportData={reportDataParams.reportData} flux={flux} pendEdits={pendEdits}/>
                </Provider>);
            expect(props.loadReport).not.toHaveBeenCalled();
        });

        it('loadReport is not called when tblId is missing', () => {
            const missingRouteParams = Object.assign({}, routeParams, {params: {tblId: null}});
            component = mount(
                <Provider store={store}>
                    <UnconnectedReportRoute {...props} match={missingRouteParams} reportData={reportDataParams.reportData} flux={flux} pendEdits={pendEdits}/>
                </Provider>);
            expect(props.loadReport).not.toHaveBeenCalled();
        });

        it('loadReport is not called when rptId is missing', () => {
            const missingRouteParams = Object.assign({}, routeParams, {params: {rptId: null}});
            component = mount(
                <Provider store={store}>
                    <UnconnectedReportRoute {...props} match={missingRouteParams} reportData={reportDataParams.reportData} flux={flux} pendEdits={pendEdits}/>
                </Provider>);
            expect(props.loadReport).not.toHaveBeenCalled();
        });
    });

    describe('loadDynamicReport', () => {
        const initialState = {};
        let store = null;
        const paramsWithChildTable = Object.assign({}, routeParams.params, {detailKeyFid: 4, detailKeyValue: 'value'});

        beforeEach(() => {
            store = mockStore(initialState);
        });

        it(`is called with app data on mount if 'detailKeyFid' and 'detailKeyValue' are passed in as part of params`, () => {
            component = mount(
                <Provider store={store}>
                    <UnconnectedReportRoute
                        {...props}
                        match={{params: paramsWithChildTable}}
                        reportData={reportDataParams.reportData}
                        flux={flux}
                        pendEdits={pendEdits}/>
                </Provider>);
            expect(props.loadDynamicReport).toHaveBeenCalledWith(
                jasmine.any(String),
                appId,
                tblId,
                rptId,
                true,
                jasmine.any(Object),
                jasmine.objectContaining({
                    query: jasmine.any(String),
                    offset,
                    numRows
                })
            );
        });

        it(`is not called if 'detailKeyFid' and 'detailKeyValue' are not defined`, () => {
            component = mount(
                <Provider store={store}>
                    <UnconnectedReportRoute
                        {...props}
                        match={routeParams}
                        reportData={reportDataParams.reportData}
                        flux={flux}
                        pendEdits={pendEdits}/>
                </Provider>);
            expect(props.loadDynamicReport).not.toHaveBeenCalled();
        });
    });
});
