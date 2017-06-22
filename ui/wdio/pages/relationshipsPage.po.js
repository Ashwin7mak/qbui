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
    let formBuilderPO = requirePO('formBuilder');
    let modalDialog = requirePO('/common/modalDialog');
    let notificationContainer = requirePO('/common/notificationContainer');
    let topNavPO = requirePO('topNav');
    let loadingSpinner = requirePO('/common/loadingSpinner');
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
                return browser.waitForVisible('.recordTrowser');
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
                return reportContentPO.waitForReportContent();
            }
        },

        /**
         * Given a form that contains a link to a parent node, click on the link
         */
        clickOnParentRecordLinkInForm: {value: function(index) {
            formsPO.viewFormContainerEl.waitForVisible();
            browser.waitForVisible('.textField.viewElement.textLink');
            let linkEl = this.parentRecordLinkEl;
            return linkEl.click();
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
                return formSectionEl.element(linkToParentLocatorString).click();
            } else {
                //TODO: Handle multiple links to parent(s)
                // Try to find something clickable on the form
                browser.waitForVisible(linkToParentLocatorString);
                return browser.element(linkToParentLocatorString).click();
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
            return browser.waitForVisible('.slidey-container .iconActionButton.closeDrawer', e2eConsts.shortWaitTimeMs, true);
        }},

        /**
         * While viewing a child record in s-r click the table homepage link
         */
        clickTableHomePageLink : {value: function() {
            this.tableHomePageLinkEl.waitForVisible();
            // Needed for animation of slidey-righty
            browser.pause(slideyRightyPause);
            return this.tableHomePageLinkEl.click();
        }},

        /**
         * Method to create relationship using add another record button via form builder
         */
        createRelationshipToParentTable: {value: function(parentTable, parentField, parentRecord, expectedParentRecordValues, expectedChildRecordValues) {

            //Select settings -> modify this form
            topNavPO.clickOnModifyFormLink();

            //Click on add a new record button
            formBuilderPO.addNewField(e2eConsts.GET_ANOTHER_RECORD);

            //Select parent table from 'create relationship' dialog
            modalDialog.selectItemFromModalDialogDropDownList(modalDialog.modalDialogTableSelectorDropDownArrow, parentTable);

            //Select a Field to create relationship to parent table from 'create relationship' dialog
            if (parentField !== '') {
                //Click on advanced settings of add a record dialog
                modalDialog.clickModalDialogAdvancedSettingsToggle();

                //Select field to link to parent table (This will be either titleField or recordId or uniqueRequired field)
                modalDialog.selectItemFromModalDialogDropDownList(modalDialog.modalDialogFieldSelectorDropDownArrow, parentField);
            }

            //Click Add To form button
            modalDialog.clickOnModalDialogBtn(modalDialog.ADD_TO_FORM_BTN);
            modalDialog.waitUntilModalDialogSlideAway();

            //Verify the get another record got added to the form builder
            expect(formBuilderPO.getSelectedFieldLabel().split('\n')[0]).toBe(e2eConsts.GET_ANOTHER_RECORD + ' from ' + parentTable);

            //Save the form builder
            formBuilderPO.save();
            //wait until save success container goes away
            notificationContainer.waitUntilNotificationContainerGoesAway();

            //Select record from parent Picker
            //click on the edit pencil on the child record
            formsPO.clickRecordEditPencilInViewForm();

            //Select parent picker value
            const fieldTypes = ['allPhoneFields', 'allParentRecordFields'];
            fieldTypes.forEach(function(fieldType) {
                formsPO.enterFormValues(fieldType, parentRecord);
            });

            //Click Save on the form
            formsPO.clickFormSaveBtn();
            loadingSpinner.waitUntilLoadingSpinnerGoesAway();
            //wait until save success container goes away
            notificationContainer.waitUntilNotificationContainerGoesAway();

            // Click on link to parent (via related Numeric Field)
            this.clickOnFormFieldLinkToParent(this.getFormSectionEl());

            // Slidey Righty comes up
            this.slideyRightyEl.waitForVisible();
            loadingSpinner.waitUntilLoadingSpinnerGoesAway();
            // Check you are on the right parent container
            let actualParentRecordValues = this.getValuesFromFormSection(this.getFormSectionEl(true));
            expect(actualParentRecordValues.sort()).toEqual(expectedParentRecordValues.sort());

            //Verify the embedded child record values
            // Confirm the values on the child form is the right record
            let embeddedChildRecordValues = reportContentPO.getRecordValues(0, 0);
            console.log("embedded child record values are: " + embeddedChildRecordValues);
            console.log("expected child record values are: " + expectedChildRecordValues);
            return expect(embeddedChildRecordValues[0]).toEqual(expectedChildRecordValues[0]);
        }},

        /**
         * Verift the Get another record relationship dialog selectTables list and select the parentTable
         * @param expectedTablesList to verify the select table drop down list
         * @param parentTable table to select
         */
        verifyTablesAndFieldsFromCreateRelationshipDialog: {
            value: function(expectedTablesList, selectParentTable, selectField, verifyDefaultField) {
                expect(modalDialog.modalDialogContainer.isVisible()).toBe(true);
                //Verify title
                expect(modalDialog.modalDialogTitle).toContain(e2eConsts.GET_ANOTHER_RECORD);
                //Verify select tables drop down has all the tables except the one you're in
                modalDialog.clickOnDropDownDownArrowToExpand(modalDialog.modalDialogTableSelectorDropDownArrow);
                let tableDropDownList = modalDialog.allDropDownListOptions;
                expect(tableDropDownList).toEqual(expectedTablesList);
                //click again on the arrow to collapse the outer menu
                modalDialog.clickOnDropDownDownArrowToExpand(modalDialog.modalDialogTableSelectorDropDownArrow);
                //Select the table
                modalDialog.selectItemFromModalDialogDropDownList(modalDialog.modalDialogTableSelectorDropDownArrow, selectParentTable);

                //Select Field form field dropdown
                if (selectField !== '') {
                    //Click on advanced settings of add a record dialog
                    modalDialog.clickModalDialogAdvancedSettingsToggle();

                    //Select field to link to parent table (This will be either titleField or recordId or unique&required fields)
                    modalDialog.selectItemFromModalDialogDropDownList(modalDialog.modalDialogFieldSelectorDropDownArrow, selectField);
                }
                if (verifyDefaultField !== '') {
                    //Click on advanced settings of add a record dialog
                    modalDialog.clickModalDialogAdvancedSettingsToggle();

                    //Verify the default field selected
                    modalDialog.modalDialog.element('.advancedSettingsInfo .fieldSelector .Select-multi-value-wrapper').waitForVisible();
                    expect(modalDialog.modalDialog.element('.advancedSettingsInfo .fieldSelector .Select-multi-value-wrapper').getAttribute('textContent')).toBe(verifyDefaultField);
                }
            }}

    });
    module.exports = relationshipsPage;
}());
