(function() {
    'use strict';
    // Import the base page object
    var e2ePageBase = requirePO('./e2ePageBase');
    var formsPO = requirePO('formsPage');

    var ReportContentPage = Object.create(e2ePageBase, {
        addRecordBtn: {get: function() {return browser.element('.reportToolsAndContentContainer .iconUISturdy-add');}},

        /**
         * Helper method to ensure the report has been properly loaded with records. Will throw an error if no records are in the report.
         * @returns A promise that will resolve after waiting for the report records to be displayed
         */
        waitForReportContent: {value: function() {
            // wait until you see .card rows
            browser.element('.card').waitForVisible();
            return browser.element('.reportToolsAndContentContainer .iconUISturdy-add').waitForVisible();
        }},

        /**
         * Helper method that will load a report for you in your browser by directly hitting a generated URL
         * @param realmName
         * @param appId
         * @param tableId
         * @param reportId
         * @returns A promise that will resolve after loading the generated URL
         */
        loadReportByIdInBrowser: {value: function(realmName, appId, tableId, reportId) {
            //navigate to the url
            browser.url(e2eBase.getRequestReportsPageEndpoint(realmName, appId, tableId, reportId));
            //wait until addRecord button in table is visible
            this.addRecordBtn.waitForVisible();
        }},

        clickAddRecordBtn: {value: function() {
            //this.addRecordBtn.waitForVisible();
            browser.element('.reportToolsAndContentContainer .iconUISturdy-add').click();
            browser.element('.editForm').waitForVisible();
        }},


    });

    module.exports = ReportContentPage;
}());
