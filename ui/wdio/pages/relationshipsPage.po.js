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
    var reportContentPO = requirePO('reportContent');

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
         * Given a record element in agGrid, click on the record.
         * @param recordRowIndex
         */
        clickOnRecordInChildTable : {value: function(recordRowIndex) {
            browser.waitForVisible('.viewForm');
            reportContentPO.waitForReportContent();
            let recordRowEl = reportContentPO.getRecordRowElement(recordRowIndex);
            // Hardcoded to click on the first cell of the record
            let recordCellEl = reportContentPO.getRecordRowCells(recordRowEl).value[1];

            // Scroll to the cell of recordRowIndex row
            if (browserName === 'chrome') {
                recordCellEl.moveToObject();
            } else {
                browser.execute(function(element) {
                    element.scrollIntoView(false);
                }, recordCellEl);
            }
            // Click on the cell
            recordCellEl.click();

            // Wait for slidey-righty to be present
            return browser.waitForVisible('.slidey-righty');
        }},

        getChildRecordValuesFromForm : {value: function() {
            browser.waitForExist('.slidey-righty .viewForm .formTable');
            let fieldElements = browser.elements('.slidey-righty .viewForm .formTable .viewElement');
            return fieldElements.value.map(function(element) {
                return element.getAttribute('textContent');
            });
        }},

        navigateToNextChildRecord : {value: function(reverse) {
            browser.waitForVisible('.slidey-righty .stageHeadline .iconActions');
            if (!reverse) {
                let nextButtonEl = browser.element('.stageHeadline .iconActions .iconUISturdy-caret-filled-right');
                nextButtonEl.waitForVisible();
                return nextButtonEl.click();
            } else {
                let prevButtonEl = browser.element('.stageHeadline .iconActions .iconUISturdy-caret-filled-left');
                prevButtonEl.waitForVisible();
                return prevButtonEl.click();
            }
        }},

        closeSlideyRighty : {value: function() {
            browser.waitForVisible('.slidey-righty .iconActionButton.closeDrawer');
            browser.waitForExist('.slidey-righty .viewForm .formTable');
            browser.click('.slidey-righty .iconActionButton.closeDrawer');
            browser.waitForVisible('.slidey-righty .iconActionButton.closeDrawer', e2eConsts.shortWaitTimeMs, true);

        }}
    });

    module.exports = relationshipsPage;
}());
