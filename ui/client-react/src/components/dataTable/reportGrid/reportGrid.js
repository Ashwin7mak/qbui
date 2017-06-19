import React, {PropTypes} from 'react';
import {DragDropContext} from 'react-dnd';
import TouchBackend from 'react-dnd-touch-backend';
import QbGrid from '../qbGrid/qbGrid';
import QbHeaderCell from '../qbGrid/qbHeaderCell';
import ReportColumnTransformer from './reportColumnTransformer';
import ReportRowTransformer from './reportRowTransformer';
import FieldUtils from 'APP/utils/fieldUtils';
import ReportUtils from 'APP/utils/reportUtils';
import ReportColumnHeaderMenu from './reportColumnHeaderMenu';
import EmptyImage from 'APP/assets/images/empty box graphic.svg';
import {I18nMessage} from 'APP/utils/i18nMessage';
import Locale from 'APP/locales/locales';
import {connect} from 'react-redux';
import {moveColumn, draggingColumnStart, draggingColumnEnd} from '../../../actions/reportBuilderActions';
import {getPendEdits} from '../../../reducers/record';
import _ from 'lodash';

import ReportCell from './reportCell';

import './reportGrid.scss';

export const ReportGrid = React.createClass({
    propTypes: {
        /**
         * The app id for this report */
        appId: PropTypes.string,

        /**
         * The table id of this report */
        tblId: PropTypes.string,

        /**
         * The report id of this report */
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

        /**
         * search text
         */
        searchString: PropTypes.string,
        // relationship phase-1, will need remove when we allow editing
        phase1: PropTypes.bool,

        /**
         * present an alternate UI instead of an empty grid if on rows are present?
         */
        noRowsUI: PropTypes.bool

    },

    getDefaultProps() {
        return {
            records: [],
            columns: [],
            noRowsUI: false
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
        let editingRowId = null;

        //  if inline edit is open, get the current editing record id
        let pendEdits = this.getPendEdits();
        if (pendEdits && pendEdits.isInlineEditOpen) {
            editingRowId = pendEdits.currentEditingRecordId;
        }

        return editingRowId;
    },

    getPendEdits() {
        return getPendEdits(this.props.record);
    },

    isOnlyOneColumnVisible() {
        return this.props.columns.filter(column => {
            return !column.isHidden && !column.isPlaceholder;
        }).length === 1;
    },

    /**
     * get text to display below grid if no rows are displayed
     * @returns {*}
     */
    renderNoRowsExist() {

        const hasSearch = this.props.searchString && this.props.searchString.trim().length > 0;

        let recordsName = Locale.getMessage("records.plural");
        let recordName = Locale.getMessage("records.singular");
        if (this.props.selectedTable) {
            if (this.props.selectedTable.name) {
                recordsName = this.props.selectedTable.name.toLowerCase();
            }
            if (this.props.selectedTable.tableNoun) {
                recordName = this.props.selectedTable.tableNoun.toLowerCase();
            }
        }

        return (
            <div className="noRowsExist">

                <div className="noRowsIconLine">
                    <img className="noRowsIcon animated zoomInDown" alt="No Rows" src={EmptyImage} />
                </div>

                <div className="noRowsText">
                    {hasSearch ? <I18nMessage message="grid.no_filter_matches" recordsName={recordsName} recordName={recordName}/> : <I18nMessage message="grid.no_rows" recordsName={recordsName}/>}
                </div>
            </div>);
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

        if (!this.props.noRowsUI || this.props.loading || transformedRecords.length > 0) {

            return (
                <QbGrid
                    numberOfColumns={_.isArray(this.props.columns) ? this.props.columns.length : 0}
                    columns={this.transformColumns()}
                    rows={transformedRecords}
                    loading={this.props.loading}
                    appUsers={this.props.appUsers}
                    phase1={this.props.phase1}
                    showRowActionsColumn={!this.props.phase1}

                    onStartEditingRow={this.startEditingRow}
                    editingRowId={editingRecordId}
                    isInlineEditOpen={isInLineEditOpen}
                    isDraggable={false}
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
                    isEditingRowSaving={_.has(pendEdits, 'saving') ? pendEdits.saving : false}
                    headerRenderer={QbHeaderCell}
                    cellRenderer={ReportCell}
                    commonCellProps={{
                        appUsers: this.props.appUsers,
                        onCellChange: this.onCellChange,
                        onCellBlur: this.onCellBlur,
                        onCellClick: this.props.onCellClick,
                        onCellClickEditIcon: this.startEditingRow,
                        validateFieldValue: this.props.handleValidateFieldValue,
                        isInlineEditOpen: isInLineEditOpen,
                        phase1: this.props.phase1
                    }}
                    compareCellChanges={FieldUtils.compareFieldValues}
                    menuComponent={ReportColumnHeaderMenu}
                    menuProps={{
                        appId: this.props.appId,
                        tblId: this.props.tblId,
                        rptId: this.props.rptId,
                        sortFids: this.props.sortFids,
                        isOnlyOneColumnVisible: this.isOnlyOneColumnVisible()
                    }}/>);
        } else {
            // instead of grid, render a "no records" UI
            return this.renderNoRowsExist();
        }
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
        record: state.record,
        searchString: state.search && state.search.searchInput
    };
};

export default DragDropContext(TouchBackend({enableMouseEvents: true, delay: 30}))(connect(mapStateToProps)(ReportGrid));
