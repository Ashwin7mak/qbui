import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import RecordTrowser from '../../src/components/record/recordTrowser';
import Promise from 'bluebird';

const RecordMock = React.createClass({
    render: function() {
        return (
            <div className="record">test</div>
        );
    }
});

describe('RecordTrowser functions', () => {
    'use strict';

    let flux = {
        actions: {
            recordPendingEditsCommit() {},
            recordPendingEditsCancel() {},
            saveRecord() {return Promise.resolve({});},
            saveNewRecord() {return Promise.resolve({});},
            savingForm() {},
            hideTrowser() {}
        }
    };

    let component;

    beforeEach(() => {
        RecordTrowser.__Rewire__('Record', RecordMock);

        spyOn(flux.actions, 'recordPendingEditsCommit');
        spyOn(flux.actions, 'recordPendingEditsCancel');
        spyOn(flux.actions, 'saveRecord').and.callThrough();
        spyOn(flux.actions, 'saveNewRecord').and.callThrough();
        spyOn(flux.actions, 'hideTrowser');
    });

    afterEach(() => {
        RecordTrowser.__ResetDependency__('Record');

        flux.actions.recordPendingEditsCommit.calls.reset();
        flux.actions.recordPendingEditsCancel.calls.reset();
        flux.actions.saveRecord.calls.reset();
        flux.actions.saveNewRecord.calls.reset();
        flux.actions.hideTrowser.calls.reset();
    });

    it('test render of loading component', () => {

        component = TestUtils.renderIntoDocument(<RecordTrowser flux={flux} visible={true}/>);

        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

    });

    it('test cancelling the record trowser', () => {

        component = TestUtils.renderIntoDocument(<RecordTrowser pendEdits={{recordChanges: {}}} flux={flux} recId={"1"} visible={true}/>);

        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        const closeIcon = TestUtils.findRenderedDOMComponentWithClass(component, "iconTableUISturdy-close");
        TestUtils.Simulate.click(closeIcon);

        expect(flux.actions.hideTrowser).toHaveBeenCalled();
    });

    it('test saving new record in the trowser', () => {

        const form = {editFormData: {}};

        component = TestUtils.renderIntoDocument(<RecordTrowser form={form} pendEdits={{isPendingEdit:true, recordChanges: {}}} flux={flux} recId={null} visible={true}/>);

        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        let saveButton = ReactDOM.findDOMNode(component).querySelectorAll(".trowserFooter .rightIcons .btn");
        expect(saveButton.length).toBe(1);

        TestUtils.Simulate.click(saveButton[0]);

        expect(flux.actions.saveNewRecord).toHaveBeenCalled();
    });

    it('test saving existing record in the trowser', () => {

        const form = {editFormData: {}};

        component = TestUtils.renderIntoDocument(<RecordTrowser form={form} pendEdits={{isPendingEdit:true, recordChanges: {}}} flux={flux} recId={"1"} visible={true}/>);

        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        let saveButton = ReactDOM.findDOMNode(component).querySelectorAll(".trowserFooter .rightIcons .btn");
        expect(saveButton.length).toBe(1);

        TestUtils.Simulate.click(saveButton[0]);

        expect(flux.actions.saveRecord).toHaveBeenCalled();
    });
});
