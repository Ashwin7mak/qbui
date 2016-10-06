import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import RecordTrowser from '../../src/components/record/recordTrowser';

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
            recordPendingEditsCommit() {return;},
            recordPendingEditsCancel() {return;},
            saveRecord() {return;},
            saveNewRecord() {return;}
        }
    };

    let component;

    beforeEach(() => {
        RecordTrowser.__Rewire__('Record', RecordMock);

        spyOn(flux.actions, 'recordPendingEditsCommit');
        spyOn(flux.actions, 'recordPendingEditsCancel');
        spyOn(flux.actions, 'saveRecord');
        spyOn(flux.actions, 'saveNewRecord');
    });

    afterEach(() => {
        RecordTrowser.__ResetDependency__('Record');

        flux.actions.recordPendingEditsCommit.calls.reset();
        flux.actions.recordPendingEditsCancel.calls.reset();
        flux.actions.saveRecord.calls.reset();
        flux.actions.saveNewRecord.calls.reset();
    });

    it('test render of loading component', () => {

        component = TestUtils.renderIntoDocument(<RecordTrowser flux={flux} visible={true}/>);

        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

    });

});
