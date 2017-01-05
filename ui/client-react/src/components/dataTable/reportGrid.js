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
        };
    },

    transformColumns() {
        return Column.transformColumnsForGrid(this.props.columns);
    },

    transformRecords() {
        return Row.transformRecordsForGrid(this.props.records, this.props.columns, this.props.primaryKeyName, this.state.editingRecord, this.props.pendEdits);
    },

    startEditingRow(recordId) {
        this.setState({editingRecord: recordId});
        this.props.onEditRecordStart(recordId);
    },

    onCellChange(value, colDef) {
        let updatedFieldValue = {
            value: value,
            display: value
        };

        let change = {
            values: {
                oldVal: {value: colDef.value, display: colDef.display},
                newVal: updatedFieldValue
            },
            recId: colDef.recordId,
            fid: colDef.id,
            fieldName: colDef.fieldDef.name,
            fieldDef: colDef.fieldDef
        };

        this.props.onFieldChange(change);
    },

    onCellBlur(value, recordId, fieldId) {
        return;
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

export default ReportGrid;
