import React from 'react';
import {shallow, mount} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';
import TestUtils from 'react-addons-test-utils';
import _ from 'lodash';


import QbGrid from '../../../src/components/dataTable/qbGrid/qbGrid';
import ColumnTransformer from '../../../src/components/dataTable/qbGrid/columnTransformer';
import RowTransformer from '../../../src/components/dataTable/qbGrid/rowTransformer';
import * as Table from 'reactabular-table';
import {UNSAVED_RECORD_ID} from '../../../src/constants/schema';

const testColumns = [
    new ColumnTransformer('Header 1', 1, 'header1class'),
    new ColumnTransformer('Header 2', 2, 'header2class'),
    new ColumnTransformer('Header 3', 3, 'header3class')
];
const testRows = [
    new RowTransformer(1, {
        text: 'Row 1',
        1: {id: 1, text: 'row-1-cell-1'},
        2: {id: 2, text: 'row-1-cell-2'},
        3: {id: 3, text: 'row-1-cell-3'}
    }),
    new RowTransformer(2, {
        text: 'Row 2',
        isEditing: true,
        isSelected: true,
        1: {id: 1, text: 'row-2-cell-1'},
        2: {id: 2, text: 'row-2-cell-2'},
        3: {id: 3, text: 'row-2-cell-3'}
    }),
];
const firstRow = testRows[0];
const editingRow = testRows[1];
const newRow = new RowTransformer(UNSAVED_RECORD_ID, {test: 'new'});
const subHeaderRow = new RowTransformer(3, {
    text: 'Subheader',
    isSubHeader: true,
    subHeaderLabel: 'SubHeader 1',
    group: {}
});

const actions = {
    compareCellChanges() {},
    onClickAdd() {},
    onClickDelete() {},
    onClickCancel() {},
    onClickEdit() {},
    onClickSave() {},
    onClickToggle() {}
};

const testCellRenderer = (props) => {
    return <div>{props.text}</div>;
};

const requireProps = {
    editingRowErrors: [],
    onCancelEditingRow: actions.onClickCancel,
    onClickSaveRow: actions.onClickSave,
};

let component;
let instance;

describe('QbGrid', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    it('pass props to reactabular to display rows', () => {
        component = shallow(<QbGrid numberOfColumns={testColumns.length} columns={testColumns} rows={testRows} cellRenderer={testCellRenderer}/>);
        instance = component.instance();

        let TableBody = component.find(Table.Body);
        expect(TableBody).toHaveProp('rows', testRows);
    });

    it('adds a first column for row actions to the columns passed in through props', () => {
        component = shallow(<QbGrid numberOfColumns={testColumns.length} columns={testColumns} rows={testRows} cellRenderer={testCellRenderer}/>);

        let TableProvider = component.find(Table.Provider);
        expect(TableProvider.props().columns.length).toEqual(testColumns.length + 1);
    });

    describe('addRowProps', () => {
        it('adds props to each row so the row component can have access to relevant properties set on QbGrid', () => {
            component = shallow(<QbGrid
                numberOfColumns={testColumns.length}
                columns={testColumns}
                rows={testRows}
                cellRenderer={testCellRenderer}
                compareCellChanges={actions.compareCellChanges}
            />);
            instance = component.instance();

            let TableBody = component.find(Table.Body);
            expect(TableBody).toHaveProp('onRow', instance.addRowProps);

            // isMatch only checks that the keys specified here are each object, not all keys
            // We don't need to check each individual cell for the purpose of this test
            expect(_.isMatch(instance.addRowProps(firstRow), {
                id: firstRow.id,
                subHeaderId: firstRow.id,
                className: 'qbRow',
                classes: [],
                editingRowId: null,
                isInlineEditOpen: false,
                isValid: true,
                isSaving: false,
                isEditing: false,
                isSelected: false,
                isSubHeader: false,
                subHeaderLabel: null,
                subHeaderLevel: null,
                numberOfColumns: testColumns.length + 1,
                compareCellChanges: actions.compareCellChanges,

                // Passes through other properties of row object
                text: firstRow.text,
            })).toEqual(true);
        });

        it('adds an editing class when the row is in editing mode', () => {
            component = shallow(<QbGrid
                numberOfColumns={testColumns.length}
                columns={testColumns}
                rows={testRows}
                cellRenderer={testCellRenderer}
                compareCellChanges={actions.compareCellChanges}
            />);
            instance = component.instance();

            expect(instance.addRowProps(editingRow).className).toEqual('qbRow editing');
        });
    });

    describe('onClickAddNewRow', () => {
        it('calls the onClickAddNewRow prop function with the editingRowId passed in', () => {
            spyOn(actions, 'onClickAdd');
            component = shallow(<QbGrid editingRowId={firstRow.id} onClickAddNewRow={actions.onClickAdd}/>);
            instance = component.instance();

            instance.onClickAddNewRow();

            expect(actions.onClickAdd).toHaveBeenCalledWith(firstRow.id);
        });
    });

    describe('getActionsCell', () => {
        it('gets a row actions cell', () => {
            component = shallow(<QbGrid
                onClickDeleteIcon={actions.onClickDelete}
                onClickEditIcon={actions.onClickEdit}
                isEditing={true}
                editingRowId={editingRow.id}
                isEditingRowValid={true}
                isEditingRowSaving={true}
                isInlineEditOpen={true}
                isSelected={editingRow.isSelected}
                editingRowErrors={[1]}
                onCancelEditingRow={actions.onClickCancel}
                onClickSaveRow={actions.onClickSave}
            />);
            instance = component.instance();

            let actionCell = instance.getActionsCell(null, {rowData: editingRow});

            expect(actionCell.props).toEqual({
                editingRowErrors: [1],
                editingRowId: editingRow.id,
                isEditing: true,
                isEditingRowSaving: true,
                isEditingRowValid: true,
                isInlineEditOpen: true,
                isSelected: editingRow.isSelected,
                onCancelEditingRow: actions.onClickCancel,
                onClickAddNewRow: instance.onClickAddNewRow,
                onClickDeleteRowIcon: actions.onClickDelete,
                onClickEditRowIcon: actions.onClickEdit,
                onClickSaveRow: actions.onClickSave,
                onClickToggleSelectedRow: instance.onClickToggleSelectedRow,
                rowId: editingRow.id
            });
        });
    });

    describe('getActionCellProps', () => {
        it('adds the isStickyCell prop to action cells so the component can add the appropriate class', () => {
            component = shallow(<QbGrid/>);
            instance = component.instance();

            expect(instance.getActionCellProps()).toEqual({
                isStickyCell: true
            });
        });
    });

    describe('onClickToggleSelectedRow', () => {
        it('creates a function that can be used an event listener that includes the row id', () => {
            spyOn(actions, 'onClickToggle');
            component = shallow(<QbGrid onClickToggleSelectedRow={actions.onClickToggle}/>);
            instance = component.instance();

            // Create the function from the method and immediately invoke the returned function
            instance.onClickToggleSelectedRow(firstRow.id)();

            expect(actions.onClickToggle).toHaveBeenCalledWith(firstRow.id);
        });
    });

    describe('getUniqueRowKey', () => {
        it('returns a unique key for the row if the row has an id', () => {
            component = shallow(<QbGrid/>);
            instance = component.instance();

            let actualValue = instance.getUniqueRowKey({rowData: firstRow, rowIndex: 4});
            expect(actualValue).toEqual(`row-${firstRow.id}`);
        });

        it('returns a unique key based on the index of the row in the array for new records (records without an id)', () => {
            component = shallow(<QbGrid/>);
            instance = component.instance();

            let actualValue = instance.getUniqueRowKey({rowData: newRow, rowIndex: 4});
            expect(actualValue).toEqual(`newRow-4`);
        });
    });

    it('displays a grid based on passed in rows and columns', () => {
        let rowsWithHeader = [...testRows, subHeaderRow];

        // Using test utils in this class because we want to check the rendered DOM for the whole grid and not unit test shallow component
        component = TestUtils.renderIntoDocument(<QbGrid
            {...requireProps}
            numberOfColumns={testColumns.length}
            columns={testColumns}
            rows={rowsWithHeader}
            cellRenderer={testCellRenderer}
        />);

        // Displays headers/columns
        let headers = TestUtils.scryRenderedDOMComponentsWithClass(component, 'qbHeaderCell');
        expect(headers.length).toEqual(testColumns.length + 1); // We add 1 to account for the first column with row actions
        testColumns.forEach((column, index) => {
            // Add 1 to the index to count for the row added by QbGrid for the row actions in the first column
            expect(headers[index + 1].innerText).toEqual(column.headerLabel);
        });

        // Displays rows
        let rows = TestUtils.scryRenderedDOMComponentsWithClass(component, 'qbRow');
        testRows.forEach((row, rowIndex) => {
            // The `children` returned is not an array. Need to use for loop instead of forEach
            // Starting at one to skip the row actions cell that is always in the first column
            for (let i = 1; i < rows[rowIndex].children.length; i++) {
                expect(rows[rowIndex].children[i].innerText).toEqual(row[i].text);
            }
        });

        // Displays subHeaders if there are any rows where isSubHeader is true
        let subHeader = TestUtils.findRenderedDOMComponentWithClass(component, 'groupHeader');
        expect(subHeader.innerText).toEqual(subHeaderRow.subHeaderLabel);
    });
});
