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
    'table1',
    'table2'
];

const mockParentFunctions = {
    openIconChooser() {},
    closeIconChooser() {},
    setTableProperty() {},
    setEditingProperty() {},
};

describe('TableCreationPanel', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('renders a TableCreationPanel', () => {
        component = mount(<TableCreationPanel tableInfo={tableInfo}
                                              openIconChooser={mockParentFunctions.openIconChooser}
                                              closeIconChooser={mockParentFunctions.closeIconChooser}
                                              setTableProperty={mockParentFunctions.setTableProperty}
                                              setEditingProperty={mockParentFunctions.setEditingProperty}
                                              focusOn="name"
                                              validate={true}
                                              appTables={appTables} />);

        expect(component.find('.tableInfo')).toBePresent();
    });

    it('calls icon chooser callbacks when necessary', () => {
        spyOn(mockParentFunctions, 'openIconChooser');
        spyOn(mockParentFunctions, 'closeIconChooser');
        component = mount(<TableCreationPanel tableInfo={tableInfo}
                                              openIconChooser={mockParentFunctions.openIconChooser}
                                              closeIconChooser={mockParentFunctions.closeIconChooser}
                                              setTableProperty={mockParentFunctions.setTableProperty}
                                              setEditingProperty={mockParentFunctions.setEditingProperty}
                                              focusOn="name"
                                              validate={true}
                                              appTables={appTables} />);

        expect(component.find('.tableInfo')).toBePresent();

        let iconChooser = component.find(".iconChooser .showAllToggle");
        expect(iconChooser).toBePresent();

        Simulate.click(iconChooser.get(0));
        expect(mockParentFunctions.openIconChooser).toHaveBeenCalled();

    });

    it('calls editing callbacks', () => {
        spyOn(mockParentFunctions, 'setTableProperty');
        spyOn(mockParentFunctions, 'setEditingProperty');

        component = mount(<TableCreationPanel tableInfo={tableInfo}
                                              openIconChooser={mockParentFunctions.openIconChooser}
                                              closeIconChooser={mockParentFunctions.closeIconChooser}
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
