import React from 'react';
import {mount, shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import TableCreationPanel from '../../src/components/table/tableCreationPanel';
import {Simulate} from 'react-addons-test-utils';

let component;
let instance;

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
        spyOn(mockParentFunctions, 'openIconChooser');
        spyOn(mockParentFunctions, 'closeIconChooser');
        spyOn(mockParentFunctions, 'setTableProperty');
        spyOn(mockParentFunctions, 'setEditingProperty');
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

        expect(component.find('.tableInfo.dialogCreationPanelInfo')).toBePresent();
    });

    it('calls icon chooser callbacks when necessary', () => {
        component = mount(<TableCreationPanel tableInfo={tableInfo}
                                              openIconChooser={mockParentFunctions.openIconChooser}
                                              closeIconChooser={mockParentFunctions.closeIconChooser}
                                              setTableProperty={mockParentFunctions.setTableProperty}
                                              setEditingProperty={mockParentFunctions.setEditingProperty}
                                              focusOn="name"
                                              validate={true}
                                              appTables={appTables} />);

        expect(component.find('.tableInfo.dialogCreationPanelInfo')).toBePresent();

        let iconChooser = component.find(".iconChooser .showAllToggle");
        expect(iconChooser).toBePresent();

        Simulate.click(iconChooser.get(0));
        expect(mockParentFunctions.openIconChooser).toHaveBeenCalled();

    });

    it('calls editing callbacks', () => {
        component = mount(<TableCreationPanel tableInfo={tableInfo}
                                              openIconChooser={mockParentFunctions.openIconChooser}
                                              closeIconChooser={mockParentFunctions.closeIconChooser}
                                              setTableProperty={mockParentFunctions.setTableProperty}
                                              setEditingProperty={mockParentFunctions.setEditingProperty}
                                              focusOn="name"
                                              validate={true}
                                              appTables={appTables} />);

        expect(component.find('.tableInfo.dialogCreationPanelInfo')).toBePresent();

        let inputFields = component.find(".dialogFieldInput input");
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

    it('will invoke setTableProperty when setTableIcon is invoked', () => {
        component = shallow(<TableCreationPanel setTableProperty={mockParentFunctions.setTableProperty} />);

        instance = component.instance();
        instance.setTableIcon('dragon icon');

        expect(mockParentFunctions.setTableProperty).toHaveBeenCalledWith('tableIcon', 'dragon icon');
    });
});
