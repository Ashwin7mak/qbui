import Locale from "../../../../../reuse/client/src/locales/locale";
import GovernanceBundleLoader from "../../../locales/governanceBundleLoader";
import * as SCHEMACONSTS from "../../../../../client-react/src/constants/schema";
import * as Formatters from "./AccountUsersGridFormatters";
import * as RealmUserAccountFlagConstants from "../../../common/constants/RealmUserAccountFlagConstants.js";

let GRID_FACET_LOCALE = "governance.account.users";

export const FACET_FIELDS = [
    {
        label: Locale.getMessage(GRID_FACET_LOCALE + ".accessStatus"),
        type: SCHEMACONSTS.TEXT,
        needsAccountAdmin:true,
        needsRealmAdmin:true,
        options: ['Denied', 'Deactivated', 'Paid Seat', 'No App Access'],
        formatter: user => Formatters.FormatUserStatusText(user.hasAppAccess, {rowData: user})
    },
    {
        label: Locale.getMessage(GRID_FACET_LOCALE + ".paidSeatSingular"),
        type: SCHEMACONSTS.CHECKBOX,
        needsAccountAdmin:true,
        needsRealmAdmin:true,
        options: ['Yes', 'No'],
        formatter: user => 'Paid Seat' === Formatters.FormatUserStatusText(user.hasAppAccess, {rowData: user})
    },
    {
        label: Locale.getMessage(GRID_FACET_LOCALE + ".quickbaseStaff"),
        type: SCHEMACONSTS.CHECKBOX,
        needsAccountAdmin:true,
        needsRealmAdmin:true,
        options: ['Yes', 'No'],
        formatter: user => RealmUserAccountFlagConstants.HasAnySystemPermissions(user)
    },
    {
        label: Locale.getMessage(GRID_FACET_LOCALE + ".inactive"),
        type: SCHEMACONSTS.CHECKBOX,
        needsAccountAdmin:true,
        needsRealmAdmin:false,
        options: ['Yes', 'No'],
        formatter: user => Formatters.FormatIsInactiveBool(user.lastAccess, {rowData: user})
    },
    {
        label: Locale.getMessage(GRID_FACET_LOCALE + ".inGroup"),
        type: SCHEMACONSTS.CHECKBOX,
        needsAccountAdmin:true,
        needsRealmAdmin:false,
        options: ['Yes', 'No'],
        formatter: user => user.numGroupsMember > 0
    },
    {
        label: Locale.getMessage(GRID_FACET_LOCALE + ".groupManager"),
        type: SCHEMACONSTS.CHECKBOX,
        needsAccountAdmin:true,
        needsRealmAdmin:false,
        options: ['Yes', 'No'],
        formatter: user => user.numGroupsManaged > 0
    },
    {
        label: Locale.getMessage(GRID_FACET_LOCALE + ".canCreateApps"),
        type: SCHEMACONSTS.CHECKBOX,
        needsAccountAdmin:true,
        needsRealmAdmin:false,
        options: ['Yes', 'No'],
        formatter: user => RealmUserAccountFlagConstants.CanCreateApps(user)
    },
    {
        label: Locale.getMessage(GRID_FACET_LOCALE + ".appManager"),
        type: SCHEMACONSTS.CHECKBOX,
        needsAccountAdmin:true,
        needsRealmAdmin:false,
        options: ['Yes', 'No'],
        formatter: user => user.numAppsManaged > 0
    },
    {
        label: Locale.getMessage(GRID_FACET_LOCALE + ".realmDirectoryUsers"),
        type: SCHEMACONSTS.CHECKBOX,
        needsAccountAdmin:false,
        needsRealmAdmin:true,
        options: ['Yes', 'No'],
        formatter: user => RealmUserAccountFlagConstants.HasAnyRealmPermissions(user)
    },
    {
        label: Locale.getMessage(GRID_FACET_LOCALE + ".realmApproved"),
        type: SCHEMACONSTS.CHECKBOX,
        needsAccountAdmin:false,
        needsRealmAdmin:true,
        options: ['Yes', 'No'],
        formatter: user => RealmUserAccountFlagConstants.IsApprovedInRealm(user)
    }
];

export const GetFacetFields = (hasAccountAdmin, hasRealmAdmin) => {

    // Build the full facet information compliant with FacetInterface
    let facetInfo = [];

    _.forEach(FACET_FIELDS, (field, fieldID) => {
        if (field && (field.needsAccountAdmin && hasAccountAdmin || field.needsRealmAdmin && hasRealmAdmin)) {
            let id = parseInt(fieldID);
            facetInfo.push({
                id: id,
                name: FACET_FIELDS[fieldID].label,
                type: FACET_FIELDS[fieldID].type,
                values: _.map(FACET_FIELDS[fieldID].options, (aFacet) => {
                    return {id: id, value: aFacet};
                })
            });
        }
    });

    return facetInfo;
};
