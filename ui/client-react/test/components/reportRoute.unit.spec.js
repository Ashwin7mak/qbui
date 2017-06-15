import React from 'react';
import jasmineEnzyme from 'jasmine-enzyme';
import {shallow, mount} from 'enzyme';
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

    let props = {
        clearSearchInput: () => {},
        loadFields: (app, tbl) => {},
        loadReport: (context, appId, tblId, rptId, format, offset, rows) => {},
        loadDynamicReport: (context, appId, tblId, rptId, format, filter, queryParams) => {},
        selectTable: (appId, tblId) => {},

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

    const StageMock = React.createClass({
        render() {
            return <div className="stage-mock" />;
        }
    });

    class ReportToolsAndContentMock extends React.Component {
        render() {
            return <div />;
        }
    }

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
        jasmineEnzyme();
        spyOn(props, 'clearSearchInput');
        spyOn(props, 'loadFields');
        spyOn(props, 'loadReport');
        spyOn(props, 'loadDynamicReport');
        spyOn(props, 'selectTable');
        ReportRouteRewireAPI.__Rewire__('Stage', StageMock);
        ReportRouteRewireAPI.__Rewire__('ReportToolsAndContent', ReportToolsAndContentMock);
        ReportRouteRewireAPI.__Rewire__('ReportFieldSelectMenu', mockReportFieldSelectMenu);
        ReportRouteRewireAPI.__Rewire__('ReportSaveOrCancelFooter', mockReportSaveOrCancelFooter);
    });

    afterEach(() => {
        props.clearSearchInput.calls.reset();
        props.loadFields.calls.reset();
        props.loadReport.calls.reset();
        props.loadDynamicReport.calls.reset();
        props.selectTable.calls.reset();
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
                    <ReportRoute {...props} reportData={reportDataParams.reportData} pendEdits={pendEdits}/>
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
                    <UnconnectedReportRoute {...props} match={routeParams} reportData={reportDataParams.reportData}pendEdits={pendEdits}/>
                </Provider>);
            expect(props.loadReport).toHaveBeenCalledWith(jasmine.any(String), appId, tblId, rptId, true, offset, numRows);
            expect(props.selectTable).toHaveBeenCalledWith(appId, tblId);
            expect(props.clearSearchInput).toHaveBeenCalled();
            expect(props.loadFields).toHaveBeenCalledWith(appId, tblId);
        });

        it('loadReport is not called when appId is missing', () => {
            const missingRouteParams = Object.assign({}, routeParams, {params: {appId: null}});
            component = mount(
                <Provider store={store}>
                    <UnconnectedReportRoute {...props} match={missingRouteParams} reportData={reportDataParams.reportData}pendEdits={pendEdits}/>
                </Provider>);
            expect(props.loadReport).not.toHaveBeenCalled();
            expect(props.selectTable).not.toHaveBeenCalled();
            expect(props.clearSearchInput).not.toHaveBeenCalled();
            expect(props.loadFields).not.toHaveBeenCalled();
        });

        it('loadReport is not called when tblId is missing', () => {
            const missingRouteParams = Object.assign({}, routeParams, {params: {tblId: null}});
            component = mount(
                <Provider store={store}>
                    <UnconnectedReportRoute {...props} match={missingRouteParams} reportData={reportDataParams.reportData}pendEdits={pendEdits}/>
                </Provider>);
            expect(props.loadReport).not.toHaveBeenCalled();
        });

        it('loadReport is not called when rptId is missing', () => {
            const missingRouteParams = Object.assign({}, routeParams, {params: {rptId: null}});
            component = mount(
                <Provider store={store}>
                    <UnconnectedReportRoute {...props} match={missingRouteParams} reportData={reportDataParams.reportData}pendEdits={pendEdits}/>
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
            expect(props.selectTable).toHaveBeenCalledWith(appId, tblId);
            expect(props.clearSearchInput).toHaveBeenCalled();
            expect(props.loadFields).toHaveBeenCalledWith(appId, tblId);
        });

        it(`is not called if 'detailKeyFid' and 'detailKeyValue' are not defined`, () => {
            component = mount(
                <Provider store={store}>
                    <UnconnectedReportRoute
                        {...props}
                        match={routeParams}
                        reportData={reportDataParams.reportData}
                        pendEdits={pendEdits}/>
                </Provider>);
            expect(props.loadDynamicReport).not.toHaveBeenCalled();
        });
    });

    describe('handleDrillIntoChild as a prop to ReportToolsAndContent', () => {
        it ('is undefined when uniqueId does not exist', () => {
            component = shallow(
                    <UnconnectedReportRoute
                        {...props}
                        match={routeParams}
                        reportData={reportDataParams.reportData}
                        pendEdits={pendEdits}
                    />);
            expect(component.find('.reportToolsAndContentContainer'))
                .toHaveProp('handleDrillIntoChild', undefined);
        });

        it ('is handleDrillIntoChild function when uniqueId does exist', () => {
            component = shallow(
                    <UnconnectedReportRoute
                        {...props}
                        uniqueId={1}
                        match={routeParams}
                        reportData={reportDataParams.reportData}
                        pendEdits={pendEdits}/>);
            let instance = component.instance();
            expect(component.find('.reportToolsAndContentContainer'))
                .toHaveProp('handleDrillIntoChild', instance.handleDrillIntoChild);
        });
    });
});
