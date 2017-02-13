/**
 * Created by rbeyer on 2/2/17.
 */
import React, {PropTypes} from 'react';
import Logger from '../../../../utils/logger';
import QBGrid from '../../../dataTable/qbGrid/qbGrid';
import './userManagement.scss';


let logger = new Logger();

const UserManagement = React.createClass({

    propTypes: {
        appId: PropTypes.string.isRequired,
        appUsers: PropTypes.array.isRequired
    },

    createUserRows() {
        this.props.appUsers.forEach(function(user) {
            user.id = user.userId;
        });
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
                property: 'lastName',
                header: {
                    label: <span>Last Name</span>
                },
                cell: {formatters: [cellFormatter]}
            },
            {
                property: 'screenName',
                header: {
                    label: <span>Screen Name</span>
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
                property: 'userId',
                header: {
                    label: <span>User ID</span>
                },
                cell: {formatters: [cellFormatter]}
            }
        ];
        return columns;
    },

    render() {
        this.createUserRows();
        const cellFormatter = (cellData) => {return <span>{cellData}</span>;};
        const columns = this.createUserColumns(cellFormatter);
        return (
            <div className="userManagementContainer">
                <QBGrid
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
