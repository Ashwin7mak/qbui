import React from 'react';
import {mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import TableCreationPanel from '../../src/components/table/tableCreationPanel';
import {Simulate} from 'react-addons-test-utils';

let component;

let tableInfo = {
    name: {value: 'Customers'},
    tableNoun: {value: 'customer'},
    description: {value: ''},
    tableIcon: {value: 'projects'}
};

let appTables = [
    {name: 'table1'},
    {name: 'table2'}
];

const mockParentFunctions = {
    tableMenuOpened() {},
    tableMenuClosed() {},
    setTableProperty() {},
    setEditingProperty() {},
};

describe('TableCreationPanel', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('renders a TableCreationPanel', () => {
        component = mount(<TableCreationPanel tableInfo={tableInfo}
                            tableMenuOpened={mockParentFunctions.tableMenuOpened}
                            tableMenuClosed={mockParentFunctions.tableMenuClosed}
                            setTableProperty={mockParentFunctions.setTableProperty}
                            setEditingProperty={mockParentFunctions.setEditingProperty}
                            focusOn="name"
                            validate={true}
                            appTables={appTables} />);

        expect(component.find('.tableInfo')).toBePresent();
    });

    it('calls tableMenu callbacks when necessary', () => {
        spyOn(mockParentFunctions, 'tableMenuOpened');
        spyOn(mockParentFunctions, 'tableMenuClosed');
        component = mount(<TableCreationPanel tableInfo={tableInfo}
                                              tableMenuOpened={mockParentFunctions.tableMenuOpened}
                                              tableMenuClosed={mockParentFunctions.tableMenuClosed}
                                              setTableProperty={mockParentFunctions.setTableProperty}
                                              setEditingProperty={mockParentFunctions.setEditingProperty}
                                              focusOn="name"
                                              validate={true}
                                              appTables={appTables} />);

        expect(component.find('.tableInfo')).toBePresent();

        let iconMenu = component.find("#createTableIconDropdown");
        expect(iconMenu).toBePresent();

        Simulate.click(iconMenu.get(0));
        expect(mockParentFunctions.tableMenuOpened).toHaveBeenCalled();

        Simulate.click(iconMenu.get(0));
        expect(mockParentFunctions.tableMenuClosed).toHaveBeenCalled();
    });

    it('calls editing callbacks', () => {
        spyOn(mockParentFunctions, 'setTableProperty');
        spyOn(mockParentFunctions, 'setEditingProperty');
        component = mount(<TableCreationPanel tableInfo={tableInfo}
                                              tableMenuOpened={mockParentFunctions.tableMenuOpened}
                                              tableMenuClosed={mockParentFunctions.tableMenuClosed}
                                              setTableProperty={mockParentFunctions.setTableProperty}
                                              setEditingProperty={mockParentFunctions.setEditingProperty}
                                              focusOn="name"
                                              validate={true}
                                              appTables={appTables} />);

        expect(component.find('.tableInfo')).toBePresent();

        let inputFields = component.find(".tableFieldInput input");
        expect(inputFields).toBePresent();

        let input = inputFields.get(0);

        Simulate.focus(input);
        Simulate.change(input);
        expect(mockParentFunctions.setEditingProperty).toHaveBeenCalled();

        input.value = 'newText';
        Simulate.change(input);
        Simulate.keyDown(input, {key: "Tab", keyCode: 9, which: 9}); // tab out
        expect(mockParentFunctions.setTableProperty).toHaveBeenCalled();
    });
});
