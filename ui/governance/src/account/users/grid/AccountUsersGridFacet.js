import Locale from "../../../../../reuse/client/src/locales/locale";
import GovernanceBundleLoader from "../../../locales/governanceBundleLoader";
import * as SCHEMACONSTS from "../../../../../client-react/src/constants/schema";
import * as Formatters from "./AccountUsersGridFormatters";
import * as RealmUserAccountFlagConstants from "../../../common/constants/RealmUserAccountFlagConstants.js";

GovernanceBundleLoader.changeLocale('en-us');


export const FACET_FIELDS = [
    {
        label: Locale.getMessage("governance.account.users.accessStatus"),
        type: SCHEMACONSTS.TEXT,
        isAccountAdmin:true,
        isRealmAdmin:true,
        formatter: user => Formatters.FormatUserStatusText(user.hasAppAccess, {rowData: user})
    },
    {
        label: Locale.getMessage("governance.account.users.paidSeatSingular"),
        type: SCHEMACONSTS.CHECKBOX,
        isAccountAdmin:true,
        isRealmAdmin:true,
        formatter: user => 'Paid Seat' === Formatters.FormatUserStatusText(user.hasAppAccess, {rowData: user})
    },
    {
        label: Locale.getMessage("governance.account.users.quickbaseStaff"),
        type: SCHEMACONSTS.CHECKBOX,
        isAccountAdmin:true,
        isRealmAdmin:true,
        formatter: user => RealmUserAccountFlagConstants.HasAnySystemPermissions(user)
    },
    {
        label: Locale.getMessage("governance.account.users.inactive"),
        type: SCHEMACONSTS.CHECKBOX,
        isAccountAdmin:true,
        isRealmAdmin:false,
        formatter: user => Formatters.FormatIsInactiveBool(user.lastAccess, {rowData: user})
    },
    {
        label: Locale.getMessage("governance.account.users.inGroup"),
        type: SCHEMACONSTS.CHECKBOX,
        isAccountAdmin:true,
        isRealmAdmin:false,
        formatter: user => user.numGroupsMember > 0
    },
    {
        label: Locale.getMessage("governance.account.users.groupManager"),
        type: SCHEMACONSTS.CHECKBOX,
        isAccountAdmin:true,
        isRealmAdmin:false,
        formatter: user => user.numGroupsManaged > 0
    },
    {
        label: Locale.getMessage("governance.account.users.canCreateApps"),
        type: SCHEMACONSTS.CHECKBOX,
        isAccountAdmin:true,
        isRealmAdmin:false,
        formatter: user => RealmUserAccountFlagConstants.CanCreateApps(user)
    },
    {
        label: Locale.getMessage("governance.account.users.appManager"),
        type: SCHEMACONSTS.CHECKBOX,
        isAccountAdmin:true,
        isRealmAdmin:false,
        formatter: user => user.numAppsManaged > 0
    },
    {
        label: Locale.getMessage("governance.account.users.realmDirectoryUsers"),
        type: SCHEMACONSTS.CHECKBOX,
        isAccountAdmin:false,
        isRealmAdmin:true,
        formatter: user => RealmUserAccountFlagConstants.HasAnyRealmPermissions(user)
    },
    {
        label: Locale.getMessage("governance.account.users.realmApproved"),
        type: SCHEMACONSTS.CHECKBOX,
        isAccountAdmin:false,
        isRealmAdmin:true,
        formatter: user => RealmUserAccountFlagConstants.IsApprovedInRealm(user)
    }
];

export const GetFacetFields = (hasAccountAdmin, hasRealmAdmin) => {
    return function(users) {
        // Go through the users passed and start building the facet values
        let facetFields = {};
        _.forEach(users, (user) => {

            // For each facet columns that we have
            _.forEach(FACET_FIELDS, (field, fieldID) => {
                // check for permission on the facet field
                if (field && (field.isAccountAdmin && hasAccountAdmin || field.isRealmAdmin && hasRealmAdmin)) {
                    // if this is the first time we are seeing the fieldID, create a holder
                    if (_.isUndefined(facetFields[fieldID])) {
                        facetFields[fieldID] = new Set();
                    }
                    // add the facet value
                    facetFields[fieldID].add(field.formatter(user));
                }
            });
        });


        // Build the full facet information compliant with FacetInterface
        let facetInfo = [];
        _.forEach(facetFields, function(facets, fieldID) {
            let id = parseInt(fieldID);
            let facetArray = Array.from(facets);
            if (!_.isEmpty(facetArray)) {
                facetInfo.push({
                    id: id,
                    name: FACET_FIELDS[fieldID].label,
                    type: FACET_FIELDS[fieldID].type,
                    values: _.map(facetArray, (aFacet) => {
                        return {id: id, value: aFacet};
                    })
                });
            }
        });

        return facetInfo;
    };
};
