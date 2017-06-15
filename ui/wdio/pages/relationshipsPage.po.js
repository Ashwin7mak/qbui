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
    // slidey-righty animation const
    var slideyRightyPause = 2000;
    const GET_ANOTHER_RECORD = 'Get another record';

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
                browser.waitForVisible('.addChildBtn');
                browser.element('.addChildBtn').click();
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
         * While viewing a parent record on a form get the values of each record in the child table
         * @returns An array of record values for all child records
         */
        getChildRecordValuesFromForm : {value: function() {
            this.slideyRightyEl.waitForVisible();
            this.viewFormTableEl.waitForVisible();
            let fieldElements = this.viewFormTableEl.elements('.viewElement');
            return fieldElements.value.map(function(element) {
                return element.getAttribute('textContent');
            });
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
        }},

        /**
         * Method to create relationship using add another record button via form builder
         */
        createRelationshipToParentTable: {value: function(parentTable, selectField) {

            //Select settings -> modify this form
            formBuilderPO.open();

            //Click on add a new record button
            formBuilderPO.addNewFieldToFormByDoubleClicking(GET_ANOTHER_RECORD);

            //Select table from table list of add a record dialog
            modalDialog.selectItemFromModalDialogDropDownList(modalDialog.modalDialogTableSelectorDropDownArrow, parentTable);

            //Select Field form field dropdown
            if (selectField !== '') {
                //Click on advanced settings of add a record dialog
                modalDialog.clickModalDialogAdvancedSettingsToggle();

                //Select field to link to parent table (This will be either titleField or recordId)
                modalDialog.selectItemFromModalDialogDropDownList(modalDialog.modalDialogFieldSelectorDropDownArrow, selectField);
            }

            //Click Add To form button
            modalDialog.clickOnModalDialogBtn(modalDialog.ADD_TO_FORM_BTN);

            //Verify the get another record got added to the form builder
            expect(formBuilderPO.getSelectedFieldLabel().split('\n')[0]).toBe(GET_ANOTHER_RECORD + ' from ' + parentTable);

            //Save the form builder
            formBuilderPO.save();
            //wait until save success container goes away
            notificationContainer.waitUntilNotificationContainerGoesAway();
            //verify You land in view form
            formsPO.waitForViewFormsTableLoad();
        }},

        /**
         * Method to select a record via parent picker
         */
        selectFromParentPicker: {
            value: function(parentRecord) {
                let fields = browser.elements('.formElementContainer .field').value.filter(function(fieldLabel) {
                    return fieldLabel.element('.fieldLabel').getAttribute('textContent').includes('Get another record');
                });

                if (fields !== []) {
                    fields[0].element('.cellWrapper .multiChoiceContainer .Select-arrow-zone').waitForVisible();
                    fields[0].element('.cellWrapper .multiChoiceContainer .Select-arrow-zone').click();
                    return formsPO.selectFromList(parentRecord);
                }

            }},

        /**
         * Method to verify relationship link in view record mode
         */
        verifyParentRecordRelationship: {value: function(expectedParentRecordFieldValues) {
            let getRecordValuesByClickingOnRelLink = [];
            //verify You land in view form since you edited a record from View form after saving
            formsPO.waitForViewFormsTableLoad();
            let fields = browser.elements('.formElementContainer .field').value.filter(function(fieldLabel) {
                return fieldLabel.element('.fieldLabel').getAttribute('textContent').includes('Get another record');
            });

            if (fields !== []) {
                fields[0].element('.cellWrapper .textLink').waitForVisible();
                fields[0].element('.cellWrapper .textLink').click();
                //Wait until the view form drawer loads
                browser.element('.drawer .viewForm .cellWrapper').waitForVisible();
                getRecordValuesByClickingOnRelLink = browser.element('.drawer .viewForm').elements('.cellWrapper').getAttribute('textContent');
                expect(getRecordValuesByClickingOnRelLink.sort()).toEqual(expectedParentRecordFieldValues.sort());

                //close the View record drawer
                browser.element('.closeDrawer').click();
                //wait until drawer screen disappear
                browser.waitForVisible('.closeDrawer', e2eConsts.longWaitTimeMs, true);
            }

        }},

        /**
         * Verift the Get another record relationship dialog selectTables list and select the parentTable
         * @param expectedTablesList to verify the select table drop down list
         * @param parentTable table to select
         */
        verifyTablesAndFieldsFromCreateRelationshipDialog: {
            value: function(expectedTablesList, selectParentTable, selectField) {
                expect(modalDialog.modalDialogContainer.isVisible()).toBe(true);
                //Verify title
                expect(modalDialog.modalDialogTitle).toContain('Get another record');
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

                    //Select field to link to parent table (This will be either titleField or recordId)
                    modalDialog.selectItemFromModalDialogDropDownList(modalDialog.modalDialogFieldSelectorDropDownArrow, selectField);
                } else {
                    //Click on advanced settings of add a record dialog
                    modalDialog.clickModalDialogAdvancedSettingsToggle();

                    //Verify the default field selected
                    expect(modalDialog.modalDialog.element('.advancedSettingsInfo .fieldSelector .Select-multi-value-wrapper').getAttribute('textContent')).toBe(selectField);
                }
            }}

    });
    module.exports = relationshipsPage;
}());
