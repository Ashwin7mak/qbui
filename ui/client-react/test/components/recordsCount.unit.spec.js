import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import RecordCount from '../../src/components/report/recordsCount';

const fakeRecordCountData = {
    valid: {
        recordCount: 10,
        isFiltered: true,
        filteredRecordCount: 5,
        nameForRecords: "Duder",
        isCounting: true
    },
    invalid: {
        recordCount: null,
        isFiltered: false,
        filteredRecordCount: null,
        nameForRecords: "Duder",
        isCounting: false
    }
};

describe('Record Count tests', () => {
    'use strict';

    var component;

    it('test render of component', () => {
        component = TestUtils.renderIntoDocument(<RecordCount recordCount={fakeRecordCountData.valid.recordCount} isFiltered={fakeRecordCountData.valid.isFiltered} isCounting={fakeRecordCountData.valid.isCounting}
                                                              filteredRecordCount={fakeRecordCountData.valid.filteredRecordCount} nameForRecords={fakeRecordCountData.valid.nameForRecords}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        var recordsCount = ReactDOM.findDOMNode(component);
        expect(recordsCount).toBeDefined();
    });

    it('test has records', () => {
        component = TestUtils.renderIntoDocument(<RecordCount recordCount={fakeRecordCountData.valid.recordCount} isFiltered={fakeRecordCountData.valid.isFiltered} isCounting={fakeRecordCountData.valid.isCounting}
                                                              filteredRecordCount={fakeRecordCountData.valid.filteredRecordCount} nameForRecords={fakeRecordCountData.valid.nameForRecords}/>);
        var node = ReactDOM.findDOMNode(component);
        var recordsCount = node.getElementsByClassName("recordsCount");
        expect(recordsCount).toBeDefined();
    });

    it('test no records', () => {
        component = TestUtils.renderIntoDocument(<RecordCount recordCount={fakeRecordCountData.invalid.recordCount} isFiltered={fakeRecordCountData.invalid.isFiltered} isCounting={fakeRecordCountData.invalid.isCounting}
                                                                     filteredRecordCount={fakeRecordCountData.invalid.filteredRecordCount} nameForRecords={fakeRecordCountData.invalid.nameForRecords}/>);
        var node = ReactDOM.findDOMNode(component);
        expect(node).toBe(null);
    });
});

