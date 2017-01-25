import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import ConnectedRecordTrowser, {RecordTrowser, __RewireAPI__ as RecordTrowserRewireAPI} from '../../src/components/record/recordTrowser';
import Promise from 'bluebird';
import {Provider} from "react-redux";
import configureMockStore from 'redux-mock-store';
import * as ShellActions from '../../src/actions/shellActions';

const RecordMock = React.createClass({
    render: function() {
        return (
            <div className="record">test</div>
        );
    }
});

const mockStore = configureMockStore();

describe('RecordTrowser functions', () => {
    'use strict';

    let flux = {
        actions: {
            recordPendingEditsCommit() {},
            recordPendingEditsCancel() {},
            saveRecord() {return Promise.resolve({});},
            saveNewRecord() {return Promise.resolve({});}
        }
    };

    let component;

    beforeEach(() => {
        RecordTrowserRewireAPI.__Rewire__('Record', RecordMock);

        spyOn(flux.actions, 'recordPendingEditsCommit');
        spyOn(flux.actions, 'recordPendingEditsCancel');
        spyOn(flux.actions, 'saveRecord').and.callThrough();
        spyOn(flux.actions, 'saveNewRecord').and.callThrough();
        spyOn(ShellActions, 'showErrorMsgDialog');
        spyOn(ShellActions, 'hideErrorMsgDialog');
    });

    afterEach(() => {
        RecordTrowserRewireAPI.__ResetDependency__('Record');

        flux.actions.recordPendingEditsCommit.calls.reset();
        flux.actions.recordPendingEditsCancel.calls.reset();
        flux.actions.saveRecord.calls.reset();
        flux.actions.saveNewRecord.calls.reset();
        ShellActions.showErrorMsgDialog.calls.reset();
        ShellActions.hideErrorMsgDialog.calls.reset();
    });

    it('test render of loading component', () => {

        component = TestUtils.renderIntoDocument(<RecordTrowser flux={flux} visible={true}/>);

        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

    });

    it('test cancelling the record trowser', () => {

        component = TestUtils.renderIntoDocument(
            <RecordTrowser
                pendEdits={{recordChanges: {}}}
                flux={flux}
                recId={"1"}
                visible={true}
                errorPopupHidden={true}
            />
        );
        spyOn(component, 'clearEditsAndClose');

        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        const closeIcon = TestUtils.findRenderedDOMComponentWithClass(component, "iconTableUISturdy-close");
        TestUtils.Simulate.click(closeIcon);

        expect(component.clearEditsAndClose).toHaveBeenCalled();
    });

    it('test saving new record in the trowser', () => {

        const initialState = {};
        const store = mockStore(initialState);

        component = TestUtils.renderIntoDocument(
            <Provider store={store}>
                <ConnectedRecordTrowser editForm={{formData: {}}} pendEdits={{isPendingEdit:true, recordChanges: {}}} flux={flux} recId={null} visible={true}/>
            </Provider>);

        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        let saveButton = ReactDOM.findDOMNode(component).querySelectorAll(".trowserFooter .rightIcons .btn");
        expect(saveButton.length).toBe(2);

        TestUtils.Simulate.click(saveButton[0]);

        expect(flux.actions.saveNewRecord).toHaveBeenCalled();
    });

    it('test saving existing record in the trowser', () => {

        const initialState = {};
        const store = mockStore(initialState);

        component = TestUtils.renderIntoDocument(
            <Provider store={store}>
                <ConnectedRecordTrowser editForm={{formData: {}}} pendEdits={{isPendingEdit:true, recordChanges: {}}} flux={flux} recId={"1"} visible={true}/>
            </Provider>);

        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        let saveButton = ReactDOM.findDOMNode(component).querySelectorAll(".trowserFooter .rightIcons .btn");
        expect(saveButton.length).toBe(1);

        TestUtils.Simulate.click(saveButton[0]);

        expect(flux.actions.saveRecord).toHaveBeenCalled();
    });

    it('test saving new record which has server side error in the trowser', () => {

        component = TestUtils.renderIntoDocument(<RecordTrowser editForm={{formData: {}}} pendEdits={{isPendingEdit:true, recordChanges: {}, editErrors: {errors: [{id: 9, invalidMessage: "error message #1", def: {fieldName: "test field"}}]}}} flux={flux} recId={null} visible={true}/>);

        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        let errorMessageDialog = ReactDOM.findDOMNode(component).querySelectorAll(".qbErrorMessage");
        expect(errorMessageDialog.length).toBe(1);
    });

    it('test saving existing record which has server side error in the trowser', () => {

        component = TestUtils.renderIntoDocument(<RecordTrowser editForm={{formData: {}}} pendEdits={{isPendingEdit:true, recordChanges: {}, editErrors: {errors: [{id: 9, invalidMessage: "error message #1", def: {fieldName: "test field"}}]}}} flux={flux} recId={"1"} visible={true}/>);

        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        let errorMessageDialog = ReactDOM.findDOMNode(component).querySelectorAll(".qbErrorMessage");
        expect(errorMessageDialog.length).toBe(1);
    });

    it('test saving record which has server side errors, and error state icon displayed in footer section', () => {
        component = TestUtils.renderIntoDocument(<RecordTrowser editForm={{formData: {}}} pendEdits={{isPendingEdit:true, hasAttemptedSave: true, recordChanges: {}, editErrors: {errors: [{id: 9, invalidMessage: "error message #1", def: {fieldName: "test field"}}]}}} flux={flux} recId={"1"} visible={true}/>);

        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        let errorMessageAlertIcon = ReactDOM.findDOMNode(component).querySelectorAll(".trowserFooter .rightIcons .saveAlertButton");
        expect(errorMessageAlertIcon.length).toBe(1);
    });

    it('does not display the error icon if there is a client-side validation error, but the user has not attempted to save the record', () => {
        component = TestUtils.renderIntoDocument(<RecordTrowser editForm={{formData: {}}} pendEdits={{isPendingEdit:true, hasAttemptedSave: false, recordChanges: {}, editErrors: {errors: [{id: 9, invalidMessage: "error message #1", def: {fieldName: "test field"}}]}}} flux={flux} recId={"1"} visible={true}/>);

        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        let errorMessageAlertIcon = ReactDOM.findDOMNode(component).querySelectorAll(".trowserFooter .rightIcons .saveAlertButton");
        expect(errorMessageAlertIcon.length).toBe(0);
    });

    it('test dismiss error message popup in trowser', () => {

        const form = {editFormData: {}};
        let dispatchMethod = () => { };
        component = TestUtils.renderIntoDocument(<RecordTrowser form={form} pendEdits={{isPendingEdit:true, recordChanges: {}, editErrors: {errors: [{id: 9, invalidMessage: "error message #1", def: {fieldName: "test field"}}]}}} flux={flux} recId={null} visible={true} dispatch={dispatchMethod}/>);

        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        let errorMessageDialog = ReactDOM.findDOMNode(component).querySelectorAll(".qbErrorMessage");
        expect(errorMessageDialog.length).toBe(1);

        let errorMessageCloseButton = ReactDOM.findDOMNode(component).querySelectorAll(".qbErrorMessageHeader .rightIcons .btn");
        expect(errorMessageCloseButton.length).toBe(1);

        TestUtils.Simulate.click(errorMessageCloseButton[0]);

        expect(ShellActions.hideErrorMsgDialog).toHaveBeenCalled();
    });
});
