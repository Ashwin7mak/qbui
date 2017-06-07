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
                myApps: "retour à Mes Applications",
                manageBilling: "Gestion de facturation",
                contactSupport: "Contactez le support",
                manageUsers: "Gérer les utilisateurs",
                accountSummary: "Relevé de compte",
                manageApps: "Gérer les applications",
                manageGroups: "Gestion des groupes",
                setAccountProperties: "Régler les propriétés de compte",
                setRealmPolicies: "Régler les politiques realm",
                editRealmBranding: "Edit Realm Branding FR"
            },
            account: {
                users: {
                    accessStatus: "État d'accord Quick Base",
                    userStatus: "User status fr",
                    paidSeats: "Sièges payés",
                    paidSeatSingular: "Siège payé",
                    quickbaseStaff: "Personnel Quick Base",
                    inGroup: "Dans tout groupe",
                    inactive: "Inactif",
                    groupManager: "Dirigeant de groupe",
                    canCreateApps: "Peut créer des apps",
                    appManager: "App manager",
                    realmApproved: "Realm approuvé",
                    deniedUsers: "Utilisateurs denis",
                    deactivatedUsers: "Utilisateurs déactivés",
                    realmDirectoryUsers: "À realm directory",
                    stageTitle: "Gérer tous les utilisateurs",
                    stageDescription: "Utiliser cette page pour gérer tout votre compteur Quick Base et utilisateurs realm. Prenez un regard autour, et ",
                    feedbackLink: "https://team.quickbase.com/db/bmrrmm53x?a=nwr",
                    feedbackLinkText: "donnez-nous vos commentaires",
                    grid: {
                        firstName: "PRÉNOM",
                        lastName: "NOM DE FAMILLE",
                        email: "EMAIL",
                        userName: "NOM D'UTILISATEUR",
                        lastAccess: "DERNIER ACCÈS",
                        quickbaseAccessStatus: "ÉTAT D'ACCÈS QUICK BASE",
                        inactive: "INACTIF?",
                        inAnyGroup: "DANS TOUT GROUPE?",
                        groupManager: "CHEF DE GROUPE?",
                        canCreateApps: "POUVEZ CRÉER DES APPS?",
                        appManager: "APP MANAGER?",
                        inRealmDirectory: "DANS LE REALM DE RÉPERTOIRE?",
                        realmApproved: "REALM APPROUVÉ?"
                    }
                }
            }
        }
    }
};
