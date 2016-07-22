import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import QBGrid  from '../../src/components/dataTable/qbGrid/qbGrid';

import CellValueRenderers from '../../src/components/dataTable/agGrid/cellValueRenderers';

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

function mouseclick(element, clickCount = 1) {
    // create a mouse click event
    var event = document.createEvent('MouseEvents');
    event.initMouseEvent('click', true, true, window, clickCount, 0, 0);

    // send click to element
    element.dispatchEvent(event);
}

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
        CellValueRenderers.__Rewire__('I18nNumber', I18nMessageMock);
        spyOn(flux.actions, 'getFilteredRecords');
        spyOn(flux.actions, 'rowClicked');

    });

    afterEach(() => {
        CellValueRenderers.__ResetDependency__('I18nNumber');
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
                                flux={flux} />;
                    </div>);
            }
        }));

        let parent = TestUtils.renderIntoDocument(TestParent());

        let gridElement = parent.refs.qbGrid;
        let selectAllCheckbox = gridElement.getDOMNode().getElementsByClassName("selectAllCheckbox");
        expect(selectAllCheckbox.length).toEqual(1);

        // select all
        TestUtils.Simulate.change(selectAllCheckbox[0], {"target": {"checked": true}});

        // deselect all
        TestUtils.Simulate.change(selectAllCheckbox[0], {"target": {"checked": false}});

        let checkboxes = gridElement.getDOMNode().querySelectorAll(".actionsCol input[type=checkbox]");
        expect(checkboxes.length).toBe(1);
        // select a row
        TestUtils.Simulate.change(checkboxes[0], {"target": {"checked": true}});

        let rows = gridElement.getDOMNode().getElementsByTagName("TR");

        expect(rows.length).toBe(fakeReportData_after.data.records.length + 1);
        // select a row via double click on the 1st cell

        let cells = gridElement.getDOMNode().getElementsByClassName("multiLineTextCell");
        expect(cells.length).toBe(1);

        // double click to edit row
        mouseclick(cells[0], 2);

        // single click to drill down
        TestUtils.Simulate.click(cells[0]);
        window.setTimeout(function() {
            expect(didRowClick).toBe(true);
            done();
        }, 900);
    });


});
