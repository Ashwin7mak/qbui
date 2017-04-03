import React from 'react';
import TestUtils from 'react-addons-test-utils';
import QBForm from  '../../src/components/QBForm/qbform';
import {ConnectedRecordRoute, RecordRoute} from '../../src/components/record/recordRoute';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {Provider} from "react-redux";
import {APP_ROUTE} from '../../src/constants/urlConstants';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

import {mount} from 'enzyme';

describe('RecordRoute', () => {
    'use strict';

    let component;

    //TODO: once all the flux actions are converted to redux, this file should get refactored
    //TODO: to use enzyme
    let flux = {};
    flux.actions = {
        hideTopNav() {return;},
        setTopTitle() {return;},
        selectTableId() {return;}
    };

    let reduxProps = {
        editNewRecord: () => {},
        loadForm: () => {},
        openRecord: () => {},
        clearSearchInput: () => {},
        record: [
            {id: 2, recId: 2, nextRecordId: 3, previousRecordId: 1}
        ]
    };

    beforeEach(() => {
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

            let routeParams = {appId: 1, tblId: 2, rptId: 3, recordId: 2};
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

            component = TestUtils.renderIntoDocument(
                <Provider store={store}>
                    <RecordRoute params={routeParams} reportData={reportData} flux={flux} router={router} {...reduxProps}/>
                </Provider>);
            expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

            let prevRecord = TestUtils.scryRenderedDOMComponentsWithClass(component, "prevRecord");
            let nextRecord = TestUtils.scryRenderedDOMComponentsWithClass(component, "nextRecord");
            let returnToReport = TestUtils.scryRenderedDOMComponentsWithClass(component, "backToReport");

            // should have all 3 nav links
            expect(prevRecord.length).toBe(1);
            expect(nextRecord.length).toBe(1);
            expect(returnToReport.length).toBe(1);

            // previous record
            TestUtils.Simulate.click(prevRecord[0]);
            expect(reduxProps.openRecord).toHaveBeenCalled();
            expectedRouter.push(`${APP_ROUTE}/1/table/2/report/3/record/1`);

            // next record
            TestUtils.Simulate.click(nextRecord[0]);
            expect(reduxProps.openRecord).toHaveBeenCalled();
            expectedRouter.push(`${APP_ROUTE}/1/table/2/report/3/record/3`);

            // return to report
            TestUtils.Simulate.click(returnToReport[0]);
            expectedRouter.push(`${APP_ROUTE}/1/table/2/report/3`);

            expect(router).toEqual(expectedRouter);
        });
    });
});
