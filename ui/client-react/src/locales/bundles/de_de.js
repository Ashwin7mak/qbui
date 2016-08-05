export default {
    locales: "de-de",
    currencyCode: "eur",

    messages: {
        apps: {
            header: "Anwendungen"
        },
        reports : {
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
            more: "Mehr..."
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
            backToReport: "Zurück zu melden"
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
            recordDeleted : "Der Datensatz wurde gelöscht",
            recordNotDeleted : "Nehmen Sie nicht gelöscht"
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
        report : {
            blank : "leer",
            facets :{
                noFacets :"Nein werte",
                seeMore : "weitere...",
                tooManyValues: "Zu viele Werte für die Filterung zu verwenden",
                noCheck : "Nein",
                yesCheck : "Ja"
            },
            filteredRecordCount :
                "{filteredRecordCount} von {recordCount} {nameForRecords} ",
            newReport: "Neu",
            organizeReports: "Organisieren",
            recordCount : "{recordCount} {nameForRecords} ",
            recordCountPlaceHolder : "Zählen {nameForRecords}",
            reportNavigationBar : "{pageStart} - {pageEnd}",
            searchPlaceHolder:  "Suchen Sie diese",
            sortAndGroup : {
                addField: "Feld hinzufügen",
                by: "nach",
                changeOrder: "Austausch bestellen",
                chooseFields :  {
                    group: "Wählen Sie Feld für die Gruppierung",
                    sort: "Wählen Sie für die Sortierung"
                },
                group: "Gruppen",
                header : "Sortieren & Gruppen",
                moreFields : "mehr Felder ...",
                reset: "Zurückstellen",
                resetTip : "Verlassen und Wiederherstellung des ursprünglichen Berichts zu sortieren und zu Gruppeneinstellungen",
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
            email: 'name@domain.com'
        },

    }
};
