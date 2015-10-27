import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReportContent from '../../src/components/report/dataTable/content';
import Loader  from 'react-loader';
import GriddleTable  from '../../src/components/dataTable/griddleTable/griddleTable';
//import {DateFormatter}  from '../../src/components/dataTable/griddleTable/formatters';

const fakeReportData_loading = {
    loading: true
};
const fakeReportData_empty = {
    loading: false,
    data: {
        name: "",
        records: [],
        columns: []
    }
};

const fakeReportData_simple = {
    loading: false,
    data: {
        name: "test",
        filteredRecords: [{
            col_num: 1,
            col_text: "abc",
            col_date: "01-01-2015"
        }],
        columns: ["col_num", "col_text", "col_date"]
    }
};

//const cols_with_numeric_field = [
//    {
//        "columnName": "col_num",
//        "datatypeAttributes": {
//            type: "NUMERIC"
//        }
//    },
//    "col_text",
//    "col_date"
//];
//
//const cols_with_date_field = [
//    "col_num",
//    "col_text",
//    {
//        "column_name": "col_date",
//        "datatypeAttributes": {
//            type: "DATE"
//        }
//    }
//];

const cols_with_bold_attrs = [
    {
        "columnName": "col_num",
        "datatypeAttributes": {
            clientSideAttributes: {"bold": true}
        }
    },
    "col_text",
    "col_date"
];
const cols_with_nowrap_attrs = [
    {
        "columnName": "col_num",
        "datatypeAttributes": {
            clientSideAttributes: {"word-wrap": true}
        }
    },
    "col_text",
    "col_date"
];

const fakeReportData_attributes = {
    loading: false,
    data: {
        name: "test",
        filteredRecords: [{
            col_num: 1,
            col_text: "abc",
            col_date: "01-01-2015"
        }]
    }
};



describe('ReportContent functions', () => {
    'use strict';

    var component;

    it('test render of component', () => {
        component = TestUtils.renderIntoDocument(<ReportContent reportData={fakeReportData_empty}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render of loader', () => {
        component = TestUtils.renderIntoDocument(<ReportContent reportData={fakeReportData_loading} />);
        expect(TestUtils.scryRenderedComponentsWithType(component, Loader).length).toEqual(1);
        expect(TestUtils.scryRenderedComponentsWithType(component, GriddleTable).length).toEqual(0);
    });

    it('test render of empty component', () => {
        component = TestUtils.renderIntoDocument(<ReportContent reportData={fakeReportData_empty} />);
        expect(TestUtils.scryRenderedComponentsWithType(component, GriddleTable).length).toEqual(1);
    });

    it('test render of data without attributes', () => {
        component = TestUtils.renderIntoDocument(<ReportContent reportData={fakeReportData_simple} />);
        var griddle = TestUtils.scryRenderedComponentsWithType(component, GriddleTable);
        expect(griddle.length).toEqual(1);
        griddle = griddle[0];
        expect(griddle.props.results).toEqual(fakeReportData_simple.data.filteredRecords);
        expect(griddle.props.columnMetadata).toEqual(fakeReportData_simple.data.columns);
    });
/* TODO: In the process of figuring this out
    it('test render of data with numeric field', () => {
        fakeReportData_attributes.data.columns = cols_with_numeric_field;
        component = TestUtils.renderIntoDocument(<ReportContent reportData={fakeReportData_attributes} />);
        var griddle = TestUtils.scryRenderedComponentsWithType(component, GriddleTable);
        expect(griddle.length).toEqual(1);
        griddle = griddle[0];
        expect(griddle.props.results).toEqual(fakeReportData_simple.data.filteredRecords);

        var col = cols_with_numeric_field[0];
        expect(col.cssClassName).toMatch('AlignRight');
        expect(TestUtils.isCompositeComponentWithType(col.customComponent, NumericFormatter)).toBeTruthy();
    });

    it('test render of data with date field', () => {
        fakeReportData_attributes.data.columns = cols_with_date_field;
        component = TestUtils.renderIntoDocument(<ReportContent reportData={fakeReportData_attributes} />);
        var griddle = TestUtils.scryRenderedComponentsWithType(component, GriddleTable);
        expect(griddle.length).toEqual(1);
        griddle = griddle[0];
        expect(griddle.props.results).toEqual(fakeReportData_simple.data.filteredRecords);

        var col = cols_with_date_field[2];
        expect(TestUtils.isCompositeComponentWithType(col.customComponent, DateFormatter)).toBeTruthy();
    });
    */

    it('test render of data with bold attribute', () => {
        fakeReportData_attributes.data.columns = cols_with_bold_attrs;
        component = TestUtils.renderIntoDocument(<ReportContent reportData={fakeReportData_attributes} />);
        var griddle = TestUtils.scryRenderedComponentsWithType(component, GriddleTable);
        expect(griddle.length).toEqual(1);
        griddle = griddle[0];
        expect(griddle.props.results).toEqual(fakeReportData_simple.data.filteredRecords);

        var col = cols_with_bold_attrs[0];
        expect(col.cssClassName).toMatch('Bold');
    });

    it('test render of data with nowrap attribute', () => {
        fakeReportData_attributes.data.columns = cols_with_nowrap_attrs;
        component = TestUtils.renderIntoDocument(<ReportContent reportData={fakeReportData_attributes} />);
        var griddle = TestUtils.scryRenderedComponentsWithType(component, GriddleTable);
        expect(griddle.length).toEqual(1);
        griddle = griddle[0];
        expect(griddle.props.results).toEqual(fakeReportData_simple.data.filteredRecords);

        var col = cols_with_nowrap_attrs[0];
        expect(col.cssClassName).toMatch('NoWrap');
    });

});

