export default {
    locales: "en-us",
    currencyCode: "usd",

    messages: {
        test: {
            testMsg: "test"
        },
        apps: {
            header: "Apps"
        },
        app: {
            homepage: {
                welcomeTitle: "Welcome to Mercury Beta",
                welcomeText: "While you learn your way around, use this area in place of your app homepage. " +
                "This is your real app in Mercury. You won’t see your app homepage yet, but all your " +
                "data is here. Work you do here displays immediately in Classic view, too.",
                launchVideoLink: "Launch video tour (2:58)",
                guideMeLink: "Guide me through Mercury",
                guideTitle: "Welcome guide",
                guideText: "Learn all about the Mercury Beta program. See what features are currently available and how your team can get work done faster, across devices, using Mercury.",
                guideButton: "Download the Welcome guide",
                feedbackTitle: "We want your feedback",
                feedbackText: "Our team is waiting to hear from you! We’re so eager to hear what you think about Mercury that we’ve included a Feedback button on each page of your app.",
                feedbackButton: "Give feedback",
                tipTitle: "Nothing happened when I clicked...",
                tipText: "This is work in progress, so if you click a button and it doesn’t do anything, no worries. We’re still working on that feature.",
                helpTitle: "Need help?",
                helpText: "We want you to be successful; that’s why we’re always here to help.",
                helpLinkPreText: "Please ",
                helpLinkText: "contact our Care team",
                missingWalkMe: "Tutorial is not available."
            }
        },
        appMenu: {
            qbClassicLink: "Switch to QuickBase Classic"
        },
        pendingEditModal: {
            modalBodyMessage: "Save changes before leaving?",
            modalStayButton: "Stay and keep working",
            modalDoNotSaveButton: "Don't Save",
            modalSaveButton: "Save"
        },
        dtsErrorModal: {
            dtsErrorTitle: "Sorry to interrupt your work",
            dtsErrorBodyMessage: "Mercury can’t continue running your app today, but will resume tomorrow.",
            dtsErrorSecondErrorBodyMessage: "Your app is still available in QuickBase Classic.",
            dtsErrorTID: "Transaction ID:",
            dtsErrorPrimaryButtonText: "Open my app in Classic"
        },
        reports: {
            allReports: "All Reports",
            emailReportTooltip: "Share these records with someone else",
            emailSubject: "'{reportName}' report from the QuickBase app '{appName}'",
            emailBody: "Here's the '{reportName}' report from the table '{tableName}' in '{appName}'"
        },
        records: {
            singular: "record",
            plural: "records"
        },
        selection: {
            edit: "Edit",
            email: "Email",
            print: "Print",
            copy: "Copy",
            delete: "Delete",
            dontDelete: "Don't delete",
            deleteThisRecord: "Delete this record?",
            more: "More...",
            placeholder: "Select...",
            notFound: "Not Found"
        },
        footer: {
            copyright: "{year} QuickBase, Inc. All rights reserved."
        },
        nav: {
            home: "Home",
            users: "Users",
            favorites: "Favorites",
            reportsHeading: "Reports",
            tablesHeading: "Tables",
            appsHeading: "Apps",
            searchAppsPlaceholder: "Search apps...",
            searchTablesPlaceholder: "Search tables...",
            searchReportsPlaceholder: "Search reports...",
            searchRecordsPlaceholder: "Search...",
            backToReport: "Back to the report",
            nextRecord: "Next Record",
            previousRecord: "Previous Record",
            save: "Save",
            saveAndNext: "Save & Next",
            saveAndAddAnother: "Save & Add Another",
            new: "New"
        },
        field: {
            search: "Search",
            searchNoMatch: "No users found"
        },
        grid: {
            no_data: "There is no data to display."
        },
        globalActions: {
            user: "User",
            alerts: "Alerts",
            help: "Help",
            logout: "Logout"
        },
        pageActions: {
            addRecord: "Add a record",
            saveRecord: "Save changes",
            saveAndAddRecord: "Save and add a new row",
            cancelSelection: "Cancel changes",
            favorite: "Favorite",
            gridEdit: "Grid Edit",
            edit: "Edit",
            delete: "Delete",
            email: "Email",
            print: "Print",
            customizeReport: "Customize this Report",
            customizeForm: "Customize this Form",
            customizePage: "Customize this Page"
        },
        recordActions: {
            previous: "Previous",
            return: "Return to report",
            next: "Next"
        },
        recordNotifications: {
            recordAdded : "Record added",
            recordNotAdded :"Record not added",
            recordSaved : "Record saved",
            recordNotSaved :"Record not saved",
            deleted : "deleted",
            notDeleted : "not deleted",
            cannotLoad : "Cannot load record",
            error: {
                403: "You are not authorized to create or access this record",
                500: "Unexpected error rendering this record"
            }
        },
        header: {
            menu: {
                locale: {
                    "en-us": "English",
                    "fr-fr": "French",
                    "de-de": "German"
                },
                preferences: "Preferences",
                sign_out: "Sign out"
            }
        },
        fields: {
            checkbox: {
                no: 'No',
                yes: 'Yes'
            },
            textField: {
                clear: 'Clear all text'
            }
        },
        form : {
            tab : 'Tab',
            error: {
                403: "You are not authorized to access this form",
                500: "Unexpected error rendering this form"
            },
            footer: {
                lastUpdatedBy: "Last updated by ",
                createdOn: "Created on ",
                ownedBy: "Owned by "
            }
        },
        report : {
            blank : "blank",
            facets : {
                noFacets : "No values",
                seeMore : "more...",
                tooManyValues : "Too many values to use for filtering.",
                noCheck : "No",
                yesCheck : "Yes",
                clearFacet: "Clear {facet} filter",
                clearFacetSelection: "Click to clear this filter"
            },
            filteredRecordCount : "{filteredRecordCount} of {recordCount} records",
            filteredSingleRecordCount : "{filteredRecordCount} of {recordCount} record",
            newReport: "New",
            organizeReports: "Organize",
            recordCount : "{recordCount} records",
            singleRecordCount : "{recordCount} record",
            recordCountPlaceHolder : "Counting records...",
            cardViewCountPlaceHolder : "Counting...",
            reportNavigationBar : "{pageStart} - {pageEnd}",
            previousToolTip: "Back",
            nextToolTip: "Next",
            previousPage: "Previous",
            nextPage: "Next",
            previousPageLoadingOnSwipe: "Getting previous...",
            nextPageLoadingOnSwipe: "Getting more...",
            searchPlaceHolder:  "Search these",
            sortAndGroup : {
                addField: "Add a field",
                by: "by",
                changeGroupOrder: "Change group order",
                changeSortOrder: "Change sort order",
                chooseFields :  {
                    group: "Choose a field to group by",
                    sort: "Choose a field to sort by"
                },
                group: "Group",
                header : "Sort & Group",
                moreFields : "more fields...",
                reset: "Reset",
                resetTip : "Exit and restore to original sort and group settings",
                sort:   "Sort",
                stopGroupingBy: "Stop grouping by",
                stopSortingBy: "Stop sorting by",
                thenBy: "then by"
            },
            menu: {
                sort: {
                    aToZ: "Sort A to Z",
                    highToLow: "Sort highest to lowest",
                    newToOld: "Sort newest to oldest",
                    zToA: "Sort Z to A",
                    lowToHigh: "Sort lowest to highest",
                    oldToNew: "Sort oldest to newest",
                    uncheckedToChecked: "Sort unchecked to checked",
                    checkedToUnchecked: "Sort checked to unchecked"
                },
                group: {
                    aToZ: "Group A to Z",
                    highToLow: "Group highest to lowest",
                    newToOld: "Group newest to oldest",
                    zToA: "Group Z to A",
                    lowToHigh: "Group lowest to highest",
                    oldToNew: "Group oldest to newest",
                    uncheckedToChecked: "Group unchecked to checked",
                    checkedToUnchecked: "Group checked to unchecked"
                },
                addColumnBefore: "Add column before",
                addColumnAfter: "Add column after",
                hideColumn: "Hide this column",
                newTable: "New table based on this column",
                columnProps: "Column properties",
                fieldProps: "Field properties"
            }
        },
        errorMessagePopup: {
            errorMessagePopupHeader: {
                singleErrorLabel: "Please fix this field",
                multipleErrorLabel: "Please fix these {numFields} fields."
            },
            errorAlertIconTooltip: {
                showErrorPopup: "Show error list",
                closeErrorPopup: "Hide error list",
            }
        },
        month: {
            jan: {
                short: "Jan",
                full: "January"
            },
            feb: {
                short: "Feb",
                full: "February"
            },
            mar: {
                short: "Mar",
                full: "March"
            },
            apr: {
                short: "Apr",
                full: "April"
            },
            may: {
                short: "May",
                full: "May"
            },
            jun: {
                short: "Jun",
                full: "June"
            },
            jul: {
                short: "Jul",
                full: "July"
            },
            aug: {
                short: "Aug",
                full: "August"
            },
            sep: {
                short: "Sep",
                full: "September"
            },
            oct: {
                short: "Oct",
                full: "October"
            },
            nov: {
                short: "Nov",
                full: "November"
            },
            dec: {
                short: "Dec",
                full: "December"
            }
        },
        groupHeader: {
            empty: "(Empty)",
            abbr: {
                quarter: "Q",
                fiscalYear: "FY"
            },
            numeric: {
                range: "{lower} to {upper}"
            },
            duration: {
                second: "{duration} second",
                seconds: "{duration} seconds",
                minute: "{duration} minute",
                minutes: "{duration} minutes",
                hour: "{duration} hour",
                hours: "{duration} hours",
                day: "{duration} day",
                days: "{duration} days",
                week: "{duration} week",
                weeks: "{duration} weeks"
            },
            date: {
                week: "Week of {date}",
                month: "{month} {year}",
                quarter: "{quarter} {year}"
            },
            am: "AM",
            pm: "PM"
        },
        cancel: "Cancel",
        cancelTip: "Exit and discard any changes",
        apply: "Apply",
        applyTip: "Exit and apply any changes",
        success: "Success",
        failed: "Failed",
        placeholder:  {
            email: 'name@domain.com',
            maxLength :"up to {maxLength} characters",
            url: 'www.example.com'
        },
        editErrors :"{numErrors, plural, \n  =0 {No errors}\n =1 {Please fix 1 field}\n other {Please fix these # fields}\n} ",
        errors: {
            appNotFound: {
                notFound: "The app is not available in Mercury right now. ",
                inQuickBaseClassic: " in QuickBase Classic. ",
                clickHere: "Open the app "
            },
            noApps: {
                noApps: "There are no apps in Mercury. ",
                addApps: " to add apps."
            },
            errorLoadingReport: {
                message: "That report is not available",
                helpText: "For now, you can try selecting a different report.",
                contactSupport: "Let our team know so we can fix it",
                supportTeamInfo: "Some information for the support team:",
                playGraphic: "Show me how",
                stopGraphic: "Stop playing",
                showAdditionalInfo: "View details",
                hideAdditionalInfo: "Hide details"
            },
            noTables: {
                noTables: "There are no tables in the app. ",
                createTablesInQuickBaseClassic: "Create tables in "
            },
            supportLink: {
                text: "Contact our Care team"
            }
        },
        invalidMsg : {
            unknown: 'Invalid unknown type. Results: ',
            required: 'Fill in the {fieldName}',
            email: 'Format the {fieldName} like name@domain.com',
            maxChars: 'Use up to {maxNum} characters',
            choiceMaxLength :"Select a choice with {maxNum} characters or less"
        },
        createInQuickBaseClassicMessage: {
        },
        noneOption: "\<None\>",
        unimplemented: {
            search: "Searching is not available yet",
            favorites: "Accessing favorites is not available yet",
            makeFavorite: "Marking as a favorite is not available yet",
            print: "Printing is not available yet",
            copy: "Copying is not available yet",
            email: "Emailing is not available yet",
            delete: "Deleting is not available yet"
        },
        pageTitles: {
            pageTitleSeparator: " - ",
            editingRecord: "Edit Record #{recordId}",
            newRecord: "Add Record",
            viewRecord: "View Record #{recordId}"
        },
        quickBaseClassic: "QuickBase Classic",
        quickBaseMercury: "QuickBase Mercury",
        v2v3: {
            manageAccessTitle: "Manage user access to Mercury",
            versionSelectTitle: "My users will open this app in",
            manageAccessTip: "*Only app admins can manage user access"

        }
    }
};
