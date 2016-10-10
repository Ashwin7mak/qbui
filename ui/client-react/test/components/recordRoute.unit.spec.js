import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import Fluxxor from 'fluxxor';
import QBForm from  '../../src/components/QBForm/qbform';
import {RecordRoute} from '../../src/components/record/recordRoute';

describe('RecordRoute functions', () => {
    'use strict';

    let component;

    let flux = {};

    flux.actions = {
        showTopNav() {return;},
        setTopTitle() {return;},
        selectTableId() {return;},
        loadFormAndRecord() {return;},
        openingReportRow() {return;},
        showPreviousRecord() {return;},
        showNextRecord() {return;}
    };

    beforeEach(() => {
        spyOn(flux.actions, 'selectTableId');
        spyOn(flux.actions, 'loadFormAndRecord');
        spyOn(flux.actions, 'openingReportRow');
        spyOn(flux.actions, 'showPreviousRecord');
        spyOn(flux.actions, 'showNextRecord');
    });

    afterEach(() => {
        flux.actions.selectTableId.calls.reset();
        flux.actions.loadFormAndRecord.calls.reset();
        flux.actions.openingReportRow.calls.reset();
        flux.actions.showPreviousRecord.calls.reset();
        flux.actions.showNextRecord.calls.reset();
    });

    it('test render of component with missing url params', () => {
        let badRouteParams = {appId:1, tblId:2};

        component = TestUtils.renderIntoDocument(<RecordRoute params={badRouteParams} flux={flux}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        let qbForm = TestUtils.scryRenderedComponentsWithType(component, QBForm);
        expect(qbForm.length).toBe(0);

    });

    it('test render of component without report param', () => {
        let routeParams = {appId:1, tblId:2, recordId: 4};

        component = TestUtils.renderIntoDocument(<RecordRoute params={routeParams} flux={flux}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        expect(flux.actions.selectTableId).toHaveBeenCalledWith(routeParams.tblId);
        expect(flux.actions.loadFormAndRecord).toHaveBeenCalledWith(routeParams.appId, routeParams.tblId, routeParams.recordId, routeParams.rptId, routeParams.formType);

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
        let routeParams = {appId:1, tblId:2, recordId: 3, rptId: 4};

        component = TestUtils.renderIntoDocument(<RecordRoute params={routeParams} flux={flux}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        expect(flux.actions.loadFormAndRecord).toHaveBeenCalledWith(routeParams.appId, routeParams.tblId, routeParams.recordId, routeParams.rptId, routeParams.formType);

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
        let routeParams = {appId:1, tblId:2, rptId:3, recordId: 2};

        let reportData = {
            appId:1,
            tblId:2,
            rptId:3,

            previousRecordId:1,
            currentRecordId:2,
            nextRecordId:3,

            data: {
                records: [
                    {"Record ID#": {id:1, value:1, display: "1"}},
                    {"Record ID#": {id:2, value:2, display: "2"}},
                    {"Record ID#": {id:3, value:3, display: "3"}}
                ],
                columns: [
                    {
                        id:1,
                        field:"Record ID#",
                        headerName:"Record ID#",
                        datatypeAttributes: {type:"NUMERIC"}
                    }
                ]
            }
        };

        let router = [];
        let expectedRouter = [];

        component = TestUtils.renderIntoDocument(<RecordRoute params={routeParams} reportData={reportData} flux={flux} router={router}/>);
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
        expect(flux.actions.showPreviousRecord).toHaveBeenCalled();
        expectedRouter.push('/app/1/table/2/report/3/record/1');

        // next record
        TestUtils.Simulate.click(nextRecord[0]);
        expect(flux.actions.showNextRecord).toHaveBeenCalled();
        expectedRouter.push('/app/1/table/2/report/3/record/3');

        // return to report
        TestUtils.Simulate.click(returnToReport[0]);
        expectedRouter.push('/app/1/table/2/report/3');
        expect(component.props.router).toEqual(expectedRouter);
    });
});
