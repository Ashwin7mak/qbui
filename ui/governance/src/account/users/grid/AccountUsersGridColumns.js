import * as Formatters from './AccountUsersGridFormatters';
import _ from 'lodash';

// Column Definitions
const breakWordColumnProps = {
    style: {
        maxWidth: 275,
        wordWrap: 'break-word'
    }
};

const boolColumnProps = {
    classes: ['AlignCenter BoolColumn'],
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
        },
        internalQbProps: {
            forAccountAdminOnly: true
        }
    },
    {
        property: 'hasAppAccess',
        header: {
            label: 'QuickBase Access Status',
            props: boolColumnProps
        },
        cell: {
            formatters: [Formatters.FormatUserStatusHTML]
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
        props: boolColumnProps,
        internalQbProps: {
            forAccountAdminOnly: true
        }
    },
    {
        property: 'numGroupsMember',
        header: {
            label: 'In Any Group?'
        },
        cell: {
            formatters: [Formatters.FormatIsGroupMember]
        },
        props: boolColumnProps,
        internalQbProps: {
            forAccountAdminOnly: true
        }
    },
    {
        property: 'numGroupsManaged',
        header: {
            label: 'Group Manager?'
        },
        cell: {
            formatters: [Formatters.FormatIsGroupManager]
        },
        props: boolColumnProps,
        internalQbProps: {
            forAccountAdminOnly: true
        }
    },
    {
        property: 'accountTrusteeFlags',
        header: {
            label: 'Can create apps?'
        },
        cell: {
            formatters: [Formatters.FormatCanCreateApps]
        },
        props: boolColumnProps,
        internalQbProps: {
            forAccountAdminOnly: true
        }
    },
    {
        property: 'numAppsManaged',
        header: {
            label: 'App Manager?'
        },
        cell: {
            formatters: [Formatters.FormatIsAppManager]
        },
        props: boolColumnProps,
        internalQbProps: {
            forAccountAdminOnly: true
        }
    },
    {
        property: 'realmDirectoryFlags',
        header: {
            label: 'In Realm Directory?'
        },
        cell: {
            formatters: [Formatters.FormatIsInRealmDirectory]
        },
        props: boolColumnProps,
        internalQbProps: {
            forRealmAdminOnly: true
        }
    },
    {
        property: 'realmDirectoryFlags',
        header: {
            label: 'Realm Approved?'
        },
        cell: {
            formatters: [Formatters.FormatIsRealmApproved]
        },
        props: boolColumnProps,
        internalQbProps: {
            forRealmAdminOnly: true
        }
    }
];

export const GetAccountUsersGridColumns = (hasAccountAdmin, hasRealmAdmin) => {
    return _.filter(columns, (c) => {
        if (c.internalQbProps) {
            if (c.internalQbProps.forAccountAdminOnly && !hasAccountAdmin) {
                return false;
            } else if (c.internalQbProps.forRealmAdminOnly && !hasRealmAdmin) {
                return false;
            }
        }

        return true;
    });
};
