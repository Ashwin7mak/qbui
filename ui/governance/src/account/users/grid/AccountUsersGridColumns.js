import * as Formatters from './AccountUsersGridFormatters';
import _ from 'lodash';
import * as FieldConsts from '../../../../../client-react/src/constants/schema';
import Locale from '../../../../../client-react/src/locales/locales';
import GovernanceBundleLoader from '../../../locales/governanceBundleLoader';

const boolColumnProps = {
    classes: ['BoolColumn'],
};

// GovernanceBundleLoader.changeLocale('en-us');

// Column Definitions
const columns = [
    {
        property: 'firstName',
        header: {
            label: Locale.getMessage('governance.account.users.grid.firstName')
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
            label: Locale.getMessage('governance.account.users.grid.lastName')
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
            label: Locale.getMessage('governance.account.users.grid.email')
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
            label: Locale.getMessage('governance.account.users.grid.userName')
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
            label: Locale.getMessage('governance.account.users.grid.lastAccess')
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
            label: Locale.getMessage('governance.account.users.grid.quickbaseAccessStatus')
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
            label: Locale.getMessage('governance.account.users.grid.inactive')
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
            label: Locale.getMessage('governance.account.users.grid.inAnyGroup')
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
            label: Locale.getMessage('governance.account.users.grid.groupManager')
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
            label: Locale.getMessage('governance.account.users.grid.canCreateApps')
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
            label: Locale.getMessage('governance.account.users.grid.appManager')
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
            label: Locale.getMessage('governance.account.users.grid.inRealmDirectory')
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
            label: Locale.getMessage('governance.account.users.grid.realmApproved')
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
