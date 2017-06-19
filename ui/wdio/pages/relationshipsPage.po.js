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
    let formsPagePO = requirePO('formsPage');
    let reportInLineEditPO = requirePO('reportInLineEdit');
    // slidey-righty animation const
    var slideyRightyPause = 2000;

    var relationshipsPage = Object.create(e2ePageBase, {
        // Element locators

        // Slidey-righty which is a drawer component for showing child records of a parent record
        slideyRightyEl: {get: function() {return browser.element('.slidey-container');}},
        viewFormTableEl: {get: function() {return this.slideyRightyEl.element('.viewForm .formTable');}},
        tableHomePageLinkEl: {get: function() {return this.slideyRightyEl.element('.navLinks .tableHomepageLink');}},
        iconActionsEl: {get: function() {return this.slideyRightyEl.element('.stageHeadline .iconActions');}},
        iconActionsRightButtonEl: {get: function() {return this.iconActionsEl.element('.iconUISturdy-caret-filled-right');}},
        iconActionsLeftButtonEl: {get: function() {return this.iconActionsEl.element('.iconUISturdy-caret-filled-left');}},
        iconActionsCloseDrawerButtonEl: {get: function() {return this.slideyRightyEl.element('.iconActionButton.closeDrawer');}},
        parentRecordLinkEl: {
            get: function() {
                return browser.element('.textField.viewElement.textLink');
            }
        },
        parentRecordLinkInDrawerEl: {
            get: function() {
                return browser.element('.numericField.viewElement');
            }
        },
        // returns the element displaying the add child button
        addChildButton: {
            get: function() {
                return browser.element('.addChildBtn');
            }
        },
        // returns the class for the element displaying the add child button but in a disabled state
        addChildButtonDisabledClass: {
            get: function() {
                return '.addChildBtn.disabled';
            }
        },
        // Page Object functions
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
        recordsCountEl: {value: function(qbPanelFormSection) {
            qbPanelFormSection.waitForVisible();
            return qbPanelFormSection.element('.recordsCount');
        }},

        /**
         * Given a record element in agGrid, click on the record.
         * @param recordRowIndex
         */
        clickOnRecordInChildTable : {value: function(recordRowIndex) {
            formsPO.viewFormContainerEl.waitForVisible();
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
            return this.slideyRightyEl.waitForVisible();
        }},


        /**
         * clicks on add child button and opens the trowser.
         * @param
         */
        clickAddChildButton: {
            value: function() {
                this.addChildButton.waitForVisible();
                this.addChildButton.click();
                browser.waitForVisible('.recordTrowser');
            }
        },


        /***
         * adds a child record to embedded table
         * @param origRecordCount - original record counts in embedded table
         * @param parentRefVal - parent record value
         */
        addChildRecord: {
            value: function(origRecordCount, parentRefVal) {
                // Click on add child button on embedded table opens trowser
                this.clickAddChildButton();
                const fieldTypes = ['allTextFields', 'allParentRecordFields'];

                browser.waitForVisible('form.editForm');
                // enter form values
                fieldTypes.forEach(function(fieldType) {
                    let parentReferenceFieldValue = null;
                    if (fieldType === 'allParentRecordFields') {
                        parentReferenceFieldValue = parentRefVal;
                    }
                    formsPagePO.enterFormValues(fieldType, parentReferenceFieldValue);
                });

                // Click Save on the form
                formsPagePO.clickFormSaveBtn();
                // wait until report rows in table are loaded
                reportContentPO.waitForReportContent();
            }
        },

        /**
         * Given a form that contains a link to a parent node, click on the link
         */
        clickOnParentRecordLinkInForm: {value: function(index) {
            formsPO.viewFormContainerEl.waitForVisible();
            browser.waitForVisible('.textField.viewElement.textLink');
            let linkEl = this.parentRecordLinkEl;
            linkEl.click();
        }},
        /**
         * While viewing a parent record on a form get the values of each record in the child table
         * @returns An array of record values for all child records
         */
        getChildRecordValuesFromForm : {value: function() {
            this.slideyRightyEl.waitForVisible();
            let fieldElements = this.viewFormTableEl.elements('.viewElement');
            return fieldElements.value.map(function(element) {
                return element.getAttribute('textContent');
            });
        }},

        /**
         * Get a particular visible form section element in the UI.
         * @param inDrawer - boolean value if the form you are accessing is a drawer component (as with relationships). Defaults to false.
         * @param sectionId - section identifier in the form itself (defaults to 0)
         * @returns A promise that will resolve to a formSection element if successful
         */
        getFormSectionEl : {value: function(inDrawer, sectionId) {
            let sectionLocatorString;
            if (!sectionId) {
                sectionLocatorString = '.section-0';
            } else {
                sectionLocatorString = '.section-' + sectionId;
            }

            //TODO: Handle case with multiple drawers open (need a nested relationship setup)
            let fullLocatorString;
            if (inDrawer) {
                fullLocatorString = '.drawer .formTable' + sectionLocatorString;
            } else {
                fullLocatorString = '.formTable' + sectionLocatorString;
            }

            // Implicit assertion
            browser.waitForVisible(fullLocatorString);
            return browser.element(fullLocatorString);
        }},

        /**
         * Get field values out of the visible form section in the UI
         * @param inDrawer - boolean value if the form you are accessing is a drawer component (as with relationships). Defaults to false.
         * @param sectionId - section identifier in the form itself (defaults to 0)
         * @returns A promise that will resolve to an array of field values if successful
         */
        getValuesFromFormSection : {value: function(formSectionEl) {
            let fieldElements = formSectionEl.elements('.viewElement');

            // Direct assertion
            // Handle if fieldElements is null
            if (fieldElements.value.length !== 0) {
                return fieldElements.value.map(function(element) {
                    return element.getAttribute('textContent');
                });
            } else {
                // Logging for wdio
                browser.logger.error('No field values found in specified form section');
                // Send error up the stack for proper test failure
                throw Error('No field values found in specified form section');
            }
        }},

        /**
         * Looks through a visible form and tries to click on a field that has been linked to a related parent record
         * @param formSectionEl - form section element to make search more specific
         */
        clickOnFormFieldLinkToParent : {value: function(formSectionEl) {
            let linkToParentLocatorString = '.textField.viewElement.textLink';

            if (formSectionEl) {
                //TODO: Handle multiple links to parent(s)
                // Use the specific form section
                formSectionEl.waitForVisible();
                formSectionEl.element(linkToParentLocatorString).click();
            } else {
                //TODO: Handle multiple links to parent(s)
                // Try to find something clickable on the form
                browser.waitForVisible(linkToParentLocatorString);
                browser.element(linkToParentLocatorString).click();
            }
        }},

        /**
         * While viewing a child record in slidey-righty click the next button to view the next child record in succession
         * @param Reverse flag, if set to true the function will click the previous button instead
         */
        navigateToNextChildRecord : {value: function(reverse) {
            this.iconActionsEl.waitForVisible();
            if (!reverse) {
                this.iconActionsRightButtonEl.waitForVisible();
                // Needed for animation of slidey-righty
                browser.pause(slideyRightyPause);
                return this.iconActionsRightButtonEl.click();
            } else {
                this.iconActionsLeftButtonEl.waitForVisible();
                // Needed for animation of slidey-righty
                browser.pause(slideyRightyPause);
                return this.iconActionsLeftButtonEl.click();
            }
        }},

        /**
         * Close the open slidey-righty by clicking the X button
         */
        closeSlideyRighty : {value: function() {
            this.iconActionsCloseDrawerButtonEl.waitForVisible();
            this.viewFormTableEl.waitForExist();
            this.iconActionsCloseDrawerButtonEl.click();
            browser.waitForVisible('.slidey-container .iconActionButton.closeDrawer', e2eConsts.shortWaitTimeMs, true);
        }},

        /**
         * While viewing a child record in s-r click the table homepage link
         */
        clickTableHomePageLink : {value: function() {
            this.tableHomePageLinkEl.waitForVisible();
            // Needed for animation of slidey-righty
            browser.pause(slideyRightyPause);
            this.tableHomePageLinkEl.click();
        }
        }
    });

    module.exports = relationshipsPage;
}());
