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

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('ReportRoute', () => {
    'use strict';
    const pendEdits = {};
    let component;
    let mockNavStore = Fluxxor.createStore({
        getState() {
            return {};
        }
    });

    let props = {
        clearSearchInput: () => {},
        loadFields: (app, tbl) => {},
        loadReport: (context, appId, tblId, rptId, format, offset, rows) => {},
        loadTableHomePage: (context, appId, tblId, rptId, format, filter, queryParams) => {}
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
        NavStore: new mockNavStore()
    };
    let flux = new Fluxxor.Flux(stores);

    flux.actions = {
        selectTableId() {return;},
        hideTopNav() {return;}
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

    beforeEach(() => {
        spyOn(flux.actions, 'selectTableId');
        spyOn(props, 'clearSearchInput');
        spyOn(props, 'loadFields');
        spyOn(props, 'loadReport');
        spyOn(props, 'loadTableHomePage');
        ReportRouteRewireAPI.__Rewire__('Stage', StageMock);
        ReportRouteRewireAPI.__Rewire__('ReportToolsAndContent', ReportToolsAndContentMock);
        ReportRouteRewireAPI.__Rewire__('ReportFieldSelectMenu', mockReportFieldSelectMenu);
    });

    afterEach(() => {
        flux.actions.selectTableId.calls.reset();
        props.clearSearchInput.calls.reset();
        props.loadFields.calls.reset();
        props.loadTableHomePage.calls.reset();
        ReportRouteRewireAPI.__ResetDependency__('Stage');
        ReportRouteRewireAPI.__ResetDependency__('ReportToolsAndContent');
        ReportRouteRewireAPI.__ResetDependency__('ReportFieldSelectMenu');
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
        let loadReport = null;
        let initialState = {};
        let store = null;
        let spiedLoadReportProps = null;
        beforeEach(() => {
            loadReport = jasmine.createSpy('loadReport');
            spiedLoadReportProps = Object.assign({}, props, {loadReport});

            store = mockStore(initialState);
        });

        it('loadReport is called with app data', () => {
            component = mount(
                <Provider store={store}>
                    <UnconnectedReportRoute
                        {...spiedLoadReportProps}
                        match={routeParams}
                        reportData={reportDataParams.reportData}
                        flux={flux}
                        pendEdits={pendEdits}
                    />
                </Provider>);
            expect(loadReport).toHaveBeenCalledWith(jasmine.any(String), appId, tblId, rptId, true, offset, numRows);
        });

        it('loadReport is not called when appId is missing', () => {
            const missingRouteParams = Object.assign({}, routeParams, {params: {appId: null}});
            component = mount(
                <Provider store={store}>
                    <UnconnectedReportRoute
                        {...spiedLoadReportProps}
                        match={missingRouteParams}
                        reportData={reportDataParams.reportData}
                        flux={flux}
                        pendEdits={pendEdits}
                    />
                </Provider>);
            expect(loadReport).not.toHaveBeenCalled();
        });

        it('loadReport is not called when tblId is missing', () => {
            const missingRouteParams = Object.assign({}, routeParams, {params: {tblId: null}});
            component = mount(
                <Provider store={store}>
                    <UnconnectedReportRoute
                        {...spiedLoadReportProps}
                        match={missingRouteParams}
                        reportData={reportDataParams.reportData}
                        flux={flux}
                        pendEdits={pendEdits}
                    />
                </Provider>);
            expect(loadReport).not.toHaveBeenCalled();
        });

        it('loadReport is not called when rptId is missing', () => {
            const missingRouteParams = Object.assign({}, routeParams, {params: {rptId: null}});
            component = mount(
                <Provider store={store}>
                    <UnconnectedReportRoute
                        {...spiedLoadReportProps}
                        match={missingRouteParams}
                        reportData={reportDataParams.reportData}
                        flux={flux}
                        pendEdits={pendEdits}
                    />
                </Provider>);
            expect(loadReport).not.toHaveBeenCalled();
        });
    });
});
