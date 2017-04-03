import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import {mount, shallow} from 'enzyme';
import _ from 'lodash';
import {Record, __RewireAPI__ as RecordRewireAPI} from '../../src/components/record/record';

const renderText = 'Mock QBForm';
var QBFormMock = React.createClass({
    render: function() {
        return (
            <div onclick={this.handleFieldChange}>{renderText}</div>
        );
    }
});

describe('Record functions', () => {
    'use strict';

    let appId = '1';
    let tblId = '2';
    let recId = '6';
    let props = {
        appId: appId,
        tblId: tblId,
        recId: recId,
        pendEdits: {
            recordEditOpen: false,
            recordChanges: {}
        },
        formData: {
            record: [
                {display:'2', id:3, value:2},
                {display:'blah', id:6, value:'blah'}
            ],
            fields: [
                {id:3, builtIn:true, name:'Record ID#', required:true, tableId:'2', type:'SCALAR', datatypeAttributes:{type:'NUMERIC'}},
                {id:6, builtIn:false, name:'City', required:true, tableId:'2', type:'SCALAR', datatypeAttributes:{type:'TEXT'}}
            ]
        },
        editRecordStart: () => {},
        editRecordChange: () => {}
    };

    beforeEach(() => {
        RecordRewireAPI.__Rewire__('QBForm', QBFormMock);
        spyOn(props, 'editRecordStart').and.callThrough();
        spyOn(props, 'editRecordChange').and.callThrough();
    });

    afterEach(() => {
        RecordRewireAPI.__ResetDependency__('QBForm');
        props.editRecordStart.calls.reset();
        props.editRecordChange.calls.reset();
    });

    it('test render of component', () => {
        let component = mount(<Record {...props}/>);
        const div = component.find('div');
        expect(div.text()).toBe(renderText);
    });

    var editRecordStartTests = [
        {name: 'test editRecord Start is not called on component mount', recId:recId, recordChanges:{'change':'someChange'}, recordEditOpen:false, expectation:false},
        {name: 'test editRecord Start is not called on component mount with edit open', recId:recId, recordChanges:{'change':'someChange'}, recordEditOpen:true, expectation:false},
        {name: 'test editRecord Start is called on component mount', recordChanges:{}, recId:recId, recordEditOpen:true, expectation:true},
        {name: 'test editRecord Start is called on component mount with no recId', recId:null, recordChanges:{}, recordEditOpen:true, expectation:true}
    ];
    editRecordStartTests.forEach(testCase => {
        it(testCase.name, () => {
            let testProps = _.clone(props);
            testProps.recId = testCase.recId;
            testProps.pendEdits.recordEditOpen = testCase.recordEditOpen;
            testProps.pendEdits.recordChanges = testCase.recordChanges;

            mount(<Record {...testProps}  />);
            if (testCase.expectation) {
                expect(props.editRecordStart).toHaveBeenCalled();
            } else {
                expect(props.editRecordStart).not.toHaveBeenCalled();
            }
        });
    });

    it('test field change callback', () => {
        let component = TestUtils.renderIntoDocument(<Record {...props}></Record>);
        component.handleFieldChange({});
        expect(props.editRecordChange).toHaveBeenCalled();
    });

    it('test field change callback - take 2', () => {
        let component = TestUtils.renderIntoDocument(<Record {...props}></Record>);
        component.handleFieldChange({});
        expect(props.editRecordChange).toHaveBeenCalled();
    });

});
