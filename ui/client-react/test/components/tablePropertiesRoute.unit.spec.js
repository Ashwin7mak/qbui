import React from 'react';
import TestUtils, {Simulate} from 'react-addons-test-utils';
import {TablePropertiesRoute, __RewireAPI__ as TablePropertiesRouteRewireAPI}  from '../../src/components/table/settings/tablePropertiesRoute';
import thunk from 'redux-thunk';
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
    editing: null
};

const props = {
    app: sampleApp,
    table: sampleTable,
    tableProperties: sampleTableProperties,
    isDirty: false,
    updateTable: () => {return Promise.resolve({});},
    loadTableProperties: () => {},
    setTableProperty: () => {},
    closeIconChooser: () => {},
    setEditingProperty: () => {},
    resetEditedTableProperties: () => {},
    deleteTable: () => {return Promise.resolve({});},
    notifyTableDeleted: () => {},
    updateAppTableProperties: () => {}
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

        it('test buttons are disabled if form is not dirty', () => {
            let buttonsPanel = TestUtils.scryRenderedDOMComponentsWithClass(component, "tableInfoButtons");
            expect(buttonsPanel.length).toEqual(1);

            let buttons = buttonsPanel[0].querySelectorAll("button[disabled]");
            expect(buttons.length).toBe(2);
        });

        it('test buttons are enabled if form is dirty', () => {
            let newProps = _.clone(props);
            newProps.isDirty = true;
            component = TestUtils.renderIntoDocument(<TablePropertiesRoute {...newProps}/>);
            let buttonsPanel = TestUtils.scryRenderedDOMComponentsWithClass(component, "tableInfoButtons");
            expect(buttonsPanel.length).toEqual(1);
            let buttons = buttonsPanel[0].querySelectorAll("button:not([disabled])");
            expect(buttons.length).toBe(2);
        });

        it('test render of delete icon on page bar', () => {
            expect(TestUtils.scryRenderedDOMComponentsWithClass(component, "deleteTable").length).toEqual(1);
        });

        it('test clicking on delete icon sets the state to open the modal', () => {
            let deleteTableIcon = TestUtils.scryRenderedDOMComponentsWithClass(component, "deleteTable")[0];
            Simulate.mouseDown(deleteTableIcon);
            //confirm that the state was updated that is supposed to throw up the Modal
            expect(component.state.confirmDeletesDialogOpen).toBe(true);
        });

        it('test clicking on cancel button of modal resets the state', () => {
            let deleteTableIcon = TestUtils.scryRenderedDOMComponentsWithClass(component, "deleteTable")[0];
            Simulate.mouseDown(deleteTableIcon);
            //confirm that the state was updated that is supposed to throw up the Modal
            expect(component.state.confirmDeletesDialogOpen).toBe(true);
            component.cancelTableDelete();
            expect(component.state.confirmDeletesDialogOpen).toBe(false);
        });
    });

    describe('TablePropertiesRoute actions', () =>{
        beforeEach(() =>{
            TablePropertiesRouteRewireAPI.__Rewire__('TableCreationPanel', TableCreationPanelMock);
            spyOn(props, 'updateTable').and.callThrough();
            spyOn(props, 'loadTableProperties').and.callThrough();
            spyOn(props, 'resetEditedTableProperties').and.callThrough();
            spyOn(props, 'deleteTable').and.callThrough();
            spyOn(props, 'updateAppTableProperties').and.callThrough();
            component = TestUtils.renderIntoDocument(<TablePropertiesRoute {...props}/>);
        });

        afterEach(() =>{
            TablePropertiesRouteRewireAPI.__ResetDependency__('TableCreationPanel');
            props.updateTable.calls.reset();
            props.loadTableProperties.calls.reset();
            props.resetEditedTableProperties.calls.reset();
            props.deleteTable.calls.reset();
            props.updateAppTableProperties.calls.reset();
        });

        it('test loadTableProperties is called', () => {
            expect(props.loadTableProperties).toHaveBeenCalledWith(sampleTable);
        });

        it('test calls update on clicking apply button', () => {
            let newProps = _.clone(props);
            newProps.isDirty = true;
            component = TestUtils.renderIntoDocument(<TablePropertiesRoute {...newProps}/>);
            let buttonsPanel = TestUtils.scryRenderedDOMComponentsWithClass(component, "tableInfoButtons");
            let applyButton = buttonsPanel[0].querySelectorAll('.primaryButton');
            Simulate.click(applyButton[0]);
            expect(props.updateTable).toHaveBeenCalled();
        });

        it('test calls reset on clicking reset button', () => {
            let newProps = _.clone(props);
            newProps.isDirty = true;
            component = TestUtils.renderIntoDocument(<TablePropertiesRoute {...newProps}/>);
            let buttonsPanel = TestUtils.scryRenderedDOMComponentsWithClass(component, "tableInfoButtons");
            let resetButton = buttonsPanel[0].querySelectorAll('.secondaryButton');
            Simulate.click(resetButton[0]);
            expect(props.resetEditedTableProperties).toHaveBeenCalled();
        });

        it('test calls delete api when Delete button is clicked', () => {
            component.handleTableDelete();
            expect(props.deleteTable).toHaveBeenCalled();
        });


    });
});
