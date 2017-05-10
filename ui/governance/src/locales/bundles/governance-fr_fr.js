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
                    feedbackLinkText: "https://some.quickbase.com/link/to/feedback",
                    grid: {
                        firstName: "PRÉNOM",
                        lastName: "NOM DE FAMILLE",
                        email: "EMAIL",
                        userName: "NOM D'UTILISATEUR",
                        lastAccess: "DERNIER ACCÈS",
                        quickbaseAccessStatus: "ÉTAT D'ACCÈS QUICKBASE",
                        inactive: "INACTIF?",
                        inAnyGroup: "DANS TOUT GROUPE",
                        groupManager: "CHEF DE GROUPE",
                        canCreateApps: "POUVEZ CRÉER DES APPS",
                        appManager: "APP MANAGER",
                        inRealmDirectory: "DANS LE REALM DE RÉPERTOIRE?",
                        realmApproved: "REALM APPROUVÉ?"
                    }                    
                }
            },
        }
    }
};
