(function() {
    'use strict';
    // Import the base page object
    var e2ePageBase = requirePO('./e2ePageBase');
    let TopNavPO = requirePO('topNav');
    let RequestAppsPage = requirePO('requestApps');
    let tableCreatePO = requirePO('tableCreate');

    var ReportContentPage = Object.create(e2ePageBase, {
        addRecordBtn: {get: function() {return browser.element('.reportToolsAndContentContainer .addNewRecord');}},
        reportSortGrpBtn: {get: function() {return browser.element('.sortButton');}},
        getAllRowsCellValues: {get: function() {
            browser.element('.fieldRow').waitForVisible();
            return browser.elements('.fieldValue');
        }},
        /**
         * Helper method to ensure the report has been properly loaded with records. Will throw an error if no records are in the report.
         * @returns A promise that will resolve after waiting for the report records to be displayed
         */
        waitForReportContent: {value: function() {
            // wait until you see .records count
            return browser.element('.recordsCount').waitForVisible();
        }},

        /**
         * Helper method that will load a report for you in your browser by directly hitting a generated URL
         * @param realmName
         * @param appId
         * @param tableId
         * @param reportId
         * @returns A promise that will resolve after loading the generated URL
         */
        loadReportByIdInBrowser: {value: function(realmName, app, table, reportId) {
            // Load the requestAppsPage (shows a list of all the apps in a realm)
            RequestAppsPage.get(e2eBase.getRequestAppsPageEndpoint(realmName));
            //select the App
            RequestAppsPage.selectApp(app.name);
            //Select table
            tableCreatePO.selectTable(table.name);
            //navigate to the url
            browser.url(e2eBase.getRequestReportsPageEndpoint(realmName, app.id, table.id, reportId));
            //wait for the report content to be visible
            this.waitForReportContent();
        }},

        /**
         * Function that will click on the Add record button on report page
         */
        clickAddRecordBtn: {value: function() {
            browser.element('.reportToolsAndContentContainer .addNewRecord').waitForVisible();
            browser.element('.reportToolsAndContentContainer .addNewRecord').click();
            browser.element('.editForm').waitForVisible();
        }},
    });

    module.exports = ReportContentPage;
}());
