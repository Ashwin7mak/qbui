export default {
    locales: "de-de",
    currencyCode: "eur",

    messages: {
        apps: {
            header: "Anwendungen"
        },
        app: {
            homepage: {
                welcomeTitle: "Willkommen bei Mercury Beta",
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
            settings: "Einstellungen"
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
            new: "Neu"
        },
        field: {
            search: "Suche",
            searchNoMatch: "Keiner stimmt mit"
        },
        grid: {
            no_data: "Es liegen keine Daten zum Anzeigen."
        },
        globalActions: {
            user: "Benutzer",
            alerts: "Benachrichtigung",
            help: "Hilfe",
            logout: "Abmelden"
        },
        pageActions: {
            addRecord: "Datensatz hinzufügen",
            configureFormBuilder: "Ändern Sie dieses Formular",
            saveRecord: "Änderungen speichern",
            saveAndAddRecord: "Speichern und fügen Sie eine neue Zeile",
            saveAndAddRecordDisabled: "Hinzufügen von mehreren Datensätzen funktioniert nicht sofort",
            cancelSelection: "Abbrechen Änderungen",
            favorite: "Favorit",
            gridEdit: "Gitter bearbeiten",
            edit: "Bearbeiten",
            delete: "Löschen",
            email: "Email",
            print: "Drucken",
            customizeReport: "Fertigen Sie diesen Bericht",
            customizeForm: "Fertigen Sie dieses Formular",
            customizePage: "Fertigen Sie diese Seite"
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
            deleted : "gelöscht",
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
                sign_out: "Austragen"
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
            }
        },
        relationship: {
            childTable: "Kind Tisch"
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
                clearFacetSelection: "Klicken Sie auf diese Filter zu löschen"
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
            phone: "Formatieren Sie die {fieldName} +x x xx xx xx xx",
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
            viewRecord: "Eintrag anzeigen # {recordId}"
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
        builder: {
            formBuilder: {
                unimplemented: "Feature ist momentan nicht verfügbar",
                removeField: "Feld aus Form entfernen"
            },
            fields: {
                // Keys are equal to server constants for field types to make it easier to get these keys
                FORMULA: "Formel",
                SCALAR: "Scalar",
                CONCRETE: "Beton",
                REPORT_LINK: "Berichtslink",
                SUMMARY: "Zusammenfassung",
                LOOKUP: "Nachschlagen",
                //Data types
                CHECKBOX: "Kontrollkästchen",
                TEXT: "Text",
                PHONE_NUMBER: "Telefonnummer",
                DATE_TIME: "Datum & Uhrzeit",
                DATE: "Datum",
                DURATION: "Dauer",
                TIME_OF_DAY: "Uhrzeit",
                NUMERIC: "Numerisch",
                CURRENCY: "Währung",
                RATING: "Rating",
                PERCENT: "Prozent",
                URL: "Url",
                EMAIL_ADDRESS: "Email",
                USER: "Benutzer",
                FILE_ATTACHMENT: "Datei",
                TEXT_FORMULA: "Textformel",
                URL_FORMULA: "Url-Formel",
                NUMERIC_FORMULA: "Numerische Formel"
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
            tableCreated: "Table created",
            tableCreationFailed: "Unable to create table"
        }
    }
};
