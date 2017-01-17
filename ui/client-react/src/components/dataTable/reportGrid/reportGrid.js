import React, {PropTypes} from 'react';
import QbGrid from '../qbGrid/qbGrid';
import ReportColumnTransformer from './reportColumnTransformer';
import ReportRowTransformer from './reportRowTransformer';
import FieldUtils from '../../../utils/fieldUtils';
import ReportColumnHeaderMenu from './reportColumnHeaderMenu';

import _ from 'lodash';

import ReportCell from './reportCell';

const ReportGrid = React.createClass({
    propTypes: {
        appId: PropTypes.string,
        tblId: PropTypes.string,
        rptId: PropTypes.string,

        /**
         * The records to be displayed on the grid */
        records: PropTypes.array,

        /**
         * The columns displayed on the grid */
        columns: PropTypes.array,

        /**
         * The name of the primary key field (usually Record ID#) */
        primaryKeyName: PropTypes.string.isRequired,

        /**
         * Whether the data for the grid is still loading. Dispalys the loader when true. */
        loading: PropTypes.bool,

        /**
         * A list of users in the app for the user picker field type */
        appUsers: PropTypes.array.isRequired,

        /**
         * Any currently pending edits to a record that have not been saved. The pending values will be displayed
         * instead of the current record values if they exist and the isInlineEditOpen property is true on pending edits.
         */
        pendEdits: PropTypes.object,

        /**
         * Any validation errors for a record that is being edited */
        editErrors: PropTypes.object,

        /**
         * Action that starts inline editing */
        onEditRecordStart: PropTypes.func.isRequired,

        /**
         * Action to save a record that is currently being edited */
        onClickRecordSave: PropTypes.func,

        /**
         * The action that will cancel any pending edits and close inline editing */
        onEditRecordCancel: PropTypes.func,

        /**
         * The action that will delete a record */
        onRecordDelete: PropTypes.func,

        /**
         * Action for when a field value is changed (e.g., user types in an input box when inline editing) */
        onFieldChange: PropTypes.func.isRequired,

        /**
         * An action that is called when a field should be validated */
        handleValidateFieldValue: PropTypes.func,

        /**
         * Action to add a new blank record to the grid and open it for editing */
        onRecordNewBlank: PropTypes.func,

        /**
         * A property that indicates whether inline edit should be open */
        isInlineEditOpen: PropTypes.bool,

        /**
         * When adding a new blank row, there is now record ID yet. Instead the reportDataStore sets the index of the
         * record in the grid along with an editingId. This property may be depracted once AgGrid is removed. See more information
         * in the getCurrentlyEditingRecordId method
         */
        editingIndex: PropTypes.number,

        /**
         * Related to editingIndex */
        editingId: PropTypes.number,

        /**
         * The currently selected rows. Indicated by the checkboxes in the first column of the grid.*/
        selectedRows: PropTypes.array,

        /**
         * The action to select a row or rows on the grid */
        selectRows: PropTypes.func,

        /**
         * The action to toggle the selection of a row on the grid */
        toggleSelectedRow: PropTypes.func,

        /**
         * The action to take a user to the form view for editing */
        openRecordForEdit: PropTypes.func,

        /**
         * A list of ids by which the report has been sorted (used for displaying the report header menu) */
        sortFids: PropTypes.array
    },

    getDefaultProps() {
        return {
            records: [],
            columns: []
        };
    },

    transformColumns() {
        return ReportColumnTransformer.transformColumnsForGrid(this.props.columns);
    },

    transformRecords(editingRecordId) {
        return ReportRowTransformer.transformRecordsForGrid(
            this.props.records,
            this.props.columns,
            {
                primaryKeyFieldName: this.props.primaryKeyName,
                editingRecordId: editingRecordId,
                pendEdits: this.props.pendEdits,
                selectedRows: this.props.selectedRows
            }
        );
    },

    startEditingRow(recordId) {
        this.props.onEditRecordStart(recordId);
    },

    onCellChange(value, colDef) {
        let updatedFieldValue = {
            value: value,
            display: value
        };

        this.props.onFieldChange(formatChange(updatedFieldValue, colDef));
    },

    onCellBlur(updatedFieldValue, colDef) {
        this.props.onFieldChange(formatChange(updatedFieldValue, colDef));
    },

    /**
     * select all grid rows
     */
    selectAllRows() {
        let selected = []; // array of record ids to select
        this.props.records.forEach(record => {
            selected.push(record[this.props.primaryKeyName].value);
        });
        this.props.selectRows(selected);
    },

    deselectAllRows() {
        this.props.selectRows([]);
    },

    toggleSelectAllRows() {
        const allSelected = this.props.selectedRows.length === this.props.records.length;

        if (allSelected) {
            this.deselectAllRows();
        } else {
            this.selectAllRows();
        }
    },

    onStartEditingRow(recordId) {
        return () => {
            if (this.props.onEditRecordStart) {
                this.props.onEditRecordStart(recordId);
            }
        };
    },

    onClickDelete(recordId) {
        if (this.props.onRecordDelete) {
            this.props.onRecordDelete(recordId);
        }
    },

    getCurrentlyEditingRecordId() {
        // Editing Id trumps editingRowId when editingIndex is set
        // Editing index comes from the reportDataStore whereas editingRecord comes from the pending edits store
        // When saveAndAddAnewRow is clicked, then the reportDataStore sets the editingIndex (index of new row in array)
        // and editingId (id of newly created row).
        // TODO:: This process can be refactored once AgGrid is removed.
        let editingRowId = null;

        if (this.props.pendEdits && this.props.pendEdits.isInlineEditOpen && this.props.pendEdits.currentEditingRecordId) {
            editingRowId = this.props.pendEdits.currentEditingRecordId;
        }

        if (this.props.editingIndex && this.props.editingId !== editingRowId) {
            editingRowId = this.props.editingId;
        }

        return editingRowId;
    },

    render() {
        let isRecordValid = true;
        if (_.has(this.props, 'editErrors.ok')) {
            isRecordValid = this.props.editErrors.ok;
        }

        let editingRecordId = this.getCurrentlyEditingRecordId();

        return <QbGrid
            numberOfColumns={_.isArray(this.props.columns) ? this.props.columns.length : 0}
            columns={this.transformColumns()}
            rows={this.transformRecords(editingRecordId)}
            loading={this.props.loading}
            onStartEditingRow={this.startEditingRow}
            editingRowId={editingRecordId}
            // TODO:: Refactor out need for this prop once AgGrid is removed.
            // Currently required because editingRowId could be null for a new record so it is difficult to check if
            // in editing mode with only that property. Future implementation might set a new record's id to 0 or 'new'
            isInlineEditOpen={this.props.isInlineEditOpen}
            appUsers={this.props.appUsers}
            selectedRows={this.props.selectedRows}
            onClickToggleSelectedRow={this.props.toggleSelectedRow}
            onClickEditIcon={this.props.openRecordForEdit}
            onClickDeleteIcon={this.onClickDelete}
            onClickToggleSelectAllRows={this.toggleSelectAllRows}
            onCancelEditingRow={this.props.onEditRecordCancel}
            editingRowErrors={this.props.editErrors ? this.props.editErrors.errors : []}
            isEditingRowValid={isRecordValid}
            onClickAddNewRow={this.props.onRecordNewBlank}
            onClickSaveRow={this.props.onClickRecordSave}
            isEditingRowSaving={_.has(this.props, 'pendEdits.saving') ? this.props.pendEdits.saving : false}
            cellRenderer={ReportCell}
            commonCellProps={{
                appUsers: this.props.appUsers,
                onCellChange: this.onCellChange,
                onCellBlur: this.onCellBlur,
                onCellClick: this.startEditingRow,
                validateFieldValue: this.props.handleValidateFieldValue,
            }}
            compareCellChanges={FieldUtils.compareFieldValues}
            menuComponent={ReportColumnHeaderMenu}
            menuProps={{
                appId: this.props.appId,
                tblId: this.props.tblId,
                rptId: this.props.rptId,
                sortFids: this.props.sortFids,
            }}
        />;
    }
});

// --- PRIVATE METHODS ---
function formatChange(updatedValues, colDef) {
    return {
        values: {
            oldVal: {value: colDef.value, display: colDef.display},
            newVal: updatedValues
        },
        recId: colDef.recordId,
        fid: colDef.id,
        fieldName: colDef.fieldDef.name,
        fieldDef: colDef.fieldDef
    };
}

export default ReportGrid;
