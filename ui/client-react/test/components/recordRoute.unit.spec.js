import React from 'react';
import TestUtils from 'react-addons-test-utils';
import QBForm from  '../../src/components/QBForm/qbform';
import {ConnectedRecordRoute, RecordRoute,
       __RewireAPI__ as recordRouteRewire} from '../../src/components/record/recordRoute';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {Provider} from "react-redux";
import {APP_ROUTE} from '../../src/constants/urlConstants';
import {MemoryRouter, withRouter} from 'react-router-dom';
import {mount} from 'enzyme';
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

    //TODO: once all the flux actions are converted to redux, this file should get refactored
    //TODO: to use enzyme
    let flux = {};
    flux.actions = {
        selectTableId() {return;}
    };

    let reduxProps = {
        editNewRecord: () => {},
        loadForm: () => {},
        openRecord: () => {},
        clearSearchInput: () => {},
        showTopNav: () => {},
        record: {
            recordIdBeingEdited: 2,
            records: [{id: 2, recId: 2, nextRecordId: 3, previousRecordId: 1}]
        }
    };

    beforeEach(() => {
        jasmineEnzyme();
        spyOn(flux.actions, 'selectTableId');
        spyOn(reduxProps, 'editNewRecord').and.callThrough();
        spyOn(reduxProps, 'loadForm').and.callThrough();
        spyOn(reduxProps, 'openRecord').and.callThrough();
        spyOn(reduxProps, 'clearSearchInput').and.callThrough();
        spyOn(reduxProps, 'showTopNav').and.callThrough();
    });

    afterEach(() => {
        flux.actions.selectTableId.calls.reset();
        reduxProps.editNewRecord.calls.reset();
        reduxProps.loadForm.calls.reset();
        reduxProps.openRecord.calls.reset();
        reduxProps.clearSearchInput.calls.reset();
    });

    describe('Previous/Next/Return functions', () => {
        it('test render of component with missing url params', () => {
            let params = {appId: 1, tblId: 2};

            component = TestUtils.renderIntoDocument(<RecordRoute {...reduxProps} match={{params}} flux={flux}/>);
            expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

            let qbForm = TestUtils.scryRenderedComponentsWithType(component, QBForm);
            expect(qbForm.length).toBe(0);
        });

        it('test render of component without report param', () => {

            const initialState = {
                record: {
                    recordIdBeingEdited: 2,
                    records: [{id: 2, recId: 2, nextRecordId: 3, previousRecordId: 1}]
                }
            };
            const store = mockStore(initialState);

            let params = {appId: "1", tblId: "2", recordId: "4"};

            const withMockParams = (ComponentToWrap) => {
                class WrappedComponent extends React.Component {
                    render() {
                        const {...props} = this.props;
                        return <ComponentToWrap {...props} match={{params}} />;
                    }
                }
                return WrappedComponent;
            };
            const ComponentUnderTest = withMockParams(ConnectedRecordRoute);
            component = TestUtils.renderIntoDocument(
                <MemoryRouter>
                    <Provider store={store}>
                        <ComponentUnderTest flux={flux} selectedTable={{"name": "TestTable"}}/>
                    </Provider>
                </MemoryRouter>);

            expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

            expect(flux.actions.selectTableId).toHaveBeenCalledWith(params.tblId);

            let qbForm = TestUtils.scryRenderedComponentsWithType(component, QBForm);
            expect(qbForm.length).toBe(1);

            let prevRecord = TestUtils.scryRenderedDOMComponentsWithClass(component, "prevRecord");
            let nextRecord = TestUtils.scryRenderedDOMComponentsWithClass(component, "nextRecord");
            let returnToReport = TestUtils.scryRenderedDOMComponentsWithClass(component, "backToReport");

            // no report param so no nav links
            expect(prevRecord.length).toBe(0);
            expect(nextRecord.length).toBe(0);
            expect(returnToReport.length).toBe(0);
        });

        it('test render of component with report param', () => {

            const initialState = {
                record: {
                    recordIdBeingEdited: 2,
                    records: [{id: 2, recId: 2, nextRecordId: 3, previousRecordId: 1}]
                }
            };
            const store = mockStore(initialState);

            let params = {appId: 1, tblId: 2, recordId: 3, rptId: 4};

            component = TestUtils.renderIntoDocument(
                <MemoryRouter>
                    <Provider store={store}>
                        <ConnectedRecordRoute match={{params}} flux={flux} selectedTable={{"name": "TestTable"}}/>
                    </Provider>
                </MemoryRouter>);

            expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

            let prevRecord = TestUtils.scryRenderedDOMComponentsWithClass(component, "prevRecord");
            let nextRecord = TestUtils.scryRenderedDOMComponentsWithClass(component, "nextRecord");
            let returnToReport = TestUtils.scryRenderedDOMComponentsWithClass(component, "backToReport");

            // no next/prev nav links since we don't have props for those records (a bookmarked link)
            expect(prevRecord.length).toBe(0);
            expect(nextRecord.length).toBe(0);

            // but we can still nav back to the report
            expect(returnToReport.length).toBe(1);
        });

        it('test correct state is pushed to history', () => {
            const initialState = {};
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
                        <RecordRoute match={{params}} reportData={reportData} flux={flux} history={history} {...reduxProps} selectedTable={{"name": "TestTable"}}/>
                    </Provider>
                </MemoryRouter>);
            expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

            let prevRecord = component.find('.prevRecord');
            let nextRecord = component.find('.nextRecord');
            let returnToReport = component.find('.backToReport');

            // should have all 3 nav links
            expect(prevRecord.length).toBe(1);
            expect(nextRecord.length).toBe(1);
            expect(returnToReport.length).toBe(1);

            // previous record
            prevRecord.simulate('click');
            expect(reduxProps.openRecord).toHaveBeenCalled();
            expectedRouter.push(`${APP_ROUTE}/1/table/2/report/3/record/1`);

            // next record
            nextRecord.simulate('click');
            expect(reduxProps.openRecord).toHaveBeenCalled();
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
        const initialState = {embeddedReports: {[embedPrefix] : {reportData}}};
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
                                     flux={flux}
                                     router={router}
                                     {...reduxProps}
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
                                                         flux={flux}
                                                         history={history}
                                                         {...reduxProps}
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
            expect(reduxProps.openRecord).toHaveBeenCalled();

            // next record
            nextRecord.simulate('click');
            expect(reduxProps.openRecord).toHaveBeenCalled();
            //selectTableId action is not called when in a drawer
            expect(flux.actions.selectTableId).not.toHaveBeenCalled();
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
                            flux={flux}
                            history={history}
                            {...reduxProps}
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
                            flux={flux}
                            history={history}
                            {...reduxProps}
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
    });
});
