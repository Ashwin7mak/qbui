export default {
    locales: "fr-fr",
    currencyCode: "eur",

    messages: {
        apps: {
            header: "Vos Apps"
        },
        app: {
            homepage: {
                welcomeTitle: "Bienvenue sur Mercury Beta",
                welcomeText: "Pendant que vous apprenez votre chemin, utilisez cette zone à la place de votre page d'accueil d'application. " +
                "C'est votre application réelle dans Mercury. Vous ne verrez pas encore la page d'accueil de votre application, mais " +
                "données sont ici. Les travaux effectués ici s'affichent immédiatement en mode Classique.",
                launchVideoLink: "Lancez une tournée vidéo (2:58)",
                guideMeLink: "Guide-moi par Mercury",
                guideTitle: "Guide d'accueil",
                guideText: "Apprenez tout sur le programme Mercury Beta. Voyez quelles fonctionnalités sont actuellement disponibles et comment votre équipe peut obtenir le travail plus rapidement, à travers les périphériques, en utilisant Mercury.",
                guideButton: "Télécharger le guide d'accueil",
                feedbackTitle: "Nous souhaitons recevoir vos commentaires",
                feedbackText: "Notre équipe attend vos nouvelles! Nous sommes tellement désireux d'entendre ce que vous pensez de Mercury que nous avons inclus un bouton de commentaires sur chaque page de votre application.",
                feedbackButton: "Donnez votre avis",
                tipTitle: "Rien ne s'est passé quand j'ai cliqué...",
                tipText: "Il s'agit de travaux en cours, donc si vous cliquez sur un bouton et il ne fait rien, pas de soucis. Nous travaillons encore sur cette fonctionnalité.",
                helpTitle: "Besoin d'aide?",
                helpText: "Nous voulons que vous réussissiez; C'est pourquoi nous sommes toujours là pour vous aider.",
                helpLinkPreText: "Veuillez ",
                helpLinkText: "contacter notre équipe de soins"
            }
        },
        appMenu: {
            qbClassicLink: "Basculer vers QuickBase Classic"
        },
        pendingEditModal: {
            modalBodyMessage: "Enregistrer les modifications avant de quitte?",
            modalStayButton: "Restez et continuer à travailler",
            modalDoNotSaveButton: "Ne pas enregistrer",
            modalSaveButton: "Sauvegarder"
        },
        dtsErrorModal: {
            dtsErrorTitle: "Désolé d'interrompre votre travail",
            dtsErrorBodyMessage: "Mercury ne peut pas continuer à exécuter votre application aujourd'hui, mais reprendra demain. ",
            dtsErrorSecondErrorBodyMessage: "Votre application est toujours disponible dans QuickBase Classic.",
            dtsErrorTID: "Identifiant de transaction:",
            dtsErrorPrimaryButtonText: "Ouvrez mon application en Classique"
        },
        reports: {
            allReports: "Tous les Rapports",
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
            dontDelete: "Ne pas supprimer",
            deleteThisRecord: "Supprimer cet enregistrement?",
            more: "Plus...",
            placeholder: "Sélectionner...",
            notFound: "Pas trouvé"
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
            backToReport: "Retour au rapport",
            nextRecord: "Prochain enregistrement",
            previousRecord: "Previous enregistrement",
            save: "Sauver",
            saveAndNext: "Sauver et prochain",
            saveAndAddAnother: "Sauver et ajouter un autre",
            cancel: "Annuler",
            new: "Nouveau"
        },
        field: {
            search: "Chercher",
            searchNoMatch: "Personne ne correspond à"
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
            configureFormBuilder: 'Configurer Forme Constructeur',
            saveRecord: "Sauvegarder les modifications",
            saveAndAddRecord: "Enregistrer et ajouter une nouvelle ligne",
            saveAndAddRecordDisabled: "Ajout de plusieurs enregistrements ne fonctionnant pas en ce moment",
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
            cannotLoad : "Impossible de charger la fiche",
            error: {
                403: "Vous n'êtes pas autorisé à créer ou à accéder à cette fiche",
                500: "Erreur inattendue rendant cette fiche"
            }
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
        fields: {
            checkbox: {
                no: 'Non',
                yes: 'Oui'
            },
            textField: {
                clear: 'Effacer tout le texte'
            }
        },
        form : {
            tab : 'Onglet',
            error: {
                403: "Vous n'êtes pas autorisé à accéder à ce formulaire",
                500: "Erreur inattendue rendant ce formulaire"
            },
            footer: {
                lastUpdatedBy: "Dernière mise à jour par ",
                createdOn: "Créé sur ",
                ownedBy: "Propriétaire "
            }
        },
        durationWithUnits: {
            Weeks:"{value, plural, \n =0 {0 semaines}\n =1 {1 semaine}\n other {{value}  semaines}\n} ",
            Days:"{value, plural, \n =0 {0 jours}\n =1 {1 jour}\n other {{value}  jours}\n} ",
            Hours:"{value, plural, \n =0 {0 heures}\n =1 {1 heure}\n other {{value}  heures}\n} ",
            Minutes: "{value, plural, \n =0 {0 minutes}\n =1 {1 minute}\n other {{value}  minutes}\n} ",
            Seconds: "{value, plural, \n =0 {0 secondes}\n =1 {1 seconde}\n other {{value}  secondes}\n} ",
            Milliseconds: "{value, plural, \n =0 {0 millisecondes}\n =1 {1 milliseconde}\n other {{value}  millisecondes}\n} "
        },
        acceptedDurationType: {
            Weeks: 'semaines',
            Week: 'semaine',
            W: 'se',
            Days: 'journees',
            Day: 'journee',
            D: 'j',
            Hours: 'heures',
            Hour: 'heure',
            H: 'h',
            Minutes: 'minutes',
            Minute: 'minute',
            M: 'm',
            Seconds: 'secondes',
            Second: 'seconde',
            S: 's',
            Milliseconds: 'millisecondes',
            Millisecond: 'milliseconde',
            MS: 'ms',
            Secs: 'secs',
            Msecs: 'msecs'
        },
        durationTableHeader: {
            Weeks:"semaines",
            Days:"jours",
            Hours:"heures",
            Minutes: "minutes",
            Seconds: "secondes"
        },
        report : {
            blank : "blanc",
            inlineEdit: "Modifier enregistrement en ligne",
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
                changeGroupOrder: "Gruppe wechseln bestellen",
                changeSortOrder: "Changer l'ordre de groupe",
                chooseFields :  {
                    group: "Choisissez un champ à un groupe par",
                    sort: "Choisissez un champ pour trier par"
                },
                group: "Groupe",
                header : "Trier & Groupe",
                moreFields : "plus de champs ...",
                reset: "Réinitialiser",
                resetTip : "Quitter et restaurer tri initial et les paramètres du groupe",
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
        errorMessagePopup: {
            errorMessagePopupHeader: {
                singleErrorLabel: "S'il vous plaît corriger ce domaine",
                multipleErrorLabel: "S'il vous plaît corriger ces {numFields} des champs"
            },
            errorAlertIconTooltip: {
                showErrorPopup: "Afficher la liste des erreurs",
                closeErrorPopup: "liste d'erreurs Masquer",
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
            email: "nom@domaine.com",
            maxLength :"jusqu'à {maxLength} caractères",
            url: 'www.exemple.fr',
            phone: '+x x xx xx xx xx',
        },
        editErrors :"{numErrors, plural, \n  =0 {Pas d'erreurs}\n =1 {S'il vous plaît fixer 1 champ}\n other {S'il vous plaît corriger ces # champs}\n} ",
        errors: {
            appNotFound: {
                notFound: "L'application est pas disponible dans Mercury en ce moment. ",
                inQuickBaseClassic: " dans QuickBase Classic. ",
                clickHere: "Ouvrez l'application"
            },
            noApps: {
                noApps: "Il n'y a pas d'applications dans Mercury. ",
                addApps: " d'ajouter des applications."
            },
            errorLoadingReport: {
                message: "Ce rapport n'est pas disponible",
                helpText: "Pour l'instant, vous pouvez essayer Sélection d'un rapport différent.",
                contactSupport: "Laissez notre équipe sait que nous puissions fixer",
                supportTeamInfo: "Quelques informations pour l'équipe de soutien:",
                playGraphic: "Me montrer comment",
                stopGraphic: "Arrête de jouer",
                showAdditionalInfo: "Voir les détails",
                hideAdditionalInfo: "Cacher les détails"
            },
            noTables: {
                noTables: "Il n'y a pas tables. ",
                createTablesInQuickBaseClassic: "Créer des tables dans ",
            },
            supportLink: {
                text: "Contactez notre équipe de soins"
            }
        },
        invalidMsg : {
            api: {
                notUniqueSingleField: "Remplissez une valeur différente. Un autre {recordName} utilise déjà ce {fieldName}.",
                notUniqueMultiChoice: "Sélectionnez un autre {fieldName}. Un autre {recordName} utilise déjà celui-ci.",
                invalidRecord: "Type de données non valide. Remplissez une valeur différente."
            },
            unknown: "Type inconnu non valide. Résultats: ",
            required: "Remplissez {fieldName}",
            email: "Formater la {fieldName} comme prénom@domaine.fr",
            emails: "Formatez toutes les adresses comme prénom@domaine.fr",
            maxChars: "Utilisez jusqu'à caractères {maxNum}",
            choiceMaxLength : "Sélectionnez un choix avec {maxNum} caractères ou moins",
            phone: "Formater le {fieldName} comme +x x xx xx xx xx",
            phoneInvalidCountryCode: "Formatez le code du pays comme +x pour les numéros internationaux",
            duration: {
                timeFormat: "Formater le {fieldName} dans {value}",
                Weeks: 'Formater le {fieldName} dans semaines',
                Days: 'Formater le {fieldName} dans journées',
                Hours: 'Formater le {fieldName} dans heures',
                Minutes: 'Formater le {fieldName} dans minutes',
                Seconds: 'Formater le {fieldName} dans secondes',
                Milliseconds: 'Formater le {fieldName} dans millisecondes',
            }
        },
        noneOption: "\<Aucun\>",
        unimplemented: {
            search: "La recherche n'est pas encore disponible",
            favorites: "L'accès aux Favoris n'est pas encore disponible",
            makeFavorite: "Marquer comme favori n'est pas encore disponible",
            print: "L'impression n'est pas encore disponible",
            copy: "La copie n'est pas encore disponible",
            email: "L'envoi par courriel n'est pas encore disponible",
            delete: "La suppression n'est pas encore disponible"
        },
        pageTitles: {
            pageTitleSeparator: " - ",
            editingRecord: "Modifier l'enregistrement n ° {recordId}",
            newRecord: "Ajouter un enregistrement",
            viewRecord: "Afficher le document n ° {recordId}"
        },
        quickBaseClassic: "QuickBase Classique",
        quickBaseMercury: "QuickBase Mercury",
        v2v3: {
            manageAccessTitle: "Gérer l'accès des utilisateurs au Mercure",
            versionSelectTitle: "Mes utilisateurs ouvriront cette application dans",
            manageAccessTip: "*Seuls les administrateurs d'applications peuvent gérer l'accès des utilisateurs"

        },
        missingWalkMe: "Le didacticiel n'est pas disponible"
    }
};
