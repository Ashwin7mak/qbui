export default {
    locales: "en-us",

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
            copyright: "{year} Intuit Inc. All rights reserved."
        },
        stage: {
            header: "A Very Important Report",
            sub_header: "This is a snapshot of your original report from your app",
            content: "Congratulations and welcome! You’re part of a small, early-access program. Your feedback now, will shape the way QuickBase looks and behaves in the future. Below is a snapshot of one of your reports. Browse through it as you normally would. How does it look? Does your data display the way you expect it to? Use the big button, to the right, to let us know. We look forward to hearing what you have to say.",
            feedback: {
                header: "Remember",
                    //TODO: conform message key naming to camel case not snake
                sub_header: "Your Feedback Matters",
                button: "Send your feedback"
            }
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
        iconActions: {
            more: "More..."
        },
        recordActions: {
            previous: "Previous",
            return: "Return to report",
            next: "Next"
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
                "{padding}{filteredRecordCount} of {recordCount}",
            newReport: "New",
            organizeReports: "Organize",
            recordCount : "{recordCount} {nameForRecords} ",
            searchPlaceHolder:  "Search these {nameForRecords} ...",
        },
        cancel: "Cancel"
    }
};
