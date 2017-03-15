import React, {PropTypes, Component} from 'react';
import moment from 'moment';

import * as Table from 'reactabular-table';
import QbHeaderCell from '../../../../client-react/src/components/dataTable/qbGrid/qbHeaderCell';
import QbRow from '../../../../client-react/src/components/dataTable/qbGrid/qbRow';
import QbCell from '../../../../client-react/src/components/dataTable/qbGrid/qbCell';
import '../../../../client-react/src/components/dataTable/qbGrid/qbGrid.scss';

import {connect} from 'react-redux';
import * as AccountUsersActions from './AccountUsersActions';

// Realm/User/Account Flag constants
const DeactivatedFlag = 0x00000040;
const DeniedFlag = 0x0008;
const CanCreateAppFlag = 0x0004;
const RealmApprovedFlag = 0x0004;
const RegisteredFlag = 0x0010;

// Helper Flag Functions
const HasFlag = (bits, flag) => (bits & flag) !== 0;
const IsDeactivated = cellData => HasFlag(cellData.userBasicFlags, DeactivatedFlag);
const IsDenied = cellData => HasFlag(cellData.realmDirectoryFlags, DeniedFlag);
const CanCreateApps = cellData => HasFlag(cellData.accountTrusteeFlags, CanCreateAppFlag);
const IsApprovedInRealm = cellData => HasFlag(cellData.realmDirectoryFlags, RealmApprovedFlag);
const HasAnyRealmPermissions = cellData => cellData.realmDirectoryFlags !== 0;
const HasAnySystemPermissions = cellData => cellData.systemRights !== 0;

// Render Helpers
const IsTimeNull = timeStr => timeStr === '1900-01-01T00:00:00Z';
const RenderBoolColumn = bool => bool ? 'Y' : '--';

// Column Definitions
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
        props: {
            style: {
                maxWidth: 275,
                wordWrap: 'break-word'
            }
        }
    },
    {
        property: 'userName',
        header: {
            label: 'User Name'
        },
        props: {
            style: {
                maxWidth: 275,
                wordWrap: 'break-word'
            }
        }
    },
    {
        property: 'lastAccess',
        header: {
            label: 'Last Access'
        },
        cell: {
            formatters: [
                lastAccessString => {
                    if (IsTimeNull(lastAccessString)) {
                        return 'never';
                    } else {
                        return moment(lastAccessString).format("MMMM D YYYY");
                    }
                }
            ]
        }
    },
    {
        property: 'hasAppAccess',
        header: {
            label: 'QuickBase Access Status'
        },
        cell: {
            formatters: [
                (hasAppAccess, cellInfo) => {
                    if (IsDeactivated(cellInfo.rowData)) {
                        return "Deactivated";
                    } else if (IsDenied(cellInfo.rowData)) {
                        return "Denied";
                    } else if (HasAnySystemPermissions(cellInfo.rowData)) {
                        return "QuickBase Staff";
                    } else if (hasAppAccess) {
                        return "Paid Seat";
                    } else {
                        return "";
                    }
                }
            ]
        }
    },
    {
        property: 'lastAccess',
        header: {
            label: 'Inactive?'
        },
        cell: {
            formatters: [
                (lastAccessString, cellInfo) => {
                    if (IsTimeNull(lastAccessString)) {
                        return RenderBoolColumn(false);
                    } else {
                        const daysSinceLastAccess = moment().diff(lastAccessString, 'days');
                        return RenderBoolColumn(daysSinceLastAccess >= 180);
                    }

                }
            ]
        },
        props: {
            classes: ['qbIconOnlyCell'],
            style: {
                maxWidth: 100
            }
        }
    },
    {
        property: 'numGroupsMember',
        header: {
            label: 'In Any Group?'
        },
        cell: {
            formatters: [
                (numGroupsMember, cellInfo) => {
                    return RenderBoolColumn(numGroupsMember > 0);
                }
            ]
        },
        props: {
            classes: ['qbIconOnlyCell'],
            style: {
                maxWidth: 100
            }
        }
    },
    {
        property: 'numGroupsManaged',
        header: {
            label: 'Group Manager?'
        },
        cell: {
            formatters: [
                (numGroupsManaged, cellInfo) => {
                    return RenderBoolColumn(numGroupsManaged > 0);
                }
            ]
        },
        props: {
            classes: ['qbIconOnlyCell'],
            style: {
                maxWidth: 100
            }
        }
    },
    {
        property: 'accountTrusteeFlags',
        header: {
            label: 'Can create apps?'
        },
        cell: {
            formatters: [
                (accountTrusteeFlags, cellInfo) => {
                    return RenderBoolColumn(CanCreateApps(cellInfo.rowData));
                }
            ]
        },
        props: {
            classes: ['qbIconOnlyCell'],
            style: {
                maxWidth: 100
            }
        }
    },
    {
        property: 'numAppsManaged',
        header: {
            label: '# Apps Managed'
        },
        props: {
            style: {
                maxWidth: 100
            }
        }
    },
    {
        property: 'realmDirectoryFlags',
        header: {
            label: 'In Realm Directory?'
        },
        cell: {
            formatters: [
                (flags, cellInfo) => {
                    return RenderBoolColumn(HasAnyRealmPermissions(cellInfo.rowData));
                }
            ]
        },
        props: {
            classes: ['qbIconOnlyCell'],
            style: {
                maxWidth: 100
            }
        }
    },
    {
        property: 'realmDirectoryFlags',
        header: {
            label: 'Realm Approved?'
        },
        cell: {
            formatters: [
                (flags, cellInfo) => {
                    return RenderBoolColumn(IsApprovedInRealm(cellInfo.rowData));
                }
            ]
        },
        props: {
            classes: ['qbIconOnlyCell'],
            style: {
                maxWidth: 100
            }
        }
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

