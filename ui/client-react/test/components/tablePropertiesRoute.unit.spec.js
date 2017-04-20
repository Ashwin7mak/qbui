import React from 'react';
import TestUtils, {Simulate} from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import Fluxxor from 'fluxxor';
import {TablePropertiesRoute, __RewireAPI__ as TablePropertiesRouteRewireAPI}  from '../../src/components/table/settings/tablePropertiesRoute';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {Provider} from "react-redux";
import Promise from 'bluebird';
import _ from 'lodash';

const sampleTable = {id: 'table1', name: 'table1 name'};
const sampleApp = {id: 'app1', tables: [sampleTable]};
const sampleTableProperties = {iconChooserOpen: false,
    savingTable: false,
    tableInfo: {
        name: {value: 'Customers'},
        tableNoun: {value: 'customer'},
        description: {value: ''},
        tableIcon: {value: 'projects'}
    },
    isDirty: false,
    editing: null
};
const flux = {
    actions:{
        updateTableProps: () => {return;}
    }
};

const props = {
    app: sampleApp,
    table: sampleTable,
    tableProperties: sampleTableProperties,
    updateTable: () => {return Promise.resolve({});},
    loadTableProperties: () => {},
    setTableProperty: () => {},
    closeIconChooser: () => {},
    setEditingProperty: () => {},
    resetEditedTableProperties: () => {},
    deleteTable: () => {return Promise.resolve({});},
    flux: flux
};

describe('TablePropertiesRoute functions', () => {
    'use strict';
    let component;
    const middlewares = [thunk];

    const TableCreationPanelMock = React.createClass({
        render() {
            return <div className="table-creation-panel-mock" />;
        }
    });
    describe('TablePropertiesRoute', () => {
        beforeEach(() => {
            TablePropertiesRouteRewireAPI.__Rewire__('TableCreationPanel', TableCreationPanelMock);
            component = TestUtils.renderIntoDocument(<TablePropertiesRoute {...props}/>);
        });

        afterEach(() => {
            TablePropertiesRouteRewireAPI.__ResetDependency__('TableCreationPanel');
        });

        it('test render of component with null props', () => {
            expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        });

        it('test render of component with non null props', () => {
            expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        });

        it('test render of table creation panel', () => {
            expect(TestUtils.scryRenderedComponentsWithType(component, TableCreationPanelMock).length).toEqual(1);
        });

        it('test buttons are not rendered if form is not dirty', () => {
            let buttonsPanel = TestUtils.scryRenderedDOMComponentsWithClass(component, "tableInfoButtons");
            expect(buttonsPanel.length).toEqual(1);
            expect(buttonsPanel[0].className.indexOf("closed") !== -1).toBe(true);
        });

        it('test buttons are not rendered if form is dirty', () => {
            let newProps = _.clone(props);
            newProps.tableProperties.isDirty = true;
            component = TestUtils.renderIntoDocument(<TablePropertiesRoute {...newProps}/>);
            let buttonsPanel = TestUtils.scryRenderedDOMComponentsWithClass(component, "tableInfoButtons");
            expect(buttonsPanel.length).toEqual(1);
            expect(buttonsPanel[0].className.indexOf("open") !== -1).toBe(true);
        });

        xit('test render of delete icon on page bar', () => {
            expect(TestUtils.scryRenderedDOMComponentsWithClass(component, "deleteTable").length).toEqual(1);
        });
    });

    describe('TablePropertiesRoute actions', () =>{
        beforeEach(() =>{
            TablePropertiesRouteRewireAPI.__Rewire__('TableCreationPanel', TableCreationPanelMock);
            spyOn(props, 'updateTable').and.callThrough();
            spyOn(props, 'loadTableProperties').and.callThrough();
            spyOn(props, 'resetEditedTableProperties').and.callThrough();
            component = TestUtils.renderIntoDocument(<TablePropertiesRoute {...props}/>);
        });

        afterEach(() =>{
            TablePropertiesRouteRewireAPI.__ResetDependency__('TableCreationPanel');
            props.updateTable.calls.reset();
            props.loadTableProperties.calls.reset();
            props.resetEditedTableProperties.calls.reset();
        });

        it('test loadTableProperties is called', () => {
            expect(props.loadTableProperties).toHaveBeenCalledWith(sampleTable);
        });

        it('test calls update on clicking apply button', () => {
            let newProps = _.clone(props);
            newProps.tableProperties.isDirty = true;
            component = TestUtils.renderIntoDocument(<TablePropertiesRoute {...newProps}/>);
            let buttonsPanel = TestUtils.scryRenderedDOMComponentsWithClass(component, "tableInfoButtons");
            let applyButton = buttonsPanel[0].querySelectorAll('.primaryButton');
            Simulate.click(applyButton[0]);
            expect(props.updateTable).toHaveBeenCalled();
        });

        it('test calls reset on clicking reset button', () => {
            let newProps = _.clone(props);
            newProps.tableProperties.isDirty = true;
            component = TestUtils.renderIntoDocument(<TablePropertiesRoute {...newProps}/>);
            let buttonsPanel = TestUtils.scryRenderedDOMComponentsWithClass(component, "tableInfoButtons");
            let resetButton = buttonsPanel[0].querySelectorAll('.secondaryButton');
            Simulate.click(resetButton[0]);
            expect(props.resetEditedTableProperties).toHaveBeenCalled();
        });

        xit('test clicking on delete icon calls delete table', () => {
            let deleteTableIcon = TestUtils.scryRenderedDOMComponentsWithClass(component, "deleteTable")[0];
            Simulate.click(deleteTableIcon);
        });
    });
});
