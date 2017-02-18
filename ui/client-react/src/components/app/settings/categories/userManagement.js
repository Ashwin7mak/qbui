/**
 * Created by rbeyer on 2/16/17.
 */
import React, {PropTypes} from 'react';
import * as search from 'searchtabular';
import * as Table from 'reactabular-table';
import {compose} from 'redux';
import './userManagement.scss';

class UserManagement extends React.Component {

    constructor(...args) {
        super(...args);
        this.state = {
            searchColumn: 'all',
            query: {}
        };
        this.createUserColumns = this.createUserColumns.bind(this);
        this.createUserRows = this.createUserRows.bind(this);
    }

    createUserColumns(cellFormatter) {
        let columns = [
            {
                property: 'firstName',
                header: {
                    label: 'First Name'
                },
                cell: {formatters: [cellFormatter]}
            },
            {
                property: 'lastName',
                header: {
                    label: 'Last Name'
                },
                cell: {formatters: [cellFormatter]}
            },
            {
                property: 'screenName',
                header: {
                    label: 'Screen Name'
                },
                cell: {formatters: [cellFormatter]}
            },
            {
                property: 'email',
                header: {
                    label: 'Email'
                },
                cell: {formatters: [cellFormatter]}
            },
            {
                property: 'roleName',
                header: {
                    label: 'Role'
                },
                cell: {formatters: [cellFormatter]}
            }
        ];
        return columns;
    }

    createUserRows() {
        //this will add the role name to the user object
        //this is soooooo inefficient
        let appRoles = this.props.appRoles;
        this.props.appUsers.forEach(function(user) {
            appRoles.forEach(function(appRole) {
                if (appRole.id == user.roleId) {
                    user.roleName = appRole.name;
                }
            });
        });
    }

    render() {
        this.createUserRows();
        const cellFormatter = (cellData) => {return <span>{cellData}</span>;};
        const columns = this.createUserColumns(cellFormatter);
        const resolvedRows = this.props.appUsers;
        const query = this.state.query;
        const searchedRows = compose(
            search.highlighter({
                columns: columns,
                matches: search.matches,
                query
            }),
            search.multipleColumns({
                columns: columns,
                query
            }),
        )(resolvedRows);
        return (
            <div className="userManagementContainer">
                <div className="search-container">
                    <span>Search</span>
                    <search.Field
                        column={this.state.searchColumn}
                        query={query}
                        columns={columns}
                        rows={resolvedRows}
                        onColumnChange={searchColumn => this.setState({searchColumn})}
                        onChange={query => this.setState({query})}
                    />
                </div>
                <Table.Provider columns={columns} className="userGrid">
                    <Table.Header headerRows={[columns]} />
                    <Table.Body rows={searchedRows} rowKey="userId" className="userTBody"/>
                </Table.Provider>
            </div>
        );
    }

}

UserManagement.propTypes = {
    appId: PropTypes.string.isRequired,
    appUsers: PropTypes.array.isRequired,
    appRoles: PropTypes.array.isRequired
};

export default UserManagement;
