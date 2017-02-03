/**
 * Created by rbeyer on 2/2/17.
 */
import React, {PropTypes} from 'react';
import Logger from '../../../utils/logger';
import QBGrid from '../../dataTable/qbGrid/qbGrid';
import RowTransformer from '../../dataTable/qbGrid/rowTransformer';
import './userManagement.scss';


let logger = new Logger();

const UserManagement = React.createClass({

    propTypes: {
        appId: PropTypes.string.isRequired,
        appUsers: PropTypes.array.isRequired
    },

    createUserColumns(cellFormatter) {
         let columns = [
            {
                property: 'firstName',
                header: {
                    label: <span>First Name</span>
                },
                cell: {formatters: [cellFormatter]}
            },
            {
                property: 'email',
                header: {
                    label: <span>Email</span>
                },
                cell: {formatters: [cellFormatter]}
            },
            {
                property: 'screenName',
                header: {
                    label: <span>Screen Name</span>
                },
                cell: {formatters: [cellFormatter]}
            }
        ];
        return columns;
    },

    render() {
        const CellRenderer = (props) => {return <div className="customCell">{props.appUsers}</div>;};
        const cellFormatter = (cellData) => {return React.createElement(CellRenderer, cellData);};
        const columns = this.createUserColumns(cellFormatter);
        return (
            <div className="userManagementContainer">
                <QBGrid
                    cellRenderer={CellRenderer}
                    columns={columns}
                    rows={this.props.appUsers}
                    numberOfColumns={columns.length}
                    showRowActionsColumn={false}
                />
            </div>
        );
    }

});

export default UserManagement;