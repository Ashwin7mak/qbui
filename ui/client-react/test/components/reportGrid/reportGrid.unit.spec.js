import React from 'react';
import {shallow} from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import ReportGrid, {
    ReportGrid as UnconnectedReportGrid,
    __RewireAPI__ as ReportGridRewireAPI
} from '../../../src/components/dataTable/reportGrid/reportGrid';
import QbGrid from '../../../src/components/dataTable/qbGrid/qbGrid';
import ReportColumnTransformer from '../../../src/components/dataTable/reportGrid/reportColumnTransformer';
import ReportCell from '../../../src/components/dataTable/reportGrid/reportCell';
import ReportColumnHeaderMenu from '../../../src/components/dataTable/reportGrid/reportColumnHeaderMenu';
import FieldUtils from '../../../src/utils/fieldUtils';

const testRecordId = 3;
const requiredProps = {
    primaryKeyName: 'Record ID#',
    appUsers: [],
    onEditRecordStart() {},
    onFieldChange() {}
};
const actions = {
    selectRows() {},
    onRecordDelete() {},
    handleValidateFieldValue() {},
    openRecordForEdit() {},
    onEditRecordCancel() {},
    onRecordNewBlank() {},
    onClickRecordSave() {},
    onCellClick() {},
};
const testColDef = {value: 'oldValue', display: 'oldDisplay', recordId: testRecordId, id: 1, fieldDef: {name: 'testField'}};
const newValues = {value: 'newValue', display: 'newValue'};
const expectedFieldChangeResult = {
    values: {oldVal: {value: testColDef.value, display: testColDef.display}, newVal: newValues},
    recId: testColDef.recordId,
    fid: testColDef.id,
    fieldName: testColDef.fieldDef.name,
    fieldDef: testColDef.fieldDef
};
const testRecords = [
    {'Record ID#': {value: testRecordId}}
];
const testGroupedRecords = [
    {
        id: 'groupId',
        group: 'test group',
        children: testRecords
    }
];
const testColumns = [
    new ReportColumnTransformer(1,
        {
            builtIn: false,
            dataIsCopyable: true,
            id: 1,
            includeInQuickSearch: true,
            indexed: false,
            isHidden: false,
            multiChoiceSourceAllowed: false,
            name: 'Header 1',
            required: true,
            tableId: '1',
            type: "SCALAR",
            unique: false,
            userEditableValue: true
        },
        'Header 1', 'header1class', ''),
    new ReportColumnTransformer(2,
        {
            builtIn: false,
            dataIsCopyable: true,
            id: 2,
            includeInQuickSearch: true,
            indexed: false,
            isHidden: false,
            multiChoiceSourceAllowed: false,
            name: 'Header 2',
            required: true,
            tableId: '1',
            type: "SCALAR",
            unique: false,
            userEditableValue: true
        },
        'Header 2', 'header2class', ''),
    new ReportColumnTransformer(3,
        {
            builtIn: false,
            dataIsCopyable: true,
            id: 3,
            includeInQuickSearch: true,
            indexed: false,
            isHidden: false,
            multiChoiceSourceAllowed: false,
            name: 'Header 3',
            required: true,
            tableId: '3',
            type: "SCALAR",
            unique: false,
            userEditableValue: true
        },
        'Header 3', 'header3class', ''),
];


let component;
let instance;

describe('ReportGrid', () => {
    beforeEach(() => {
        jasmineEnzyme();
    });

    describe('onCellChange', () => {
        it('transforms the field change into one accepted by the flux store', () => {
            spyOn(requiredProps, 'onFieldChange');
            component = shallow(<UnconnectedReportGrid {...requiredProps} />);
            instance = component.instance();

            // Cell change only receives the value
            instance.onCellChange(newValues.value, testColDef);

            expect(requiredProps.onFieldChange).toHaveBeenCalledWith(expectedFieldChangeResult);
        });
    });

    describe('onCellBlur', () => {
        it('transforms the field change into one accepted by the flux store', () => {
            spyOn(requiredProps, 'onFieldChange');
            component = shallow(<UnconnectedReportGrid {...requiredProps}/>);
            instance = component.instance();

            // Cell blur receives a value object with both the value and display
            instance.onCellBlur(newValues, testColDef);

            expect(requiredProps.onFieldChange).toHaveBeenCalledWith(expectedFieldChangeResult);
        });
    });

    describe('selectAllRows', () => {
        it('selects all records currently passed into the grid', () => {
            spyOn(actions, 'selectRows');
            component = shallow(<UnconnectedReportGrid {...requiredProps} selectRows={actions.selectRows} records={testRecords}/>);
            instance = component.instance();

            instance.selectAllRows();

            expect(actions.selectRows).toHaveBeenCalledWith([testRecordId]);
        });

        it('ignores group headers when selecting rows', () => {
            spyOn(actions, 'selectRows');
            component = shallow(<UnconnectedReportGrid {...requiredProps} selectRows={actions.selectRows} records={testGroupedRecords}/>);
            instance = component.instance();

            instance.selectAllRows();

            expect(actions.selectRows).toHaveBeenCalledWith([testRecordId]);
            expect(actions.selectRows).not.toHaveBeenCalledWith([testGroupedRecords[0].id]);
        });
    });

    describe('deselectAllRows', () => {
        it('calls selectRows prop with an empty array', () => {
            spyOn(actions, 'selectRows');
            component = shallow(<UnconnectedReportGrid {...requiredProps} selectRows={actions.selectRows} records={testRecords}/>);
            instance = component.instance();

            instance.deselectAllRows();

            expect(actions.selectRows).toHaveBeenCalledWith([]);
        });
    });

    describe('toggleSelectAllRows', () => {
        let testCases = [
            {
                description: 'calls selectAllRows if not all rows are selected',
                records: testRecords,
                selectedRows: [],
                expectSelectAllRowsToBeCalled: true
            },
            {
                description: 'calls selectAllRows if not all grouped rows are selected',
                records: testGroupedRecords,
                selectedRows: [],
                expectSelectAllRowsToBeCalled: true
            },
            {
                description: 'calls deselectAllRows if all rows are currently selected',
                records: testRecords,
                selectedRows: [testRecordId],
                expectSelectAllRowsToBeCalled: false
            },
            {
                description: 'calls deselectAllRows if all grouped rows are currently selected',
                records: testGroupedRecords,
                selectedRows: [testRecordId],
                expectSelectAllRowsToBeCalled: false
            },
        ];

        testCases.forEach(testCase => {
            it(testCase.description, () => {
                component = shallow(<UnconnectedReportGrid
                    {...requiredProps}
                    selectRows={actions.selectRows}
                    records={testCase.records}
                    selectedRows={testCase.selectedRows}
                />);
                instance = component.instance();
                spyOn(instance, 'selectAllRows');
                spyOn(instance, 'deselectAllRows');

                instance.toggleSelectAllRows();

                if (testCase.expectSelectAllRowsToBeCalled) {
                    expect(instance.selectAllRows).toHaveBeenCalled();
                    expect(instance.deselectAllRows).not.toHaveBeenCalled();
                } else {
                    expect(instance.deselectAllRows).toHaveBeenCalled();
                    expect(instance.selectAllRows).not.toHaveBeenCalled();
                }

            });
        });
    });

    describe('startEditingRow', () => {
        it('passes the recordId to the onEditRecordStart prop', () => {
            spyOn(requiredProps, 'onEditRecordStart');
            component = shallow(<UnconnectedReportGrid {...requiredProps} onEditRecordStart={requiredProps.onEditRecordStart}/>);
            instance = component.instance();

            let mockField = {id: 1};
            instance.startEditingRow(testRecordId, mockField);

            expect(requiredProps.onEditRecordStart).toHaveBeenCalledWith(testRecordId, mockField);
        });
    });

    describe('onClickDelete', () => {
        it('passes the recordId to the onRecordDelete prop', () => {
            spyOn(actions, 'onRecordDelete');
            component = shallow(<UnconnectedReportGrid {...requiredProps} onRecordDelete={actions.onRecordDelete}/>);
            instance = component.instance();

            instance.onClickDelete(testRecordId);

            expect(actions.onRecordDelete).toHaveBeenCalledWith(testRecordId);
        });
    });

    describe('getCurrentlyEditingRecordId', () => {
        let testCases = [
            {
                description: 'returns null if there are no pending edits',
                pendEdits: null,
                editingIndex: testRecordId,
                editingId: null,
                expectedValue: null
            },
            {
                description: 'returns null if the record is not currently in inline edit mode',
                pendEdits: {isInlineEditOpen: false},
                editingIndex: testRecordId,
                editingId: null,
                expectedValue: null
            },
            {
                description: 'returns null if there is not a currentEditingRecordId on pendEdits',
                pendEdits: {isInlineEditOpen: true, currentEditingRecordId: null},
                editingIndex: testRecordId,
                editingId: null,
                expectedValue: null
            },
            {
                description: 'returns the current record Id if the record is in inlineEdit mode and has an id',
                pendEdits: {isInlineEditOpen: true, currentEditingRecordId: testRecordId},
                editingIndex: null,
                editingId: null,
                expectedValue: testRecordId
            }
        ];

        testCases.forEach(testCase => {
            it(testCase.description, () => {
                component = shallow(<UnconnectedReportGrid
                    {...requiredProps}
                    record={[{pendEdits: testCase.pendEdits}]}
                    editingIndex={testCase.editingIndex}
                    editingId={testCase.editingId}
                />);
                instance = component.instance();

                expect(instance.getCurrentlyEditingRecordId()).toEqual(testCase.expectedValue);
            });
        });
    });

    describe('QbGrid props test', () => {
        const isInlineEditOpen = true;
        const pendEdits = {
            isInlineEditOpen: isInlineEditOpen,
            currentEditingRecordId: testRecordId,
            errors: ['an error'],
            ok: false,
            saving: true
        };
        const selectedRows = [4];
        const appId = 'appId';
        const tblId = 'tblId';
        const rptId = 'rptId';
        const sortFids = [5, 6];
        const testAppUsers = [7, 8];

        let phase1 = undefined;

        beforeAll(() => {
            ReportGridRewireAPI.__Rewire__('ReportRowTransformer', {
                transformRecordsForGrid() {
                    return testRecords;
                }
            });
            ReportGridRewireAPI.__Rewire__('ReportColumnTransformer', {
                transformColumnsForGrid() {
                    return testColumns;
                }
            });
        });

        afterAll(() => {
            ReportGridRewireAPI.__ResetDependency__('ReportRowTransformer');
            ReportGridRewireAPI.__ResetDependency__('ReportColumnTransformer');
        });

        it('passes the correct props to QbGrid to render the grid correctly', () => {
            component = shallow(<UnconnectedReportGrid
                {...requiredProps}
                {...actions}
                columns={testColumns}
                records={testRecords}
                isInlineEditOpen={isInlineEditOpen}
                record={[{pendEdits}]}
                loading={false}
                selectedRows={selectedRows}
                editErrors={pendEdits}
                appId={appId}
                tblId={tblId}
                rptId={rptId}
                sortFids={sortFids}
                appUsers={testAppUsers}
                phase1={phase1}
            />);
            instance = component.instance();

            let qbGrid = component.find(QbGrid);
            expect(qbGrid).toHaveProp('numberOfColumns', testColumns.length);
            expect(qbGrid).toHaveProp('columns', testColumns);
            expect(qbGrid).toHaveProp('rows', testRecords);
            expect(qbGrid).toHaveProp('loading', false);
            expect(qbGrid).toHaveProp('onStartEditingRow', instance.startEditingRow);
            expect(qbGrid).toHaveProp('editingRowId', testRecordId);
            expect(qbGrid).toHaveProp('isInlineEditOpen', isInlineEditOpen);
            expect(qbGrid).toHaveProp('appUsers', testAppUsers);
            expect(qbGrid).toHaveProp('selectedRows', selectedRows);
            expect(qbGrid).toHaveProp('areAllRowsSelected', true);
            expect(qbGrid).toHaveProp('onClickToggleSelectedRow', actions.onClickToggle);
            expect(qbGrid).toHaveProp('onClickEditIcon', actions.openRecordForEdit);
            expect(qbGrid).toHaveProp('onClickDeleteIcon', instance.onClickDelete);
            expect(qbGrid).toHaveProp('onClickToggleSelectAllRows', instance.toggleSelectAllRows);
            expect(qbGrid).toHaveProp('onCancelEditingRow', actions.onEditRecordCancel);
            expect(qbGrid).toHaveProp('editingRowErrors', pendEdits.errors);
            expect(qbGrid).toHaveProp('isEditingRowValid', pendEdits.ok);
            expect(qbGrid).toHaveProp('onClickAddNewRow', actions.onRecordNewBlank);
            expect(qbGrid).toHaveProp('onClickSaveRow', actions.onClickRecordSave);
            expect(qbGrid).toHaveProp('isEditingRowSaving', pendEdits.saving);
            expect(qbGrid).toHaveProp('cellRenderer', ReportCell);
            expect(qbGrid).toHaveProp('commonCellProps', {
                appUsers: testAppUsers,
                isInlineEditOpen: isInlineEditOpen,
                phase1,
                onCellChange: instance.onCellChange,
                onCellBlur: instance.onCellBlur,
                onCellClick: actions.onCellClick,
                onCellClickEditIcon: instance.startEditingRow,
                validateFieldValue: actions.handleValidateFieldValue
            });
            expect(qbGrid).toHaveProp('compareCellChanges', FieldUtils.compareFieldValues);
            expect(qbGrid).toHaveProp('menuComponent', ReportColumnHeaderMenu);
            expect(qbGrid).toHaveProp('menuProps', {
                appId: appId,
                tblId: tblId,
                rptId: rptId,
                sortFids: sortFids,
                isOnlyOneColumnVisible: false
            });
        });

        it('passes the correct props to QbGrid and commonCellProps for relationships phase1', () => {
            phase1 = true;
            component = shallow(<UnconnectedReportGrid
                {...requiredProps}
                {...actions}
                columns={testColumns}
                records={testRecords}
                isInlineEditOpen={isInlineEditOpen}
                record={[{pendEdits}]}
                loading={false}
                selectedRows={selectedRows}
                editErrors={pendEdits}
                appId={appId}
                tblId={tblId}
                rptId={rptId}
                sortFids={sortFids}
                appUsers={testAppUsers}
                phase1={phase1}
            />);
            instance = component.instance();

            let qbGrid = component.find(QbGrid);
            expect(qbGrid).toHaveProp('phase1', phase1);
            expect(qbGrid).toHaveProp('showRowActionsColumn', !phase1);
            expect(qbGrid).toHaveProp('commonCellProps', {
                appUsers: testAppUsers,
                isInlineEditOpen: isInlineEditOpen,
                phase1: phase1,
                onCellChange: instance.onCellChange,
                onCellBlur: instance.onCellBlur,
                onCellClick: actions.onCellClick,
                onCellClickEditIcon: instance.startEditingRow,
                validateFieldValue: actions.handleValidateFieldValue
            });
        });

        it('renders the no rows present UI', () => {
            phase1 = true;
            component = shallow(<UnconnectedReportGrid
                {...requiredProps}
                {...actions}
                columns={testColumns}
                records={[]}
                isInlineEditOpen={isInlineEditOpen}
                record={[{pendEdits}]}
                loading={false}
                selectedRows={selectedRows}
                editErrors={pendEdits}
                appId={appId}
                tblId={tblId}
                rptId={rptId}
                sortFids={sortFids}
                appUsers={testAppUsers}
                phase1={phase1}
                noRowsUI={true}
            />);
            instance = component.instance();

            // grid should not be present
            let qbGrid = component.find(QbGrid);
            expect(qbGrid.length).toBe(0);

            // check for 'no rows' element
            let noRows = component.find(".noRowsExist");
            expect(noRows.length).toBe(1);
        });
    });
});
