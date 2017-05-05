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
                    paidSeats: "Paid seats FR",
                    deniedUsers: "Denied users FR",
                    deactivatedUsers: "Deactivated users FR",
                    realmDirectoryUsers: "In realm directory FR",
                    stageTitle: "Manage all Users FR",
                    stageDescription: "FR Use this page to manage QuickBase users at the account and realm levels. Take a look around and try out the functionality. If you have any feedback, we'd love to hear it:",
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
