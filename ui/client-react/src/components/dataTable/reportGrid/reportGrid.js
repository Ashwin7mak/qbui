import React, {PropTypes} from 'react';
import QbGrid from '../qbGrid/qbGrid';
import ReportColumnTransformer from './reportColumnTransformer';
import ReportRowTransformer from './reportRowTransformer';
import FieldUtils from '../../../utils/fieldUtils';
import ReportUtils from '../../../utils/reportUtils';
import ReportColumnHeaderMenu from './reportColumnHeaderMenu';
import {connect} from 'react-redux';

import _ from 'lodash';

import ReportCell from './reportCell';

export const ReportGrid = React.createClass({
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
        //pendEdits: PropTypes.object,

        /**
         * Any validation errors for a record that is being edited */
        editErrors: PropTypes.object,

        /**
         * Action that starts inline editing */
        onEditRecordStart: PropTypes.func,

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
         * Action that will occur when a cell is click (does not include area covered by edit icon) */
        onCellClick: PropTypes.func,

        /**
         * Action for when a field value is changed (e.g., user types in an input box when inline editing) */
        onFieldChange: PropTypes.func,

        /**
         * An action that is called when a field should be validated */
        handleValidateFieldValue: PropTypes.func,

        /**
         * Action to add a new blank record to the grid and open it for editing */
        onRecordNewBlank: PropTypes.func,

        /**
         * A property that indicates whether inline edit should be open */
        //isInlineEditOpen: PropTypes.bool,

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
        sortFids: PropTypes.array,

        // relationship phase-1, will need remove when we allow editing
        phase1: PropTypes.bool
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
        let isInlineEditOpen = this.getPendEdits().isInlineEditOpen || false;
        return ReportRowTransformer.transformRecordsForGrid(
            this.props.records,
            this.props.columns,
            {
                primaryKeyFieldName: this.props.primaryKeyName,
                editingRecordId: editingRecordId,
                //pendEdits: this.props.pendEdits,
                pendEdits: this.getPendEdits(),
                selectedRows: this.props.selectedRows,
                isInlineEditOpen: isInlineEditOpen
            }
        );
    },

    startEditingRow(recordId, fieldDef) {
        if (this.props.onEditRecordStart) {
            this.props.onEditRecordStart(recordId, fieldDef);
        }
    },

    onCellChange(value, colDef) {
        let updatedFieldValue = {
            value: value,
            display: value
        };

        if (this.props.onFieldChange) {
            this.props.onFieldChange(formatChange(updatedFieldValue, colDef));
        }
    },

    onCellBlur(updatedFieldValue, colDef) {
        if (this.props.onFieldChange) {
            this.props.onFieldChange(formatChange(updatedFieldValue, colDef));
        }
    },

    /**
     * select all grid rows
     */
    selectAllRows() {
        // Transform the records first so that subHeaders (grouped records) can be handled appropriately
        let selected = this.transformRecords().filter(record => !record.isSubHeader).map(record => {
            return record.id;
        });

        this.props.selectRows(selected);
    },

    deselectAllRows() {
        this.props.selectRows([]);
    },

    toggleSelectAllRows() {
        if (ReportUtils.areAllRowsSelected(this.transformRecords(), this.props.selectedRows)) {
            this.deselectAllRows();
        } else {
            this.selectAllRows();
        }
    },

    onClickDelete(recordId) {
        if (this.props.onRecordDelete) {
            this.props.onRecordDelete(recordId);
        }
    },

    getCurrentlyEditingRecordId() {
        // Editing Id trumps editingRowId when editingIndex is set
        // Editing index comes from the reportDataStore whereas editingRecord comes from the pending edits store
        // When saveAndAddANewRow is clicked, then the reportDataStore sets the editingIndex (index of new row in array)
        // and editingId (id of newly created row). The editingIndex could be any integer, but if it is not null, we can assume a new row is added.
        // TODO:: This process can be refactored once AgGrid is removed. https://quickbase.atlassian.net/browse/MB-1920
        let editingRowId = null;

        let pendEdits = this.getPendEdits();
        //if (this.props.pendEdits && this.props.pendEdits.isInlineEditOpen && this.props.pendEdits.currentEditingRecordId) {
        //    editingRowId = this.props.pendEdits.currentEditingRecordId;
        //}
        if (pendEdits && pendEdits.isInlineEditOpen && pendEdits.currentEditingRecordId) {
            editingRowId = pendEdits.currentEditingRecordId;
        }

        if (Number.isInteger(this.props.editingIndex) && this.props.editingId !== editingRowId) {
            editingRowId = this.props.editingId;
        }

        return editingRowId;
    },

    getPendEdits() {
        //  TODO: just getting to work....improve this to support multi records...
        let pendEdits = {};
        if (Array.isArray(this.props.record) && this.props.record.length > 0) {
            if (_.isEmpty(this.props.record[0]) === false) {
                pendEdits = this.props.record[0].pendEdits || {};
            }
        }
        return pendEdits;
    },

    render() {
        let isRecordValid = true;
        if (_.has(this.props, 'editErrors.ok')) {
            isRecordValid = this.props.editErrors.ok;
        }

        let editingRecordId = this.getCurrentlyEditingRecordId();
        let transformedRecords = this.transformRecords(editingRecordId);

        let pendEdits = this.getPendEdits();
        let isInLineEditOpen = (pendEdits.isInlineEditOpen === true);

        return <QbGrid
            numberOfColumns={_.isArray(this.props.columns) ? this.props.columns.length : 0}
            columns={this.transformColumns()}
            rows={transformedRecords}
            loading={this.props.loading}
            appUsers={this.props.appUsers}
            phase1={this.props.phase1}
            showRowActionsColumn={!this.props.phase1}

            onStartEditingRow={this.startEditingRow}
            editingRowId={editingRecordId}
            // TODO:: Refactor out need for this prop once AgGrid is removed. https://quickbase.atlassian.net/browse/MB-1920
            // Currently required because editingRowId could be null for a new record so it is difficult to check if
            // in editing mode with only that property. Future implementation might set a new record's id to 0 or 'new'
            //isInlineEditOpen={this.props.isInlineEditOpen}
            isInlineEditOpen={isInLineEditOpen}
            selectedRows={this.props.selectedRows}
            areAllRowsSelected={ReportUtils.areAllRowsSelected(transformedRecords, this.props.selectedRows)}
            onClickToggleSelectedRow={this.props.toggleSelectedRow}
            onClickEditIcon={this.props.openRecordForEdit}
            onClickDeleteIcon={this.onClickDelete}
            onClickToggleSelectAllRows={this.toggleSelectAllRows}
            onCancelEditingRow={this.props.onEditRecordCancel}
            editingRowErrors={this.props.editErrors ? this.props.editErrors.errors : []}
            isEditingRowValid={isRecordValid}
            onClickAddNewRow={this.props.onRecordNewBlank}
            onClickSaveRow={this.props.onClickRecordSave}
            //isEditingRowSaving={_.has(this.props, 'pendEdits.saving') ? this.props.pendEdits.saving : false}
            isEditingRowSaving={_.has(pendEdits, 'saving') ? pendEdits.saving : false}
            cellRenderer={ReportCell}
            commonCellProps={{
                appUsers: this.props.appUsers,
                onCellChange: this.onCellChange,
                onCellBlur: this.onCellBlur,
                onCellClick: this.props.onCellClick,
                onCellClickEditIcon: this.startEditingRow,
                validateFieldValue: this.props.handleValidateFieldValue,
                //isInlineEditOpen: this.props.isInlineEditOpen
                isInlineEditOpen: isInLineEditOpen,
                phase1: this.props.phase1
            }}
            compareCellChanges={FieldUtils.compareFieldValues}
            menuComponent={ReportColumnHeaderMenu}
            menuProps={{
                appId: this.props.appId,
                tblId: this.props.tblId,
                rptId: this.props.rptId,
                sortFids: this.props.sortFids
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

const mapStateToProps = (state) => {
    return {
        report: state.report,
        record: state.record
    };
};

export default connect(
    mapStateToProps
)(ReportGrid);
