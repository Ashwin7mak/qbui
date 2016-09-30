import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import AGGrid  from '../../src/components/dataTable/agGrid/agGrid';
import AGGridReact from 'ag-grid-react';

import {__RewireAPI__ as NumberFieldValueRendererRewire}  from '../../src/components/fields/fieldValueRenderers';

import Loader  from 'react-loader';
import * as query from '../../src/constants/query';
import Locale from '../../src/locales/locales';

import DEFAULT_RECORD_KEY_ID from '../../src/constants/schema';

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
                fieldDef: {datatypeAttributes: {type:"TEXT"}}
            },
            {
                id: 2,
                field: "col_num",
                headerName: "col_num",
                fieldDef: {datatypeAttributes: {type:"NUMERIC"}}
            },
            {
                // Skip 3 because that ID is reserved for Record ID#
                id:4,
                field: "col_date",
                headerName: "col_date",
                fieldDef: {datatypeAttributes: {type:"DATE"}}
            },
            {
                id:5,
                field: "col_checkbox",
                headerName: "col_check",
                fieldDef: {datatypeAttributes: {type:"CHECKBOX"}}
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
                fieldDef: {datatypeAttributes: {type:"NUMERIC"}}
            },
            {
                id: 2,
                field: "col_text1",
                headerName: "col_text",
                fieldDef: {datatypeAttributes: {type:"TEXT"}}
            },
            {
                id: 3,
                field: "col_date1",
                headerName: "col_date",
                fieldDef: {datatypeAttributes: {type:"DATE"}}
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

function getUneditableFieldTestData(options) {
    // Add uneditable row to the data
    let testData = Object.assign({}, fakeReportData_before);

    // Remove checkboxes because they cause extra inputs and it messes up the count unexpectedly
    delete testData.data.records[0].col_checkbox;
    delete testData.data.records[1].col_checkbox;
    testData.data.columns.splice(3, 1);

    // Add uneditable data or a record ID field
    testData.data.records[0].col_record_id = {
        id: 6,
        value: 100,
        display: "100"
    };
    testData.data.columns.push({
        id: (options.recordId ? 3 : 6),
        field: 'Record ID#',
        headerName: "record_id",
        fieldDef: {datatypeAttributes: {type:"NUMERIC"}},
        userEditableValue: options.userEditableValue
    });

    return testData;
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
        NumberFieldValueRendererRewire.__Rewire__('I18nNumber', I18nMessageMock);
        spyOn(flux.actions, 'getFilteredRecords');
        spyOn(flux.actions, 'rowClicked');

    });

    afterEach(() => {
        AGGrid.__ResetDependency__('I18nMessage');
        NumberFieldValueRendererRewire.__ResetDependency__('I18nNumber');
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
            return col.fieldDef.datatypeAttributes.type === "NUMERIC";
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
            return col.fieldDef.datatypeAttributes.type === "TEXT";
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

        let dateColIndex = _.findIndex(fakeReportData_before.data.columns, function(col) {
            return col.fieldDef.datatypeAttributes.type === "DATE";
        });

        let gridElement = TestUtils.scryRenderedDOMComponentsWithClass(component, "agGrid");
        let menuButtons = ReactDOM.findDOMNode(gridElement[0]).querySelectorAll(".ag-header button.dropdownToggle");
        expect(menuButtons.length).toEqual(fakeReportData_before.data.columns.length);
        TestUtils.Simulate.click(menuButtons[dateColIndex]);
        let menu = gridElement[0].getElementsByClassName("dropdown-menu");
        expect(menu.length).toBeGreaterThan(1);
        let menuoptions = menu[dateColIndex].querySelectorAll("a:last-child"); // find the menu item text
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

        let checkColIndex = _.findIndex(fakeReportData_before.data.columns, function(col) {
            return col.fieldDef.datatypeAttributes.type === "CHECKBOX";
        });

        let gridElement = TestUtils.scryRenderedDOMComponentsWithClass(component, "agGrid");
        let menuButtons = ReactDOM.findDOMNode(gridElement[0]).querySelectorAll(".ag-header button.dropdownToggle");
        expect(menuButtons.length).toEqual(fakeReportData_before.data.columns.length);
        TestUtils.Simulate.click(menuButtons[checkColIndex]);
        let menu = gridElement[0].getElementsByClassName("dropdown-menu");
        expect(menu.length).toBeGreaterThan(1);
        let menuoptions = menu[checkColIndex].querySelectorAll("a:last-child"); // find the menu item text
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

    it('does not have input boxes for uneditable fields', () => {
        let dataWithUneditableField = getUneditableFieldTestData({userEditableValue: false, recordId: false});

        let callBacks = {
            onEditRecordStart: function() {
            },
        };
        const TestParent = React.createFactory(React.createClass({
            // wrap the grid in a container with styles needed to render editing UI
            render() {
                return (<div className="reportToolsAndContentContainer singleSelection">
                        <AGGrid ref="grid"
                                flux={flux}
                                keyField="col_record_id"
                                uniqueIdentifier="col_record_id"
                                onEditRecordStart={callBacks.onEditRecordStart}
                                actions={TableActionsMock}
                                records={dataWithUneditableField.data.records}
                                columns={dataWithUneditableField.data.columns}
                                loading={false}
                                />
                </div>);
            }
        }));

        // Start editing the row
        const parent = TestUtils.renderIntoDocument(TestParent());
        let columnCells = ReactDOM.findDOMNode(parent).querySelectorAll(".ag-body-container .ag-row:first-child .gridCell");
        let firstCell = columnCells[0].parentElement;
        mouseclick(firstCell, 2);

        // There should only inputs for editable cells
        let editableCellInputs = ReactDOM.findDOMNode(parent).querySelectorAll(".ag-body-container .ag-row.editing input");
        expect(editableCellInputs.length).toBe(dataWithUneditableField.data.columns.length - 1);
    });

    it('does not show input fields for record id cells', () => {
        // Add uneditable row to the data
        let dataWithRecordIdField = getUneditableFieldTestData({userEditableValue: true, recordId: true});

        let callBacks = {
            onEditRecordStart: function() {
            },
        };
        const TestParent = React.createFactory(React.createClass({
            // wrap the grid in a container with styles needed to render editing UI
            render() {
                return (<div className="reportToolsAndContentContainer singleSelection">
                        <AGGrid ref="grid"
                                flux={flux}
                                keyField="col_record_id"
                                uniqueIdentifier="col_record_id"
                                onEditRecordStart={callBacks.onEditRecordStart}
                                actions={TableActionsMock}
                                records={dataWithRecordIdField.data.records}
                                columns={dataWithRecordIdField.data.columns}
                                loading={false}
                                />
                </div>);
            }
        }));

        // Start editing the row
        const parent = TestUtils.renderIntoDocument(TestParent());
        let columnCells = ReactDOM.findDOMNode(parent).querySelectorAll(".ag-body-container .ag-row:first-child .gridCell");
        let firstCell = columnCells[0].parentElement;
        mouseclick(firstCell, 2);

        // There should only inputs for editable cells
        let editableCellInputs = ReactDOM.findDOMNode(parent).querySelectorAll(".ag-body-container .ag-row.editing input");
        expect(editableCellInputs.length).toBe(dataWithRecordIdField.data.columns.length - 1);
    });

    it('allows editing of a cell even if the Record ID column name has been changed', () => {
        AGGrid.__ResetDependency__('AgGridReact');
        let callBacks = {
            onEditRecordStart: function() {
            },
        };
        spyOn(callBacks, 'onEditRecordStart');

        let testData = Object.assign({}, fakeReportData_before);
        testData.data.columns.push({
            id: 3,
            field: 'Employee ID',
            headerName: 'employee_id',
            fieldDef: {datatypeAttributes: {type: 'Numeric'}},
            userEditableValue: false
        });
        testData.data.records[0].col_record_id = {
            id: 6,
            value: 8,
            display: '8'
        };

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
                                records={testData.data.records}
                                columns={testData.data.columns}
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
    });
});
