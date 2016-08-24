import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import AGGrid  from '../../src/components/dataTable/agGrid/agGrid';
import AGGridReact from 'ag-grid-react';

import CellRenderers from '../../src/components/dataTable/agGrid/cellRenderers';
import CellValueRenderers from '../../src/components/dataTable/agGrid/cellValueRenderers';
import {DateCellRenderer, DateTimeCellRenderer, TimeCellRenderer, NumericCellRenderer, TextCellRenderer, CheckBoxCellRenderer} from '../../src/components/dataTable/agGrid/cellRenderers';

import Loader  from 'react-loader';
import * as query from '../../src/constants/query';
import Locale from '../../src/locales/locales';


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
        records: [
            {
                col_num: {id: 2, value: 1, display: "1"},
                col_text: {id: 1, value: "abc", display: "abc"},
                col_date: {id: 3, value: "01-01-2015", display: "01-01-2015"},
                col_checkbox: {id: 4, value: true, display: true}
            },
            {
                col_num: {id: 2, value: 2, display: "2"},
                col_text: {id: 1, value: "xyz", display: "xyz"},
                col_date: {id: 3, value: "01-18-1966", display: "01-18-1966"},
                col_checkbox: {id: 4, value: false, display: false}
            }],
        columns: [
            {
                id:1,
                field: "col_text",
                headerName: "col_text",
                datatypeAttributes: {type:"TEXT"}
            },
            {
                id: 2,
                field: "col_num",
                headerName: "col_num",
                datatypeAttributes: {type:"NUMERIC"}
            },
            {
                id:3,
                field: "col_date",
                headerName: "col_date",
                datatypeAttributes: {type:"DATE"}
            },
            {
                id:4,
                field: "col_checkbox",
                headerName: "col_check",
                datatypeAttributes: {type:"CHECKBOX"}
            }]
    }
};
const fakeReportData_after = {
    loading: false,
    data: {
        records: [
            {
                col_num1: {id: 1, value: 2, display: "2"},
                col_text1: {id: 2, value: "xyz", display: "xyz"},
                col_date1: {id: 3, value: "01-01-2018", display: "01-01-2018"}
            }],
        columns: [
            {
                id: 1,
                field: "col_num1",
                headerName: "col_num",
                datatypeAttributes: {type:"NUMERIC"}
            },
            {
                id: 2,
                field: "col_text1",
                headerName: "col_text",
                datatypeAttributes: {type:"TEXT"}
            },
            {
                id: 3,
                field: "col_date1",
                headerName: "col_date",
                datatypeAttributes: {type:"DATE"}
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

    let flux = {
        actions: {
            getFilteredRecords: ()=>{},
            selectedRows: ()=>{},
            rowClicked: ()=>{},
            mark: ()=>{},
            measure: ()=>{}
        }
    };

    beforeEach(() => {
        AGGrid.__Rewire__('I18nMessage', I18nMessageMock);
        CellValueRenderers.__Rewire__('I18nNumber', I18nMessageMock);
        spyOn(flux.actions, 'getFilteredRecords');
        spyOn(flux.actions, 'rowClicked');

    });

    afterEach(() => {
        AGGrid.__ResetDependency__('I18nMessage');
        CellValueRenderers.__ResetDependency__('I18nNumber');
        flux.actions.getFilteredRecords.calls.reset();
        flux.actions.rowClicked.calls.reset();
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

        //parent.setState({
        //    records: fakeReportData_after.data.records,
        //    columns: fakeReportData_after.data.columns
        //});
        //
        //expect(parent.refs.regGrid.props.records).toEqual(fakeReportData_after.data.records);
        //expect(parent.refs.regGrid.props.columns).toEqual(fakeReportData_after.data.columns);
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
        expect(rowsSelected).toEqual(fakeReportData_before.data.records.length);
        expect(selectAllCheckbox[0].checked).toEqual(true);
    });

    it('renders column menu', () => {
        AGGrid.__ResetDependency__('AgGridReact');
        component = TestUtils.renderIntoDocument(<AGGrid actions={TableActionsMock}
                                                         records={fakeReportData_before.data.records}
                                                         columns={fakeReportData_before.data.columns} flux={flux}
                                                         loading={false} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let gridElement = TestUtils.scryRenderedDOMComponentsWithClass(component, "agGrid");
        expect(gridElement.length).toBe(1);

        let header = ReactDOM.findDOMNode(component).querySelectorAll(".ag-header");
        expect(header.length).toBe(1);

        let menuButtons = ReactDOM.findDOMNode(component).querySelectorAll(".ag-header button.dropdownToggle");
        expect(menuButtons.length).toBe(fakeReportData_before.data.columns.length);

        TestUtils.Simulate.click(menuButtons[0]);

        let menu = ReactDOM.findDOMNode(component).querySelectorAll(".ag-header .dropdown.open");
        expect(menu.length).toEqual(1);

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
        let menuButtons = ReactDOM.findDOMNode(gridElement[0]).querySelectorAll(".ag-header button.dropdownToggle");
        expect(menuButtons.length).toEqual(fakeReportData_before.data.columns.length);

        TestUtils.Simulate.click(menuButtons[numericcol.id - 1]);

        let menu = gridElement[0].getElementsByClassName("dropdown-menu");
        expect(menu.length).toBeGreaterThan(0);
        let menuoptions = menu[numericcol.id - 1].querySelectorAll("a:last-child"); // find the menu item text
        expect(menuoptions[0].innerHTML.includes(Locale.getMessage("report.menu.sort.lowToHigh"))).toBe(true);
        expect(menuoptions[1].innerHTML.includes(Locale.getMessage("report.menu.sort.highToLow"))).toBe(true);
        expect(menuoptions[2].innerHTML.includes(Locale.getMessage("report.menu.group.lowToHigh"))).toBe(true);
        expect(menuoptions[3].innerHTML.includes(Locale.getMessage("report.menu.group.highToLow"))).toBe(true);
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
        let menuButtons = ReactDOM.findDOMNode(gridElement[0]).querySelectorAll(".ag-header button.dropdownToggle");
        expect(menuButtons.length).toEqual(fakeReportData_before.data.columns.length);
        TestUtils.Simulate.click(menuButtons[textcol.id - 1]);
        let menu = gridElement[0].getElementsByClassName("dropdown-menu");
        expect(menu.length).toBeGreaterThan(0);
        let menuoptions = menu[0].querySelectorAll("a:last-child"); // find the menu item text
        expect(menuoptions[0].innerHTML.includes(Locale.getMessage("report.menu.sort.aToZ"))).toBe(true);
        expect(menuoptions[1].innerHTML.includes(Locale.getMessage("report.menu.sort.zToA"))).toBe(true);
        expect(menuoptions[2].innerHTML.includes(Locale.getMessage("report.menu.group.aToZ"))).toBe(true);
        expect(menuoptions[3].innerHTML.includes(Locale.getMessage("report.menu.group.zToA"))).toBe(true);
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
        let menuButtons = ReactDOM.findDOMNode(gridElement[0]).querySelectorAll(".ag-header button.dropdownToggle");
        expect(menuButtons.length).toEqual(fakeReportData_before.data.columns.length);
        TestUtils.Simulate.click(menuButtons[datecol.id - 1]);
        let menu = gridElement[0].getElementsByClassName("dropdown-menu");
        expect(menu.length).toBeGreaterThan(1);
        let menuoptions = menu[datecol.id - 1].querySelectorAll("a:last-child"); // find the menu item text
        expect(menuoptions[0].innerHTML.includes(Locale.getMessage("report.menu.sort.oldToNew"))).toBe(true);
        expect(menuoptions[1].innerHTML.includes(Locale.getMessage("report.menu.sort.newToOld"))).toBe(true);
        expect(menuoptions[2].innerHTML.includes(Locale.getMessage("report.menu.group.oldToNew"))).toBe(true);
        expect(menuoptions[3].innerHTML.includes(Locale.getMessage("report.menu.group.newToOld"))).toBe(true);
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
        let menuButtons = ReactDOM.findDOMNode(gridElement[0]).querySelectorAll(".ag-header button.dropdownToggle");
        expect(menuButtons.length).toEqual(fakeReportData_before.data.columns.length);
        TestUtils.Simulate.click(menuButtons[checkcol.id - 1]);
        let menu = gridElement[0].getElementsByClassName("dropdown-menu");
        expect(menu.length).toBeGreaterThan(1);
        let menuoptions = menu[checkcol.id - 1].querySelectorAll("a:last-child"); // find the menu item text
        expect(menuoptions[0].innerHTML.includes(Locale.getMessage("report.menu.sort.uncheckedToChecked"))).toBe(true);
        expect(menuoptions[1].innerHTML.includes(Locale.getMessage("report.menu.sort.checkedToUnchecked"))).toBe(true);
        expect(menuoptions[2].innerHTML.includes(Locale.getMessage("report.menu.group.uncheckedToChecked"))).toBe(true);
        expect(menuoptions[3].innerHTML.includes(Locale.getMessage("report.menu.group.checkedToUnchecked"))).toBe(true);
    });

    it('test row actions ', () => {
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
                            onRowClick={flux.actions.rowClicked}
                    />
                </div>);
            }
        }));
        const parent = TestUtils.renderIntoDocument(TestParent());
        const grid = parent.refs.grid;

        // find the edit icons
        const editButtons = ReactDOM.findDOMNode(grid).querySelectorAll(".gridCell button.edit");
        expect(editButtons.length).toBe(fakeReportData_before.data.records.length);

        // click on edit icon
        TestUtils.Simulate.click(editButtons[0]);
        expect(flux.actions.rowClicked).toHaveBeenCalled();

        // find the dropdown buttons
        const dropdownButtons = ReactDOM.findDOMNode(grid).querySelectorAll(".gridCell button.dropdownToggle");
        expect(dropdownButtons.length).toBe(fakeReportData_before.data.records.length);

        // click on dropdown icon
        TestUtils.Simulate.click(dropdownButtons[0]);

        //find the open dropdown
        const dropdownMenus = ReactDOM.findDOMNode(grid).querySelectorAll(".gridCell .dropdown.open .dropdown-menu");
        expect(dropdownMenus.length).toBe(1);
    });

    it('test edit cells by double clicking ', () => {
        AGGrid.__ResetDependency__('AgGridReact');
        let callBacks = {
            onEditRecordStart: function() {
            },
        };
        spyOn(callBacks, 'onEditRecordStart');

        const TestParent = React.createFactory(React.createClass({

            // wrap the grid in a container with styles needed to render editing UI
            render() {
                return (<div className="reportToolsAndContentContainer singleSelection">
                        <AGGrid ref="grid"
                                flux={flux}
                                keyField="col_num"
                                uniqueIdentifier="col_num"
                                onEditRecordStart={callBacks.onEditRecordStart}
                                actions={TableActionsMock}
                                records={fakeReportData_before.data.records}
                                columns={fakeReportData_before.data.columns}
                                loading={false}
                                />
                </div>);
            }
        }));

        const parent = TestUtils.renderIntoDocument(TestParent());

        // find the edited rows

        const editRows = ReactDOM.findDOMNode(parent).querySelectorAll(".ag-body-container .ag-row.editing");
        expect(editRows.length).toBe(0);

        // find the field cells in the 1st row

        const columnCells = ReactDOM.findDOMNode(parent).querySelectorAll(".ag-body-container .ag-row:first-child .gridCell");
        expect(columnCells.length).toBe(fakeReportData_before.data.columns.length);

        // select a row via double click on the 1st cell
        let firstCell = columnCells[0].parentElement;
        mouseclick(firstCell, 2);
        // look for row with the editing class added
        const editRowsAfterDblClick = ReactDOM.findDOMNode(parent).querySelectorAll(".ag-body-container .ag-row.editing");
        expect(editRowsAfterDblClick.length).toBe(1);
        expect(callBacks.onEditRecordStart).toHaveBeenCalled();

        // find the field cells in the last row
        const lastRowColumnCells = ReactDOM.findDOMNode(parent).querySelectorAll(".ag-body-container .ag-row:last-child .gridCell");
        expect(lastRowColumnCells.length).toBe(fakeReportData_before.data.columns.length);

        // select the 2nd row
        firstCell = lastRowColumnCells[0].parentElement;
        mouseclick(firstCell, 2);
        // look for row with the editing class added
        const editRowsAfterSecondDblClick = ReactDOM.findDOMNode(parent).querySelectorAll(".ag-body-container .ag-row.editing");
        expect(editRowsAfterSecondDblClick.length).toBe(1);

        // make sure it's a different row
        expect(editRowsAfterDblClick).not.toBe(editRowsAfterSecondDblClick);

        // find the cell editors ag-grid has added
        const cellEditors = ReactDOM.findDOMNode(parent).querySelectorAll(".ag-body-container .ag-row.editing .cellEditWrapper");
        expect(cellEditors.length).toBe(fakeReportData_before.data.columns.length);

        // tab out of the last column
        TestUtils.Simulate.keyDown(cellEditors[fakeReportData_before.data.columns.length - 1], {key : "Tab"});
        const editRowsTabbingOutOfLast = ReactDOM.findDOMNode(parent).querySelectorAll(".ag-body-container .ag-row.editing");

        // make sure we have a different edit row
        expect(editRowsTabbingOutOfLast.length).toBe(1);
        expect(editRowsTabbingOutOfLast).not.toBe(editRowsAfterSecondDblClick);
    });
});
