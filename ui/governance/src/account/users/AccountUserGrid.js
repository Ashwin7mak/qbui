import React, {PropTypes, Component} from 'react';
import moment from 'moment';

import data from './AccountUserGridTempData';

import * as Table from 'reactabular-table';
import QbHeaderCell from '../../../../client-react/src/components/dataTable/qbGrid/qbHeaderCell';
import QbRow from '../../../../client-react/src/components/dataTable/qbGrid/qbRow';
import QbCell from '../../../../client-react/src/components/dataTable/qbGrid/qbCell';
import '../../../../client-react/src/components/dataTable/qbGrid/qbGrid.scss';

const DeactivatedFlag = 0x00000040;
const DeniedFlag = 0x0008;
const CanCreateAppFlag = 0x0004;
const RealmApprovedFlag = 0x0004;
const RegisteredFlag = 0x0010;

const HasFlag = (bits, flag) => {return (bits & flag) !== 0;};
const IsDeactivated = (cellData) => {return HasFlag(cellData.userBasicFlags, DeactivatedFlag);};
const IsDenied = (cellData) => {return HasFlag(cellData.realmDirectoryFlags, DeniedFlag);};
const CanCreateApps = (cellData) => {return HasFlag(cellData.accountTrusteeFlags, CanCreateAppFlag);};
const IsApprovedInRealm = (cellData) => {return HasFlag(cellData.realmDirectoryFlags, RealmApprovedFlag);};
const IsRegisteredInRealm = (cellData) => {return HasFlag(cellData.realmDirectoryFlags, RegisteredFlag);};
const IsTimeNull = (timeStr ) => { return timeStr === '0001-01-01T00:00:00Z';}

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
                    const isPaidSet = hasAppAccess && !(IsDeactivated(cellInfo.rowData) || IsDenied(cellInfo.rowData));
                    return isPaidSet ? 'Check' : '';
                }
            ]
        },
        props: {
            style: {
                maxWidth: 100
            }
        }
    },
    {
        property: 'numGroupsMember',
        header: {
            label: '# Groups',
        },
        props: {
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
                    return numGroupsManaged > 0 ? 'Check' : '';
                }
            ]
        },
        props: {
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
                    return CanCreateApps(cellInfo.rowData) ? 'Check' : '';
                }
            ]
        },
        props: {
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
                    return IsApprovedInRealm(cellInfo.rowData) ? 'Check' : '';
                }
            ]
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
            label: 'Denied?',
        },
        cell: {
            formatters: [
                (flags, cellInfo) => {
                    return IsDenied(cellInfo.rowData) ? 'Check' : '';
                }
            ]
        },
        props: {
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
                    return IsDeactivated(cellInfo.rowData) ? 'Check' : '';
                }
            ]
        },
        props: {
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
                    return isRegistered && daysSinceLastAccess >= 90 ? 'Check' : '';
                }
            ]
        },
        props: {
            style: {
                maxWidth: 100
            }
        }
    },
];

class AccountUsersGrid extends Component {
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
                            rows={data}
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

export default AccountUsersGrid;
