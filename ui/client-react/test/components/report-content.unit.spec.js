import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReportContent from '../../src/components/report/dataTable/reportContent';
import Loader  from 'react-loader';
import GriddleTable  from '../../src/components/dataTable/griddleTable/griddleTable';
import {NumericFormatter, DateFormatter} from '../../src/components/dataTable/griddleTable/formatters';
import _ from 'lodash';

var NumericFormatterMock = React.createClass({
    render: function() {
        return <div>mock numeric</div>;
    }
});
var DateFormatterMock = React.createClass({
    render: function() {
        return <div>mock date</div>;
    }
});

const header_empty = <div>nothing</div>;

const fakeReportData_loading = {
    loading: true
};
const fakeReportData_empty = {
    loading: false,
    data: {
        name: "",
        filteredRecords: [],
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

const cols_with_numeric_field = [
    {
        "columnName": "col_num",
        "datatypeAttributes": {
            type: "NUMERIC"
        }
    },
    "col_text",
    "col_date"
];

const cols_with_date_field = [
    "col_num",
    "col_text",
    {
        "column_name": "col_date",
        "datatypeAttributes": {
            type: "DATE"
        }
    }
];

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
    let flux = {};


    it('test render of component', () => {
        component = TestUtils.renderIntoDocument(<ReportContent
            reportData={fakeReportData_empty} reportHeader={header_empty}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render of loader', () => {
        component = TestUtils.renderIntoDocument(<ReportContent
            reportData={fakeReportData_loading} reportHeader={header_empty}/>);
        expect(TestUtils.scryRenderedComponentsWithType(component, Loader).length).toEqual(1);
        expect(TestUtils.scryRenderedComponentsWithType(component, GriddleTable).length).toEqual(0);
    });

    it('test render of empty component', () => {
        component = TestUtils.renderIntoDocument(<ReportContent
            reportData={fakeReportData_empty} reportHeader={header_empty}/>);
        expect(TestUtils.scryRenderedComponentsWithType(component, GriddleTable).length).toEqual(1);
    });

    it('test render of data without attributes', () => {
        component = TestUtils.renderIntoDocument(<ReportContent
            reportData={fakeReportData_simple}  reportHeader={header_empty}/>);
        var griddle = TestUtils.scryRenderedComponentsWithType(component, GriddleTable);
        expect(griddle.length).toEqual(1);
        griddle = griddle[0];
        expect(griddle.props.reportData.data.filteredRecords.length).toEqual(fakeReportData_simple.data.filteredRecords.length);
        expect(_.intersection(griddle.props.columnMetadata, fakeReportData_simple.data.columns).length).toEqual(fakeReportData_simple.data.columns.length);
    });

    it('test render of data with numeric field', () => {
        ReportContent.__Rewire__('NumericFormatter', NumericFormatterMock);

        fakeReportData_attributes.data.columns = cols_with_numeric_field;
        component = TestUtils.renderIntoDocument(<ReportContent flux={flux}
                                                                reportData={fakeReportData_attributes}
                                                                reportHeader={header_empty}/>);
        var griddle = TestUtils.scryRenderedComponentsWithType(component, GriddleTable);
        expect(griddle.length).toEqual(1);

        var col = cols_with_numeric_field[0];
        expect(col.cssClassName).toMatch('AlignRight');
        expect(col.customComponent).toBe(NumericFormatterMock);

        ReportContent.__ResetDependency__('NumericFormatter');
    });

    it('test render of data with date field', () => {
        ReportContent.__Rewire__('DateFormatter', DateFormatterMock);

        fakeReportData_attributes.data.columns = cols_with_date_field;
        component = TestUtils.renderIntoDocument(<ReportContent
            reportData={fakeReportData_attributes} reportHeader={header_empty}/>);
        var griddle = TestUtils.scryRenderedComponentsWithType(component, GriddleTable);
        expect(griddle.length).toEqual(1);

        var col = cols_with_date_field[2];
        expect(col.customComponent).toBe(DateFormatterMock);

        ReportContent.__ResetDependency__('DateFormatter');
    });


    it('test render of data with bold attribute', () => {
        fakeReportData_attributes.data.columns = cols_with_bold_attrs;
        component = TestUtils.renderIntoDocument(<ReportContent
            reportData={fakeReportData_attributes} reportHeader={header_empty}/>);
        var griddle = TestUtils.scryRenderedComponentsWithType(component, GriddleTable);
        expect(griddle.length).toEqual(1);

        var col = cols_with_bold_attrs[0];
        expect(col.cssClassName).toMatch('Bold');
    });

    it('test render of data with nowrap attribute', () => {
        fakeReportData_attributes.data.columns = cols_with_nowrap_attrs;
        component = TestUtils.renderIntoDocument(<ReportContent
            reportData={fakeReportData_attributes} reportHeader={header_empty}/>);
        var griddle = TestUtils.scryRenderedComponentsWithType(component, GriddleTable);
        expect(griddle.length).toEqual(1);

        var col = cols_with_nowrap_attrs[0];
        expect(col.cssClassName).toMatch('NoWrap');
    });

});

