/**
 * Created by rbeyer on 2/2/17.
 */
import React, {PropTypes} from 'react';
import * as search from 'searchtabular';
import { compose } from 'redux';
import Logger from '../../../../utils/logger';
import QBGrid from '../../../dataTable/qbGrid/qbGrid';
import './userManagement.scss';


let logger = new Logger();

const UserManagement = React.createClass({

    propTypes: {
        appId: PropTypes.string.isRequired,
        appUsers: PropTypes.array.isRequired
    },

    getInitialState() {
        return {
            searchColumn: 'all',
            query: {},
            duder: this.props.appUsers
        };
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
                property: 'userId',
                header: {
                    label: 'User ID'
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
        const resolvedRows = this.state.duder;
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
                        onColumnChange={searchColumn => this.setState({ searchColumn })}
                        onChange={query => this.setState({ query })}
                    />
                </div>
                <QBGrid
                    columns={columns}
                    rows={searchedRows}
                    numberOfColumns={columns.length}
                    showRowActionsColumn={false}
                />
            </div>
        );
    }

});

export default UserManagement;
