import React, {PropTypes} from 'react';
import QbGrid from './qbGrid/qbGridNew';
import Column from './qbGrid/column';
import Row from './qbGrid/row';
import Fluxxor from 'fluxxor';
import _ from 'lodash';

const FluxMixin = Fluxxor.FluxMixin(React);

const ReportGrid = React.createClass({
    mixins: [FluxMixin],
    propTypes: {
        records: PropTypes.array,
        columns: PropTypes.array,
        primaryKeyName: PropTypes.string.isRequired,
        loading: PropTypes.bool,
        appUsers: PropTypes.array.isRequired,
        onFieldChange: PropTypes.func.isRequired,
        onEditRecordStart: PropTypes.func.isRequired,
        pendEdits: PropTypes.object,
        selectedRows: PropTypes.array,
        onRecordDelete: PropTypes.func,
        onEditRecordCancel: PropTypes.func,
        editErrors: PropTypes.object,
        onRecordNewBlank: PropTypes.func,
        onClickRecordSave: PropTypes.func,
        isInlineEditOpen: PropTypes.bool,
        editingIndex: PropTypes.number,
        editingId: PropTypes.number,
    },

    getDefaultProps() {
        return {
            records: [],
            columns: []
        };
    },

    getInitialState() {
        return {
            editingRecord: null,
            pendEdits: {
                currentEditingRecordId: null,
                recordChanges: {}
            }
        };
    },

    componentWillReceiveProps(nextProps) {
        if (!nextProps.isInlineEditOpen) {
            this.setState({editingRecord: null});
        }
    },

    transformColumns() {
        return Column.transformColumnsForGrid(this.props.columns);
    },

    transformRecords() {
        // Editing Id trumps editingRowId when editingIndex is set
        // Editing index comes from the reportDataStore whereas editingRecord comes from the pending edits store
        // When saveAndAddAnewRow is clicked, then the reportDataStore sets the editingIndex (index of new row in array)
        // and editingId (id of newly created row).
        // TODO:: This process can be refactored once AgGrid is removed.
        let editingRowId = this.state.editingRecord;
        if (this.props.editingIndex && this.props.editingId !== editingRowId) {
            editingRowId = this.props.editingId;
        }

        return Row.transformRecordsForGrid(this.props.records, this.props.columns, this.props.primaryKeyName, editingRowId, this.props.pendEdits, this.props.selectedRows);
        // return Row.transformRecordsForGrid(this.props.records, this.props.columns, this.props.primaryKeyName, this.state.editingRecord, this.state.pendEdits);
    },

    startEditingRow(recordId) {
        this.props.onEditRecordStart(recordId);
        // TODO:: Refactor out this state and use a passed in prop (perhaps something from pendEdits?)
        this.setState({editingRecord: recordId});
        // this.setState({pendEdits: {currentEditingRecordId: recordId, recordChanges: {}}});
    },

    onCellChange(value, colDef) {
        let updatedFieldValue = {
            value: value,
            display: value
        };

        this.props.onFieldChange(formatChange(updatedFieldValue, colDef));
        // Comment out the line above, and uncomment out this line and the line in transformRecords to see performance when not using the pendEdits store and
        // relying on props to work their way down the React tree.
        // let localPendEdits = Object.assign({}, this.state.pendEdits);
        // localPendEdits.recordChanges[colDef.id] = change.values;
        // this.setState({pendEdits: localPendEdits});
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
        this.selectRows(selected);
    },

    deselectAllRows() {
        this.selectRows([]);
    },

    selectRows(selectedRowIds) {
        this.getFlux().actions.selectedRows(selectedRowIds);
    },

    toggleSelectAllRows() {
        const allSelected = this.props.selectedRows.length === this.props.records.length;

        if (allSelected) {
            this.deselectAllRows();
        } else {
            this.selectAllRows();
        }
    },

    toggleSelectedRow(id) {
        const flux = this.getFlux();

        let selectedRows = this.props.selectedRows;

        if (selectedRows.indexOf(id) === -1) {
            // not already selected, add to selectedRows
            selectedRows.push(id);
        } else {
            // already selected, remove from selectedRows
            selectedRows = _.without(selectedRows, id);
        }
        flux.actions.selectedRows(selectedRows);
    },

    /**
     * edit the selected record in the trowser
     * @param data row record data
     */
    openRecordForEdit(recordId) {
        this.getFlux().actions.openRecordForEdit(recordId);
    },

    onClickDelete(recordId) {
        if (this.props.onRecordDelete) {
            this.props.onRecordDelete(recordId);
        }
    },

    render() {
        let isRecordValid = true;
        if (_.has(this.props, 'editErrors.ok')) {
            isRecordValid = this.props.editErrors.ok;
        }

        return <QbGrid
            numberOfColumns={_.isArray(this.props.columns) ? this.props.columns.length : 0}
            columns={this.transformColumns()}
            rows={this.transformRecords()}
            loading={this.props.loading}
            onStartEditingRow={this.startEditingRow}
            editingRowId={this.state.editingRecord}
            appUsers={this.props.appUsers}
            onCellChange={this.onCellChange}
            onCellBlur={this.onCellBlur}
            selectedRows={this.props.selectedRows}
            onClickToggleSelectedRow={this.toggleSelectedRow}
            onClickEditIcon={this.openRecordForEdit}
            onClickDeleteIcon={this.onClickDelete}
            onClickToggleSelectAllRows={this.toggleSelectAllRows}
            onCancelEditingRow={this.props.onEditRecordCancel}
            editingRowErrors={this.props.editErrors}
            isEditingRowValid={isRecordValid}
            onClickAddNewRow={this.props.onRecordNewBlank}
            onClickSaveRow={this.props.onClickRecordSave}
            isEditingRowSaving={_.has(this.props, 'pendEdits.saving') ? this.props.pendEdits.saving : false}
        />;
    }
});

// Private methods
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
