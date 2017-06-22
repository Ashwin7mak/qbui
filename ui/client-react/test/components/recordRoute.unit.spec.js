import React from 'react';

import QBForm from  '../../src/components/QBForm/qbform';
import {ConnectedRecordRoute, RecordRoute,
       __RewireAPI__ as recordRouteRewire} from '../../src/components/record/recordRoute';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {Provider} from "react-redux";
import {APP_ROUTE} from '../../src/constants/urlConstants';
import {MemoryRouter, withRouter} from 'react-router-dom';
import {mount, shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

class BreakpointMock {
    static isSmallBreakpoint() {
        return true;
    }
}

describe('RecordRoute', () => {
    'use strict';

    let component;

    let props = {
        editNewRecord: () => {},
        loadForm: () => {},
        openRecord: () => {},
        clearSearchInput: () => {},
        selectTable: () => {},
        showTopNav: () => {},
        record: {
            recordIdBeingEdited: 2,
            records: [{id: 2, recId: 2, nextRecordId: 3, previousRecordId: 1}]
        },
        appUsers: []
    };

    beforeEach(() => {
        jasmineEnzyme();

        spyOn(props, 'editNewRecord').and.callThrough();
        spyOn(props, 'loadForm').and.callThrough();
        spyOn(props, 'openRecord').and.callThrough();
        spyOn(props, 'clearSearchInput').and.callThrough();
        spyOn(props, 'selectTable').and.callThrough();
    });

    afterEach(() => {
        props.editNewRecord.calls.reset();
        props.loadForm.calls.reset();
        props.openRecord.calls.reset();
        props.clearSearchInput.calls.reset();
        props.selectTable.calls.reset();
        props.record = {
            recordIdBeingEdited: 2,
            records: [{id: 2, recId: 2, nextRecordId: 3, previousRecordId: 1}]
        };
    });

    describe('Previous/Next/Return functions', () => {
        it('test render of component with missing url params', () => {
            let params = {appId: 1, tblId: 2};
            component = mount(<RecordRoute match={{params}} {...props}/>);
            expect(component).toBeDefined();

            const recordContainer = component.find('.recordContainer');
            expect(recordContainer.length).toBe(0);
        });

        it('test render of component without report param', () => {

            const initialState = {
                record: {
                    recordIdBeingEdited: 2,
                    records: [{id: 2, recId: 2, nextRecordId: 3, previousRecordId: 1}]
                },
                app: {}
            };
            const store = mockStore(initialState);

            let params = {appId: "1", tblId: "2", recordId: "4"};

            component = mount(
                <MemoryRouter>
                    <Provider store={store}>
                        <RecordRoute match={{params}} {...props} selectedTable={{"name": "TestTable"}}/>
                    </Provider>
                </MemoryRouter>);

            expect(component).toBeDefined();

            const recordContainer = component.find('.recordContainer');
            expect(recordContainer.length).toBe(1);

            const prevRecord = component.find('.prevRecord');
            const nextRecord = component.find('.nextRecord');
            const returnToReport = component.find('.backToReport');

            // no report param so no nav links
            expect(prevRecord.length).toBe(0);
            expect(nextRecord.length).toBe(0);
            expect(returnToReport.length).toBe(0);

            expect(props.selectTable).toHaveBeenCalledWith(params.appId, params.tblId);
        });

        it('test render of component with report param', () => {

            const initialState = {
                record: {
                    recordIdBeingEdited: 2,
                    records: [{id: 2, recId: 2, nextRecordId: 3, previousRecordId: 1}]
                },
                app: {}
            };
            const store = mockStore(initialState);

            let params = {appId: 1, tblId: 2, recordId: 3, rptId: 4};

            component = mount(
                <MemoryRouter>
                    <Provider store={store}>
                        <RecordRoute match={{params}} {...props} selectedTable={{"name": "TestTable"}}/>
                    </Provider>
                </MemoryRouter>);

            expect(component).toBeDefined();

            const prevRecord = component.find('.prevRecord');
            const nextRecord = component.find('.nextRecord');
            const returnToReport = component.find('.backToReport');

            // no next/prev nav links since we don't have props for those records (a bookmarked link)
            expect(prevRecord.length).toBe(0);
            expect(nextRecord.length).toBe(0);

            // but we can still nav back to the report
            expect(returnToReport.length).toBe(1);
        });

        it('test correct state is pushed to history', () => {
            const initialState = {
                app: {}
            };
            const store = mockStore(initialState);

            let params = {appId: '1', tblId: '2', rptId: '3', recordId: '2'};
            let reportData = {
                appId: 1,
                tblId: 2,
                rptId: 3,

                previousRecordId: 1,
                currentRecordId: 2,
                nextRecordId: 3,

                data: {
                    keyField: {
                        name: 'Record ID#'
                    },
                    filteredRecords: [
                        {"Record ID#": {id: 1, value: 1, display: "1"}},
                        {"Record ID#": {id: 2, value: 2, display: "2"}},
                        {"Record ID#": {id: 3, value: 3, display: "3"}}
                    ],
                    columns: [
                        {
                            id: 1,
                            field: "Record ID#",
                            headerName: "Record ID#",
                            fieldDef: {datatypeAttributes: {type: "NUMERIC"}}
                        }
                    ]
                }
            };

            let history = [];
            let expectedRouter = [];

            component = mount(
                <MemoryRouter>
                    <Provider store={store}>
                        <RecordRoute match={{params}} reportData={reportData} history={history} {...props} selectedTable={{"name": "TestTable"}}/>
                    </Provider>
                </MemoryRouter>);
            expect(component).toBeDefined();

            let prevRecord = component.find('.prevRecord');
            let nextRecord = component.find('.nextRecord');
            let returnToReport = component.find('.backToReport');

            // should have all 3 nav links
            expect(prevRecord.length).toBe(1);
            expect(nextRecord.length).toBe(1);
            expect(returnToReport.length).toBe(1);

            // previous record
            prevRecord.simulate('click');
            expect(props.openRecord).toHaveBeenCalled();
            expectedRouter.push(`${APP_ROUTE}/1/table/2/report/3/record/1`);

            // next record
            nextRecord.simulate('click');
            expect(props.openRecord).toHaveBeenCalled();
            expectedRouter.push(`${APP_ROUTE}/1/table/2/report/3/record/3`);

            // return to report
            returnToReport.simulate('click');
            expectedRouter.push(`${APP_ROUTE}/1/table/2/report/3`);

            expect(history).toEqual(expectedRouter);
        });
    });

    describe('Record Wrapper with drawer context tests', () => {
        const drawerTableId = '2';
        const embeddedReport = {
            id: 'EMBEDDED123',
            appId: 1,
            tblId: 2,
            rptId: 3,

            previousRecordId: 3,
            currentRecordId: 4,
            nextRecordId: 5,

            data: {
                keyField: {
                    name: 'Record ID#'
                },
                filteredRecords: [
                    {"Record ID#": {id: 3, value: 1, display: "3"}},
                    {"Record ID#": {id: 4, value: 2, display: "4"}},
                    {"Record ID#": {id: 5, value: 3, display: "5"}}
                ],
                columns: [
                    {
                        id: 1,
                        field: "Record ID#",
                        headerName: "Record ID#",
                        fieldDef: {datatypeAttributes: {type: "NUMERIC"}}
                    }
                ]
            }
        };
        const routeParams = {appId: '1', tblId: '2', rptId: '3', recordId: '2'};

        const embedPrefix = "EMBEDDED";
        const reportData = {
            appId: 1,
            tblId: 2,
            rptId: 3,

            previousRecordId: 1,
            currentRecordId: 2,
            nextRecordId: 3,

            data: {
                keyField: {
                    name: 'Record ID#'
                },
                filteredRecords: [
                    {"Record ID#": {id: 1, value: 1, display: "1"}},
                    {"Record ID#": {id: 2, value: 2, display: "2"}},
                    {"Record ID#": {id: 3, value: 3, display: "3"}}
                ],
                columns: [
                    {
                        id: 1,
                        field: "Record ID#",
                        headerName: "Record ID#",
                        fieldDef: {datatypeAttributes: {type: "NUMERIC"}}
                    }
                ]
            }
        };
        const initialState = {
            embeddedReports: {[embedPrefix] : {reportData}},
            app: {}
        };
        const store = mockStore(initialState);

        let router = [];
        beforeAll(() => {
            jasmineEnzyme();
            recordRouteRewire.__Rewire__('embeddedReport', embeddedReport);
            recordRouteRewire.__Rewire__('drawerTableId', drawerTableId);
        });

        afterAll(() => {
            recordRouteRewire.__ResetDependency__('embeddedReport');
            recordRouteRewire.__ResetDependency__('drawerTableId');
        });


        /***
         * test if drawer component gets created with isDrawerContext being false
         */
        it('test if drawer component gets created when having no drawers to start with', () => {

            component = mount(
                <MemoryRouter>
                    <Provider store={store}>
                        <RecordRoute match={{params:routeParams}}
                                     reportData={reportData}
                                     router={router}
                                     {...props}
                                     isDrawerContext={false}
                                     uniqueId="DRAWER123"/>
                    </Provider>
                </MemoryRouter>
                        );

            //drawer does not exists
            let drawer = component.find('.drawer');
            expect(drawer.length).toBe(0);

            //drawer container does exists
            let drawerContainer = component.find('.drawerContainer');
            expect(drawerContainer.length).toBe(1);
        });

        it('next/prev buttons exist  in a drawer and open record action called on clicking them', () => {

            const uniqueId = "EMBEDDED123";
            const embeddedReports = {[uniqueId] : embeddedReport};

            const selectedApp = {
                id: "1",
                name: "Country App",
                tables: [
                    {id: '2', name: 'country'}
                ]
            };
            const matchParams = {params: {appId: '1', tblId: '2', rptId: uniqueId, recordId: '2'}};

            const record = {
                recordIdBeingEdited: 2,
                records: [{id: uniqueId, recId: 2, nextRecordId: 3, previousRecordId: 1}]
            };
            let history = [];

            component = mount(
                    <MemoryRouter>
                            <Provider store={store}>
                                            <RecordRoute
                                                         match={matchParams}
                                                         history={history}
                                                         {...props}
                                                         reportData={reportData}
                                                         uniqueId={uniqueId}
                                                         isDrawerContext={true}
                                                         selectedApp={selectedApp}
                                                         location={{pathname:"path"}}
                                                         record={record}
                                                         router={router}
                                                         embeddedReports={embeddedReports}/>
                                            </Provider>
                    </MemoryRouter>
            );

            let prevRecord = component.find('.prevRecord');
            let nextRecord = component.find('.nextRecord');

            // should have all 3 nav links
            expect(prevRecord.length).toBe(1);
            expect(nextRecord.length).toBe(1);
            // previous record

            prevRecord.simulate('click');
            expect(props.openRecord).toHaveBeenCalled();

            // next record
            nextRecord.simulate('click');
            expect(props.openRecord).toHaveBeenCalled();
            //selectTableId action is not called when in a drawer
            expect(props.selectTable).not.toHaveBeenCalled();
        });

        it('small breakpoints has drawer transition from bottom', () => {
            recordRouteRewire.__Rewire__('Breakpoints', BreakpointMock);

            const uniqueId = "EMBEDDED734";
            const matchParams = {params: {appId: '1', tblId: '2', rptId: uniqueId, recordId: '2'}};

            let history = [];

            component = mount(
                <MemoryRouter>
                    <Provider store={store}>
                        <RecordRoute
                            match={matchParams}
                            history={history}
                            {...props}
                            reportData={reportData}
                            uniqueId={uniqueId}
                            isDrawerContext={false}
                            location={{pathname: "sr_app"}}
                        />
                    </Provider>
                </MemoryRouter>
            );

            //drawer container sliding up
            let drawerContainer = component.find('.drawerContainer.bottom');
            expect(drawerContainer.length).toBe(2);
            recordRouteRewire.__ResetDependency__('Breakpoints');

        });

        it('large breakpoints has drawer transition from right', () => {
            const uniqueId = "EMBEDDED356";
            const matchParams = {params: {appId: '1', tblId: '2', rptId: uniqueId, recordId: '2'}};

            let history = [];

            component = mount(
                <MemoryRouter>
                    <Provider store={store}>
                        <RecordRoute
                            match={matchParams}
                            history={history}
                            {...props}
                            reportData={reportData}
                            uniqueId={uniqueId}
                            isDrawerContext={true}
                            location={{pathname: "sr_app"}}
                        />
                    </Provider>
                </MemoryRouter>
            );

            //drawer container is sliding from right
            let drawerContainer = component.find('.drawerContainer.right');
            expect(drawerContainer.length).toBe(1);

        });

        it('start edit in trowser by pushing new url with query', () => {
            const windowHistoryUtilsMock = {
                pushWithQuery: jasmine.createSpy('pushWithQuery')
            };
            recordRouteRewire.__Rewire__('WindowHistoryUtils', windowHistoryUtilsMock);

            component = shallow(
                <MemoryRouter>
                    <Provider store={store}>
                        <RecordRoute match={{params:routeParams}}
                                     reportData={reportData}
                                     router={router}
                                     {...props}
                                     isDrawerContext={false}
                                     uniqueId="DRAWER123"/>
                    </Provider>
                </MemoryRouter>
            );

            const recordRoute = component.dive().dive().dive().instance();

            // this is what's called when user clicks on the edit pencil icon to start editing in trowser
            recordRoute.openRecordForEdit();

            // adding query to url "?editRec=2" which will trigger the trowser to open
            expect(windowHistoryUtilsMock.pushWithQuery).toHaveBeenCalledWith('editRec', 2);

            recordRouteRewire.__ResetDependency__('WindowHistoryUtils');
        });

        it('start edit in trowser by ', () => {
            const windowHistoryUtilsMock = {
                pushWithQueries: jasmine.createSpy('pushWithQueries')
            };
            recordRouteRewire.__Rewire__('WindowHistoryUtils', windowHistoryUtilsMock);

            component = shallow(
                <MemoryRouter>
                    <Provider store={store}>
                        <RecordRoute match={{params:routeParams}}
                                     reportData={reportData}
                                     router={router}
                                     {...props}
                                     isDrawerContext={true}
                                     uniqueId="DRAWER123"/>
                    </Provider>
                </MemoryRouter>
            );

            const recordRoute = component.dive().dive().dive().instance();

            // this is what's called when user clicks on the edit pencil icon to start editing in trowser
            recordRoute.openRecordForEdit();

            // adding query to url "?editRec=2&detailAppId=1&detailTableId=2&detailReportId=0&viewContextId=DRAWER123"
            // which will trigger the trowser to open and allow editing child record
            expect(windowHistoryUtilsMock.pushWithQueries).toHaveBeenCalledWith({
                editRec: '2',
                detailAppId: '1',
                detailTableId: '2',
                detailReportId: 0,
                viewContextId: 'DRAWER123'
            });

            recordRouteRewire.__ResetDependency__('WindowHistoryUtils');
        });
    });
});
