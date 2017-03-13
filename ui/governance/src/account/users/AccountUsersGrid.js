import React, {PropTypes, Component} from 'react';
import moment from 'moment';

import * as Table from 'reactabular-table';
import QbHeaderCell from '../../../../client-react/src/components/dataTable/qbGrid/qbHeaderCell';
import QbRow from '../../../../client-react/src/components/dataTable/qbGrid/qbRow';
import QbCell from '../../../../client-react/src/components/dataTable/qbGrid/qbCell';
import '../../../../client-react/src/components/dataTable/qbGrid/qbGrid.scss';

import {connect} from 'react-redux';
import * as AccountUsersActions from './AccountUsersActions';

const DeactivatedFlag = 0x00000040;
const DeniedFlag = 0x0008;
const CanCreateAppFlag = 0x0004;
const RealmApprovedFlag = 0x0004;
const RegisteredFlag = 0x0010;

const HasFlag = (bits, flag) => (bits & flag) !== 0;
const IsDeactivated = cellData => HasFlag(cellData.userBasicFlags, DeactivatedFlag);
const IsDenied = cellData => HasFlag(cellData.realmDirectoryFlags, DeniedFlag);
const CanCreateApps = cellData => HasFlag(cellData.accountTrusteeFlags, CanCreateAppFlag);
const IsApprovedInRealm = cellData => HasFlag(cellData.realmDirectoryFlags, RealmApprovedFlag);
const IsRegisteredInRealm = cellData => HasFlag(cellData.realmDirectoryFlags, RegisteredFlag);
const IsTimeNull = timeStr => timeStr === '1900-01-01T00:00:00Z';
const RenderBoolColumn = bool => bool ? 'Y' : '--';

const columns = [
    {
        property: 'firstName',
        header: {
            label: 'First Name',
        }
    },
    {
        property: 'lastName',
        header: {
            label: 'Last Name',
        },
    },
    {
        property: 'email',
        header: {
            label: 'Email',
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
            label: 'User Name',
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
            label: 'Last Access',
        },
        cell: {
            formatters: [
                lastAccessString => {
                    if (IsTimeNull(lastAccessString)) {
                        return 'never';
                    } else {
                        return moment(lastAccessString).fromNow();
                    }
                }
            ]
        }
    },
    {
        property: 'hasAppAccess',
        header: {
            label: 'Paid Seat?',
        },
        cell: {
            formatters: [
                (hasAppAccess, cellInfo) => {
                    const isPaidSeat = hasAppAccess && !(IsDeactivated(cellInfo.rowData) || IsDenied(cellInfo.rowData));
                    return RenderBoolColumn(isPaidSeat);
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
            label: 'In Any Group?',
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
            label: 'Group Manager?',
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
            label: 'Can create apps?',
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
            label: '# App Managed',
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
            label: 'Realm Approved?',
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
    },
    {
        property: 'realmDirectoryFlags',
        header: {
            label: 'Denied?',
        },
        cell: {
            formatters: [
                (flags, cellInfo) => {
                    return RenderBoolColumn(IsDenied(cellInfo.rowData));
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
        property: 'userBasicFlags',
        header: {
            label: 'Deactivated?',
        },
        cell: {
            formatters: [
                (flags, cellInfo) => {
                    return RenderBoolColumn(IsDeactivated(cellInfo.rowData));
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
        property: 'lastAccess',
        header: {
            label: 'Inactive?',
        },
        cell: {
            formatters: [
                (lastAccessString, cellInfo) => {
                    if (IsTimeNull(lastAccessString)) {
                        return '';
                    }
                    const isRegistered = IsRegisteredInRealm(cellInfo.rowData);
                    const daysSinceLastAccess = moment().diff(lastAccessString, 'days');
                    return RenderBoolColumn(isRegistered && daysSinceLastAccess >= 90);
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
];


class AccountUsersGrid extends Component {

    constructor(props) {
        super(props);
    }

    /**
     * get users whenever the component mounts
     */
    componentDidMount() {
        this.props.fetchAccountUsers();
    }

    render() {
        return (
            <Table.Provider
                ref="qbGridTable"
                className="qbGrid"
                columns={columns}
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
                <Table.Header className="qbHeader" />

                <Table.Body className="qbTbody"
                            rows={this.props.users}
                            rowKey="uid"
                            onRow={(row) => {
                                return {
                                    className: 'qbRow'
                                };
                            }}
                />
            </Table.Provider>
        );
    }
}


// Provide type checking
AccountUsersGrid.propTypes = {
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

