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
        return Row.transformRecordsForGrid(this.props.records, this.props.columns, this.props.primaryKeyName, this.state.editingRecord);
    },

    startEditingRow(recordId) {
        console.log("eidting new row " + recordId);
        this.setState({editingRecord: recordId});
    },

    render() {
        return <QbGrid
            columns={this.transformColumns()}
            rows={this.transformRecords()}
            loading={this.props.loading}
            startEditingRow={this.startEditingRow}
            editingRow={this.state.editingRecord}
            appUsers={this.props.appUsers}
        />;
    }
});

export default ReportGrid;
