import React, {PropTypes} from 'react';
import QbGrid from './qbGrid/qbGridNew';
import Column from './qbGrid/column';
import Row from './qbGrid/row';

const ReportGrid = React.createClass({
    propTypes: {
        records: PropTypes.array,
        columns: PropTypes.array,
        primaryKeyName: PropTypes.string.isRequired,
        loading: PropTypes.bool
    },

    getDefaultProps() {
        return {
            records: [],
            columns: []
        };
    },

    transformColumns() {
        return Column.transformColumnsForGrid(this.props.columns);
    },

    transformRecords() {
        return Row.transformRecordsForGrid(this.props.records, this.props.columns, this.props.primaryKeyName);
    },

    render() {
        return <QbGrid
            columns={this.transformColumns()}
            rows={this.transformRecords()}
            loading={this.props.loading}
        />;
    }
});

export default ReportGrid;
