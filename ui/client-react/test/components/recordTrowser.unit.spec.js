import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import ConnectedRecordTrowser, {__RewireAPI__ as RecordTrowserRewireAPI} from '../../src/components/record/recordTrowser';
import {RecordTrowser} from '../../src/components/record/recordTrowser';

import Promise from 'bluebird';
import {Provider} from "react-redux";
import configureMockStore from 'redux-mock-store';
import {hideErrorMsgDialog} from '../../src/actions/shellActions';

const RecordMock = React.createClass({
    render: function() {
        return (
            <div className="record">test</div>
        );
    }
});


const mockStore = configureMockStore();
let initialState = {};
let store = {};

describe('RecordTrowser functions', () => {
    'use strict';

    let flux = {
        actions: {
            recordPendingEditsCommit() {},
            recordPendingEditsCancel() {},
            saveRecord() {return Promise.resolve({});},
            saveNewRecord() {return Promise.resolve({});},
            editNextRecord() {},
            editPreviousRecord() {},
            openRecordForEdit() {}
        }
    };


    let component;

    beforeEach(() => {
        store = mockStore(initialState);
        RecordTrowserRewireAPI.__Rewire__('Record', RecordMock);

        spyOn(flux.actions, 'recordPendingEditsCommit');
        spyOn(flux.actions, 'recordPendingEditsCancel');
        spyOn(flux.actions, 'saveRecord').and.callThrough();
        spyOn(flux.actions, 'saveNewRecord').and.callThrough();
        spyOn(flux.actions, 'editNextRecord');
        spyOn(flux.actions, 'editPreviousRecord');
        spyOn(flux.actions, 'openRecordForEdit');
    });

    afterEach(() => {
        RecordTrowserRewireAPI.__ResetDependency__('Record');

        flux.actions.recordPendingEditsCommit.calls.reset();
        flux.actions.recordPendingEditsCancel.calls.reset();
        flux.actions.saveRecord.calls.reset();
        flux.actions.saveNewRecord.calls.reset();
        flux.actions.editNextRecord.calls.reset();
        flux.actions.editPreviousRecord.calls.reset();
        flux.actions.openRecordForEdit.calls.reset();
    });

    it('test render of loading component', () => {

        component = TestUtils.renderIntoDocument(<Provider store={store}><ConnectedRecordTrowser flux={flux} visible={true}/></Provider>);

        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

    });

    it('test cancelling the record trowser', () => {

        component = TestUtils.renderIntoDocument(
            <Provider store={store}>
            <ConnectedRecordTrowser
                pendEdits={{recordChanges: {}}}
                flux={flux}
                recId={"1"}
                visible={true}
                errorPopupHidden={true}
                onHideTrowser={()=>{}}
            />
            </Provider>
        );
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        const closeIcon = TestUtils.findRenderedDOMComponentWithClass(component, "iconTableUISturdy-close");
        TestUtils.Simulate.click(closeIcon);

        expect(flux.actions.recordPendingEditsCancel).toHaveBeenCalled();
    });

    it('test saving new record in the trowser', () => {
        component = TestUtils.renderIntoDocument(
            <Provider store={store}>
                <ConnectedRecordTrowser editForm={{formData: {}}} pendEdits={{isPendingEdit:true, recordChanges: {}}} flux={flux} recId={null} visible={true}/>
            </Provider>);

        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        let saveButton = ReactDOM.findDOMNode(component).querySelectorAll(".saveOrCancelFooter .rightIcons .btn");

        expect(saveButton.length).toBe(2);
        TestUtils.Simulate.click(saveButton[0]);

        expect(flux.actions.saveNewRecord).toHaveBeenCalled();
    });

    it('test saving existing record in the trowser', () => {
        component = TestUtils.renderIntoDocument(
            <Provider store={store}>
                <ConnectedRecordTrowser editForm={{formData: {}}} pendEdits={{isPendingEdit:true, recordChanges: {}}} flux={flux} recId={"1"} visible={true}/>
            </Provider>);

        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        let saveButton = ReactDOM.findDOMNode(component).querySelectorAll(".saveOrCancelFooter .rightIcons .btn");
        expect(saveButton.length).toBe(1);

        TestUtils.Simulate.click(saveButton[0]);

        expect(flux.actions.saveRecord).toHaveBeenCalled();
    });

    it('test saving new record which has server side error in the trowser', () => {

        component = TestUtils.renderIntoDocument(<Provider store={store}><ConnectedRecordTrowser editForm={{formData: {}}} pendEdits={{isPendingEdit:true, recordChanges: {}, editErrors: {errors: [{id: 9, invalidMessage: "error message #1", def: {fieldName: "test field"}}]}}} flux={flux} recId={null} visible={true}/></Provider>);

        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        let errorMessageDialog = ReactDOM.findDOMNode(component).querySelectorAll(".qbErrorMessage");
        expect(errorMessageDialog.length).toBe(1);
    });

    it('test saving existing record which has server side error in the trowser', () => {

        component = TestUtils.renderIntoDocument(<Provider store={store}><ConnectedRecordTrowser editForm={{formData: {}}} pendEdits={{isPendingEdit:true, recordChanges: {}, editErrors: {errors: [{id: 9, invalidMessage: "error message #1", def: {fieldName: "test field"}}]}}} flux={flux} recId={"1"} visible={true}/></Provider>);

        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        let errorMessageDialog = ReactDOM.findDOMNode(component).querySelectorAll(".qbErrorMessage");
        expect(errorMessageDialog.length).toBe(1);
    });

    it('test saving record which has server side errors, and error state icon displayed in footer section', () => {
        component = TestUtils.renderIntoDocument(<Provider store={store}><ConnectedRecordTrowser editForm={{formData: {}}} pendEdits={{isPendingEdit:true, hasAttemptedSave: true, recordChanges: {}, editErrors: {errors: [{id: 9, invalidMessage: "error message #1", def: {fieldName: "test field"}}]}}} flux={flux} recId={"1"} visible={true}/></Provider>);

        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        let errorMessageAlertIcon = ReactDOM.findDOMNode(component).querySelectorAll(".saveOrCancelFooter .rightIcons .saveAlertButton");
        expect(errorMessageAlertIcon.length).toBe(1);
    });

    it('does not display the error icon if there is a client-side validation error, but the user has not attempted to save the record', () => {
        component = TestUtils.renderIntoDocument(<Provider store={store}><ConnectedRecordTrowser editForm={{formData: {}}} pendEdits={{isPendingEdit:true, hasAttemptedSave: false, recordChanges: {}, editErrors: {errors: [{id: 9, invalidMessage: "error message #1", def: {fieldName: "test field"}}]}}} flux={flux} recId={"1"} visible={true}/></Provider>);

        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        let errorMessageAlertIcon = ReactDOM.findDOMNode(component).querySelectorAll(".saveOrCancelFooter .rightIcons .saveAlertButton");
        expect(errorMessageAlertIcon.length).toBe(0);
    });

    it('test dismiss error message popup in trowser', () => {

        const form = {editFormData: {}};

        component = TestUtils.renderIntoDocument(
            <Provider store={store}>
                <ConnectedRecordTrowser form={form} pendEdits={{isPendingEdit:true, recordChanges: {}, editErrors: {errors: [{id: 9, invalidMessage: "error message #1", def: {fieldName: "test field"}}]}}} flux={flux} recId={null} visible={true}/>
            </Provider>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        let errorMessageDialog = ReactDOM.findDOMNode(component).querySelectorAll(".qbErrorMessage");
        expect(errorMessageDialog.length).toBe(1);

        let errorMessageCloseButton = ReactDOM.findDOMNode(component).querySelectorAll(".qbErrorMessageHeader .rightIcons .btn");
        expect(errorMessageCloseButton.length).toBe(1);

        TestUtils.Simulate.click(errorMessageCloseButton[0]);
        expect(store.getActions()[0]).toEqual(hideErrorMsgDialog());
    });

    it('test navigateToNewRecord in the trowser', () => {

        const form = {editFormData: {}};

        let reportData = {
            navigateAfterSave: true,
            appId:1,
            tblId:2,
            rptId:3
        };
        let routerList = [];
        let newRecId  = "abracadabra";
        component = TestUtils.renderIntoDocument(<RecordTrowser
            flux={flux}
            router={routerList} recId={"1"} reportData={reportData} visible={true}/>);

        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        component.navigateToNewRecord(newRecId);

        expect(routerList.length).toEqual(1);
        expect(routerList[0].indexOf(newRecId)).not.toEqual(-1);
    });

    it('test nextRecord in the trowser', () => {

        const form = {editFormData: {}};

        let reportData = {
            appId:1,
            tblId:2,
            rptId:3,
            nextEditRecordId : 4
        };
        let routerList = [];
        let newRecId  = "abracadabra";
        component = TestUtils.renderIntoDocument(<RecordTrowser
            flux={flux}
            openRecordForEdit={flux.actions.openRecordForEdit}
            router={routerList} recId={"1"} reportData={reportData} visible={true}/>);

        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        component.nextRecord();

        expect(flux.actions.editNextRecord).toHaveBeenCalled();
        expect(flux.actions.openRecordForEdit).toHaveBeenCalled();
    });

    it('test previousRecord in the trowser', () => {

        const form = {editFormData: {}};

        let reportData = {
            appId:1,
            tblId:2,
            rptId:3,
            nextEditRecordId : 4
        };
        let routerList = [];
        let newRecId  = "abracadabra";
        component = TestUtils.renderIntoDocument(<RecordTrowser
            flux={flux}
            openRecordForEdit={flux.actions.openRecordForEdit}
            router={routerList} recId={"1"} reportData={reportData} visible={true}/>);

        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        component.previousRecord();

        expect(flux.actions.editPreviousRecord).toHaveBeenCalled();
        expect(flux.actions.openRecordForEdit).toHaveBeenCalled();
    });

});
