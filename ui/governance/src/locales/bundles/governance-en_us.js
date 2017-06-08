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
                myApps: "back to My Apps",
                manageBilling: "Manage Billing",
                contactSupport: "Contact Support",
                manageUsers: "Manage All Users",
                accountSummary: "Account Summary",
                manageApps: "Manage Apps",
                manageGroups: "Manage Groups",
                setAccountProperties: "Set Account Properties",
                setRealmPolicies: "Set Realm Policies",
                editRealmBranding: "Edit Realm Branding"
            },
            account: {
                users: {
                    accessStatus: "Quick Base access status",
                    userStatus: "User status",
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
                    deniedUserSingular: "Denied user",
                    deactivatedUsers: "Deactivated users",
                    deactivatedUserSingular: "Deactivated user",
                    realmDirectoryUsers: "In realm directory",
                    stageTitle: "Manage All Users",
                    stageDescription: "Use this page to manage all your Quick Base account and realm users. Take a look around, and ",
                    feedbackLink: "https://team.quickbase.com/db/bmrrmm53x?a=nwr",
                    feedbackLinkText: "give us feedback",
                    grid: {
                        firstName: "FIRST NAME",
                        lastName: "LAST NAME",
                        email: "EMAIL",
                        userName: "USER NAME",
                        lastAccess: "LAST ACCESS",
                        quickbaseAccessStatus: "QUICK BASE ACCESS STATUS",
                        inactive: "INACTIVE?",
                        inAnyGroup: "IN ANY GROUP",
                        groupManager: "GROUP MANAGER",
                        canCreateApps: "CAN CREATE APPS",
                        appManager: "APP MANAGER",
                        inRealmDirectory: "IN REALM DIRECTORY?",
                        realmApproved: "REALM APPROVED?",
                        noItemsFound: "No {items} match what you're looking for."
                    }
                }
            }
        }
    }
};
