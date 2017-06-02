import React from 'react';
import jasmineEnzyme from 'jasmine-enzyme';
import {mount} from 'enzyme';
import TestUtils, {Simulate} from 'react-addons-test-utils';

import LinkToRecordTableSelectionDialog from '../../src/components/fields/linkToRecordTableSelectionDialog';

let component;
let domComponent;

const mockParentFunctions = {
    tableSelected: () => {},
    cancel: () => {}
};

let tables = [
    {id: "childTableId", name: "child table", tableIcon: "childIcon", recordTitleFieldId: 5},
    {id: "parentTableId", name: "parent table", tableIcon: "parentIcon", recordTitleFieldId: 5}
];

let props = {
    show: true,
    tables,
    childTableId: "childTableId",
    onCancel: mockParentFunctions.cancel,
    tableSelected: mockParentFunctions.tableSelected
};

describe('LinkToRecordTableSelectionDialog', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    afterEach(() => {
        // Remove modal from the dom after every test to reset
        let modalInDom = document.querySelector('.tableDataConnectionDialog');
        if (modalInDom) {
            modalInDom.parentNode.removeChild(modalInDom);
        }
    });

    it('renders a LinkToRecordTableSelectionDialog', () => {
        component = mount(<LinkToRecordTableSelectionDialog {...props} />);

        domComponent = document.querySelector('.tableDataConnectionDialog');

        expect(domComponent).not.toBeNull();

        domComponent = document.querySelector('.tableDataConnectionDialog .finishedButton:disabled');
        expect(domComponent).not.toBeNull();
    });

    it('cancels the LinkToRecordTableSelectionDialog', () => {
        component = mount(<LinkToRecordTableSelectionDialog {...props} />);

        domComponent = document.querySelector('.tableDataConnectionDialog');

        let cancelButton = domComponent.querySelector('.cancelButton');
        Simulate.click(cancelButton);
    });

    it('selects a table and closes the dialog', () => {
        component = mount(<LinkToRecordTableSelectionDialog {...props} />);

        let select = document.querySelector('.tableDataConnectionDialog .tableSelector .Select-control');
        expect(select).not.toBeNull();

        //Simulate.clock doesn't work on react-select
        TestUtils.SimulateNative.mouseDown(select, {button: 0});
        let tableOption = document.querySelector('.tableDataConnectionDialog .tableSelector .tableOption');
        expect(tableOption).not.toBeNull();

        TestUtils.SimulateNative.mouseDown(tableOption, {button: 0});

        let finishedButton = document.querySelector('.tableDataConnectionDialog .finishedButton');
        expect(finishedButton).not.toBeNull();
        Simulate.click(finishedButton);
    });

});
