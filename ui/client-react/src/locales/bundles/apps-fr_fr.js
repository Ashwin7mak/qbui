import FieldFormats from '../../utils/fieldFormats';
/**
 * This bundle contains all the strings needed by the "Apps" functional area.
 * This functional area is for the main app served in client-react at the /qbase/apps route.
 */
export default {
    locales: "fr-fr",
    currencyCode: "eur",

    messages: {
        apps: {
            header: "Vos Apps",
            missing: "Restez connecté, mes applications arrivent bientôt"
        },
        app: {
            homepage: {
                welcomeTitle: "Bienvenue à",
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
            },
            dashboards: {
                missing: "Restez à l'écoute, les tableaux de bord de l'application arrivent bientôt"
            },
            settings: "Paramètres",
            users: {
                addUser: "Ajouter un nouvel utilisateur",
                users: "Utilisateurs",
                content: "C'est la liste de toutes les personnes qui ont été ajoutées à votre application. Vous pouvez obtenir quelques idées rapides sur le nombre de personnes dans chaque rôle dans votre application ainsi que de trouver une personne spécifique dans la liste et de les envoyer par courrier électronique.",
                manager: "Gestionnaire d'applications",
                removeUser: "Supprimer cet utilisateur?",
                unAssignUser: "Les utilisateurs ne pourront plus accéder à cette application. Toutes les données qu'ils ont déjà entrées restent dans la demande.",
                deleteUser: "Retirer {valeur} utilisateur",
                deleteUsers: "Retirer {valeur} utilisateurs",
                removeButton: "Retirer",
                cancel: "Annuler",
                plural: "utilisateurs",
                usersRemovedFromAppRole: "{numOfUsers} Les utilisateurs ont été supprimés de l'application",
                userRemovedFromAppRole: "L'utilisateur a été supprimé de l'application",
                userAdded: "Utilisateur ajouté",
                userAddError: "Erreur d'ajout d'utilisateur",
                userRemovingError: "Erreur lors de l'enlever",
                emailBody: "Le corps du courrier électronique va ici",
                emailSubject: "Le sujet de l'email va ici"
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
            testAutomation: "Automatisation des tests",
            copyAutomation: "Copier l'automatisation",
            editAutomation: "Modifier l'automatisation",
            deleteAutomation: "Supprimer l'automatisation",
            dontDelete: "Ne pas supprimer",
            deleteThisRecord: "Supprimer cet enregistrement?",
            deleteTheseSwitches: "Supprimer ces commutateurs?",
            deleteTheseOverrides: "Supprimer ces annule?",
            more: "Plus...",
            placeholder: "Sélectionner...",
            tablesPlaceholder: "Sélectionnez une table...",
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
            next: "Prochain",
            previous: "Orécédent",
            finished: "Fini",
            apply: "Appliquer",
            new: "Nouveau",
            backToApp: "Retour à l'application",
            reset: "Réinitialiser",
            closeRecord: "Fermer record",
            expandSection: "Développer section",
            collapseSection: "Effondrer section"
        },
        field: {
            search: "Chercher",
            searchNoMatch: "Personne ne correspond à",
            searchNoMatchAddUser: "Aucun utilisateur ne correspond à ce que vous recherchez"
        },
        grid: {
            no_data: "Il n'y a pas de données à afficher.",
            no_filter_matches: "Aucun {recordsName} ne correspond à ce que vous recherchez. Essayez de rechercher un autre type d'{recordsName}.",
            no_rows: "Il n'y a aucun {recordsName} à voir en ce moment.",
            no_rows_but: "Il n'y a pas de {recordsName}, mais vous pouvez ",
            no_rows_create_link:  "créer une"
        },
        globalActions: {
            user: "Utilisateur",
            alerts: "Alertes",
            help: "Aidez-moi",
            logout: "Se déconnecter"
        },
        pageActions: {
            addRecord: "Ajouter un enregistrement",
            approve: "Approuve ce disque",
            saveRecord: "Sauvegarder les modifications",
            saveAndAddRecord: "Enregistrer et ajouter une nouvelle ligne",
            saveAndAddRecordDisabled: "Ajout de plusieurs enregistrements ne fonctionnant pas en ce moment",
            cancelSelection: "Annuler les modifications",
            close: "Fermer",
            favorite: "Préféré",
            gridEdit: "Grille modifier",
            edit: "Modifier",
            delete: "Effacer",
            email: "Email",
            print: "Imprimer",
            customizeReport: "Personnaliser ce Rapport",
            customizeForm: "Personnaliser ce formulaire",
            customizePage: "Personnaliser cette page",
            deleteTable: "Supprimer la table"
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
            deleted : "{value, plural,\n =0 {0 {nameForRecord} enregistrement}\n =1 {1 {nameForRecord} enregistrement}\n other {# {nameForRecord} enregistrement}\n} supprimés",
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
                sign_out: "Se déconnecter",
                feedbackMenuButton: "Donnez votre avis",
                feedbackMenuTitle: "Retour d'information",
                reportFeedBackButton: "Signaler un problème",
                feedbackTooltip: "Partagez des idées et des problèmes",
                helpTooltip: "Aidez-moi",
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
                lastUpdatedOn: "Dernière mise à jour le ",
                createdOn: "Créé sur ",
                ownedBy: "Propriétaire "
            },
            notification: {
                save: {
                    success: "Formulaire enregistré",
                    error: "Erreur lors de l'enregistrement du formulaire"
                }
            },
            noParentRecordSelected: "Aucun enregistrement sélectionné"
        },
        automation: {
            approverecord: {
                success: "Enregistrement approuvé.",
                error: "Une erreur s'est produite lors de l'approbation de ce document."
            },
            testAutomation: {
                success: "Test d'automatisation réussi.",
                error: "Une erreur s'est produite lors du test de cette automatisation."
            },
            saveAutomation: {
                success: "Automatisation enregistrée réussie.",
                error: "Une erreur s'est produite lors de la sauvegarde de cette automatisation."
            },
            automationList: {
                nameHeader: "Prénom",
                activeHeader: "Actif",
                actionHeader: "action",
                actionButton: "Tester",
                activeYes: "Oui",
                activeNo: "Non"
            },
            automationView: {
                stageHeading: "Automatisation: {automationName}",
                nameHeader: "Prénom",
                triggerHeader: "Gâchette",
                actionHeader: "action",
                actions: {
                    email: "Envoyer un e-mail"
                }
            },
            automationEdit: {
                stageHeading: "Modifier l'automatisation: {automationName}",
                nameHeader: "Prénom",
                emailSectionHeader: "Envoyer un e-mail",
                toHeader: "Notifier à qui",
                subjectHeader: "Assujettir",
                bodyHeader: "Message"
            },
            automationBuilder: {
                modify: 'Modifier l\'automatisation'
            }
        },
        relationship: {
            childTable: "Table Enfant",
            addChildRecord: "Ajouter {tableNoun}"
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
                clearFacetSelection: "Cliquez pour désactiver ce filtre",
                filter: "Filtre"
            },
            notification: {
                save: {
                    success: "Rapport enregistré",
                    error: "Impossible d'enregistrer le rapport"
                }
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
                sortAndGroupIcon: "Trier & Groupe",
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
            },
            drawer: {
                title: "Champs cachés",
                info: "Ajoutez un champ au rapport",
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
            appNotFound: "Cette application n'existe pas. Sélectionnez une autre application.",
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
            phone: "Entrez un numéro authentique pour {fieldName}",
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
            formBuilder: "Configuration non disponible actuellement pour cette vue",
            search: "La recherche n'est pas encore disponible",
            favorites: "L'accès aux Favoris n'est pas encore disponible",
            makeFavorite: "Marquer comme favori n'est pas encore disponible",
            print: "L'impression n'est pas encore disponible",
            copy: "La copie n'est pas encore disponible",
            email: "L'envoi par courriel n'est pas encore disponible",
            delete: "La suppression n'est pas encore disponible",
            emailUsers: "L'exportation de CSV n'est pas encore disponible",
            settingsRole: "Changer de rôle n'est pas encore disponible",
            emailApp: "Envoi de l'invitation de l'application n'est pas encore disponible",
        },
        pageTitles: {
            pageTitleSeparator: " - ",
            editingRecord: "Modifier l'enregistrement n ° {recordId}",
            newRecord: "Ajouter un enregistrement",
            viewRecord: "Afficher le document n ° {recordId}",
            editForm: "Modifier le formulaire",
        },
        quickBaseClassic: "QuickBase Classique",
        quickBaseMercury: "QuickBase Mercury",
        missingWalkMe: "Le didacticiel n'est pas disponible",
        missingHelp: "L'aide n'est pas encore disponible",
        fieldsDefaultLabels: {
            [FieldFormats.TEXT_FORMAT]: "Texte",
            [FieldFormats.MULTI_LINE_TEXT_FORMAT]: "Texte long",
            [FieldFormats.TEXT_FORMAT_MULTICHOICE]: "Liste de choix",
            [FieldFormats.TEXT_FORMAT_RADIO_BUTTONS]: "Boutons radio",
            [FieldFormats.TEXT_FORMULA_FORMAT]: "Formule de texte",
            [FieldFormats.NUMBER_FORMAT]: "Nombre",
            [FieldFormats.CURRENCY_FORMAT]: "Devise",
            [FieldFormats.CURRENCY_FORMAT_MULTICHOICE]: "Devise",
            [FieldFormats.PERCENT_FORMAT]: "Pourcentage",
            [FieldFormats.PERCENT_FORMAT_MULTICHOICE]: "Pourcentage",
            [FieldFormats.NUMBER_FORMAT_MULTICHOICE]: "NListe de choix uneric",
            [FieldFormats.NUMBER_FORMAT_RADIO_BUTTONS]: "Boutons radio numériques",
            [FieldFormats.NUMERIC_FORMULA_FORMAT]: "Formule numérique",
            [FieldFormats.DATE_FORMAT]: "Date",
            [FieldFormats.DATETIME_FORMAT]: "Horodatage",
            [FieldFormats.TIME_FORMAT]: "Moment de la journée",
            [FieldFormats.DURATION_FORMAT]: "Durée",
            [FieldFormats.USER_FORMAT]: "Utilisateur",
            [FieldFormats.CHECKBOX_FORMAT]: "Case à cocher",
            [FieldFormats.URL]: "URL",
            [FieldFormats.EMAIL_ADDRESS]: "Email",
            [FieldFormats.PHONE_FORMAT]: "Téléphone",
            [FieldFormats.RATING_FORMAT]: "Évaluation",
            [FieldFormats.RATING_FORMAT_MULTICHOICE]: "Évaluation",
            [FieldFormats.URL_FORMULA_FORMAT]: "URL Formule",
            [FieldFormats.LINK_TO_RECORD]: "Obtenir un autre disque",
            LINK_TO_RECORD_FROM: "Obtenez un autre enregistrement de {parentTable}",
            FORMULA: "Formule",
            SCALAR: "Scalaire",
            CONCRETE: "Béton",
            REPORT_LINK: "Lien du rapport",
            SUMMARY: "Résumé",
            LOOKUP: "Chercher",
            FILE_ATTACHMENT: "Fichier"
        },
        fieldPropertyLabels: {
            title: "Propriétés du champ",
            name: "prénom",
            required: "Doit être rempli",
            multiChoice: "Les choix",
            unique: "Doit être unique",
            linkToRecord: "Lien vers un enregistrement dans la table",
            connectedTo: "Connecté sur le champ {fieldName}"
        },
        builder: {
            tabs: {
                existingFields: 'Ajouter un champ existant',
                newFields:  'Créer un nouveau champ',
            },
            reportBuilder: {
                modify: 'Modifiez rapport'
            },
            formBuilder: {
                modify: 'Modifier formulaire',
                unimplemented: "La fonctionnalité n'est pas disponible en ce moment",
                removeField: "Supprimer le champ du formulaire",
                removeTitleField: "Ce champ ne peut pas être supprimé tant qu'un champ de titre d'enregistrement différent n'est pas réglé",
                removeRelationshipField: "Supprimer le lien vers un enregistrement dans un autre tableau",
                newFieldsMenuTitle: 'Nouveau',
                existingFieldsMenuTitle: 'Existant',
                tooltips: {
                    [`addNew${FieldFormats.TEXT_FORMAT}`]: "Créer un champ de texte et l'ajouter au formulaire",
                    [`addNew${FieldFormats.NUMBER_FORMAT}`]: "Créer un champ de numéro et l'ajouter au formulaire",
                    [`addNew${FieldFormats.DATE_FORMAT}`]: "Créer un champ de date et l'ajouter au formulaire",
                    [`addNew${FieldFormats.DATETIME_FORMAT}`]: "Créez un horodatage et ajoutez-le au formulaire",
                    [`addNew${FieldFormats.TIME_FORMAT}`]: "Créer un champ de l'heure du jour et l'ajouter au formulaire",
                    [`addNew${FieldFormats.CHECKBOX_FORMAT}`]: "Crée une case à cocher et ajoutez-la au formulaire",
                    [`addNew${FieldFormats.USER_FORMAT}`]: "Créer un champ utilisateur et l'ajouter au formulaire",
                    [`addNew${FieldFormats.CURRENCY_FORMAT}`]: "Créez un champ de devise et ajoutez-le au formulaire",
                    [`addNew${FieldFormats.PERCENT_FORMAT}`]: "Créer un champ de pourcentage et l'ajouter au formulaire",
                    [`addNew${FieldFormats.RATING_FORMAT}`]: "Créer un champ de notation et l'ajouter au formulaire",
                    [`addNew${FieldFormats.DURATION_FORMAT}`]: "Créer un champ de durée et l'ajouter au formulaire",
                    [`addNew${FieldFormats.PHONE_FORMAT}`]: "Créer un champ de téléphone et l'ajouter au formulaire",
                    [`addNew${FieldFormats.MULTI_LINE_TEXT_FORMAT}`]: "Créez un champ de texte long et ajoutez-le au formulaire",
                    [`addNew${FieldFormats.URL}`]: "Créer un champ URL et l'ajouter au formulaire",
                    [`addNew${FieldFormats.EMAIL_ADDRESS}`]: "Créer un champ de messagerie et l'ajouter au formulaire",
                    [`addNew${FieldFormats.TEXT_FORMULA_FORMAT}`]: "Créez un champ de formule de texte et ajoutez-le au formulaire",
                    [`addNew${FieldFormats.URL_FORMULA_FORMAT}`]: "Créer un champ de formule d'URL et l'ajouter au formulaire",
                    [`addNew${FieldFormats.NUMERIC_FORMULA_FORMAT}`]: "Créez un champ de formule numérique et ajoutez-le au formulaire",
                    [`addNew${FieldFormats.TEXT_FORMAT_MULTICHOICE}`]: "Créer une liste de choix et l'ajouter au formulaire",
                    [`addNew${FieldFormats.RATING_FORMAT_MULTICHOICE}`]: "Créer un champ de notation et l'ajouter au formulaire",
                    [`addNew${FieldFormats.CURRENCY_FORMAT_MULTICHOICE}`]: "Créez un champ de devise et ajoutez-le au formulaire",
                    [`addNew${FieldFormats.PERCENT_FORMAT_MULTICHOICE}`]: "Créez un champ de pourcentage et ajoutez-le au formulaire",
                    [`addNew${FieldFormats.NUMBER_FORMAT_MULTICHOICE}`]: "Créer une liste de choix numérique et l'ajouter au formulaire",
                    [`addNew${FieldFormats.NUMBER_FORMAT_RADIO_BUTTONS}`]: "Créez des boutons radio numériques et ajoutez-les au formulaire",
                    [`addNew${FieldFormats.TEXT_FORMAT_RADIO_BUTTONS}`]: "Créer les boutons radio des champs et les ajouter au formulaire",
                    [`addNew${FieldFormats.LINK_TO_RECORD}`]: "Créer un lien vers un enregistrement dans un autre tableau",
                }
            },
            existingFieldsToolTip: 'Ajoutez {fieldName} au formulaire',
            existingEmptyState: "Tous les champs {numberOfFields} qui appartiennent à {tableName} sont sur le formulaire",
            fieldGroups: {
                text: "Texte",
                numeric: "Nombre",
                date: "Date",
                other: "Autre",
                relationships: "Des relations",
                tableDataConnections: "Connexions de données de table"
            },
            defaultMultichoiceOptions: {
                first: "Option 1",
                second: "Option 2",
                third: "Option 3"
            },
            linkToRecord: {
                dialogTitle: "Obtenir un autre disque",
                addToForm: "Ajouter au formulaire",
                tableChooserDescription: "Lorsque vous créez ou mettez à jour un {tableNoun}, vous pouvez rechercher et obtenir des informations à partir d'un enregistrement dans un autre tableau",
                tableChooserHeading: "Où est l'enregistrement que vous voulez obtenir?",
                advancedSettingsHeading: "Réglages avancés",
                fieldChooserDescription: "Pour obtenir un enregistrement dans la table {tableName}, une association automatique est réalisée à l'aide d'un champ unique et obligatoire. Pour sélectionner un autre champ, vous pouvez choisir parmi la liste ci-dessous. Vous ne pouvez pas modifier ce champ une fois que vous l'avez ajouté à votre formulaire."
            }
        },
        featureSwitchAdmin: {
            defaultFeatureName: "Fonctionnalité",
            featureSwitchesTitle: "Commutateurs de fonctions",
            featureSwitchOverridesTitle: "Fonctionnalité switche surcharges",
            switchName: "Nom du commutateur",
            teamName: "Nom de l'équipe",
            description: "La description",
            on: "Sur    ",
            off: "Vide",
            onOrOff: "Sure/Vide",
            defaultState: "État par défaut",
            addNew: "Ajouter un nouveau",
            delete: "Effacer",
            turnOn: "Allumer",
            turnOff: "Éteindre",
            featureSwitchCreated: "Fonction créée",
            featureSwitchUpdated: "Fonctionnalité modifiée",
            featureSwitchesDeleted: "Fonction supprimée",
            selectedFeatures: "Fonctions sélectionnées",
            overrideType: "La catégorie",
            overrideValue: "ID",
            overrideChangesDefault: "Remplace la valeur par défaut?",
            overridesYes: "Oui",
            overridesNo: "Non",
            overrideCreated: "Création d'une substitution",
            overridesUpdated: "{num} Remplacements modifié",
            overrideUpdated: "Remplacement modifié",
            overridesDeleted: "Annulation supprimée",
            selectedOverrides: "Remplacements sélectionnés",
            noOverrides: "Aucune substitution n'a été définie",
            featureNameExists: "Les noms des entités doivent être uniques",
            featureNameEmpty: "Les noms des entités doivent être blanc"
        },
        appCreation: {
            newApp: 'Nouvelle application',
            newAppPageTitle: 'Nouvelle Application',
            finishedButtonLabel: "Créer une application",
            appNameHeading: "Nom de l'application,",
            appNamePlaceHolder: "Par exemple, \"Suivi des commandes\"",
            descriptionHeading: "Description de l'application",
            appCreationFailed: "Impossible de créer une application"
        },
        tableCreation: {
            newTablePageTitle: "Nouvelle table",
            newTableDescription: "Créer une nouvelle table lorsque vous souhaitez collecter un nouveau type d'information.",

            summaryDescription: "Chaque bit d'information que vous souhaitez collecter est un champ.",
            summaryTitle: "Faites glisser et déposez les champs que vous souhaitez ajouter à votre table sur le formulaire. Vous pouvez organiser les champs dans l'ordre que vous souhaitez que les gens les utilisent.",

            addFieldsTitle: "Préparez-vous à ajouter des champs à votre table",
            tableNameHeading: "Nom de la table",
            recordNameHeading: "Un enregistrement dans le tableau est appelé",
            descriptionHeading: "La description",
            iconHeading: "Icône",
            suggestedIconsHeading: "Icônes suggérées",

            tableNamePlaceholder: "Par exemple, les clients",
            recordNamePlaceholder: "Par exemple, client",
            descriptionPlaceholder: "Texte à afficher en vol stationnaire sur le nom de la table dans la navigation à gauche",

            finishedButtonLabel: "Créer une table",
            tableCreated: "Tableau créé",
            tableCreationFailed: "Impossible de créer une table",
            validateTableNameEmpty: "Le nom de la table ne doit pas être vide",
            validateTableNameExists: "Le nom de la table doit être unique pour cette application",
            validateRecordNameEmpty: "Le nom de l'enregistrement ne doit pas être vide",

            homePageInitialTitle: "Commencez à utiliser votre table",
            homePageInitialDescription: "Nous avons créé quelques rapports pour accompagner votre nouvelle table afin que vous puissiez commencer à ajouter des enregistrements",
            homePageAddRecordButton: "Ajouter un enregistrement",
            homePageStillBuilding: "Bâtiment fixe?  ",
            homePageCreateAnother: "Créer un autre tableau",

            noSuggestedIcons: "Il n'y a pas d'icônes suggérées pour ce nom de table",
            typeForSuggestions: "Tapez un nom de table pour obtenir des suggestions",

            tableReadyTitle: "Votre table est prête!",
            tableReadyText1: "Chaque élément d'information que vous souhaitez collecter est un champ. Nous vous avons commencé avec un couple.",
            tableReadyText2: "Concevez ce formulaire pour collecter des informations. Faites glisser et déposez pour ajouter des champs.",

            tableReadyDialogOK: "D'accord",

            recordTitleFieldHeading: "Le champ du titre identifiant chaque enregistrement",
            recordTitleFieldDescription: "Choisissez le champ qui s'affiche comme titre lorsque vous visualisez ou modifiez un enregistrement. Ce champ doit être rempli.",
            recordTitleFieldDefault: "Par défaut à Noun + ID",
            recordName: "Nom de l'enregistrement"
        },
        iconChooser: {
            searchPlaceholder: "Rechercher des icônes..."
        },
        settings: {
            header: "Paramètres",
            appHeader: "App",
            automationSettings: "Paramètres d'automatisation",
            tablesHeader: "Table",
            formsHeader: "Forme",
            tableSettings: "Propriétés et paramètres de la table",
            configureFormBuilder: 'Modifiez ce formulaire',
            reportsHeader: 'Rapport',
            configureReportBuilder: 'Modifiez ce rapport'
        },
        tableEdit: {
            tableUpdateFailed: "Impossible de mettre à jour le tableau",
            tableUpdated: "Informations sur la table enregistrées",
            tableReset: "Informations sur la table non enregistrées",
            deleteThisTable: "Supprimez la table {tableName}?",
            deleteTable: "Supprimer la table",
            tableDeleted: "{tableName} tableau supprimé",
            tableDeleteFailed: "Échec de la suppression du tableau",
            tableDeleteDialog: {
                text: "Cela ne peut pas être annulé. Vous supprimez toutes les données dans le tableau et romperez les relations avec d'autres tables.",
                prompt: "Tapez OUI pour confirmer que vous souhaitez supprimer ce tableau."
            },
            YES: "OUI"
        },
        addUserToApp: {
            title: "Ajouter des utilisateurs à",
            description: "Recherchez les utilisateurs que vous souhaitez ajouter à votre application et décidez le niveau d'accès que vous souhaitez leur attribuer en leur attribuant un rôle",
            searching: "Recherche...",
            userSuccessTitle: "Votre application a un nouvel utilisateur!",
            userSuccessText: "Faites-leur savoir qu'ils ont accès à votre application en partageant le lien avec eux.",
            copy: "Copie",
            email: "Email",
            toCopy: "Cliquez pour copier dans le presse-papiers",
            toEmail: "Cliquez pour envoyer un courriel",
            userSuccessDialogOK: "Non merci",
            copied: "Lien copié",
            messageSubject:"Lien vers le {nom de l'application} Application",
            messageBody: "Je vous ai ajouté à {nom de l'application} Application. Voici un lien pour pouvoir y accéder. \N {lien}",
            addUser: "Ajouter",
            selectAUser:"Sélectionnez un utilisateur",
            selectUsers: "Sélectionnez les utilisateurs",
            assignRole: "Attribuer un rôle",
            searchPromptText: "Tapez pour rechercher",
            name: "Prénom",
            role: "Rôle",
            userName: "Nom d'utilisateur"
        }
    }
};
