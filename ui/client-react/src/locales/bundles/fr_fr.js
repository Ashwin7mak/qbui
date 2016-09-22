export default {
    locales: "fr-fr",
    currencyCode: "eur",

    messages: {
        apps: {
            header: "Vos Apps"
        },
        reports : {
            emailReportTooltip: "Partager ces documents avec quelqu'un d'autre",
            emailSubject: "'{reportName}' rapport depuis l'application QuickBase '{appName}'",
            emailBody: "Voici le rapport de la '{reportName}' '{tableName}' de table dans '{appName}'"
        },
        records: {
            singular: "enregistrement",
            plural: "enregistrement"
        },
        selection: {
            edit: "Editer",
            email: "Email",
            print: "Impremer",
            copy: "Copier",
            delete: "Effacer",
            more: "Plus..."
        },
        footer: {
            copyright: "{year} QuickBase, Inc. Tous droits réservés."
        },
        nav: {
            home: "Accueil",
            users: "Utilisateurs",
            favorites: "Favoris",
            reportsHeading: "Rapports",
            tablesHeading: "Les Tables",
            appsHeading: "Vos Apps",
            searchAppsPlaceholder: "Chercher apps...",
            searchTablesPlaceholder: "Chercher tables...",
            searchReportsPlaceholder: "Chercher rapports...",
            searchRecordsPlaceholder: "Chercher...",
            backToReport: "Retour au rapport"
        },
        field: {
            search: "Chercher",
            searchNoMatch: "Aucun utilisateur trouvé"
        },
        grid: {
            no_data: "Il n'y a pas de données à afficher."
        },
        globalActions: {
            user: "Utilisateur",
            alerts: "Alertes",
            help: "Aidez-moi",
            logout: "Se déconnecter"
        },
        pageActions: {
            addRecord: "Ajouter un enregistrement",
            saveRecord: "Sauvegarder les modifications",
            saveAndAddRecord: "Enregistrer et ajouter une nouvelle ligne",
            cancelSelection: "Annuler les modifications",
            favorite: "Préféré",
            gridEdit: "Grille modifier",
            edit: "Modifier",
            delete: "Effacer",
            email: "Email",
            print: "Imprimer",
            customizeReport: "Personnaliser ce Rapport",
            customizeForm: "Personnaliser ce formulaire",
            customizePage: "Personnaliser cette page"
        },
        recordActions: {
            previous: "Précédent",
            return: "Retour au rapport",
            next: "Prochain"
        },
        recordNotifications: {
            recordAdded : "Enregistrement ajouté",
            recordNotAdded :"Enregistrement non ajouté",
            recordSaved : "Sauvegarder",
            recordNotSaved :"Enregistrement non enregistré",
            deleted : "supprimé",
            notDeleted : "non supprimés",
        },
        header: {
            menu: {
                locale: {
                    "en-us": "Anglais",
                    "fr-fr": "Français",
                    "de-de": "Allemand"
                },
                preferences: "Préférences",
                sign_out: "Se déconnecter"
            }
        },
        form : {
            tab : 'Onglet',
            error: {
                403: "Vous n'êtes pas autorisé à accéder à ce formulaire",
                500: "Erreur inattendue rendant ce formulaire"
            }
        },
        report : {
            blank : "blanc",
            facets :{
                noFacets : "Non valeurs",
                seeMore : "plus...",
                tooManyValues: "Trop de valeurs à utiliser pour le filtrage",
                noCheck : "Non",
                yesCheck : "Oui",
                clearFacet: "Enlever le filtre {facet}",
                clearFacetSelection: "Cliquez pour désactiver ce filtre"
            },
            filteredRecordCount : "{filteredRecordCount} des {recordCount} enregistrements",
            filteredSingleRecordCount : "{filteredRecordCount} de {recordCount} record",
            newReport: "Nouveau",
            organizeReports: "Organiser",
            recordCount : "{recordCount} enregistrements",
            singleRecordCount : "{recordCount} record",
            recordCountPlaceHolder : "Compte enregistrements...",
            cardViewCountPlaceHolder : "Compte...",
            reportNavigationBar : "{pageStart} - {pageEnd}",
            previousToolTip: "Arrière",
            nextToolTip: "Prochain",
            previousPage: "Précédent",
            nextPage: "Prochain",
            previousPageLoadingOnSwipe: "Obtenir précédent...",
            nextPageLoadingOnSwipe: "Obtenir plus...",
            searchPlaceHolder:  "Rechercher ces",
            sortAndGroup : {
                addField: "Ajouter le champ",
                by: "par",
                changeOrder: "ordre de changement",
                chooseFields :  {
                    group: "Choisir un champ pour le groupement",
                    sort: "Choisir un champ pour le tri"
                },
                group: "Groupe",
                header : "Trier & Groupe",
                moreFields : "plus de champs ...",
                reset: "Réinitialiser",
                resetTip : "Sortir et restaurer à l'original tri du rapport et les paramètres du groupe",
                sort:   "Trier",
                stopGroupingBy: "Arrêter le regroupement par",
                stopSortingBy: "Arrêter le tri par",
                thenBy: "puis par"
            },
            menu: {
                sort: {
                    aToZ: "Trier A à Z",
                    highToLow: "Trier du plus haut au plus bas",
                    newToOld: "Trier récent au plus ancien",
                    zToA: "Trier Z à A",
                    lowToHigh: "Trier du plus bas au plus élevé",
                    oldToNew: "Trier le plus ancien au plus récent",
                    uncheckedToChecked: "Trier décochée à vérifier",
                    checkedToUnchecked: "Trier vérifié pour décochée"
                },
                group: {
                    aToZ: "Groupe A à Z",
                    highToLow: "Groupe haut au plus bas",
                    newToOld: "Groupe récent au plus ancien",
                    zToA: "Groupe Z à A",
                    lowToHigh: "Groupe bas au plus haut",
                    oldToNew: "Groupe le plus ancien au plus récent",
                    uncheckedToChecked: "Groupe décochée à vérifier",
                    checkedToUnchecked: "Groupe cochés décochée"
                },
                addColumnBefore: "Ajouter une colonne avant",
                addColumnAfter: "Ajouter colonne après",
                hideColumn: "Masquer cette colonne",
                newTable: "Nouvelle table basée sur cette colonne",
                columnProps: "Propriétés de la colonne",
                fieldProps: "Propriétés de champ"
            }
        },
        month: {
            jan: {
                short: "Janv",
                full: "Janvier"
            },
            feb: {
                short: "Fébr",
                full: "Février"
            },
            mar: {
                short: "Mars",
                full: "Mars"
            },
            apr: {
                short: "Avril",
                full: "Avril"
            },
            may: {
                short: "Mai",
                full: "Mai"
            },
            jun: {
                short: "Juin",
                full: "Juin"
            },
            jul: {
                short: "Juil",
                full: "Juillet"
            },
            aug: {
                short: "Août",
                full: "Août"
            },
            sep: {
                short: "Sept",
                full: "Septembre"
            },
            oct: {
                short: "Oct",
                full: "Octobre"
            },
            nov: {
                short: "Nov",
                full: "Novembre"
            },
            dec: {
                short: "Déc",
                full: "Décembre"
            }
        },
        groupHeader: {
            empty: "(Vide)",
            abbr: {
                quarter: "Q",
                fiscalYear: "FY"
            },
            numeric: {
                range: "{lower} à {upper}"
            },
            duration: {
                second: "{duration} seconde",
                seconds: "{duration} secondes",
                minute: "{duration} minute",
                minutes: "{duration} minutes",
                hour: "{duration} heure",
                hours: "{duration} heures",
                day: "{duration} journée",
                days: "{duration} journées",
                week: "{duration} semaine",
                weeks: "{duration} semaines"
            },
            date: {
                week: "Semaine du {date}",
                month: "{month} {year}",
                quarter: "{quarter} {year}"
            },
            am: "AM",
            pm: "PM"
        },
        cancel: "Annuler",
        cancelTip: "Quitter et ignorer les modifications",
        apply: "Aappliquer",
        applyTip: "Sortez et appliquer les modifications",
        success: "Le succès",
        failed: "Échoué",
        placeholder:  {
            email: 'nom@domaine.com'
        },
        editErrors :"{numErrors, plural, \n  =0 {Pas d'erreurs}\n =1 {Résoudre ce domaine}\n other {Corriger ces # champs}\n} ",
        invalidMsg : {
            required: 'Remplissez {fieldName}',
            maxChars: "Utilisez jusqu'à caractères {num}",
        },

    }
};
