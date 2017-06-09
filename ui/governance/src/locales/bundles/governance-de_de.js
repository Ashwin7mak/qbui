/**
 * This bundle contains all the strings needed by the "Governance" functional area.
 * All Governance strings should be under the "governance" property so that
 * name collisions can be avoided with other stings in other bundles.
 */
export default {
    locales: "de-de",
    currencyCode: "eur",

    messages: {
        governance: {
            noItemsFound: "Keine {items} passen zu dem, was du suchst. Versuchen Sie, nach einem anderen {item} zu suchen.",
            leftNav: {
                myApps: "zurück zu Meinen Apps",
                manageBilling: "Verwaltung",
                contactSupport: "Kontakt Unterstützung",
                manageUsers: "Benutzer Verwalten",
                accountSummary: "Kontoübersicht",
                manageApps: "Apps Verwalten",
                manageGroups: "Verwaltungsgruppen",
                setAccountProperties: "Kontoeigenschaften festlegen",
                setRealmPolicies: "Set Realm Politiken",
                editRealmBranding: "Bearbeiten Realm Branding"
            },
            account: {
                users: {
                    accessStatus: "Quick Base zugriffsstatus",
                    userStatus: "User status de",
                    paidSeats: "Paid seats",
                    paidSeatSingular: "Bezahlte sitze",
                    quickbaseStaff: "Quick Base personal",
                    inGroup: "In jeder gruppe",
                    inactive: "Inaktiv",
                    groupManager: "Gruppenleiter",
                    canCreateApps: "Kann apps erstellen",
                    appManager: "App manager",
                    realmApproved: "Realm genehmigt",
                    deniedUsers: "Verweigerte benutzer",
                    deactivatedUsers: "Deaktivierte benutzer",
                    realmDirectoryUsers: "Im realm verzeichnis",
                    stageTitle: "Verwalten sie alle benutzer",
                    stageDescription: "Verwenden Sie diese Seite, um alle Ihre Quick Base Account- und Realm-Benutzer zu verwalten. Schauen Sie sich um, und ",
                    feedbackLink: "https://team.quickbase.com/db/bmrrmm53x?a=nwr",
                    feedbackLinkText: "Geben sie uns eine rückmeldung",
                    grid: {
                        firstName: "VORNAME",
                        lastName: "NACHNAME",
                        email: "EMAIL",
                        userName: "BENUTZERNAME",
                        lastAccess: "LETZTER ZUGRIFF",
                        quickbaseAccessStatus: "QUICK BASE ZUGANGSSTATUS",
                        inactive: "INAKTIV?",
                        inAnyGroup: "IN EINER GRUPPE?",
                        groupManager: "GRUPPENLEITER?",
                        canCreateApps: "KANN APPS SCHAFFEN?",
                        appManager: "APP MANAGER?",
                        inRealmDirectory: "IM REALM VERZEICHNIS?",
                        realmApproved: "REALM GENEHMIGT?"
                    }
                }
            }
        }
    }
};
