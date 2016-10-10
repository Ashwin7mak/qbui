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
    singleRecordNotFiltered: {
        recordCount: 1,
        isFiltered: false,
        filteredRecordCount: 10,
        nameForRecords: "LoneRecord",
        isCounting: false
    },
    singleRecordFiltered: {
        recordCount: 10,
        isFiltered: true,
        filteredRecordCount: 1,
        nameForRecords: "FilteredAndAlone",
        isCounting: false
    },
    multipleRecordsNotFiltered: {
        recordCount: 210,
        isFiltered: false,
        filteredRecordCount: 10,
        nameForRecords: "Tests",
        isCounting: false
    },
    multipleRecordsFiltered: {
        recordCount: 210,
        isFiltered: true,
        filteredRecordCount: 21,
        nameForRecords: "FilteredTests",
        isCounting: false
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

    it('test has one record, no search filter', () => {
        component = TestUtils.renderIntoDocument(<RecordCount recordCount={fakeRecordCountData.singleRecordNotFiltered.recordCount}
                                                              isFiltered={fakeRecordCountData.singleRecordNotFiltered.isFiltered}
                                                              isCounting={fakeRecordCountData.singleRecordNotFiltered.isCounting}
                                                              filteredRecordCount={fakeRecordCountData.singleRecordNotFiltered.filteredRecordCount}
                                                              nameForRecords={fakeRecordCountData.singleRecordNotFiltered.nameForRecords}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        var recordsCount = ReactDOM.findDOMNode(component);
        expect(recordsCount).toBeDefined();
        var singleRecordMessageSpan = recordsCount.getElementsByTagName("span");
        expect(singleRecordMessageSpan).toBeDefined();
        var singleRecordMessage = singleRecordMessageSpan.item(0);
        expect(singleRecordMessage).toBeDefined();
        expect(singleRecordMessage.textContent).toBe("1 record");
    });

    it('test has one filtered record', () => {
        component = TestUtils.renderIntoDocument(<RecordCount recordCount={fakeRecordCountData.singleRecordFiltered.recordCount}
                                                              isFiltered={fakeRecordCountData.singleRecordFiltered.isFiltered}
                                                              isCounting={fakeRecordCountData.singleRecordFiltered.isCounting}
                                                              filteredRecordCount={fakeRecordCountData.singleRecordFiltered.filteredRecordCount}
                                                              nameForRecords={fakeRecordCountData.singleRecordFiltered.nameForRecords}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        var recordsCount = ReactDOM.findDOMNode(component);
        expect(recordsCount).toBeDefined();
        var singleRecordMessageSpan = recordsCount.getElementsByTagName("span");
        expect(singleRecordMessageSpan).toBeDefined();
        var singleRecordMessage = singleRecordMessageSpan.item(0);
        expect(singleRecordMessage).toBeDefined();
        expect(singleRecordMessage.textContent).toBe("1 of 10 records");
    });
    it('test has many records, no search filter', () => {
        component = TestUtils.renderIntoDocument(<RecordCount recordCount={fakeRecordCountData.multipleRecordsNotFiltered.recordCount}
                                                              isFiltered={fakeRecordCountData.multipleRecordsNotFiltered.isFiltered}
                                                              isCounting={fakeRecordCountData.multipleRecordsNotFiltered.isCounting}
                                                              filteredRecordCount={fakeRecordCountData.multipleRecordsNotFiltered.filteredRecordCount}
                                                              nameForRecords={fakeRecordCountData.multipleRecordsNotFiltered.nameForRecords}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        var recordsCount = ReactDOM.findDOMNode(component);
        expect(recordsCount).toBeDefined();
        var recordMessageSpan = recordsCount.getElementsByTagName("span");
        expect(recordMessageSpan).toBeDefined();
        var recordMessage = recordMessageSpan.item(0);
        expect(recordMessage).toBeDefined();
        expect(recordMessage.textContent).toBe("210 records");
    });

    it('test has multiple filtered records', () => {
        component = TestUtils.renderIntoDocument(<RecordCount recordCount={fakeRecordCountData.multipleRecordsFiltered.recordCount}
                                                              isFiltered={fakeRecordCountData.multipleRecordsFiltered.isFiltered}
                                                              isCounting={fakeRecordCountData.multipleRecordsFiltered.isCounting}
                                                              filteredRecordCount={fakeRecordCountData.multipleRecordsFiltered.filteredRecordCount}
                                                              nameForRecords={fakeRecordCountData.multipleRecordsFiltered.nameForRecords}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        var recordsCount = ReactDOM.findDOMNode(component);
        expect(recordsCount).toBeDefined();
        var recordMessageSpan = recordsCount.getElementsByTagName("span");
        expect(recordMessageSpan).toBeDefined();
        var recordMessage = recordMessageSpan.item(0);
        expect(recordMessage).toBeDefined();
        expect(recordMessage.textContent).toBe("21 of 210 records");
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

