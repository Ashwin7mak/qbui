import 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import CardView from '../../src/components/dataTable/griddleTable/cardView';

const fakeReportData_empty = {
    data: {
        results: [],
        columnMetadata: []
    }
};
const fakeReportData_valid = {
    data: {
        results: {
            col_num: 1,
            col_text: "abc",
            col_date: "01-01-2015"/*,
            col_4: 2,
            col_5: 3,
            col_6: 4*/
        },
        columnMetadata: ["col_num", "col_text", "col_date"/*, "col_4", "col_5", "col_6"*/]
    }
};

describe('Report Mobile View functions', () => {
    'use strict';

    var component;

    it('test render of component', () => {
        component = TestUtils.renderIntoDocument(<CardView data={fakeReportData_empty.data.results} metadataColumns={fakeReportData_empty.data.columnMetadata}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        var rows = TestUtils.scryRenderedDOMComponentsWithClass(component, "fieldRow");
        expect(rows.length).toEqual(0);
    });

    it('test render of component with data', () => {
        component = TestUtils.renderIntoDocument(<CardView data={fakeReportData_valid.data.results} metadataColumns={fakeReportData_valid.data.columnMetadata}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        var node = ReactDOM.findDOMNode(component);
        var rows = node.getElementsByClassName("fieldRow");
        expect(rows.length).toEqual(1);
    });

    it('test rows are collapsed by default', () => {
        component = TestUtils.renderIntoDocument(<CardView data={fakeReportData_valid.data.results} metadataColumns={fakeReportData_valid.data.columnMetadata}/>);
        var node = ReactDOM.findDOMNode(component);
        var rows = node.getElementsByClassName("fieldRow");
        expect(rows[0].className).toContain("collapsed");
    });

    it('test expand row on click', () => {
        component = TestUtils.renderIntoDocument(<CardView data={fakeReportData_valid.data.results} metadataColumns={fakeReportData_valid.data.columnMetadata}/>);
        var node = ReactDOM.findDOMNode(component);
        var rows = node.getElementsByClassName("fieldRow");
        TestUtils.Simulate.click(rows[0]);
        expect(rows[0].className).toContain("collapsed");
    });
});
