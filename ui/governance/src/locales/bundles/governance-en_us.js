/**
 * This bundle contains all the strings needed by the "Governance" functional area.
 * All Governance strings should be under the "governance" property so that
 * name collisions can be avoided with other stings in other bundles.
 */
export default {
    locales: "en-us",
    currencyCode: "usd",

    messages: {
        governance: {
            leftNav: {
                myApps: "MY APPS",
                manageBilling: "Manage Billing",
                contactSupport: "Contact Support",
                manageUsers: "Manage Users",
                accountSummary: "Account Summary",
                manageApps: "Manage Apps",
                manageGroups: "Manage Groups",
                setAccountProperties: "Set Account Properties",
                setRealmPolicies: "Set Realm Policies",
                editRealmBranding: "Edit Realm Branding"
            },
            account: {
                users: {
                    accessStatus: "QuickBase access status",
                    paidSeats: "Paid seats",
                    paidSeatSingular: "Paid seat",
                    quickbaseStaff: "QuickBase staff",
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
                    stageDescription: "Use this page to manage QuickBase users at the account and realm levels. Take a look around and try out the functionality. If you have any feedback, we'd love to hear it:",
                    feedbackLinkText: "https://some.quickbase.com/link/to/feedback"
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
