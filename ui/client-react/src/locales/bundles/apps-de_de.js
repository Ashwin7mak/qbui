import FieldFormats from '../../utils/fieldFormats';
/**
 * This bundle contains all the strings needed by the "Apps" functional area.
 * This functional area is for the main app served in client-react at the /qbase/apps route.
 */
export default {
    locales: "de-de",
    currencyCode: "eur",

    messages: {
        apps: {
            header: "Anwendungen",
            missing: "Bleiben Sie dran, meine Apps kommen bald"
        },
        app: {
            homepage: {
                welcomeTitle: "Willkommen zu",
                welcomeText: "Während Sie Ihren Weg lernen, verwenden Sie diesen Bereich anstelle der App-Homepage. " +
                "Dies ist Ihre echte App in Mercury. Sie werden Ihre App-Homepage noch nicht sehen, aber alle Ihre " +
                "daten sind hier. Die Arbeit, die Sie hier vornehmen, wird auch in der klassischen Ansicht angezeigt.",
                launchVideoLink: "Starten Sie Video-Tour (2:58)",
                guideMeLink: "Führ mich durch Quecksilber",
                guideTitle: "Begrüßungsführer",
                guideText: "Erfahren Sie alles über das Mercury-Beta-Programm. Sehen Sie, welche Funktionen zurzeit verfügbar sind und wie Ihr Team die Arbeit schneller erledigen kann, über Geräte hinweg mit Hilfe von Mercury.",
                guideButton: "Laden Sie den Begrüßungsführer herunter",
                feedbackTitle: "Wir freuen uns über Ihr Feedback",
                feedbackText: "Unser Team wartet darauf, von Ihnen zu hören! Wir sind so eifrig zu hören, was Sie über Mercury denken, dass wir einen Feedback-Button auf jeder Seite Ihrer App enthalten haben.",
                feedbackButton: "Feedback geben",
                tipTitle: "Nichts geschah, als ich anklickte ...",
                tipText: "Dies ist in Arbeit, so dass, wenn Sie auf eine Schaltfläche klicken und es macht nichts, keine Sorgen. Wir arbeiten noch an dieser Funktion.",
                helpTitle: "Brauche Hilfe?",
                helpText: "Wir wollen, dass Sie erfolgreich sind; Deshalb sind wir immer hier, um zu helfen.",
                helpLinkPreText: "Bitte ",
                helpLinkText: "wenden Sie sich an unser Care-Team"
            },
            dashboards: {
                missing: "Bleiben Sie dran, App Dashboards kommen bald"
            },
            settings: "Einstellungen",
            users: {
                addUser: "Hinzufügen ein neu Benutzer",
                users: "Benutzer",
                content: "Dies ist die Liste aller Personen, die zu Ihrer Bewerbung hinzugefügt wurden. Sie können einige kurze Einblicke darüber, wie viele Menschen sind in jeder Rolle in Ihrer Anwendung sowie finden Sie eine bestimmte Person in der Liste und E-Mail sie.",
                manager: "Anwendungsmanager",
                removeUser: "Diesen Benutzer entfernen?",
                unAssignUser: "Benutzer können nicht mehr auf diese Anwendung zugreifen. Alle Daten, die sie zuvor eingegeben haben, bleiben in der Anwendung.",
                deleteUser: "Entfernen {Wert} Benutzer",
                deleteUsers: "Entfernen {Wert} Benutzer",
                removeButton: "Entfernen",
                cancel: "Stornieren",
                plural: "Benutzer",
                usersRemovedFromAppRole: "{numOfUsers} Benutzer aus der App-Rolle entfernt",
                userRemovedFromAppRole: "Benutzer aus der App-Rolle entfernt",
                userAdded: "Benutzer hinzugefügt",
                userAddError: "Fehler beim Hinzufügen von Benutzer",
                userRemovingError: "Fehler beim Entfernen des Benutzers",
                emailBody: "Email Körper geht hier",
                emailSubject: "E-Mail-Thema geht hier"
            }
        },
        appMenu: {
            qbClassicLink: "Wechseln zu QuickBase Classic"
        },
        pendingEditModal: {
            modalBodyMessage: "Speichern Sie die Änderungen vor dem Verlassen?",
            modalStayButton: "Bleiben Sie und halten Sie arbeiten",
            modalDoNotSaveButton: "Nicht speichern",
            modalSaveButton: "Sparen"
        },
        dtsErrorModal: {
            dtsErrorTitle: "Es tut uns Leid, Ihre Arbeit zu unterbrechen",
            dtsErrorBodyMessage: "Quecksilber kann nicht fortgesetzt werden Ihre App heute läuft, aber es wird morgen fortgesetzt.",
            dtsErrorSecondErrorBodyMessage: "Ihre Anwendung ist in Quickbase-Klassiker noch zur Verfügung.",
            dtsErrorTID: "Transaktions-ID:",
            dtsErrorPrimaryButtonText: "Öffne meine app in der klassischen"
        },
        reports :{
            allReports: "Alle Berichte",
            emailReportTooltip: "Teilen Sie diese Datensätze mit einer anderen Person",
            emailSubject: "'{reportName}' bericht der QuickBase app '{appName}'",
            emailBody: "Hier is der Bericht aus der Tabelle '{reportName}' '{tableName}' '{appName}' in"
        },
        records: {
            singular: "rekord",
            plural: "aufzeichnungen"
        },
        selection: {
            edit: "Bearbeiten",
            email: "Email",
            print: "Drucken",
            copy: "Kopieren",
            delete: "Löschen",
            dontDelete: "Nicht löschen",
            deleteThisRecord: "Löschen Sie diesen Datensatz?",
            deleteTheseSwitches: "Löschen sie diesen Schaltet?",
            deleteTheseOverrides: "Löschen sie diesen Überschreibt?",
            more: "Mehr...",
            placeholder: 'Wählen...',
            tablesPlaceholder: "Wählen Sie eine Tabelle aus...",
            notFound: "Nicht gefunden"
        },
        footer: {
            copyright: "{year} QuickBase, Inc. Alle Rechte vorbehalten."
        },
        nav: {
            home: "zu Hause",
            users: "Benutzer",
            favorites: "Favoriten",
            reportsHeading: "Berichte",
            tablesHeading: "Tische",
            appsHeading: "Anwendungen",
            searchAppsPlaceholder: "Suche anwendungen...",
            searchTablesPlaceholder: "Suche tische...",
            searchReportsPlaceholder: "Suche berichte...",
            searchRecordsPlaceholder: "Suche...",
            backToReport: "Zurück zu melden",
            nextRecord: "Nächsten Rekord",
            previousRecord: "Bisherigen Rekord",
            save: "Speichern",
            saveAndNext: "Speichern und Nächster",
            saveAndAddAnother: "Speichern und fügen Sie ein anderes",
            cancel: "Stornieren",
            next: "Nächster",
            previous: "Bisherige",
            finished: "Fertig",
            apply: "Sich bewerben",
            new: "Neu",
            backToApp: "Zurück zur App",
            reset: "Zurücksetzen",
            closeRecord: "Schließen Aufzeichnung",
            expandSection: "Erweitern Abschnitt",
            collapseSection: "Zusammenbruch Abschnitt"
        },
        field: {
            search: "Suche",
            searchNoMatch: "Keiner stimmt mit",
            searchNoMatchAddUser: "Keine Benutzer passen zu dem, was du suchst"
        },
        grid: {
            no_data: "Es liegen keine Daten zum Anzeigen.",
            no_filter_matches: "Keine {recordsName} übereinstimmen, was du suchst. Versuchen Sie, nach einer anderen Art von {recordName} zu suchen.",
            no_rows: "Es gibt keine {recordsName}, um jetzt zu sehen.",
            no_rows_but: "Es gibt keine {recordsName}, aber du kannst ",
            no_rows_create_link:  "erstelle einen"
        },
        globalActions: {
            user: "Benutzer",
            alerts: "Benachrichtigung",
            help: "Hilfe",
            logout: "Abmelden"
        },
        pageActions: {
            addRecord: "Datensatz hinzufügen",
            approve: "Genehmigen Sie diese Aufzeichnung",
            saveRecord: "Änderungen speichern",
            saveAndAddRecord: "Speichern und fügen Sie eine neue Zeile",
            saveAndAddRecordDisabled: "Hinzufügen von mehreren Datensätzen funktioniert nicht sofort",
            cancelSelection: "Abbrechen Änderungen",
            close: "Schließen",
            favorite: "Favorit",
            gridEdit: "Gitter bearbeiten",
            edit: "Bearbeiten",
            delete: "Löschen",
            email: "Email",
            print: "Drucken",
            customizeReport: "Fertigen Sie diesen Bericht",
            customizeForm: "Fertigen Sie dieses Formular",
            customizePage: "Fertigen Sie diese Seite",
            deleteTable: "Tabelle löschen"
        },
        recordActions: {
            previous: "Früher",
            return: "Zurück zu berichten",
            next: "Nächster"
        },
        recordNotifications: {
            recordAdded: "Die Bilanz hinzugefügt",
            recordNotAdded :"Nehmen Sie nicht hinzugefügt",
            recordSaved : "Datensatz gespeichert",
            recordNotSaved :"Nehmen Sie nicht gespeichert",
            deleted : "{value, plural,\n =0 {0 {nameForRecord} rekord}\n =1 {1 {nameForRecord} rekord}\n other {# {nameForRecord} aufzeichnungen}\n} gelöscht",
            notDeleted : "nicht gelöscht",
            cannotLoad : "Kann nicht Datensatz laden",
            error: {
                403: "Sie sind nicht zu erstellen oder Zugriff auf diesen Datensatz autorisiert",
                500: "Unerwarteter Fehler diesen Rekord-Rendering"
            }
        },
        header: {
            menu: {
                locale: {
                    "en-us": "Englisch",
                    "fr-fr": "Französisch",
                    "de-de": "Deutsche"
                },
                preferences: "Einstellungen",
                sign_out: "Austragen",
                feedbackMenuButton: "Feedback geben",
                feedbackMenuTitle: "Feedback",
                reportFeedBackButton: "Ein Problem melden",
                feedbackTooltip: "Teilen Sie Ideen und Fragen"
            }

        },
        fields: {
            checkbox: {
                no: 'Nein',
                yes: 'Ja'
            },
            textField: {
                clear: 'Alle texte löschen'
            }
        },
        form : {
            tab : 'Tab',
            error: {
                403: "Sie sind nicht dieses Formular für den Zugriff auf autorisierte",
                500: "Unerwarteter Fehler macht dieses Formular"
            },
            footer: {
                lastUpdatedBy: "Zuletzt aktualisiert von ",
                lastUpdatedOn: "Zuletzt aktualisiert am ",
                createdOn: "Erstellt am ",
                ownedBy: "gehört "
            },
            notification: {
                save: {
                    success: "Formular gespeichert",
                    error: "Fehler beim Speichern des Formulars"
                }
            },
            noParentRecordSelected: "Kein Datensatz ausgewählt"
        },
        automation: {
            approverecord: {
                success: "Rekord genehmigt.",
                error: "Bei der Genehmigung dieses Datensatzes ist ein Fehler aufgetreten."
            },
            testautomation: {
                success: "Automatisierungstest erfolgreich.",
                error: "Beim Testen dieser Automatisierung ist ein Fehler aufgetreten."
            },
            automationList: {
                nameHeader: "Name",
                activeHeader: "Aktiv",
                actionHeader: "Aktion",
                actionButton: "Test",
                activeYes: "Ja",
                activeNo: "Nein"
            },
            automationView: {
                stageHeading: "Automatisierung: {automationName}",
                nameHeader: "Name",
                triggerHeader: "Auslöser",
                actionHeader: "Aktion",
                actions: {
                    email: "Eine E-Mail senden"
                }
            }
        },
        relationship: {
            childTable: "Kind Tisch",
            addChildRecord: "{tableNoun} hinzufügen"
        },
        durationWithUnits: {
            Weeks:"{value, plural, \n =0 {0 Wochen}\n =1 {1 Woche}\n other {{value} Wochen}\n} ",
            Days:"{value, plural, \n =0 {0 Tage}\n =1 {1 Tag}\n other {{value} Tage}\n} ",
            Hours:"{value, plural, \n =0 {0 Stunden}\n =1 {1 Stunde}\n other {{value} Stunden}\n} ",
            Minutes: "{value, plural, \n =0 {0 Minuten}\n =1 {1 Minute}\n other {{value} Minuten}\n} ",
            Seconds: "{value, plural, \n =0 {0 Sekunden}\n =1 {1 Sekunde}\n other {{value} Sekunden}\n} ",
            Milliseconds: "{value, plural, \n =0 {0 Millisekunden}\n =1 {1 Millisekunde}\n other {{value} Millisekunden}\n} "
        },
        acceptedDurationType: {
            Weeks: 'Wochen',
            Week: 'Woche',
            W: 'W',
            Days: 'Tage',
            Day: 'Tag',
            D: 'T',
            Hours: 'Stunden',
            Hour: 'Stunde',
            H: 'S',
            Minutes: 'Minuten',
            Minute: 'Minute',
            M: 'M',
            Seconds: 'Sekunden',
            Second: 'Zweite',
            S: 'Z',
            Milliseconds: 'Millisekunden',
            Millisecond: 'Millisekunde',
            MS: 'MS',
            Secs: 'Seks',
            Msecs: 'Mseks'
        },
        durationTableHeader: {
            Weeks: "Wochen",
            Days: "Tage",
            Hours: "Stunden",
            Minutes: "Minuten",
            Seconds: "Sekunden"
        },
        report : {
            blank : "leer",
            inlineEdit: "Bearbeiten record inline",
            facets :{
                noFacets :"Nein werte",
                seeMore : "weitere...",
                tooManyValues: "Zu viele Werte für die Filterung zu verwenden",
                noCheck : "Nein",
                yesCheck : "Ja",
                clearFacet: "Filter {facet} zurücksetzen",
                clearFacetSelection: "Klicken Sie auf diese Filter zu löschen",
                filter: "Filter"
            },
            notification: {
                save: {
                    success: "Bericht gespeichert",
                    error: "Fehler beim Speichern des Berichts"
                }
            },
            filteredRecordCount : "{filteredRecordCount} von {recordCount} aufzeichnungen",
            filteredSingleRecordCount : "{filteredRecordCount} von {recordCount} aufzeichnen",
            newReport: "Neu",
            organizeReports: "Organisieren",
            recordCount : "{recordCount} aufzeichnungen",
            singleRecordCount : "{recordCount} aufzeichnen",
            recordCountPlaceHolder : "Zählen aufzeichnungen...",
            cardViewCountPlaceHolder : "Zählen...",
            reportNavigationBar : "{pageStart} - {pageEnd}",
            searchPlaceHolder:  "Suchen Sie diese",
            previousToolTip: "Zurück",
            nextToolTip: "Nächster",
            previousPage: "Früher",
            nextPage: "Nächster",
            previousPageLoadingOnSwipe: "Erste vorherige...",
            nextPageLoadingOnSwipe: "immer Mehr...",
            sortAndGroup : {
                sortAndGroupIcon: "Sortieren & Gruppe",
                addField: "Feld hinzufügen",
                by: "nach",
                changeGroupOrder: "Gruppe wechseln bestellen",
                changeSortOrder: "Reihenfolge ändern",
                chooseFields :  {
                    group: "Wählen Sie ein Feld zu einer Gruppe von",
                    sort: "Wählen Sie ein Feld zu sortieren, indem Sie"
                },
                group: "Gruppen",
                header : "Sortieren & Gruppen",
                moreFields : "mehr Felder ...",
                reset: "Zurückstellen",
                resetTip : "Verlassen und Wiederherstellung des ursprünglichen Art und Gruppeneinstellungen",
                sort:   "Sortieren",
                stopGroupingBy: "Stoppen Gruppierung von",
                stopSortingBy: "Stoppen die Sortierung nach",
                thenBy: "dann durch"
            },
            menu: {
                sort: {
                    aToZ: "Sortieren von A bis Z",
                    highToLow: "Sortieren höchsten zum niedrigsten",
                    newToOld: "Sortieren neu nach alt",
                    zToA: "Sortieren von Z nach A",
                    lowToHigh: "Sortieren der niedrigsten zur höchsten",
                    oldToNew: "Sortieren ältesten Bild",
                    uncheckedToChecked: "Sortieren ungeprüft geprüft",
                    checkedToUnchecked: "Sortieren markiert zu nicht markiert"
                },
                group: {
                    aToZ: "Gruppe A bis Z",
                    highToLow: "Gruppe höchsten zum niedrigsten",
                    newToOld: "Gruppe neu nach alt",
                    zToA: "Gruppe Z bis A",
                    lowToHigh: "Gruppe der niedrigsten zur höchsten",
                    oldToNew: "Gruppe ältesten Bild",
                    uncheckedToChecked: "Gruppe ungeprüft geprüft",
                    checkedToUnchecked: "Gruppe geprüft ungeprüft"
                },
                addColumnBefore: "In Spalte vor",
                addColumnAfter: "In Spalte nach",
                hideColumn: "Ausblenden dieser Spalte",
                newTable: "Neue Tabelle auf dieser Spalte über",
                columnProps: "Spalteneigenschaften",
                fieldProps: "Feldeigenschaften"
            },
            drawer: {
                title: "Versteckte Felder",
                info: "Fügen Sie ein Feld zum Bericht hinzu",
            }
        },
        errorMessagePopup: {
            errorMessagePopupHeader: {
                singleErrorLabel: "Bitte repariere dieses feld",
                multipleErrorLabel: "Bitte beheben sie diese {numFields} felder"
            },
            errorAlertIconTooltip: {
                showErrorPopup: "Fehlerliste anzeigen",
                closeErrorPopup: "Fehlerliste ausblenden",
            }
        },
        month: {
            jan: {
                short: "Jän",
                full: "Januar"
            },
            feb: {
                short: "Feb",
                full: "Februar"
            },
            mar: {
                short: "März",
                full: "März"
            },
            apr: {
                short: "Apr",
                full: "April"
            },
            may: {
                short: "Mai",
                full: "Mai"
            },
            jun: {
                short: "Juni",
                full: "Juni"
            },
            jul: {
                short: "Juli",
                full: "Juli"
            },
            aug: {
                short: "Aug",
                full: "August"
            },
            sep: {
                short: "Sept",
                full: "September"
            },
            oct: {
                short: "Okt",
                full: "Oktober"
            },
            nov: {
                short: "Nov",
                full: "November"
            },
            dec: {
                short: "Dez",
                full: "Dezember"
            }
        },
        groupHeader: {
            empty: "(Leer)",
            abbr: {
                quarter: "Q",
                fiscalYear: "FY"
            },
            numeric: {
                range: "{lower} bis {upper}"
            },
            duration: {
                second: "{duration} zweite",
                seconds: "{duration} sekunden",
                minute: "{duration} minute",
                minutes: "{duration} protokoll",
                hour: "{duration} stunde",
                hours: "{duration} stunden",
                day: "{duration} tag",
                days: "{duration} tage",
                week: "{duration} woche",
                weeks: "{duration} wochen"
            },
            date: {
                week: "Woche {date}",
                month: "{month} {year}",
                quarter: "{quarter} {year}"
            },
            am: "AM",
            pm: "PM"
        },
        cancel: "Stornieren",
        cancelTip: "Beenden und verwerfen alle Änderungen",
        apply: "Anwenden",
        applyTip: "Beenden und gelten alle Änderungen",
        success: "Erfolg",
        failed: "Gescheitert",
        placeholder:  {
            email: "name@domaine.de",
            maxLength : "bis zu {maxLength} Zeichen",
            url: "www.beispiel.de",
            phone: "+x x xx xx xx xx",
        },
        editErrors :"{numErrors, plural, \n  =0 {Keine Fehler}\n =1 {Bitte beheben Sie dieses Feld}\n other {Bitte korrigieren Sie diese # Felder}\n} ",
        errors: {
            appNotFound: {
                notFound: "Die App ist im Moment nicht verfügbar in Mercury. ",
                inQuickBaseClassic: " in Quickbase Classic. ",
                clickHere: "Öffnen Sie die App"
            },
            noApps: {
                noApps: "Es gibt keine Apps in Mercury. ",
                addApps: " hinzuzufügen Apps."
            },
            errorLoadingReport: {
                message: "Dieser Bericht ist nicht verfügbar",
                helpText: "Denn jetzt können Sie versuchen, einen anderen Bericht auswählen.",
                contactSupport: "Lassen Sie unser Team kennen, damit wir das Problem beheben können",
                supportTeamInfo: "Einige Informationen für das Support-Team:",
                playGraphic: "Zeig mir wie",
                stopGraphic: "Hör auf zu spielen",
                showAdditionalInfo: "Details anzeigen",
                hideAdditionalInfo: "Details ausblenden"
            },
            noTables: {
                noTables: "Es gibt keine Tabellen. ",
                createTablesInQuickBaseClassic: "Erstellen von Tabellen in "
            },
            supportLink: {
                text: "Wenden Sie sich an unser Care-Team"
            }
        },
        invalidMsg : {
            api: {
                notUniqueSingleField: "Füllen Sie einen anderen Wert aus. Ein anderer {recordName} ist bereits mit diesem {fieldName}.",
                notUniqueMultiChoice: "Wählen Sie einen anderen {fieldName}. Ein anderer {recordName} verwendet diesen bereits.",
                invalidRecord: "Ungültiger Datentyp. Geben Sie einen anderen Wert ein."
            },
            unknown: "Ungültige unbekannte Art. Befund: ",
            required: "Füllen Sie das {fieldName}",
            email: "Formatieren Sie die {fieldName} wie name@domaine.de",
            emails: "Formatieren Sie alle Adressen wie name@domaine.de",
            maxChars: "Verwenden Sie bis zu {maxNum} Zeichen",
            choiceMaxLength : "Wählen Sie eine Wahl mit {maxNum} Zeichen oder weniger",
            phone: "Geben Sie eine echte Nummer für {fieldName}",
            phoneInvalidCountryCode: "Formatieren Sie den Ländercode wie +x für internationale Nummern",
            duration: {
                timeFormat: "Formatieren Sie die {fieldName} im {value}",
                Weeks: 'Formatieren Sie die {fieldName} im Wochen',
                Days: 'Formatieren Sie die {fieldName} im Tage',
                Hours: 'Formatieren Sie die {fieldName} im Stunden',
                Minutes: 'Formatieren Sie die {fieldName} im Minuten',
                Seconds: 'Formatieren Sie die {fieldName} im Sekunden',
                Milliseconds: 'Formatieren Sie die {fieldName} im Millisekunden',
            }
        },
        noneOption: "\<Keiner\>",
        unimplemented: {
            formBuilder: "Für diese Ansicht ist derzeit keine Konfiguration verfügbar",
            search: "Die Suche ist noch nicht verfügbar",
            favorites: "Der Zugriff auf Favoriten ist noch nicht verfügbar",
            makeFavorite: "Kennzeichnung als Favorit ist noch nicht verfügbar",
            print: "Der Druck ist noch nicht verfügbar",
            copy: "Kopieren ist noch nicht verfügbar",
            email: "E-Mail ist noch nicht verfügbar",
            delete: "Das Löschen ist noch nicht verfügbar",
            viewRecord: "Eintrag anzeigen # {recordId}",
            emailUsers: "Der Export von CSV ist noch nicht verfügbar",
            settingsRole: "Rollenwechsel ist noch nicht verfügbar",
            emailApp: "Die App-Einladung ist noch nicht verfügbar",
        },
        pageTitles: {
            pageTitleSeparator: " - ",
            editingRecord: "Datensatz #{recordId} bearbeiten",
            newRecord: "Datensatz hinzufügen",
            editForm: "Formular bearbeiten",
        },
        quickBaseClassic: "QuickBase Klassik",
        quickBaseMercury: "QuickBase Mercury",
        missingWalkMe: "Tutorial ist nicht verfügbar",
        missingHelp: "Hilfe ist noch nicht verfügbar",
        fieldsDefaultLabels: {
            [FieldFormats.TEXT_FORMAT]: "Text",
            [FieldFormats.MULTI_LINE_TEXT_FORMAT]: "Langtext",
            [FieldFormats.TEXT_FORMAT_MULTICHOICE]: "Auswahlliste",
            [FieldFormats.TEXT_FORMAT_RADIO_BUTTONS]: "Radio Knöpfe",
            [FieldFormats.TEXT_FORMULA_FORMAT]: "Textformel",
            [FieldFormats.NUMBER_FORMAT]: "Nummer",
            [FieldFormats.CURRENCY_FORMAT]: "Währung",
            [FieldFormats.CURRENCY_FORMAT_MULTICHOICE]: "Währung",
            [FieldFormats.PERCENT_FORMAT]: "Prozentsatz",
            [FieldFormats.PERCENT_FORMAT_MULTICHOICE]: "Prozentsatz",
            [FieldFormats.NUMBER_FORMAT_MULTICHOICE]: "Numerische Auswahlliste",
            [FieldFormats.NUMBER_FORMAT_RADIO_BUTTONS]: "Numeric radio buttons",
            [FieldFormats.NUMERIC_FORMULA_FORMAT]: "Numerische Formel",
            [FieldFormats.DATE_FORMAT]: "Datum",
            [FieldFormats.DATETIME_FORMAT]: "Time stamp",
            [FieldFormats.TIME_FORMAT]: "Zeitstempel",
            [FieldFormats.DURATION_FORMAT]: "Dauer",
            [FieldFormats.USER_FORMAT]: "Benutzer",
            [FieldFormats.CHECKBOX_FORMAT]: "Checkbox",
            [FieldFormats.URL]: "URL",
            [FieldFormats.EMAIL_ADDRESS]: "Email",
            [FieldFormats.PHONE_FORMAT]: "Telefon",
            [FieldFormats.RATING_FORMAT]: "Bewertung",
            [FieldFormats.RATING_FORMAT_MULTICHOICE]: "Bewertung",
            [FieldFormats.URL_FORMULA_FORMAT]: "URL Formel",
            [FieldFormats.LINK_TO_RECORD]: "Erhalten Sie einen anderen Rekord",
            LINK_TO_RECORD_FROM: "Erhalten Sie einen anderen Rekord von {parentTable}",
            FORMULA: "Formel",
            SCALAR: "Skalar",
            CONCRETE: "Beton",
            REPORT_LINK: "Bericht Link",
            SUMMARY: "Zusammenfassung",
            LOOKUP: "Sieh nach oben",
            FILE_ATTACHMENT: "Datei"
        },
        fieldPropertyLabels: {
            title: "Felderigenschaften",
            name: "Name",
            required: "Muss ausgefüllt werden",
            multiChoice: "Wahlen",
            unique: "Muss einmalige Werte haben",
            linkToRecord: "Link zu einem Datensatz in der Tabelle",
            connectedTo: "Auf {fieldName}-Feld verbunden"
        },
        builder: {
            tabs: {
                existingFields: 'Fügen Sie ein vorhandenes Feld hinzu',
                newFields: 'Erstellen Sie ein neues Feld',
            },
            reportBuilder: {
                modify: 'Bericht ändern'
            },
            formBuilder: {
                modify: 'Formular ändern',
                unimplemented: "Feature ist momentan nicht verfügbar",
                removeField: "Feld aus Form entfernen",
                newFieldsMenuTitle: 'Neu',
                existingFieldsMenuTitle: 'Bestehende',
                tooltips: {
                    [`addNew${FieldFormats.TEXT_FORMAT}`]: "Erstellen Sie ein Textfeld und fügen Sie es dem Formular hinzu",
                    [`addNew${FieldFormats.NUMBER_FORMAT}`]: "Erstellen Sie ein Zahlenfeld und fügen Sie es dem Formular hinzu",
                    [`addNew${FieldFormats.DATE_FORMAT}`]: "Erstellen Sie ein Datumsfeld und fügen Sie es dem Formular hinzu",
                    [`addNew${FieldFormats.DATETIME_FORMAT}`]: "Erstellen Sie einen Zeitstempel und fügen Sie ihn dem Formular hinzu",
                    [`addNew${FieldFormats.TIME_FORMAT}`]: "Erstellen Sie ein Time-of-Day-Feld und fügen Sie es dem Formular hinzu",
                    [`addNew${FieldFormats.CHECKBOX_FORMAT}`]: "Erstellen Sie ein Kontrollkästchen und fügen Sie es dem Formular hinzu",
                    [`addNew${FieldFormats.USER_FORMAT}`]: "Erstellen Sie ein Benutzerfeld und fügen Sie es dem Formular hinzu",
                    [`addNew${FieldFormats.CURRENCY_FORMAT}`]: "Erstellen Sie ein Währungsfeld und fügen Sie es dem Formular hinzu",
                    [`addNew${FieldFormats.PERCENT_FORMAT}`]: "Erstellen Sie ein Prozentfeld und fügen Sie es dem Formular hinzu",
                    [`addNew${FieldFormats.RATING_FORMAT}`]: "Erstellen Sie ein Rating-Feld und fügen Sie es dem Formular hinzu",
                    [`addNew${FieldFormats.DURATION_FORMAT}`]: "Erstellen Sie ein Dauerfeld und fügen Sie es dem Formular hinzu",
                    [`addNew${FieldFormats.PHONE_FORMAT}`]: "Erstellen Sie ein Telefonfeld und fügen Sie es dem Formular hinzu",
                    [`addNew${FieldFormats.MULTI_LINE_TEXT_FORMAT}`]: "Erstellen Sie ein langes Textfeld und fügen Sie es dem Formular hinzu",
                    [`addNew${FieldFormats.URL}`]: "Erstellen Sie ein URL-Feld und fügen Sie es dem Formular hinzu",
                    [`addNew${FieldFormats.EMAIL_ADDRESS}`]: "Erstellen Sie ein E-Mail-Feld und fügen Sie es dem Formular hinzu",
                    [`addNew${FieldFormats.TEXT_FORMULA_FORMAT}`]: "Erstellen Sie ein Textformelfeld und fügen Sie es dem Formular hinzu",
                    [`addNew${FieldFormats.URL_FORMULA_FORMAT}`]: "Erstellen Sie ein URL-Formelfeld und fügen Sie es dem Formular hinzu",
                    [`addNew${FieldFormats.NUMERIC_FORMULA_FORMAT}`]: "Erstellen Sie ein numerisches Formelfeld und fügen Sie es dem Formular hinzu",
                    [`addNew${FieldFormats.TEXT_FORMAT_MULTICHOICE}`]: "Erstellen Sie eine Auswahlliste und fügen Sie sie dem Formular hinzu",
                    [`addNew${FieldFormats.RATING_FORMAT_MULTICHOICE}`]: "Erstellen Sie ein Rating-Feld und fügen Sie es dem Formular hinzu",
                    [`addNew${FieldFormats.CURRENCY_FORMAT_MULTICHOICE}`]: "Erstellen Sie ein Währungsfeld und fügen Sie es dem Formular hinzu",
                    [`addNew${FieldFormats.PERCENT_FORMAT_MULTICHOICE}`]: "Erstellen Sie ein Prozentfeld und fügen Sie es dem Formular hinzu",
                    [`addNew${FieldFormats.NUMBER_FORMAT_MULTICHOICE}`]: "Erstellen Sie eine numerische Auswahlliste und fügen Sie sie dem Formular hinzu",
                    [`addNew${FieldFormats.NUMBER_FORMAT_RADIO_BUTTONS}`]: "Erstellen Sie numerische Optionsfelder und fügen Sie sie dem Formular hinzu",
                    [`addNew${FieldFormats.TEXT_FORMAT_RADIO_BUTTONS}`]: "Radio-Optionsfeld erstellen und sie dem Formular hinzufügen",
                    [`addNew${FieldFormats.LINK_TO_RECORD}`]: "Link zu einem Datensatz in einer anderen Tabelle erstellen",
                }
            },
            existingFieldsToolTip: 'Füge {fieldName} dem Formular hinzu',
            automationBuilder: {
                modify: 'Automatisierung ändern'
            },
            fieldGroups: {
                text: "Text",
                numeric: "Nummer",
                date: "Datum",
                other: "Andere",
                relationships: "Beziehungen",
                tableDataConnections: "Tabellendatenverbindungen"
            },
            defaultMultichoiceOptions: {
                first: "Option 1",
                second: "Option 2",
                third: "Option 3"
            },
            linkToRecord: {
                dialogTitle: "Erhalten Sie einen anderen Rekord",
                addToForm: "Fügen Sie hinzu",
                tableChooserDescription: "Wenn Sie ein {tableNoun} erstellen oder aktualisieren, können Sie nachschlagen und Informationen aus einem Datensatz in einer anderen Tabelle erhalten.",
                tableChooserHeading: "Wo ist die Platte, die du bekommen willst?",
                advancedSettingsHeading: "Erweiterte Einstellungen",
                fieldChooserDescription: "Um einen Datensatz in der {tableName} Tabelle zu erhalten, wird eine automatische Zuordnung mit einem eindeutigen und erforderlichen Feld erstellt. Um ein anderes Feld auszuwählen, kannst du aus der folgenden Liste auswählen. Sie können dieses Feld nicht ändern, sobald Sie es Ihrem Formular hinzufügen."
            }
        },
        featureSwitchAdmin: {
            defaultFeatureName: "Feature",
            featureSwitchesTitle: "Funktionsschalter",
            featureSwitchOverridesTitle: "Feature-Schalter-Overrides",
            switchName: "Funktionsname",
            teamName: "Teamname",
            description: "Beschreibung",
            on: "Auf",
            off: "Aus",
            onOrOff: "Auf/Aus",
            defaultState: "Standardzustand",
            addNew: "Neue hinzufügen",
            delete: "Löschen",
            turnOn: "Einschalten",
            turnOff: "Abschalten",
            featureSwitchCreated: "Feature erstellt",
            featureSwitchUpdated: "Feature geändert",
            featureSwitchesDeleted: "Features entfernt",
            selectedFeatures: "Ausgewählte Merkmale",
            overrideType: "Typ",
            overrideValue: "ID",
            overrideChangesDefault: "Überschreibt standardmäßig?",
            overridesYes: "Ja",
            overridesNo: "Nein",
            overrideCreated: "Überschreiben erstellt",
            overridesUpdated: "{num} Überschreiben erstellt",
            overrideUpdated: "Überschreiben geändert",
            overridesDeleted: "Überschreibt gelöscht",
            selectedOverrides: "Ausgewählte Überschreibungen",
            noOverrides: "Es wurden keine Overrides gesetzt",
            featureNameExists: "Feature-Namen müssen eindeutig sein",
            featureNameEmpty: "Feature-Namen dürfen nicht leer sein"
        },
        tableCreation: {
            newTablePageTitle: "Neue Tabelle",
            newTableDescription: "Erstellen Sie eine neue Tabelle, wenn Sie eine neue Art von Informationen sammeln möchten.",
            newTableTitle: "Nennen Sie Ihren Tisch",

            summaryDescription: "Jedes Bit von Informationen, die Sie sammeln möchten, ist ein Feld.",
            summaryTitle: "Drag & Drop Felder, die Sie hinzufügen möchten, um Ihre Tabelle auf das Formular. Sie können die Felder in der Reihenfolge anordnen, in der die Leute sie benutzen möchten.",

            addFieldsTitle: "Machen Sie sich bereit, Felder zu Ihrem Tisch hinzuzufügen",
            tableNameHeading: "Tabellenname",
            recordNameHeading: "Ein Rekord in der Tabelle heißt",
            descriptionHeading: "Beschreibung",
            iconHeading: "Symbol",
            suggestedIconsHeading: "Vorgeschlagene Ikonen",

            tableNamePlaceholder: "Zum Beispiel, Kunden",
            recordNamePlaceholder: "Zum Beispiel, Kunde",
            descriptionPlaceholder: "Text, der angezeigt wird, wenn er über den Tabellennamen in der linke navigation",

            finishedButtonLabel: "Tabelle",
            tableCreated: "Tabelle erstellen",
            tableCreationFailed: "Unable to create table",
            validateTableNameEmpty: "Kann keine Tabelle erstellen",
            validateTableNameExists: "Der Tabellenname muss für diese App eindeutig sein",
            validateRecordNameEmpty: "Tabellenname darf nicht leer sein",

            homePageInitialTitle: "Beginnen Sie mit Ihrem Tisch",
            homePageInitialDescription: "Wir haben ein paar Berichte erstellt, um mit deiner neuen Tabelle zu gehen, damit du mit dem Hinzufügen von Datensätzen beginnen kannst",
            homePageAddRecordButton: "Fügen Sie einen Datensatz hinzu",
            homePageStillBuilding: "Noch gebaut  ",
            homePageCreateAnother: "Erstellen Sie eine andere Tabelle",

            noSuggestedIcons: "Es gibt keine vorgeschlagenen Symbole für diesen Tabellennamen",
            typeForSuggestions: "Bitte geben Sie einen Tabellennamen ein, um Vorschläge zu erhalten",

            tableReadyTitle: "Dein Tisch ist fertig!",
            tableReadyText1: "Jedes Bit von Informationen, die Sie sammeln möchten, ist ein Feld. Wir haben dich mit einem Paar angefangen.",
            tableReadyText2: "Gestalte dieses Formular, um Infos zu sammeln. Ziehen und ziehen, um Felder hinzuzufügen.",

            tableReadyDialogOK: "OK"
        },
        iconChooser: {
            searchPlaceholder: "Tabellensymbole suchen ......"
        },
        settings: {
            header: "Einstellungen",
            appHeader: "App",
            automationSettings: "Automatisierungseinstellungen",
            tablesHeader: "Tabelle",
            formsHeader: "Bilden",
            tableSettings: "Tabelleneigenschaften & Einstellungen",
            configureFormBuilder: "Ändern Sie dieses Formular",
            reportsHeader: 'Bericht',
            configureReportBuilder: 'Ändern Sie diesen Bericht'

        },
        tableEdit: {
            tableUpdateFailed: "Fehler beim Aktualisieren der Tabelle",
            tableUpdated: "Tabelleninformationen gespeichert",
            tableReset: "Tabelleninformationen werden nicht gespeichert",
            deleteThisTable: "Löschen {tableName} Tabelle?",
            deleteTable: "Tabelle löschen",
            tableDeleted: "{tableName} Tabelle gelöscht",
            tableDeleteFailed: "Tabelle konnte nicht gelöscht werden",
            tableDeleteDialog: {
                text: "Das kann nicht rückgängig gemacht werden. Sie werden alle Daten in der Tabelle löschen und die Beziehungen zu anderen Tabellen brechen.",
                prompt: "Geben Sie JA ein, um zu bestätigen, dass Sie diese Tabelle löschen möchten"
            },
            YES: "JA"
        },
        addUserToApp: {
            title: "Benutzer hinzufügen",
            description: "Suchen Sie nach Benutzern, die Sie Ihrer App hinzufügen möchten, und entscheiden Sie, welche Zugriffsebene Sie ihnen geben möchten, indem Sie sie einer Rolle zuordnen",
            searching: "Suchen...",
            userSuccessTitle: "Deine App hat neuen Benutzer!",
            userSuccessText: "Lassen Sie sie wissen, dass sie Zugang zu Ihrer App haben, indem Sie den Link mit ihnen teilen.",
            copy: "Kopieren",
            email: "Email",
            toCopy: "Klicken Sie auf Kopieren in die Zwischenablage",
            toEmail: "Klicken Sie hier, um eine E-Mail zu senden",
            userSuccessDialogOK: "Nein Danke",
            copied: "Link kopiert",
            messageSubject:"Link zum {App Name} App",
            messageBody: "Ich habe dich dazu gebracht {App Name} App. Hier ist ein Link, damit du darauf zugreifen kannst. \N {Verknüpfung}"
        }
    }
};
