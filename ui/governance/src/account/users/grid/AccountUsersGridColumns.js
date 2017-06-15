import Locale from "../../../../../reuse/client/src/locales/locale";
import * as Formatters from "./AccountUsersGridFormatters";
import _ from "lodash";
import * as FieldConsts from "../../../../../client-react/src/constants/schema";

const boolColumnProps = {
    classes: ['BoolColumn'],
};

const GRID_COLUMN_LOCALE = 'governance.account.users.grid';

/**
 * Column Definitions for the Account Users Grid
 */
const columns = () => [
    {
        property: 'firstName',
        header: {
            label: Locale.getMessage(GRID_COLUMN_LOCALE + '.firstName')
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
            label: Locale.getMessage(GRID_COLUMN_LOCALE + '.lastName')
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
            label: Locale.getMessage(GRID_COLUMN_LOCALE + '.email')
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
            label: Locale.getMessage(GRID_COLUMN_LOCALE + '.userName')
        },
        cell: {
            formatters: [Formatters.FormatUsernameString]
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
            label: Locale.getMessage(GRID_COLUMN_LOCALE + '.lastAccess')
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
            label: Locale.getMessage(GRID_COLUMN_LOCALE + '.quickbaseAccessStatus')
        },
        cell: {
            formatters: [Formatters.FormatAccessStatusHTML]
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
            label: Locale.getMessage(GRID_COLUMN_LOCALE + '.inactive')
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
            label: Locale.getMessage(GRID_COLUMN_LOCALE + '.inAnyGroup')
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
            label: Locale.getMessage(GRID_COLUMN_LOCALE + '.groupManager')
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
            label: Locale.getMessage(GRID_COLUMN_LOCALE + '.canCreateApps')
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
            label: Locale.getMessage(GRID_COLUMN_LOCALE + '.appManager')
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
            label: Locale.getMessage(GRID_COLUMN_LOCALE + '.inRealmDirectory')
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
            label: Locale.getMessage(GRID_COLUMN_LOCALE + '.realmApproved')
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

/**
 * Filter the Columns based on the User Permissions
 * @param hasAccountAdmin
 * @param hasRealmAdmin
 * @returns {Array.<T>|*|{}}
 * @constructor
 */
export const GetAccountUsersGridColumns = (hasAccountAdmin, hasRealmAdmin) => {
    return _.filter(columns(), (c) => {
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
