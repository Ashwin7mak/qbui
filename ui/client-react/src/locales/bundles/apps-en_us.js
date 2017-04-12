import FieldFormats from '../../utils/fieldFormats';
/**
 * This bundle contains all the strings needed by the "Apps" functional area.
 * This functional area is for the main app served in client-react at the /qbase/apps route.
 */
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
                helpLinkText: "contact our Care team"
            },
            settings: "Settings",
            users: {
                addUser: "Adding a new user is not available yet",
                users: "Users",
                content: "This is the list of all the people who have been added to your application. You can get some quick insights about how many people are in each role in your application as well as find a specific person in the list and email them.",
                manager: "Application Manager"
            }
        },
        appMenu: {
            qbClassicLink: "Switch to QuickBase Classic"
        },
        pendingEditModal: {
            modalBodyMessage: "Save changes before leaving?",
            modalStayButton: "Stay and keep working",
            modalDoNotSaveButton: "Don't save",
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
            deleteTheseSwitches: "Delete these feature switches?",
            deleteTheseOverrides: "Delete these overrides?",
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
            cancel: "Cancel",
            next: "Next",
            previous: "Previous",
            finished: "Finished",
            new: "New",
            apply: "Apply",
            backToApp: "Back to app",
            reset: "Reset"
        },
        field: {
            search: "Search",
            searchNoMatch: "Nobody matches"
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
            saveAndAddRecordDisabled: "Adding records in the grid is not available yet",
            cancelSelection: "Cancel changes",
            favorite: "Favorite",
            gridEdit: "Grid Edit",
            edit: "Edit",
            delete: "Delete",
            email: "Email",
            print: "Print",
            customizeReport: "Customize this Report",
            customizeForm: "Customize this Form",
            customizePage: "Customize this Page",
            deleteTable: "Delete Table"
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
                lastUpdatedOn: "Last updated on ",
                createdOn: "Created on ",
                ownedBy: "Owned by "
            },
            notification: {
                save: {
                    success: "Form saved",
                    error: "Error saving form"
                }
            }
        },
        relationship: {
            childTable: "Child Table"
        },
        durationWithUnits: {
            // these keys can't change they correspond to the
            // duration consts for localization lookup
            Weeks:"{value, plural, \n =0 {0 weeks}\n =1 {1 week}\n other {{value}  weeks}\n} ",
            Days:"{value, plural, \n =0 {0 days}\n =1 {1 day}\n other {{value}  days}\n} ",
            Hours:"{value, plural, \n =0 {0 hours}\n =1 {1 hour}\n other {{value}  hours}\n} ",
            Minutes: "{value, plural, \n =0 {0 minutes}\n =1 {1 minute}\n other {{value}  minutes}\n} ",
            Seconds: "{value, plural, \n =0 {0 seconds}\n =1 {1 second}\n other {{value}  seconds}\n} ",
            Milliseconds: "{value, plural, \n =0 {0 milliseconds}\n =1 {1 millisecond}\n other {{value}  milliseconds}\n} "
        },
        acceptedDurationType: {
            Weeks: 'weeks',
            Week: 'week',
            W: 'w',
            Days: 'days',
            Day: 'day',
            D: 'd',
            Hours: 'hours',
            Hour: 'hour',
            H: 'h',
            Minutes: 'minutes',
            Minute: 'minute',
            M: 'm',
            Seconds: 'seconds',
            Second: 'second',
            S: 's',
            Milliseconds: 'milliseconds',
            Millisecond: 'millisecond',
            MS: 'ms',
            Secs: 'secs',
            Msecs: 'msecs'
        },
        durationTableHeader: {
            Weeks:"weeks",
            Days:"days",
            Hours:"hours",
            Minutes: "minutes",
            Seconds: "seconds"
        },
        report : {
            blank : "blank",
            inlineEdit: "Edit record inline",
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
            url: 'www.example.com',
            phone: '(xxx) xxx-xxxx',
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
            api: {
                notUniqueSingleField: "Fill in a different value. Another {recordName} is already using this {fieldName}.",
                notUniqueMultiChoice: "Select a different {fieldName}. Another {recordName} is already using this one.",
                invalidRecord: "Invalid data type. Fill in a different value."
            },
            unknown: "Invalid unknown type. Results: ",
            required: "Fill in the {fieldName}",
            email: "Format the {fieldName} like name@domain.com",
            emails: "Format all the addresses like name@domain.com",
            maxChars: "Use up to {maxNum} characters",
            choiceMaxLength : "Select a choice with {maxNum} characters or less",
            phone: "Format the {fieldName} like (xxx) xxx-xxxx",
            phoneInvalidCountryCode: "Format the country code like +x for international numbers",
            duration: {
                timeFormat: "Format the {fieldName} in {value}",
                Weeks: 'Format the {fieldName} in weeks',
                Days: 'Format the {fieldName} in days',
                Hours: 'Format the {fieldName} in hours',
                Minutes: 'Format the {fieldName} in minutes',
                Seconds: 'Format the {fieldName} in seconds',
                Milliseconds: 'Format the {fieldName} in milliseconds',
            }
        },
        createInQuickBaseClassicMessage: {
        },
        noneOption: "\<None\>",
        unimplemented: {
            formBuilder: "Configuration not currently available for this view",
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
            viewRecord: "View Record #{recordId}",
            editForm: "Edit Form",
        },
        quickBaseClassic: "QuickBase Classic",
        quickBaseMercury: "QuickBase Mercury",
        missingWalkMe: "Tutorial is not available",
        fieldsDefaultLabels: {
            [FieldFormats.TEXT_FORMAT]: "Text",
            [FieldFormats.MULTI_LINE_TEXT_FORMAT]: "Long text",
            [FieldFormats.TEXT_FORMAT_MULTICHOICE]: "Choice list",
            [FieldFormats.TEXT_FORMAT_RADIO_BUTTONS]: "Radio buttons",
            [FieldFormats.TEXT_FORMULA_FORMAT]: "Text formula",
            [FieldFormats.NUMBER_FORMAT]: "Number",
            [FieldFormats.CURRENCY_FORMAT]: "Currency",
            [FieldFormats.CURRENCY_FORMAT_MULTICHOICE]: "Currency",
            [FieldFormats.PERCENT_FORMAT]: "Percentage",
            [FieldFormats.PERCENT_FORMAT_MULTICHOICE]: "Percentage",
            [FieldFormats.NUMBER_FORMAT_MULTICHOICE]: "Numeric choice list",
            [FieldFormats.NUMBER_FORMAT_RADIO_BUTTONS]: "Numeric radio buttons",
            [FieldFormats.NUMERIC_FORMULA_FORMAT]: "Numeric formula",
            [FieldFormats.DATE_FORMAT]: "Date",
            [FieldFormats.DATETIME_FORMAT]: "Time stamp",
            [FieldFormats.TIME_FORMAT]: "Time of day",
            [FieldFormats.DURATION_FORMAT]: "Duration",
            [FieldFormats.USER_FORMAT]: "User",
            [FieldFormats.CHECKBOX_FORMAT]: "Checkbox",
            [FieldFormats.URL]: "URL",
            [FieldFormats.EMAIL_ADDRESS]: "Email",
            [FieldFormats.PHONE_FORMAT]: "Phone",
            [FieldFormats.RATING_FORMAT]: "Rating",
            [FieldFormats.RATING_FORMAT_MULTICHOICE]: "Rating",
            [FieldFormats.URL_FORMULA_FORMAT]: "URL Formula",
            FORMULA: "Formula",
            SCALAR: "Scalar",
            CONCRETE: "Concrete",
            REPORT_LINK: "Report link",
            SUMMARY: "Summary",
            LOOKUP: "Lookup",
            FILE_ATTACHMENT: "File"
        },
        builder: {
            formBuilder: {
                unimplemented: "Feature is not available right now",
                removeField: "Remove field from form",
                tooltips: {
                    // Tooltip for every single field type because of requirements for a/an and pronouns different for each language
                    [`addNew${FieldFormats.TEXT_FORMAT}`]: "Create a text field and add it to the form",
                    [`addNew${FieldFormats.NUMBER_FORMAT}`]: "Create a number field and add it to the form",
                    [`addNew${FieldFormats.DATE_FORMAT}`]: "Create a date field and add it to the form",
                    [`addNew${FieldFormats.DATETIME_FORMAT}`]: "Create a time stamp and add it to the form",
                    [`addNew${FieldFormats.TIME_FORMAT}`]: "Create a time-of-day field and add it to the form",
                    [`addNew${FieldFormats.CHECKBOX_FORMAT}`]: "Create a checkbox and add it to the form",
                    [`addNew${FieldFormats.USER_FORMAT}`]: "Create a user field and add it to the form",
                    [`addNew${FieldFormats.CURRENCY_FORMAT}`]: "Create a currency field and add it to the form",
                    [`addNew${FieldFormats.PERCENT_FORMAT}`]: "Create a percentage field and add it to the form",
                    [`addNew${FieldFormats.RATING_FORMAT}`]: "Create a rating field and add it to the form",
                    [`addNew${FieldFormats.DURATION_FORMAT}`]: "Create a duration field and add it to the form",
                    [`addNew${FieldFormats.PHONE_FORMAT}`]: "Create a phone field and add it to the form",
                    [`addNew${FieldFormats.MULTI_LINE_TEXT_FORMAT}`]: "Create a long text field and add it to the form",
                    [`addNew${FieldFormats.URL}`]: "Create a URL field and add it to the form",
                    [`addNew${FieldFormats.EMAIL_ADDRESS}`]: "Create an email field and add it to the form",
                    [`addNew${FieldFormats.TEXT_FORMULA_FORMAT}`]: "Create a text formula field and add it to the form",
                    [`addNew${FieldFormats.URL_FORMULA_FORMAT}`]: "Create a URL formula field and add it to the form",
                    [`addNew${FieldFormats.NUMERIC_FORMULA_FORMAT}`]: "Create a numeric formula field and add it to the form",
                    [`addNew${FieldFormats.TEXT_FORMAT_MULTICHOICE}`]: "Create a choice list and add it to the form",
                    [`addNew${FieldFormats.RATING_FORMAT_MULTICHOICE}`]: "Create a rating field and add it to the form",
                    [`addNew${FieldFormats.CURRENCY_FORMAT_MULTICHOICE}`]: "Create a currency field and add it to the form",
                    [`addNew${FieldFormats.PERCENT_FORMAT_MULTICHOICE}`]: "Create a percentage field and add it to the form",
                    [`addNew${FieldFormats.NUMBER_FORMAT_MULTICHOICE}`]: "Create a numeric choice list and add it to the form",
                    [`addNew${FieldFormats.NUMBER_FORMAT_RADIO_BUTTONS}`]: "Create numeric radio buttons and add them to the form",
                    [`addNew${FieldFormats.TEXT_FORMAT_RADIO_BUTTONS}`]: "Create radio buttons field and add them to the form",
                }
            },
            fieldGroups: {
                text: 'Text',
                numeric: 'Number',
                date: 'Date',
                other: 'Other'
            }
        },
        featureSwitchAdmin: {
            defaultFeatureName: "Feature",
            featureSwitchesTitle: "Feature Switches",
            featureSwitchOverridesTitle: "Feature Switch Overrides",
            switchName: "Switch Name",
            teamName: "Team Name",
            description: "Description",
            on: "On",
            off: "Off",
            onOrOff: "On/Off",
            defaultState: "Default State",
            addNew: "Add New",
            delete: "Delete",
            turnOn: "Turn On",
            turnOff: "Turn Off",
            featureSwitchCreated: "Feature switch created",
            featureSwitchUpdated: "Feature switch updated",
            featureSwitchesDeleted: "Feature switch(es) deleted",
            selectedFeatures: "Selected feature(s)",
            overrideType: "Type",
            overrideValue: "ID",
            overrideChangesDefault: "Overrides default?",
            overridesYes: "Yes",
            overridesNo: "No",
            overrideCreated: "Override created",
            overridesUpdated: "{num} override(s) updated",
            overrideUpdated: "Override updated",
            overridesDeleted: "Override(s) deleted",
            selectedOverrides: "Selected overrides(s)",
            noOverrides: "No overrides have been set, click 'Add New' to add one.",
            featureNameExists: "Feature names must be unique",
            featureNameEmpty: "Feature names must not be blank"
        },
        tableCreation: {
            newTablePageTitle: "New Table",
            newTableDescription: "Create a new table when you want to collect a new type of information.",
            newTableTitle: "Name your table",

            summaryDescription: "Each bit of information you want to collect is a field, like Customer Name.",
            summaryTitle: "Drag and drop fields you want to add to your table onto the form.  You can arrange the fields in the order you want people to use them.",

            addFieldsTitle: "Get ready to add fields to your table",
            tableNameHeading: "Table Name",
            recordNameHeading: "A record in the table is called",
            descriptionHeading: "Description",
            iconHeading: "Icon",
            suggestedIconsHeading: "Suggested Icons",

            tableNamePlaceholder: "For example, Customers",
            recordNamePlaceholder: "For example, customer",
            descriptionPlaceholder: "Text to show when hovering over the table name in the left navigation",

            finishedButtonLabel: "Create table",
            tableCreated: "Table created",
            tableCreationFailed: "Unable to create table",
            validateTableNameEmpty: "Fill in the table name",
            validateTableNameExists: "Fill in a different value. Another table is already using this name",
            validateRecordNameEmpty: "Fill in the record name",

            homePageInitialTitle: "Start using your table",
            homePageInitialDescription: "We created a couple of reports to go along with your new table so you can get started adding records",
            homePageAddRecordButton: "Add a record",
            homePageStillBuilding: "Still building?  ",
            homePageCreateAnother: "Create another table"
        },
        iconChooser: {
            searchPlaceholder: "Search table icons..."
        },
        settings: {
            header: "Settings",
            tablesHeader: "Table",
            appsHeader: "Table",
            formsHeader: "Form",
            tableSettings: 'Table properties & settings',
            configureFormBuilder: 'Modify this form',
        },
        tableEdit: {
            tableUpdateFailed: "Failed to update table",
            tableUpdated: "Table information saved",
            tableReset: "Table information not saved"
        }
    }
};
