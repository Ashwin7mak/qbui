import React from 'react';
import TestUtils from 'react-addons-test-utils';
import QBForm from  '../../src/components/QBForm/qbform';
import {ConnectedRecordRoute, RecordRoute,
       __RewireAPI__ as recordRouteRewire} from '../../src/components/record/recordRoute';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {Provider} from "react-redux";
import {APP_ROUTE} from '../../src/constants/urlConstants';
import {mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('RecordRoute', () => {
    'use strict';

    let component;

    //TODO: once all the flux actions are converted to redux, this file should get refactored
    //TODO: to use enzyme
    let flux = {};
    flux.actions = {
        hideTopNav() {
            return;
        },
        setTopTitle() {
            return;
        },
        selectTableId() {
            return;
        }
    };

    let reduxProps = {
        editNewRecord: () => {
        },
        loadForm: () => {
        },
        openRecord: () => {
        },
        clearSearchInput: () => {
        },
        record: [
            {id: 2, recId: 2, nextRecordId: 3, previousRecordId: 1}
        ]
    };

    beforeEach(() => {
        jasmineEnzyme();
        spyOn(flux.actions, 'selectTableId');
        spyOn(reduxProps, 'editNewRecord').and.callThrough();
        spyOn(reduxProps, 'loadForm').and.callThrough();
        spyOn(reduxProps, 'openRecord').and.callThrough();
        spyOn(reduxProps, 'clearSearchInput').and.callThrough();
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
            let badRouteParams = {appId: 1, tblId: 2};

            component = TestUtils.renderIntoDocument(<RecordRoute params={badRouteParams} flux={flux}/>);
            expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

            let qbForm = TestUtils.scryRenderedComponentsWithType(component, QBForm);
            expect(qbForm.length).toBe(0);
        });

        it('test render of component without report param', () => {

            const initialState = {};
            const store = mockStore(initialState);

            let routeParams = {appId: 1, tblId: 2, recordId: 4};

            component = TestUtils.renderIntoDocument(
                <Provider store={store}>
                    <ConnectedRecordRoute params={routeParams} flux={flux}/>
                </Provider>);

            expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

            expect(flux.actions.selectTableId).toHaveBeenCalledWith(routeParams.tblId);

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

            const initialState = {};
            const store = mockStore(initialState);

            let routeParams = {appId: 1, tblId: 2, recordId: 3, rptId: 4};

            component = TestUtils.renderIntoDocument(
                <Provider store={store}>
                    <ConnectedRecordRoute params={routeParams} flux={flux}/>
                </Provider>);

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

            let routeParams = {appId: '1', tblId: '2', rptId: '3', recordId: '2'};
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

            let router = [];
            let expectedRouter = [];
            component = mount(
                <Provider store={store}>
                    <RecordRoute params={routeParams} reportData={reportData} flux={flux}
                                 router={router} {...reduxProps}/>
                </Provider>);
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

            expect(router).toEqual(expectedRouter);
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
        const location = {search: 'drawer'};
        const routeParams = {appId: '1', tblId: '2', rptId: '3', recordId: '2'};
        const initialState = {};
        const store = mockStore(initialState);
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
                <Provider store={store}>
                    <RecordRoute params={routeParams}
                                 reportData={reportData}
                                 flux={flux}
                                 router={router}
                                 {...reduxProps}
                                 location={location}
                                 isDrawerContext={false}
                                 uniqueId="DRAWER123"/>
                </Provider>);

            //drawer exists
            let drawer = component.find('.drawer');
            expect(drawer.length).toBe(1);
        });

        it('tests drawer component not rendering nested drawers', () => {
            component = mount(
                <Provider store={store}>
                    <RecordRoute params={routeParams}
                                 flux={flux}
                                 {...reduxProps}
                                 location={location}
                                 isDrawerContext={false}
                                 uniqueId="DRAWER123"/>
                </Provider>);

            component = mount(
                <Provider store={store}>
                    <RecordRoute params={routeParams}
                                 flux={flux}
                                 {...reduxProps}
                                 uniqueId="DRAWER123"
                                 isDrawerContext={true}/>
                </Provider>);

            let drawer = component.find('.drawer');
            //not re-rendering a drawer
            expect(drawer.length).toBe(0);
        });

        it('tests navigating records in drawer', () => {

            const embeddedReports = [embeddedReport];

            const selectedApp = {
                id: "1",
                name: "Country App",
                tables: [
                    {id: '2', name: 'country'}
                ]
            };

            const record = [{id: 'DRAWER123', recId: 2, nextRecordId: 3, previousRecordId: 1}];
            component = mount(
                <Provider store={store}>
                    <RecordRoute params={routeParams}
                                 flux={flux}
                                 {...reduxProps}
                                 reportData={reportData}
                                 uniqueId="DRAWER123"
                                 isDrawerContext={true}
                                 selectedApp={selectedApp}
                                 record={record}
                                 router={router}
                                 embeddedReports={embeddedReports}/>
                </Provider>);

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
        });

    });
});
