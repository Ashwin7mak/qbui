import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import QBGrid  from '../../src/components/dataTable/qbGrid/qbGrid';

import CellValueRenderer from '../../src/components/dataTable/agGrid/cellValueRenderer';

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


const fakeReportData_after = {
    loading: false,
    data: {
        records: [
            {
                "Record ID#":  {id: 1, value: 2, display: "2"},
                "Text Field": {id: 2, value: "xyz", display: "xyz"},
                "Numeric Field": {id: 3, value: 123, display: "123"}
            }
        ],
        columns: [
            {
                id: 1,
                field: "Record ID#",
                headerName: "Record ID#",
                datatypeAttributes: {type:"NUMERIC"}
            },
            {
                id: 2,
                field: "Text Field",
                headerName: "Text Field",
                datatypeAttributes: {type:"TEXT"}
            },
            {
                id: 3,
                field: "Numeric Field",
                headerName: "Numeric Field",
                datatypeAttributes: {type:"NUMERIC"}
            }]
    }
};


describe('QbGrid functions', () => {
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
        CellValueRenderer.__Rewire__('I18nNumber', I18nMessageMock);
        spyOn(flux.actions, 'getFilteredRecords');
        spyOn(flux.actions, 'rowClicked');

    });

    afterEach(() => {
        CellValueRenderer.__ResetDependency__('I18nNumber');
        flux.actions.getFilteredRecords.calls.reset();
        flux.actions.rowClicked.calls.reset();
    });

    it('test render of component', () => {
        component = TestUtils.renderIntoDocument(
            <QBGrid actions={TableActionsMock}
                    records={fakeReportData_empty.data.records}
                    columns={fakeReportData_empty.data.columns}
                    flux={flux}/>
        );
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        let gridElement = TestUtils.scryRenderedDOMComponentsWithClass(component, "qbGrid");
        expect(gridElement.length).toEqual(1);

    });

    it('test render of component with record data', (done) => {

        let didRowClick = false;
        let TestParent = React.createFactory(React.createClass({
            getInitialState() {
                return {records: fakeReportData_after.data.records, columns: fakeReportData_after.data.columns};
            },
            render() {
                return (
                    <div className="reportContent">
                        <QBGrid ref="qbGrid"
                                actions={TableActionsMock}
                                records={this.state.records}
                                columns={this.state.columns}
                                onRowClick={()=>{didRowClick = true;}}
                                uniqueIdentifier="Record ID#"
                                keyField="Record ID#"
                                sortFids={[1]}
                                flux={flux}/>;
                    </div>);
            }
        }));

        let parent = TestUtils.renderIntoDocument(TestParent());

        let gridElement = parent.refs.qbGrid;
        let selectAllCheckbox = ReactDOM.findDOMNode(gridElement).getElementsByClassName("selectAllCheckbox");
        expect(selectAllCheckbox.length).toEqual(1);

        // select all
        TestUtils.Simulate.change(selectAllCheckbox[0], {"target": {"checked": true}});

        // deselect all
        TestUtils.Simulate.change(selectAllCheckbox[0], {"target": {"checked": false}});

        let checkboxes = ReactDOM.findDOMNode(gridElement).querySelectorAll(".actionsCol input[type=checkbox]");
        expect(checkboxes.length).toBe(1);
        // select a row
        TestUtils.Simulate.change(checkboxes[0], {"target": {"checked": true}});

        let rows = ReactDOM.findDOMNode(gridElement).getElementsByTagName("TR");

        expect(rows.length).toBe(fakeReportData_after.data.records.length + 1);
        // select a row via double click on the 1st cell

        let cells = ReactDOM.findDOMNode(gridElement).getElementsByClassName("cellWrapper");
        expect(cells.length).toBeGreaterThan(1);

        // single click to drill down
        TestUtils.Simulate.click(cells[0]);

        window.setTimeout(function() {
            expect(didRowClick).toBe(true);
            done();
        }, 500);
    });

    it('test qbGrid column menus', () => {

        let TestParent = React.createFactory(React.createClass({
            getInitialState() {
                return {records: fakeReportData_after.data.records, columns: fakeReportData_after.data.columns};
            },
            render() {
                return (
                    <div className="reportContent">
                        <QBGrid ref="qbGrid"
                                actions={TableActionsMock}
                                records={this.state.records}
                                columns={this.state.columns}
                                uniqueIdentifier="Record ID#"
                                keyField="Record ID#"
                                onEditRecordStart={()=>{}}
                                flux={flux} />;
                    </div>);
            }
        }));

        let parent = TestUtils.renderIntoDocument(TestParent());

        let gridElement = parent.refs.qbGrid;

        let dropdowns = ReactDOM.findDOMNode(gridElement).querySelectorAll(".headerCell .dropdown");
        expect(dropdowns.length).toBe(fakeReportData_after.data.columns.length);

        for (let i = 0; i < dropdowns.length; i++) {
            TestUtils.Simulate.click(dropdowns[0]);

            let menuItems = dropdowns[i].querySelectorAll("a[role=menuitem]");
            expect(menuItems.length).toBeGreaterThan(1);

            TestUtils.Simulate.click(menuItems[0]);
            TestUtils.Simulate.click(menuItems[1]);
        }

        let cells = ReactDOM.findDOMNode(gridElement).getElementsByClassName("cellWrapper");
        expect(cells.length).toBeGreaterThan(1);

        // double click to edit row
        TestUtils.Simulate.click(cells[cells.length - 1], {detail: 2});

        // tab out of the first input editor
        let inputs = ReactDOM.findDOMNode(gridElement).getElementsByClassName("cellEdit");
        expect(inputs.length).toBeGreaterThan(1);
        TestUtils.Simulate.keyDown(inputs[inputs.length - 1], {key : "Tab"});
    });

});
