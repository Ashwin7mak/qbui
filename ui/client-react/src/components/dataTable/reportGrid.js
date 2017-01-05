import React, {PropTypes} from 'react';
import QbGrid from './qbGrid/qbGridNew';
import Column from './qbGrid/column';
import Row from './qbGrid/row';

const ReportGrid = React.createClass({
    propTypes: {
        records: PropTypes.array,
        columns: PropTypes.array,
        primaryKeyName: PropTypes.string.isRequired,
        loading: PropTypes.bool,
        appUsers: PropTypes.array.isRequired,
        onFieldChange: PropTypes.func.isRequired,
        onEditRecordStart: PropTypes.func.isRequired,
        pendEdits: PropTypes.object,
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
        return Row.transformRecordsForGrid(this.props.records, this.props.columns, this.props.primaryKeyName, this.state.editingRecord, this.props.pendEdits);
        // return Row.transformRecordsForGrid(this.props.records, this.props.columns, this.props.primaryKeyName, this.state.editingRecord, this.state.pendEdits);
    },

    startEditingRow(recordId) {
        this.setState({editingRecord: recordId});
        // this.props.onEditRecordStart(recordId);
        this.setState({pendEdits: {currentEditingRecordId: recordId, recordChanges: {}}});
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

    render() {
        return <QbGrid
            columns={this.transformColumns()}
            rows={this.transformRecords()}
            loading={this.props.loading}
            startEditingRow={this.startEditingRow}
            editingRow={this.state.editingRecord}
            appUsers={this.props.appUsers}
            onCellChange={this.onCellChange}
            onCellBlur={this.onCellBlur}
        />;
    }
});

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
