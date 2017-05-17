/**
 * This bundle contains all the strings needed by the "Governance" functional area.
 * All Governance strings should be under the "governance" property so that
 * name collisions can be avoided with other stings in other bundles.
 */
export default {
    locales: "fr-fr",
    currencyCode: "eur",

    messages: {
        governance: {
            leftNav: {
                myApps: "MY APPS FR",
                manageBilling: "Manage Billing FR",
                contactSupport: "Contact Support FR",
                manageUsers: "Manage Users FR",
                accountSummary: "Account Summary FR",
                manageApps: "Manage Apps FR",
                manageGroups: "Manage Groups FR",
                setAccountProperties: "Set Account Properties FR",
                setRealmPolicies: "Set Realm Policies FR",
                editRealmBranding: "Edit Realm Branding FR"
            },
            account: {
                users: {
                    accessStatus: "Quick Base access status",
                    paidSeats: "Paid seats",
                    paidSeatSingular: "Paid seat",
                    quickbaseStaff: "Quick Base staff",
                    inGroup: "In any group",
                    inactive: "Inactive",
                    groupManager: "Group manager",
                    canCreateApps: "Can create apps",
                    appManager: "App manager",
                    realmApproved: "Realm approved",
                    deniedUsers: "Denied users",
                    deactivatedUsers: "Deactivated users",
                    realmDirectoryUsers: "In realm directory",
                    stageTitle: "Manage All Users",
                    stageDescription: "Use this page to manage all your Quick Base account and realm users. Take a look around, and ",
                    feedbackLink: "https://team.quickbase.com/db/bmrrmm53x?a=nwr",
                    feedbackLinkText: "give us feedback"
                }
            },
            count: {
                totalRecords : "{totalRecords} users",
                singleRecordCount : "{totalRecords} user",
                usersCountPlaceHolder : "Counting users...",
                cardViewCountPlaceHolder : "Counting...",
                filteredRecordCount : "{filteredRecordCount} of {totalRecords} records",
                filteredSingleRecordCount : "{filteredRecordCount} of {totalRecords} record",
            }
        }
    }
};
