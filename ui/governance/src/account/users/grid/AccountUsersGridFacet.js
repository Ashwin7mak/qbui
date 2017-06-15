import Locale from "../../../../../reuse/client/src/locales/locale";
import * as SCHEMACONSTS from "../../../../../client-react/src/constants/schema";
import * as Formatters from "./AccountUsersGridFormatters";
import * as RealmUserAccountFlagConstants from "../../../common/constants/RealmUserAccountFlagConstants.js";

/**
 * These are all the fields that the Users Grid Supports
 * Different User Permissions shows and hides the different facet fields
 */
export const FACET_FIELDS = () => [
    {
        name: Locale.getMessage("governance.account.users.userStatus"),
        type: SCHEMACONSTS.TEXT,
        needsAccountAdmin:true,
        needsRealmAdmin:true,
        options: ['Registered', 'Unregistered', 'Unverified'],
        formatter: user => Formatters.FormatUserStatusText(user.hasAppAccess, {rowData: user})
    },
    {
        name: Locale.getMessage("governance.account.users.accessStatus"),
        type: SCHEMACONSTS.TEXT,
        needsAccountAdmin:true,
        needsRealmAdmin:true,
        options: ['Deactivated', 'Denied', 'No App Access', 'Paid Seat', 'Quick Base Staff'],
        formatter: user => Formatters.FormatAccessStatusText(user.hasAppAccess, {rowData: user})
    },
    {
        name: Locale.getMessage("governance.account.users.paidSeatSingular"),
        type: SCHEMACONSTS.CHECKBOX,
        needsAccountAdmin:true,
        needsRealmAdmin:true,
        options: ['Yes', 'No'],
        formatter: user => 'Paid Seat' === Formatters.FormatAccessStatusText(user.hasAppAccess, {rowData: user})
    },
    {
        name: Locale.getMessage("governance.account.users.quickbaseStaff"),
        type: SCHEMACONSTS.CHECKBOX,
        needsAccountAdmin:true,
        needsRealmAdmin:true,
        options: ['Yes', 'No'],
        formatter: user => RealmUserAccountFlagConstants.HasAnySystemPermissions(user)
    },
    {
        name: Locale.getMessage("governance.account.users.inactive"),
        type: SCHEMACONSTS.CHECKBOX,
        needsAccountAdmin:true,
        needsRealmAdmin:false,
        options: ['Yes', 'No'],
        formatter: user => Formatters.FormatIsInactiveBool(user.lastAccess, {rowData: user})
    },
    {
        name: Locale.getMessage("governance.account.users.inGroup"),
        type: SCHEMACONSTS.CHECKBOX,
        needsAccountAdmin:true,
        needsRealmAdmin:false,
        options: ['Yes', 'No'],
        formatter: user => user.numGroupsMember > 0
    },
    {
        name: Locale.getMessage("governance.account.users.groupManager"),
        type: SCHEMACONSTS.CHECKBOX,
        needsAccountAdmin:true,
        needsRealmAdmin:false,
        options: ['Yes', 'No'],
        formatter: user => user.numGroupsManaged > 0
    },
    {
        name: Locale.getMessage("governance.account.users.canCreateApps"),
        type: SCHEMACONSTS.CHECKBOX,
        needsAccountAdmin:true,
        needsRealmAdmin:false,
        options: ['Yes', 'No'],
        formatter: user => RealmUserAccountFlagConstants.CanCreateApps(user)
    },
    {
        name: Locale.getMessage("governance.account.users.appManager"),
        type: SCHEMACONSTS.CHECKBOX,
        needsAccountAdmin:true,
        needsRealmAdmin:false,
        options: ['Yes', 'No'],
        formatter: user => user.numAppsManaged > 0
    },
    {
        name: Locale.getMessage("governance.account.users.realmDirectoryUsers"),
        type: SCHEMACONSTS.CHECKBOX,
        needsAccountAdmin:false,
        needsRealmAdmin:true,
        options: ['Yes', 'No'],
        formatter: user => RealmUserAccountFlagConstants.HasAnyRealmPermissions(user)
    },
    {
        name: Locale.getMessage("governance.account.users.realmApproved"),
        type: SCHEMACONSTS.CHECKBOX,
        needsAccountAdmin:false,
        needsRealmAdmin:true,
        options: ['Yes', 'No'],
        formatter: user => RealmUserAccountFlagConstants.IsApprovedInRealm(user)
    }
];

export const GetAccountUsersFacetFields = (hasAccountAdmin, hasRealmAdmin) => {

    // Build the full facet information compliant with FacetInterface
    let facetInfo = [];

    let facetFields = FACET_FIELDS();

    _.forEach(facetFields, (field, fieldID) => {
        if (field && (field.needsAccountAdmin && hasAccountAdmin || field.needsRealmAdmin && hasRealmAdmin)) {
            let id = parseInt(fieldID);
            facetInfo.push({
                id: id,
                name: facetFields[fieldID].name,
                type: facetFields[fieldID].type,
                values: _.map(facetFields[fieldID].options, (aFacet) => {
                    return {id: id, value: aFacet};
                })
            });
        }
    });

    return facetInfo;
};
