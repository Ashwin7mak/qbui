/**
 * This file uses the Page Object pattern to define locators for viewing relationships data in UI
 *
 * Created by klabak on 4/6/17
 */
(function() {
    'use strict';
    // Import the base page object
    var e2ePageBase = requirePO('./e2ePageBase');
    var formsPO = requirePO('formsPage');

    var relationshipsPage = Object.create(e2ePageBase, {

        /**
         * Returns form section containing the child table for a relationship
         * @param panelId - id used return corresponding section element
         */
        qbPanelFormSectionEl: {value: function(panelId) {
            let id = '#panelId' + panelId;
            return browser.element(id);
        }},

        /**
         * Returns the table header element for a section
         * @param qbPanelFormSection - form section element
         */
        qbPanelHeaderTitleTextEl: {value: function(qbPanelFormSection) {return qbPanelFormSection.element('.qbPanelHeaderTitleText');}},

        /**
         * Returns the table header element for a section
         * @param qbPanelFormSection - form section element
         */
        recordsCountEl: {value: function(qbPanelFormSection) {return qbPanelFormSection.element('.recordsCount');}},

        /**
         * Navigates to a record containing a child table on the form.
         * Makes use of the relationshipPrototype param in the URL to show the hidden table.
         * @param realmName
         * @param appId
         * @param tableId
         * @param reportId
         * @param recordId
         * @param relationshipId
         */
        viewRecordWithChildTable : {value: function(realmName, appId, tableId, reportId, recordId, relationshipId) {
            // Navigate to record form directly with relationship child table displayed
            //TODO: Currently hidden behind this param switch. Won't need to use this in the future
            var requestRecordPageEndPoint = e2eBase.recordBase.apiBase.generateFullRequest(realmName, '/qbase/app/' + appId + '/table/' + tableId + '/report/' + reportId + '/record/' + recordId + '?relationshipPrototype=1');
            browser.url(requestRecordPageEndPoint);

            // Wait for the form to load
            formsPO.viewFormContainerEl.waitForVisible();
            // Wait until child table section is visible
            return this.qbPanelFormSectionEl(relationshipId).waitForVisible();
        }}

    });

    module.exports = relationshipsPage;
}());
