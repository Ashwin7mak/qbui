import * as Formatters from './AccountUsersGridFormatters';
import _ from 'lodash';
import * as FieldConsts from '../../../../../client-react/src/constants/schema';

const boolColumnProps = {
    classes: ['BoolColumn'],
};

// Column Definitions
const columns = [
    {
        property: 'firstName',
        header: {
            label: 'First name'
        },
        fieldDef: {
            id: 1,
            datatypeAttributes: {
                type: FieldConsts.TEXT
            }
        }
    },
    {
        property: 'lastName',
        header: {
            label: 'Last name'
        },
        fieldDef: {
            id: 2,
            datatypeAttributes: {
                type: FieldConsts.TEXT
            }
        }
    },
    {
        property: 'email',
        header: {
            label: 'Email'
        },
        props: {
            classes: ['EmailColumn']
        },
        fieldDef: {
            id: 3,
            datatypeAttributes: {
                type: FieldConsts.EMAIL_ADDRESS
            }
        }
    },
    {
        property: 'userName',
        header: {
            label: 'User name'
        },
        props: {
            classes: ['ScreennameColumn']
        },
        fieldDef: {
            id: 4,
            datatypeAttributes: {
                type: FieldConsts.TEXT
            }
        }
    },
    {
        property: 'lastAccess',
        header: {
            label: 'Last access'
        },
        cell: {
            formatters: [Formatters.FormatLastAccessString]
        },
        internalQbProps: {
            forAccountAdminOnly: true
        },
        fieldDef: {
            id: 5,
            datatypeAttributes: {
                type: FieldConsts.DATE_TIME
            }
        }
    },
    {
        property: 'hasAppAccess',
        header: {
            label: 'QuickBase access status'
        },
        cell: {
            formatters: [Formatters.FormatUserStatusHTML]
        },
        fieldDef: {
            id: 6,
            datatypeAttributes: {
                type: FieldConsts.TEXT
            }
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
        },
        fieldDef: {
            id: 7,
            datatypeAttributes: {
                type: FieldConsts.CHECKBOX
            }
        }
    },
    {
        property: 'numGroupsMember',
        header: {
            label: 'In any group?'
        },
        cell: {
            formatters: [Formatters.FormatIsGroupMember]
        },
        props: boolColumnProps,
        internalQbProps: {
            forAccountAdminOnly: true
        },
        fieldDef: {
            id: 8,
            datatypeAttributes: {
                type: FieldConsts.CHECKBOX
            }
        }
    },
    {
        property: 'numGroupsManaged',
        header: {
            label: 'Group manager?'
        },
        cell: {
            formatters: [Formatters.FormatIsGroupManager]
        },
        props: boolColumnProps,
        internalQbProps: {
            forAccountAdminOnly: true
        },
        fieldDef: {
            id: 9,
            datatypeAttributes: {
                type: FieldConsts.CHECKBOX
            }
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
        },
        fieldDef: {
            id: 10,
            datatypeAttributes: {
                type: FieldConsts.CHECKBOX
            }
        }
    },
    {
        property: 'numAppsManaged',
        header: {
            label: 'App manager?'
        },
        cell: {
            formatters: [Formatters.FormatIsAppManager]
        },
        props: boolColumnProps,
        internalQbProps: {
            forAccountAdminOnly: true
        },
        fieldDef: {
            id: 11,
            datatypeAttributes: {
                type: FieldConsts.CHECKBOX
            }
        }
    },
    {
        property: 'realmDirectoryFlags',
        header: {
            label: 'In realm directory?'
        },
        cell: {
            formatters: [Formatters.FormatIsInRealmDirectory]
        },
        props: boolColumnProps,
        internalQbProps: {
            forRealmAdminOnly: true
        },
        fieldDef: {
            id: 12,
            datatypeAttributes: {
                type: FieldConsts.CHECKBOX
            }
        }
    },
    {
        property: 'realmDirectoryFlags',
        header: {
            label: 'Realm approved?'
        },
        cell: {
            formatters: [Formatters.FormatIsRealmApproved]
        },
        props: boolColumnProps,
        internalQbProps: {
            forRealmAdminOnly: true
        },
        fieldDef: {
            id: 13,
            datatypeAttributes: {
                type: FieldConsts.CHECKBOX
            }
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
