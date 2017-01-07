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

    transformColumns() {
        return Column.transformColumnsForGrid(this.props.columns);
    },

    transformRecords() {
        return Row.transformRecordsForGrid(this.props.records, this.props.columns, this.props.primaryKeyName, this.state.editingRecord, this.props.pendEdits, this.props.selectedRows);
        // return Row.transformRecordsForGrid(this.props.records, this.props.columns, this.props.primaryKeyName, this.state.editingRecord, this.state.pendEdits);
    },

    startEditingRow(recordId) {
        this.props.onEditRecordStart(recordId);
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
        return <QbGrid
            numberOfColumns={_.isArray(this.props.columns) ? this.props.columns.length : 0}
            columns={this.transformColumns()}
            rows={this.transformRecords()}
            loading={this.props.loading}
            startEditingRow={this.startEditingRow}
            editingRow={this.state.editingRecord}
            appUsers={this.props.appUsers}
            onCellChange={this.onCellChange}
            onCellBlur={this.onCellBlur}
            selectedRows={this.props.selectedRows}
            onClickToggleSelectedRow={this.toggleSelectedRow}
            onClickEditIcon={this.openRecordForEdit}
            onClickDeleteIcon={this.onClickDelete}
            onClickToggleSelectAllRows={this.toggleSelectAllRows}
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
