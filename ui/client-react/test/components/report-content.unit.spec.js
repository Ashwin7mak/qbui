import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReportContent from '../../src/components/report/dataTable/reportContent';
import GriddleTable  from '../../src/components/dataTable/griddleTable/griddleTable';
import AGGrid  from '../../src/components/dataTable/agGrid/agGrid';
import {reactCellRendererFactory} from 'ag-grid-react';
import {NumericFormatter, DateFormatter} from '../../src/components/dataTable/griddleTable/formatters';
import _ from 'lodash';

//var NumericFormatterMock = React.createClass({
//    render: function() {
//        return <div>mock numeric</div>;
//    }
//});

var NumericFormatterMock = "mock numeric";
var DateFormatterMock = React.createClass({
    render: function() {
        return <div>mock date</div>;
    }
});

var reactCellRendererFactoryMock = function(component) {
    return component;
}

const header_empty = <div>nothing</div>;

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
        columns: [{
            field: "col_num",
            headerName: "col_num"
        },
            {
                field: "col_text",
                headerName: "col_text"
            },
            {
                field: "col_date",
                headerName: "col_date"
            }]
    }
};

const cols_with_numeric_field = [
    {
        "field": "col_num",
        "datatypeAttributes": {
            type: "NUMERIC"
        }
    },
    {
        "field": "col_text"
    },
    {
        "field": "col_date"
    }
];

const cols_with_date_field = [
    {
        "field": "col_num"
    },
    {
        "field": "col_text"
    },
    {
        "field": "col_date",
        "datatypeAttributes": {
            type: "DATE"
        }
    }
];

const cols_with_bold_attrs = [
    {
        "field": "col_num",
        "datatypeAttributes": {
            clientSideAttributes: {"bold": true}
        }
    },
    {
        "field": "col_text"
    },
    {
        "field": "col_date"
    }
];
const cols_with_nowrap_attrs = [
    {
        "columnName": "col_num",
        "datatypeAttributes": {
            clientSideAttributes: {"word-wrap": true}
        }
    },
    {
        "field": "col_text"
    },
    {
        "field": "col_date"
    }
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

    it('test render of empty component', () => {
        component = TestUtils.renderIntoDocument(<ReportContent
            reportData={fakeReportData_empty} reportHeader={header_empty}/>);
        expect(TestUtils.scryRenderedComponentsWithType(component, AGGrid).length).toEqual(1);
    });

    it('test render of data without attributes', () => {
        component = TestUtils.renderIntoDocument(<ReportContent
            reportData={fakeReportData_simple}  reportHeader={header_empty}/>);
        var agGrid = TestUtils.scryRenderedComponentsWithType(component, AGGrid);
        expect(agGrid.length).toEqual(1);
        agGrid = agGrid[0];
        expect(agGrid.props.reportData.data.filteredRecords.length).toEqual(fakeReportData_simple.data.filteredRecords.length);
        expect(_.intersection(agGrid.props.columns, fakeReportData_simple.data.columns).length).toEqual(fakeReportData_simple.data.columns.length);
    });

    //it('test render of data with numeric field', () => {
    //    ReportContent.__Rewire__('NumericFormatter', NumericFormatterMock);
    //    ReportContent.__Rewire__('reactCellRendererFactory', reactCellRendererFactoryMock);
    //
    //    fakeReportData_attributes.data.columns = cols_with_numeric_field;
    //    component = TestUtils.renderIntoDocument(<ReportContent flux={flux}
    //                                                            reportData={fakeReportData_attributes}
    //                                                            reportHeader={header_empty}/>);
    //    var agGrid = TestUtils.scryRenderedComponentsWithType(component, AGGrid);
    //    expect(agGrid.length).toEqual(1);
    //
    //    var col = cols_with_numeric_field[0];
    //    expect(col.cellClass).toMatch('AlignRight');
    //    expect(col.cellRenderer).toEqual(reactCellRendererFactoryMock(NumericFormatterMock));
    //
    //    ReportContent.__ResetDependency__('NumericFormatter');
    //    ReportContent.__ResetDependency__('reactCellRendererFactory');
    //});

    //it('test render of data with date field', () => {
    //    ReportContent.__Rewire__('DateFormatter', DateFormatterMock);
    //
    //    fakeReportData_attributes.data.columns = cols_with_date_field;
    //    component = TestUtils.renderIntoDocument(<ReportContent
    //        reportData={fakeReportData_attributes} reportHeader={header_empty}/>);
    //    var agGrid = TestUtils.scryRenderedComponentsWithType(component, AGGrid);
    //    expect(agGrid.length).toEqual(1);
    //
    //    var col = cols_with_date_field[2];
    //    expect(col.cellRenderer).toBe(reactCellRendererFactory(DateFormatterMock));
    //
    //    ReportContent.__ResetDependency__('DateFormatter');
    //});


    it('test render of data with bold attribute', () => {
        fakeReportData_attributes.data.columns = cols_with_bold_attrs;
        component = TestUtils.renderIntoDocument(<ReportContent
            reportData={fakeReportData_attributes} reportHeader={header_empty}/>);
        var agGrid = TestUtils.scryRenderedComponentsWithType(component, AGGrid);
        expect(agGrid.length).toEqual(1);

        var col = cols_with_bold_attrs[0];
        expect(col.cellClass).toMatch('Bold');
    });

    it('test render of data with nowrap attribute', () => {
        fakeReportData_attributes.data.columns = cols_with_nowrap_attrs;
        component = TestUtils.renderIntoDocument(<ReportContent
            reportData={fakeReportData_attributes} reportHeader={header_empty}/>);
        var agGrid = TestUtils.scryRenderedComponentsWithType(component, AGGrid);
        expect(agGrid.length).toEqual(1);

        var col = cols_with_nowrap_attrs[0];
        expect(col.cellClass).toMatch('NoWrap');
    });

});

