import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import Record from '../../src/components/record/record';

var QBFormMock = React.createClass({
    render: function() {
        return (
            <div>form</div>
        );
    }
});

let flux = {
    actions: {
        recordPendingEditsCommit: {},
        recordPendingEditsChangeField: {},
        recordPendingEditsCancel: {},
        recordPendingEditsStart: {},
        saveRecord: {}
    }
};

describe('Record functions', () => {
    'use strict';

    let component;

    beforeEach(() => {
        Record.__Rewire__('QBForm', QBFormMock);
        spyOn(flux.actions, 'recordPendingEditsCommit');
        spyOn(flux.actions, 'recordPendingEditsChangeField');
        spyOn(flux.actions, 'recordPendingEditsCancel');
        spyOn(flux.actions, 'recordPendingEditsStart');
        spyOn(flux.actions, 'saveRecord');
    });

    afterEach(() => {
        Record.__ResetDependency__('QBForm');
        flux.actions.recordPendingEditsCommit.calls.reset();
        flux.actions.recordPendingEditsChangeField.calls.reset();
        flux.actions.recordPendingEditsCancel.calls.reset();
        flux.actions.recordPendingEditsStart.calls.reset();
        flux.actions.saveRecord.calls.reset();
    });

    it('test render of component', () => {
        component = TestUtils.renderIntoDocument(<Record flux={flux}></Record>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        const record = ReactDOM.findDOMNode(component);
        expect(record).toBeDefined();
    });
    it('test save record callback for edit', () => {
        component = TestUtils.renderIntoDocument(<Record recId={1} flux={flux} formData={{}}></Record>);
        component.handleRecordSaveClicked({value: 1});
        expect(flux.actions.recordPendingEditsCommit).toHaveBeenCalled();
        expect(flux.actions.saveRecord).toHaveBeenCalled();
    });
    it('test save record callback for add', () => {
        component = TestUtils.renderIntoDocument(<Record flux={flux} formData={{}}></Record>);
        component.handleRecordSaveClicked({});
        //TODO
    });
    it('test cancel callback', () => {
        component = TestUtils.renderIntoDocument(<Record recId={1} flux={flux}></Record>);
        component.handleEditRecordCancel();
        expect(flux.actions.recordPendingEditsCancel).toHaveBeenCalled();
    });
    it('test field change callback', () => {
        component = TestUtils.renderIntoDocument(<Record recId={1} flux={flux} pendEdits={{recordChanges: {}}} formData={{}}></Record>);
        component.handleFieldChange({});
        expect(flux.actions.recordPendingEditsChangeField).toHaveBeenCalled();
        expect(flux.actions.recordPendingEditsStart).toHaveBeenCalled();
    });
});
