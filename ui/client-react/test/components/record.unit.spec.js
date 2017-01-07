import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import Record, {__RewireAPI__ as RecordRewireAPI} from '../../src/components/record/record';

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
        RecordRewireAPI.__Rewire__('QBForm', QBFormMock);
        spyOn(flux.actions, 'recordPendingEditsCommit');
        spyOn(flux.actions, 'recordPendingEditsChangeField');
        spyOn(flux.actions, 'recordPendingEditsCancel');
        spyOn(flux.actions, 'recordPendingEditsStart');
        spyOn(flux.actions, 'saveRecord');
    });

    afterEach(() => {
        RecordRewireAPI.__ResetDependency__('QBForm');
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
    it('test field change callback', () => {
        component = TestUtils.renderIntoDocument(<Record recId={1} flux={flux} pendEdits={{recordChanges: {}, recordEditOpen: false}} formData={{}}></Record>);
        component.handleFieldChange({});
        expect(flux.actions.recordPendingEditsChangeField).toHaveBeenCalled();
    });
    it('test pendingEditStart is called on edit open', () => {
        var TestParent = React.createFactory(React.createClass({
            getInitialState() {
                return {recordEditOpen: false};
            },
            setRecordEdit() {
                this.setState({recordEditOpen: true});
            },
            render() {
                return <div>
                    <Record ref="record" recId={1} flux={flux} pendEdits={{recordChanges: {}, recordEditOpen: this.state.recordEditOpen}} formData={{}}></Record>
                    <button onClick={this.setRecordEdit} />
                </div>;
            }
        }));
        var parent = TestUtils.renderIntoDocument(TestParent());
        component = TestUtils.scryRenderedComponentsWithType(parent.refs.record, Record);
        let button = TestUtils.scryRenderedDOMComponentsWithTag(parent, 'button');
        TestUtils.Simulate.click(button[0]);
        expect(flux.actions.recordPendingEditsStart).toHaveBeenCalled();
    });
});
