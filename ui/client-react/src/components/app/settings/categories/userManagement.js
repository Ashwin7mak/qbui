/**
 * Created by rbeyer on 2/16/17.
 */
import React, {PropTypes} from 'react';
import * as Table from 'reactabular-table';
import QbHeaderCell from '../../../dataTable/qbGrid/qbHeaderCell';
import QbRow from '../../../dataTable/qbGrid/qbRow';
import QbCell from '../../../dataTable/qbGrid/qbCell';
import EmailFieldValueRenderer from '../../../fields/emailFieldValueRenderer';
import '../../../dataTable/qbGrid/qbGrid.scss';
import './userManagement.scss';
import UserRowActions from  './userRowActions';

const ICON_ACTIONS_COLUMN_ID = 'ICON_ACTIONS';
/**
 * This class is the layout for App Users Management screen
 * We build a reactabular table and style it to match the rest, adding functionality as needed.
 * The list of columns in the table is static
 *
 * @param appId
 * @param appUsers the unfiltered list of Users in the app (meaning the role name and other pertinent information hasn't be added to the user object yet)
 * @param appRoles the list of roles associated with this app
 * @type {ClassicComponentClass<P>}
 */
class UserManagement extends React.Component {

    constructor(...args) {
        super(...args);
        this.createUserColumns = this.createUserColumns.bind(this);
        this.createUserRows = this.createUserRows.bind(this);
        this.getActionsCell = this.getActionsCell.bind(this);
        this.getActionCellProps = this.getActionCellProps.bind(this);
        this.getCheckboxHeader = this.getCheckboxHeader.bind(this);
        this.onClickToggleSelectedRow = this.onClickToggleSelectedRow.bind(this);
        this.userIsSelected = this.userIsSelected.bind(this);
    }

    createUserColumns(cellFormatter) {
        const cellFormatterEmail = (cellData) => {return <EmailFieldValueRenderer value={cellData} display={cellData}/>;};
        let columns = [
            {
                property: 'name',
                header: {
                    label: 'Name'
                },
                cell: {formatters: [cellFormatter]}
            },
            {
                property: 'roleName',
                header: {
                    label: 'Role'
                },
                cell: {formatters: [cellFormatter]}
            },
            {
                property: 'email',
                header: {
                    label: 'Email'
                },
                cell: {formatters: [cellFormatterEmail]}
            },
            {
                property: 'screenName',
                header: {
                    label: 'User name'
                },
                cell: {formatters: [cellFormatter]}
            }
        ];
        return columns;
    }

    userIsSelected(selectedRows, userId, roleId) {
        const rows = _.find(selectedRows, (user)=>{
            return user.id === userId && user.roleId === roleId;
        });
        return Boolean(rows);
    }
    createUserRows() {
        let appUsersFiltered = [];
        let appUsers = this.props.appUsers;
        let selectedRows = this.props.selectedRows;
        let self = this;
        this.props.appRoles.forEach(function(role) {
            if (appUsers[role.id]) {
                appUsers[role.id].forEach(function(user) {
                    user.roleName = role.name;
                    user.name = (user.firstName ? `${user.firstName} ` : "") + (user.lastName ? user.lastName : "");
                    user.roleId = role.id;
                    user.isSelected = self.userIsSelected(selectedRows, user.userId, role.id);
                    appUsersFiltered.push(user);
                });
            }
        });
        appUsersFiltered.sort(function(a, b) {
            if (a.firstName < b.firstName) {return -1;}
            if (a.firstName > b.firstName) {return 1;}
            return 0;
        });
        return appUsersFiltered;
    }

    getActionsCell(_cellDataRow, rowProps) {
        return <UserRowActions
            rowId={rowProps.rowData.userId}
            roleId={rowProps.rowData.roleId}
            isSelected={rowProps.rowData.isSelected}
            onClickToggleSelectedRow={this.onClickToggleSelectedRow}
        />;
    }

    getActionCellProps() {
        return {
            isStickyCell: true
        };
    }

    /**
     * get the 1st column header (select-all toggle)
     * @returns {React}
     */
    getCheckboxHeader() {
        let collapseAllIcon = null;
        return (
            <div className="actionHeader">
                <input
                    type="checkbox"
                    className={`selectAllCheckbox`}
                    checked={this.props.areAllRowsSelected}
                    onChange={this.props.onClickToggleSelectAllRows}
                />
                {collapseAllIcon}
            </div>
        );
    }

    onClickToggleSelectedRow(id, roleId) {
        const {onClickToggleSelectedRow} = this.props;
        onClickToggleSelectedRow(id, roleId);
    }

    render() {
        const resolvedRows = this.createUserRows();
        const cellFormatter = (cellData) => {return <span>{cellData}</span>;};
        const columns = [
            ...[{
                property: ICON_ACTIONS_COLUMN_ID,
                headerClass: "gridHeaderCell",
                header: {
                    props: {
                        scope: 'col'
                    },
                    label: this.getCheckboxHeader(),
                    transforms: [this.getActionCellProps],
                },
                cell: {
                    formatters: [this.getActionsCell],
                    transforms: [this.getActionCellProps],
                }
            }],
            ...this.createUserColumns(cellFormatter)
        ];

        return (
        resolvedRows.length > 0 &&
            <div className="userManagementReport">
                <Table.Provider columns={columns} className="qbGrid"

                    components={{
                        header: {
                            cell: QbHeaderCell
                        },
                        body: {
                            row: QbRow,
                            cell: QbCell
                        }
                    }}
                >
                    <Table.Header headerRows={[columns]} className="qbHeader"/>
                    <Table.Body rows={resolvedRows} rowKey="userId"
                                className="qbTbody"
                                onRow={(row) => {
                                    return {
                                        className: 'qbRow'
                                    };
                                }}
                    />
                </Table.Provider>
            </div>
        );
    }

}

UserManagement.propTypes = {
    appId: PropTypes.string.isRequired,
    appUsers: PropTypes.object.isRequired,
    appRoles: PropTypes.array.isRequired
};

export default UserManagement;
