export default {
    locales: "en-us",

    messages: {
        test: {
            testMsg: "test"
        },
        apps: {
            header: "Apps"
        },
        footer: {
            copyright: "{year} Intuit Inc. All rights reserved."
        },
        lighthouse: {
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
            searchReportsPlaceholder: "Search reports..."
        },
        grid: {
            no_data: "There is no data to display.",
        },
        globalActions: {
            user: "User",
            alerts: "Alerts",
            help: "Help",
            logout: "Logout"
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
            filteredRecordCount : "{filteredRecordCount} of {recordCount} {nameForRecords} ",
            recordCount : "{recordCount} {nameForRecords} "
        }
    }
};
