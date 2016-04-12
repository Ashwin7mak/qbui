import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import AGGrid  from '../../src/components/dataTable/agGrid/agGrid';
import AGGridReact from 'ag-grid-react';
import Loader  from 'react-loader';
import * as query from '../../src/constants/query';

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

let flux = {
    actions: {
        getFilteredRecords: function() {
            return;
        }
    }
};

const fakeReportData_loading = {
    loading: true
};

const fakeReportData_empty = {
    data: {
        name: "",
        records: [],
        columns: []
    }
};

const fakeReportData_before = {
    data: {
        records: [{
            col_num: 1,
            col_text: "abc",
            col_date: "01-01-2015"
        }],
        columns: [
            {
                id: "1",
                field: "col_num",
                headerName: "col_num",
                datatypeAttributes: {type:"NUMERIC"}
            },
            {
                id:"2",
                field: "col_text",
                headerName: "col_text",
                datatypeAttributes: {type:"TEXT"}
            },
            {
                id:"3",
                field: "col_date",
                headerName: "col_date",
                datatypeAttributes: {type:"DATE"}
            }]
    }
};
const fakeReportData_after = {
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



describe('AGGrid functions', () => {
    'use strict';

    var component;

    beforeEach(() => {
        AGGrid.__Rewire__('AgGridReact', AGGridMock);
        AGGrid.__Rewire__('I18nMessage', I18nMessageMock);
        spyOn(flux.actions, 'getFilteredRecords');
    });

    afterEach(() => {
        AGGrid.__ResetDependency__('AgGridReact');
        AGGrid.__ResetDependency__('I18nMessage');
        flux.actions.getFilteredRecords.calls.reset();
    });

    it('test render of component', () => {
        component = TestUtils.renderIntoDocument(<AGGrid actions={TableActionsMock} records={fakeReportData_empty.data.records} columns={fakeReportData_empty.data.columns} flux={flux}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });


    it('test render of loader', () => {
        component = TestUtils.renderIntoDocument(<AGGrid actions={TableActionsMock}   loading={fakeReportData_loading} flux={flux}/>);
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
        expect(rowsSelected).toEqual(fakeReportData_before.data.records.length);
    });
    it('renders column menu', () => {
        AGGrid.__ResetDependency__('AgGridReact');
        component = TestUtils.renderIntoDocument(<AGGrid actions={TableActionsMock}
                                                         records={fakeReportData_before.data.records}
                                                         columns={fakeReportData_before.data.columns} flux={flux}
                                                         loading={false}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let gridElement = TestUtils.scryRenderedDOMComponentsWithClass(component, "agGrid");
        let menuButton = gridElement[0].getElementsByClassName("ag-header-cell-menu-button");
        menuButton[0].click();
        let menu = gridElement[0].getElementsByClassName("ag-menu");
        expect(menu.length).toEqual(1);
    });
    it('sorts asc from menu', () => {
        AGGrid.__ResetDependency__('AgGridReact');
        component = TestUtils.renderIntoDocument(<AGGrid appId="1" tblId="2" rptId="3" actions={TableActionsMock}
                                                         records={fakeReportData_before.data.records}
                                                         columns={fakeReportData_before.data.columns} flux={flux}
                                                         loading={false}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let gridElement = TestUtils.scryRenderedDOMComponentsWithClass(component, "agGrid");
        let menuButton = gridElement[0].getElementsByClassName("ag-header-cell-menu-button");
        menuButton[0].click();
        let menu = gridElement[0].getElementsByClassName("ag-menu");
        expect(menu.length).toEqual(1);
        let sortAscOption = menu[0].getElementsByClassName("ag-menu-option-text");
        sortAscOption[0].click();
        let queryParams = {};
        queryParams[query.SORT_LIST_PARAM] = fakeReportData_before.data.columns[0].id;
        expect(flux.actions.getFilteredRecords).toHaveBeenCalledWith("1", "2", "3", true, undefined, queryParams);
    });
    it('sorts desc from menu', () => {
        AGGrid.__ResetDependency__('AgGridReact');
        component = TestUtils.renderIntoDocument(<AGGrid appId="1" tblId="2" rptId="3" actions={TableActionsMock}
                                                         records={fakeReportData_before.data.records}
                                                         columns={fakeReportData_before.data.columns} flux={flux}
                                                         loading={false}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let gridElement = TestUtils.scryRenderedDOMComponentsWithClass(component, "agGrid");
        let menuButton = gridElement[0].getElementsByClassName("ag-header-cell-menu-button");
        menuButton[0].click();
        let menu = gridElement[0].getElementsByClassName("ag-menu");
        expect(menu.length).toEqual(1);
        let sortDescOption = menu[0].getElementsByClassName("ag-menu-option-text");
        sortDescOption[1].click();
        let queryParams = {};
        queryParams[query.SORT_LIST_PARAM] = "-" + fakeReportData_before.data.columns[0].id;
        expect(flux.actions.getFilteredRecords).toHaveBeenCalledWith("1", "2", "3", true, undefined, queryParams);
    });
    it('overrides existing sort from menu', () => {
        AGGrid.__ResetDependency__('AgGridReact');
        component = TestUtils.renderIntoDocument(<AGGrid appId="1" tblId="2" rptId="3" actions={TableActionsMock}
                                                         records={fakeReportData_before.data.records}
                                                         columns={fakeReportData_before.data.columns} flux={flux}
                                                         loading={false} sortFids={[6, 7]} groupFids={[10, 11]}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let gridElement = TestUtils.scryRenderedDOMComponentsWithClass(component, "agGrid");
        let menuButton = gridElement[0].getElementsByClassName("ag-header-cell-menu-button");
        menuButton[0].click();
        let menu = gridElement[0].getElementsByClassName("ag-menu");
        expect(menu.length).toEqual(1);
        let sortAscOption = menu[0].getElementsByClassName("ag-menu-option-text");
        sortAscOption[0].click();
        let queryParams = {};
        queryParams[query.SORT_LIST_PARAM] = "10.11." + fakeReportData_before.data.columns[0].id;
        expect(flux.actions.getFilteredRecords).toHaveBeenCalledWith("1", "2", "3", true, undefined, queryParams);
    });
    it('sort a sorted column from menu', () => {
        AGGrid.__ResetDependency__('AgGridReact');
        component = TestUtils.renderIntoDocument(<AGGrid appId="1" tblId="2" rptId="3" actions={TableActionsMock}
                                                         records={fakeReportData_before.data.records}
                                                         columns={fakeReportData_before.data.columns} flux={flux}
                                                         loading={false}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let gridElement = TestUtils.scryRenderedDOMComponentsWithClass(component, "agGrid");
        let menuButton = gridElement[0].getElementsByClassName("ag-header-cell-menu-button");
        menuButton[0].click();
        let menu = gridElement[0].getElementsByClassName("ag-menu");
        expect(menu.length).toEqual(1);
        let sortAscOption = menu[0].getElementsByClassName("ag-menu-option-text");
        sortAscOption[0].click();
        expect(flux.actions.getFilteredRecords).toHaveBeenCalled();
        menuButton = gridElement[0].getElementsByClassName("ag-header-cell-menu-button");
        menuButton[0].click();
        menu = gridElement[0].getElementsByClassName("ag-menu");
        sortAscOption = menu[0].getElementsByClassName("ag-menu-option-text");
        sortAscOption[0].click();
        expect(flux.actions.getFilteredRecords).not.toHaveBeenCalled();
    });
    it('groups asc from menu', () => {
        AGGrid.__ResetDependency__('AgGridReact');
        component = TestUtils.renderIntoDocument(<AGGrid appId="1" tblId="2" rptId="3" actions={TableActionsMock}
                                                         records={fakeReportData_before.data.records}
                                                         columns={fakeReportData_before.data.columns} flux={flux}
                                                         loading={false}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let gridElement = TestUtils.scryRenderedDOMComponentsWithClass(component, "agGrid");
        let menuButton = gridElement[0].getElementsByClassName("ag-header-cell-menu-button");
        menuButton[0].click();
        let menu = gridElement[0].getElementsByClassName("ag-menu");
        expect(menu.length).toEqual(1);
        let groupAscOption = menu[0].getElementsByClassName("ag-menu-option-text");
        groupAscOption[2].click();
        let queryParams = {};
        queryParams[query.SORT_LIST_PARAM] = fakeReportData_before.data.columns[0].id;
        expect(flux.actions.getFilteredRecords).toHaveBeenCalledWith("1", "2", "3", true, undefined, queryParams);
    });
    it('groups desc from menu', () => {
        AGGrid.__ResetDependency__('AgGridReact');
        component = TestUtils.renderIntoDocument(<AGGrid appId="1" tblId="2" rptId="3" actions={TableActionsMock}
                                                         records={fakeReportData_before.data.records}
                                                         columns={fakeReportData_before.data.columns} flux={flux}
                                                         loading={false}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let gridElement = TestUtils.scryRenderedDOMComponentsWithClass(component, "agGrid");
        let menuButton = gridElement[0].getElementsByClassName("ag-header-cell-menu-button");
        menuButton[0].click();
        let menu = gridElement[0].getElementsByClassName("ag-menu");
        expect(menu.length).toEqual(1);
        let groupDescOption = menu[0].getElementsByClassName("ag-menu-option-text");
        groupDescOption[3].click();
        let queryParams = {};
        queryParams[query.SORT_LIST_PARAM] = "-" + fakeReportData_before.data.columns[0].id;
        expect(flux.actions.getFilteredRecords).toHaveBeenCalledWith("1", "2", "3", true, undefined, queryParams);
    });
    it('overrides existing grouping from menu', () => {
        AGGrid.__ResetDependency__('AgGridReact');
        component = TestUtils.renderIntoDocument(<AGGrid appId="1" tblId="2" rptId="3" actions={TableActionsMock}
                                                         records={fakeReportData_before.data.records}
                                                         columns={fakeReportData_before.data.columns} flux={flux}
                                                         loading={false} sortFids={[6, 7]} groupFids={[10, 11]}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let gridElement = TestUtils.scryRenderedDOMComponentsWithClass(component, "agGrid");
        let menuButton = gridElement[0].getElementsByClassName("ag-header-cell-menu-button");
        menuButton[0].click();
        let menu = gridElement[0].getElementsByClassName("ag-menu");
        expect(menu.length).toEqual(1);
        let groupAscOption = menu[0].getElementsByClassName("ag-menu-option-text");
        groupAscOption[2].click();
        let queryParams = {};
        queryParams[query.SORT_LIST_PARAM] = fakeReportData_before.data.columns[0].id + ".6.7";
        expect(flux.actions.getFilteredRecords).toHaveBeenCalledWith("1", "2", "3", true, undefined, queryParams);
    });
});

