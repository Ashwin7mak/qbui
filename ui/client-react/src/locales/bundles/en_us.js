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
        reports : {
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
            more: "More..."
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
            backToReport: "Back to the report"
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
        form : {
            tab : 'Tab',
            error: {
                403: "You are not authorized to access this form",
                500: "Unexpected error rendering this form"
            },
        },
        report : {
            blank : "blank",
            facets :{
                noFacets : "No values",
                seeMore : "more...",
                tooManyValues : "Too many values to use for filtering.",
                noCheck : "No",
                yesCheck : "Yes"
            },
            filteredRecordCount :
                "{filteredRecordCount} of {recordCount} {nameForRecords} ",
            newReport: "New",
            organizeReports: "Organize",
            recordCount : "{recordCount} {nameForRecords} ",
            recordCountPlaceHolder : "Counting {nameForRecords}",
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
                changeOrder: "Change order",
                chooseFields :  {
                    group: "Choose Field for grouping",
                    sort: "Choose Field for sorting"
                },
                group: "Group",
                header : "Sort & Group",
                moreFields : "more fields...",
                reset: "Reset",
                resetTip : "Exit and restore to original report sort and group settings",
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
            email: 'name@domain.com'
        },
    }
};
