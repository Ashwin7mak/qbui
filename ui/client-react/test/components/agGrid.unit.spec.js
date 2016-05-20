import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import AGGrid  from '../../src/components/dataTable/agGrid/agGrid';
import AGGridReact from 'ag-grid-react';

import DateTimeFormatter from '../../src/components/dataTable/agGrid/formatters';
import TimeFormatter from '../../src/components/dataTable/agGrid/formatters';
import NumericFormatter from '../../src/components/dataTable/agGrid/formatters';
import TextFormatter from '../../src/components/dataTable/agGrid/formatters';
import CheckboxFormatter from '../../src/components/dataTable/agGrid/formatters';

import Loader  from 'react-loader';
import * as query from '../../src/constants/query';
import Locale from '../../src/locales/locales';

var NumericFormatterMock = function() {
    return "mock numeric";
};
var DateFormatterMock = function() {
    return "mock date";
};

var reactCellRendererFactoryMock = function(component) {
    return component;
};


var AGGridMock = React.createClass({
    render() {
        return (
            <div>test</div>
        );
    }
});

var TableActionsMock = React.createClass({
    render: function() {return <div>table actions</div>;}
});

var I18nMessageMock = React.createClass({
    render: function() {
        return (
            <div>I18Mock</div>
        );
    }
});

var CellFormatterMock =  React.createClass({
    render: function() {
        return (
            <div>I18Mock</div>
        );
    }
});


let flux = {
    actions: {
        getFilteredRecords: ()=>{},
        selectedRows: ()=>{}
    }
};

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

const fakeReportData_before = {
    loading: false,
    data: {
        records: [{
            col_num: 1,
            col_text: "abc",
            col_date: "01-01-2015",
            col_checkbox: true
        }],
        columns: [
            {
                id: 1,
                field: "col_num",
                headerName: "col_num",
                datatypeAttributes: {type:"NUMERIC"}
            },
            {
                id:2,
                field: "col_text",
                headerName: "col_text",
                datatypeAttributes: {type:"TEXT"}
            },
            {
                id:3,
                field: "col_date",
                headerName: "col_date",
                datatypeAttributes: {type:"DATE"}
            },
            {
                id:4,
                field: "col_check",
                headerName: "col_check",
                datatypeAttributes: {type:"CHECKBOX"}
            }]
    }
};
const fakeReportData_after = {
    loading: false,
    data: {
        records: [{
            col_num1: 2,
            col_text1: "xyz",
            col_date1: "01-01-2018"
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

function mouseclick(element, clickCount = 1) {
    // create a mouse click event
    var event = document.createEvent('MouseEvents');
    event.initMouseEvent('click', true, true, window, clickCount, 0, 0);

    // send click to element
    element.dispatchEvent(event);
}

describe('AGGrid functions', () => {
    'use strict';

    var component;

    beforeEach(() => {
        AGGrid.__Rewire__('AgGridReact', AGGridMock);
        AGGrid.__Rewire__('I18nMessage', I18nMessageMock);
        NumericFormatter.__Rewire__('CellFormatter', CellFormatterMock);
        spyOn(flux.actions, 'getFilteredRecords');
    });

    afterEach(() => {
        AGGrid.__ResetDependency__('AgGridReact');
        AGGrid.__ResetDependency__('I18nMessage');
        NumericFormatter.__ResetDependency__('CellFormatter');
        flux.actions.getFilteredRecords.calls.reset();
    });

    it('test render of component', () => {
        component = TestUtils.renderIntoDocument(<AGGrid actions={TableActionsMock} records={fakeReportData_empty.data.records} columns={fakeReportData_empty.data.columns} flux={flux}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });


    it('test render of loader', () => {
        component = TestUtils.renderIntoDocument(<AGGrid actions={TableActionsMock} loading={fakeReportData_loading.loading} flux={flux}/>);
        expect(TestUtils.scryRenderedComponentsWithType(component, Loader).length).toEqual(1);
        expect(TestUtils.scryRenderedComponentsWithType(component, AGGridReact).length).toEqual(0);
    });

    it('test render with empty data', () => {
        component = TestUtils.renderIntoDocument(<AGGrid columns={fakeReportData_empty.data.columns} records={fakeReportData_empty.data.records} loading={false} flux={flux}/>);
        expect(TestUtils.scryRenderedComponentsWithType(component, AGGridReact).length).toEqual(0);
        expect(ReactDOM.findDOMNode(component).textContent).toMatch("I18Mock");
    });

    it('test re-render with new data pushed from parent', () => {
        var TestParent = React.createFactory(React.createClass({
            getInitialState() {
                return {records: fakeReportData_before.data.records, columns: fakeReportData_before.data.columns};
            },
            render() {
                return <AGGrid ref="regGrid" records={this.state.records} columns={this.state.columns} flux={flux}/>;
            }
        }));

        var parent = TestUtils.renderIntoDocument(TestParent());

        parent.setState({
            records: fakeReportData_after.data.records,
            columns: fakeReportData_after.data.columns
        });

        expect(parent.refs.regGrid.props.records).toEqual(fakeReportData_after.data.records);
        expect(parent.refs.regGrid.props.columns).toEqual(fakeReportData_after.data.columns);
    });

    it('test render of grouped data', () => {
        var TestParent = React.createFactory(React.createClass({
            getInitialState() {
                return {records: fakeReportData_before.data.records, columns: fakeReportData_before.data.columns};
            },
            render() {
                return <AGGrid ref="regGrid" records={this.state.records} columns={this.state.columns} flux={flux} showGrouping={true}/>;
            }
        }));

        var parent = TestUtils.renderIntoDocument(TestParent());

        parent.setState({
            records: fakeReportData_after.data.records,
            columns: fakeReportData_after.data.columns
        });

        expect(parent.refs.regGrid.props.showGrouping).toEqual(true);
    });
    it('test expand all of grouped data', () => {
        AGGrid.__ResetDependency__('AgGridReact');
        component = TestUtils.renderIntoDocument(<AGGrid actions={TableActionsMock}
                                                         records={fakeReportData_before.data.records}
                                                         columns={fakeReportData_before.data.columns} flux={flux}
                                                         showGrouping={true} loading={false}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let gridElement = TestUtils.scryRenderedDOMComponentsWithClass(component, "agGrid");
        expect(gridElement.length).toEqual(1);
        var expandAllIcon = gridElement[0].getElementsByClassName("collapser");
        expect(expandAllIcon.length).toEqual(1);
        TestUtils.Simulate.click(expandAllIcon[0]);
        expect(expandAllIcon[0].getAttribute("state")).toEqual("open");
    });
    it('test collapse all of grouped data', () => {
        AGGrid.__ResetDependency__('AgGridReact');
        component = TestUtils.renderIntoDocument(<AGGrid actions={TableActionsMock}
                                                         records={fakeReportData_before.data.records}
                                                         columns={fakeReportData_before.data.columns} flux={flux}
                                                         showGrouping={true} loading={false}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let gridElement = TestUtils.scryRenderedDOMComponentsWithClass(component, "agGrid");
        expect(gridElement.length).toEqual(1);
        let expandAllIcon = gridElement[0].getElementsByClassName("collapser");
        expect(expandAllIcon.length).toEqual(1);
        TestUtils.Simulate.click(expandAllIcon[0]);
        TestUtils.Simulate.click(expandAllIcon[0]);
        expect(expandAllIcon[0].getAttribute("state")).toEqual("open");
    });
    it('test selectAll checkbox rendered', () => {
        AGGrid.__ResetDependency__('AgGridReact');
        component = TestUtils.renderIntoDocument(<AGGrid actions={TableActionsMock}
                                                         records={fakeReportData_before.data.records}
                                                         columns={fakeReportData_before.data.columns} flux={flux}
                                                         loading={false}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let gridElement = TestUtils.scryRenderedDOMComponentsWithClass(component, "agGrid");
        expect(gridElement.length).toEqual(1);
        let selectAllCheckbox = gridElement[0].getElementsByClassName("selectAllCheckbox");
        expect(selectAllCheckbox.length).toEqual(1);
    });
    it('test selects all rows', () => {
        AGGrid.__ResetDependency__('AgGridReact');
        component = TestUtils.renderIntoDocument(<AGGrid actions={TableActionsMock}
                                                         records={fakeReportData_before.data.records}
                                                         columns={fakeReportData_before.data.columns} flux={flux}
                                                         loading={false}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let gridElement = TestUtils.scryRenderedDOMComponentsWithClass(component, "agGrid");
        expect(gridElement.length).toEqual(1);
        let selectAllCheckbox = gridElement[0].getElementsByClassName("selectAllCheckbox");
        expect(selectAllCheckbox.length).toEqual(1);
        selectAllCheckbox[0].click();
        let listOfCheckboxes = gridElement[0].getElementsByClassName("ag-selection-checkbox");
        let rowsSelected = 0;
        for (var i = 0; i < listOfCheckboxes.length; i++) {
            if (listOfCheckboxes[i].checked) {
                rowsSelected++;
            }
        }
        //we add a hidden row to avoid clipping the row editing ui elements
        expect(rowsSelected).toEqual(fakeReportData_before.data.records.length + 1);
        expect(selectAllCheckbox[0].checked).toEqual(true);
    });
    it('renders column menu', (done) => {
        AGGrid.__ResetDependency__('AgGridReact');
        component = TestUtils.renderIntoDocument(<AGGrid actions={TableActionsMock}
                                                         records={fakeReportData_before.data.records}
                                                         columns={fakeReportData_before.data.columns} flux={flux}
                                                         loading={false}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let gridElement = TestUtils.scryRenderedDOMComponentsWithClass(component, "agGrid");
        let menuButton = gridElement[0].getElementsByClassName("ag-header-cell-menu-button");
        expect(menuButton.length).toBeGreaterThan(1);
        mouseclick(menuButton[0]);
        window.setTimeout(function() {
            let menu = gridElement[0].getElementsByClassName("ag-menu");
            expect(menu.length).toEqual(1);
            done();
        }, 100);
    });
    it('menu options numeric field', () => {
        AGGrid.__ResetDependency__('AgGridReact');
        component = TestUtils.renderIntoDocument(<AGGrid appId="1" tblId="2" rptId="3" actions={TableActionsMock}
                                                         records={fakeReportData_before.data.records}
                                                         columns={fakeReportData_before.data.columns} flux={flux}
                                                         loading={false}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        let numericcol = _.find(fakeReportData_before.data.columns, function(col) {
            return col.datatypeAttributes.type === "NUMERIC";
        });

        let gridElement = TestUtils.scryRenderedDOMComponentsWithClass(component, "agGrid");
        let menuButtons = gridElement[0].getElementsByClassName("ag-header-cell-menu-button");
        expect(menuButtons.length).toEqual(fakeReportData_before.data.columns.length);
        mouseclick(menuButtons[numericcol.id - 1]);
        let menu = gridElement[0].getElementsByClassName("ag-menu");
        expect(menu.length).toEqual(1);
        let menuoptions = menu[0].getElementsByClassName("ag-menu-option-text");
        expect(menuoptions[0].innerHTML).toEqual(Locale.getMessage("report.menu.sort.lowToHigh"));
        expect(menuoptions[1].innerHTML).toEqual(Locale.getMessage("report.menu.sort.highToLow"));
        expect(menuoptions[2].innerHTML).toEqual(Locale.getMessage("report.menu.group.lowToHigh"));
        expect(menuoptions[3].innerHTML).toEqual(Locale.getMessage("report.menu.group.highToLow"));
    });
    it('menu options text field', () => {
        AGGrid.__ResetDependency__('AgGridReact');
        component = TestUtils.renderIntoDocument(<AGGrid appId="1" tblId="2" rptId="3" actions={TableActionsMock}
                                                         records={fakeReportData_before.data.records}
                                                         columns={fakeReportData_before.data.columns} flux={flux}
                                                         loading={false}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        let textcol = _.find(fakeReportData_before.data.columns, function(col) {
            return col.datatypeAttributes.type === "TEXT";
        });

        let gridElement = TestUtils.scryRenderedDOMComponentsWithClass(component, "agGrid");
        let menuButtons = gridElement[0].getElementsByClassName("ag-header-cell-menu-button");
        expect(menuButtons.length).toEqual(fakeReportData_before.data.columns.length);
        mouseclick(menuButtons[textcol.id - 1]);
        let menu = gridElement[0].getElementsByClassName("ag-menu");
        expect(menu.length).toEqual(1);
        let menuoptions = menu[0].getElementsByClassName("ag-menu-option-text");
        expect(menuoptions[0].innerHTML).toEqual(Locale.getMessage("report.menu.sort.aToZ"));
        expect(menuoptions[1].innerHTML).toEqual(Locale.getMessage("report.menu.sort.zToA"));
        expect(menuoptions[2].innerHTML).toEqual(Locale.getMessage("report.menu.group.aToZ"));
        expect(menuoptions[3].innerHTML).toEqual(Locale.getMessage("report.menu.group.zToA"));
    });
    it('menu options date field', () => {
        AGGrid.__ResetDependency__('AgGridReact');
        component = TestUtils.renderIntoDocument(<AGGrid appId="1" tblId="2" rptId="3" actions={TableActionsMock}
                                                         records={fakeReportData_before.data.records}
                                                         columns={fakeReportData_before.data.columns} flux={flux}
                                                         loading={false}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        let datecol = _.find(fakeReportData_before.data.columns, function(col) {
            return col.datatypeAttributes.type === "DATE";
        });


        let gridElement = TestUtils.scryRenderedDOMComponentsWithClass(component, "agGrid");
        let menuButtons = gridElement[0].getElementsByClassName("ag-header-cell-menu-button");
        expect(menuButtons.length).toEqual(fakeReportData_before.data.columns.length);
        mouseclick(menuButtons[datecol.id - 1]);
        let menu = gridElement[0].getElementsByClassName("ag-menu");
        expect(menu.length).toEqual(1);
        let menuoptions = menu[0].getElementsByClassName("ag-menu-option-text");
        expect(menuoptions[0].innerHTML).toEqual(Locale.getMessage("report.menu.sort.oldToNew"));
        expect(menuoptions[1].innerHTML).toEqual(Locale.getMessage("report.menu.sort.newToOld"));
        expect(menuoptions[2].innerHTML).toEqual(Locale.getMessage("report.menu.group.oldToNew"));
        expect(menuoptions[3].innerHTML).toEqual(Locale.getMessage("report.menu.group.newToOld"));
    });
    it('menu options checkbox field', () => {
        AGGrid.__ResetDependency__('AgGridReact');
        component = TestUtils.renderIntoDocument(<AGGrid appId="1" tblId="2" rptId="3" actions={TableActionsMock}
                                                         records={fakeReportData_before.data.records}
                                                         columns={fakeReportData_before.data.columns} flux={flux}
                                                         loading={false} selectedSortFids={[3]}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        let checkcol = _.find(fakeReportData_before.data.columns, function(col) {
            return col.datatypeAttributes.type === "CHECKBOX";
        });

        let gridElement = TestUtils.scryRenderedDOMComponentsWithClass(component, "agGrid");
        let menuButtons = gridElement[0].getElementsByClassName("ag-header-cell-menu-button");
        expect(menuButtons.length).toEqual(fakeReportData_before.data.columns.length);
        mouseclick(menuButtons[checkcol.id - 1]);
        let menu = gridElement[0].getElementsByClassName("ag-menu");
        expect(menu.length).toEqual(1);
        let menuoptions = menu[0].getElementsByClassName("ag-menu-option-text");
        expect(menuoptions[0].innerHTML).toEqual(Locale.getMessage("report.menu.sort.uncheckedToChecked"));
        expect(menuoptions[1].innerHTML).toEqual(Locale.getMessage("report.menu.sort.checkedToUnchecked"));
        expect(menuoptions[2].innerHTML).toEqual(Locale.getMessage("report.menu.group.uncheckedToChecked"));
        expect(menuoptions[3].innerHTML).toEqual(Locale.getMessage("report.menu.group.checkedToUnchecked"));
    });

    it('test edit cells visible based on selection ', () => {
        AGGrid.__ResetDependency__('AgGridReact');

        const TestParent = React.createFactory(React.createClass({

            // wrap the grid in a container with styles needed to render editing UI
            render() {
                return (<div className="reportToolsAndContentContainer singleSelection">
                    <AGGrid ref="grid"
                            flux={flux}
                            actions={TableActionsMock}
                            records={fakeReportData_before.data.records}
                            columns={fakeReportData_before.data.columns}
                            loading={false}
                            />
                </div>);
            }
        }));
        const parent = TestUtils.renderIntoDocument(TestParent());
        const grid = parent.refs.grid;

        // find the checkboxes (ag-grid renders a bunch of hidden ag-row elements)
        const checkBoxes = ReactDOM.findDOMNode(grid).querySelectorAll(".gridCell:first-child");
        expect(checkBoxes.length).toBe(fakeReportData_before.data.records.length + 1);

        const selected = TestUtils.scryRenderedDOMComponentsWithClass(grid, "ag-row-selected");
        expect(selected.length).toBe(0);

        // select a row via double click
        const firstRow = checkBoxes[0].parentElement;
        mouseclick(firstRow, 2);

        // look for newly selected row (element with ag-row-selected class containing grid cells)
        const selectedAfterDblClick = ReactDOM.findDOMNode(grid).querySelectorAll(".ag-row-selected .gridCell:first-child");
        expect(selectedAfterDblClick.length).toBe(1);
    });
});
