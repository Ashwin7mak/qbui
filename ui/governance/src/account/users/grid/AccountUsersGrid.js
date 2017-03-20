import React, {PropTypes, Component} from 'react';


import * as Table from 'reactabular-table';
import QbHeaderCell from '../../../../../client-react/src/components/dataTable/qbGrid/qbHeaderCell';
import QbRow from '../../../../../client-react/src/components/dataTable/qbGrid/qbRow';
import QbCell from '../../../../../client-react/src/components/dataTable/qbGrid/qbCell';
import '../../../../../client-react/src/components/dataTable/qbGrid/qbGrid.scss';

import {connect} from 'react-redux';
import * as AccountUsersActions from '../AccountUsersActions';
import * as Formatters from './AccountUsersGridFormatters';

// Column Definitions
const breakWordColumnProps = {
    style: {
        maxWidth: 275,
        wordWrap: 'break-word'
    }
};

const boolColumnProps = {
    classes: ['AlignCenter'],
    style: {
        maxWidth: 80
    }
};

const columns = [
    {
        property: 'firstName',
        header: {
            label: 'First Name'
        }
    },
    {
        property: 'lastName',
        header: {
            label: 'Last Name'
        },
    },
    {
        property: 'email',
        header: {
            label: 'Email'
        },
        props: breakWordColumnProps
    },
    {
        property: 'userName',
        header: {
            label: 'User Name'
        },
        props: breakWordColumnProps
    },
    {
        property: 'lastAccess',
        header: {
            label: 'Last Access'
        },
        cell: {
            formatters: [Formatters.FormatLastAccessString]
        }
    },
    {
        property: 'hasAppAccess',
        header: {
            label: 'QuickBase Access Status'
        },
        cell: {
            formatters: [Formatters.FormatUserStatusText]
        }
    },
    {
        property: 'lastAccess',
        header: {
            label: 'Inactive?'
        },
        cell: {
            formatters: [Formatters.FormatIsInactive]
        },
        props: boolColumnProps
    },
    {
        property: 'numGroupsMember',
        header: {
            label: 'In Any Group?'
        },
        cell: {
            formatters: [Formatters.FormatIsGroupMember]
        },
        props: boolColumnProps
    },
    {
        property: 'numGroupsManaged',
        header: {
            label: 'Group Manager?'
        },
        cell: {
            formatters: [Formatters.FormatIsGroupManager]
        },
        props: boolColumnProps
    },
    {
        property: 'accountTrusteeFlags',
        header: {
            label: 'Can create apps?'
        },
        cell: {
            formatters: [Formatters.FormatCanCreateApps]
        },
        props: boolColumnProps
    },
    {
        property: 'numAppsManaged',
        header: {
            label: 'App Manager?'
        },
        cell: {
            formatters: [Formatters.FormatIsAppManager]
        },
        props: boolColumnProps
    },
    {
        property: 'realmDirectoryFlags',
        header: {
            label: 'In Realm Directory?'
        },
        cell: {
            formatters: [Formatters.FormatIsInRealmDirectory]
        },
        props: boolColumnProps
    },
    {
        property: 'realmDirectoryFlags',
        header: {
            label: 'Realm Approved?'
        },
        cell: {
            formatters: [Formatters.FormatIsRealmApproved]
        },
        props: boolColumnProps
    }
];

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

    constructor(props) {
        super(props);
    }

    /**
     * get users whenever the component mounts
     */
    componentDidMount() {
        this.props.fetchAccountUsers(this.props.accountId);
    }

    render() {
        return (
            <Table.Provider
                ref="qbGridTable"
                className="qbGrid"
                columns={columns}
                components={tableSubComponents}
            >
                <Table.Header className="qbHeader" />

                <Table.Body className="qbTbody"
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
    accountId: React.PropTypes.string.isRequired,
    users: React.PropTypes.array,
    fetchAccountUsers: React.PropTypes.func.isRequired
};

// Provide default val
AccountUsersGrid.defaultProps = {
    users: []
};

export {AccountUsersGrid};

const mapStateToProps = (state) => {
    return {
        users: state.AccountUsers.users
    };
};


export default connect(
    mapStateToProps,
    AccountUsersActions
)(AccountUsersGrid);

