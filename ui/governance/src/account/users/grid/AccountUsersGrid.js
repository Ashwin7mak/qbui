import React, {PropTypes, Component} from 'react';

import * as Table from 'reactabular-table';

import QbHeaderCell from '../../../../../client-react/src/components/dataTable/qbGrid/qbHeaderCell';
import QbRow from '../../../../../client-react/src/components/dataTable/qbGrid/qbRow';
import QbCell from '../../../../../client-react/src/components/dataTable/qbGrid/qbCell';
import '../../../../../client-react/src/components/dataTable/qbGrid/qbGrid.scss';


import {GetAccountUsersGridColumns} from './AccountUsersGridColumns';

import "./AccountUsersGrid.scss";

// Sub-component pieces we will be using to override React Tabular's default components
const tableSubComponents = {
    header: {
        cell: QbHeaderCell
    },
    body: {
        row: QbRow,
        cell: QbCell
    }
};

// Helper function to return additional props to add to a row element
const onRowFn = (row) => {
    return {
        className: 'qbRow'
    };
};

/**
 * Renders the grid portion of the AccountUsers view
 */
class AccountUsersGrid extends Component {
    render() {
        return (
            <Table.Provider
                ref="qbGridTable"
                className="qbGrid"
                columns={GetAccountUsersGridColumns(this.props.showAccountColumns, this.props.showRealmColumns)}
                components={tableSubComponents}
                >
                <Table.Header className="qbHeader" />

                <Table.Body
                    className="qbTbody"
                    rows={this.props.users}
                    rowKey="uid"
                    onRow={onRowFn}
                    />
            </Table.Provider>
        );
    }
}


// Provide type checking
AccountUsersGrid.propTypes = {
    users: PropTypes.array,
    showAccountColumns: PropTypes.bool,
    showRealmColumns: PropTypes.bool
};

// Provide default val
AccountUsersGrid.defaultProps = {
    users: []
};

export default AccountUsersGrid;

