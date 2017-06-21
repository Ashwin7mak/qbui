class modalDialogWindow {
    //The methods below works for both qbModal dialog and also multiStepModal dialog.
    // Since the underlying className for both modal dialogs are 'modal-dialog'
    get CREATE_TABLE_BTN() {return 'Create table';}
    get CANCEL_BTN() {return 'Cancel';}
    get TABLE_READY_DLG_OK_BTN() {return 'OK';}
    get TABLE_DELETE_BTN() {return 'Delete table';}
    get DELETE_BTN() {return 'Delete';}
    get DONT_DELETE_BTN() {return  "Don't delete";}
    get REMOVE_BTN() {return  'Remove';}
    get ADD_TO_FORM_BTN() {return  'Add to form';}
    get ADD_USER_BTN() {return  'Add';}
    get NO_THANKS_BTN() {return  'No thanks';}

    get modalDialog() {
        // modal dialog
        return browser.element('.modal-dialog');
    }

    get modalDialogCloseBtn() {
        // modal dialog
        return browser.element('.modal-dialog .iconUISturdy-close');
    }

    get modalDialogCopyBtn() {
        // modal dialog copy button
        browser.element('.tipChildWrapper .qbIcon.iconUISturdy-url').waitForVisible();
        return browser.element('.tipChildWrapper .qbIcon.iconUISturdy-url');
    }

    get modalDialogMailBtn() {
        // modal dialog copy button
        browser.element('.tipChildWrapper .qbIcon.iconUISturdy-mail').waitForVisible();
        return browser.element('.tipChildWrapper .qbIcon.iconUISturdy-mail');
    }

    get modalDialogContainer() {
        //modal dialog container
        return this.modalDialog.element('.bodyContainer');
    }

    get modalDialogTitle() {
        // modal dialog title
        return this.modalDialogContainer.element('.modal-title').getAttribute('textContent');
    }

    get modalDialogFooterButtons() {
        // modal dialog footer buttons
        return this.modalDialog.elements('.modal-footer .buttons button');
    }

    get modalDialogPrimaryButton() {
        // modal dialog footer primary button
        return this.modalDialog.element('.modal-footer .buttons .primaryButton');
    }

    get modalDialogSecondaryButton() {
        // modal dialog footer secondary button
        return this.modalDialog.element('.modal-footer .buttons .secondaryButton');
    }

    get deletePromptTextField() {
        //Delete prompt textField
        return this.modalDialog.element('.deleteTableDialogContent .prompt .deletePrompt');
    }

    get modalDialogTableSelectorDropDownArrow() {
        //TableSelector drop down arrow to expand the list
        return this.modalDialog.element('.tableSelector .Select-arrow-zone');
    }

    get modalDialogRoleSelectorDropDownArrow() {
        //TableSelector drop down arrow to expand the list
        this.modalDialog.element('.assignRole .Select-arrow-zone').waitForVisible();
        return this.modalDialog.element('.assignRole .Select-arrow-zone');
    }

    get modalDialogFieldSelectorDropDownArrow() {
        //FieldSelector drop down arrow to expand the list
        return this.modalDialog.element('.fieldSelector .Select-arrow-zone');
    }

    get modalDialogSearchNewUser() {
        this.modalDialog.element('.modal-dialog .Select-multi-value-wrapper').waitForVisible();
        return this.modalDialog.element('.modal-dialog .Select-multi-value-wrapper');
    }

    get modalDialogUserAddSearcMenu() {
        this.modalDialog.element('.modal-dialog .Select-menu-outer').waitForVisible();
        return this.modalDialog.element('.modal-dialog .Select-menu-outer');
    }

    get allDropDownListOptions() {
        let listOptions = [];
        //get the list of all drop down options
        browser.waitForVisible('.Select-menu-outer');
        browser.elements('.Select-option').value.filter(function(optionText) {
            listOptions.push(optionText.element('div div').getText());
        });
        return listOptions;
    }

    /**
     * Method to click on modal advanced setting down arrow to expand advanced settings area.
     */
    clickModalDialogAdvancedSettingsToggle() {
        //Toggle to expand advanced settings
        //Verify advanced settings is dispalyed and enabled after selecting table
        browser.element('.toggleAdvancedIcon.iconUISturdy-caret-down').waitForEnabled(e2eConsts.shortWaitTimeMs);
        //Click on advanced settings
        return browser.element('.toggleAdvancedIcon.iconUISturdy-caret-down').click();
    }

    /**
     * Method to click on modal advanced setting down arrow to expand advanced settings area.
     */
    clickOnDropDownDownArrowToExpand(element) {
        //Click on drop down arrow to expand the list
        element.waitForVisible();
        return element.click();
    }

    /**
     * Method to click on modal dialog any drop down arrow
     */
    selectItemFromModalDialogDropDownList(element, listOption) {
        //Expand the drop down
        this.clickOnDropDownDownArrowToExpand(element);
        //wait until you see select outer menu
        browser.waitForVisible('.Select-menu-outer');
        //get all options from the list
        var option = browser.elements('.Select-option').value.filter(function(optionText) {
            return optionText.getAttribute('textContent').includes(listOption);
        });

        if (option !== []) {
            //Click on filtered option
            option[0].waitForVisible();
            option[0].click();
            //wait until select menu outer
            return browser.waitForVisible('.Select-menu-outer', e2eConsts.shortWaitTimeMs, true);
        } else {
            throw new Error('Option with name ' + listOption + " not found in the list");
        }
    }

    /**
     * Method to click on modal dialog button
     * @dialogTitle to verify the dialog
     * @btnName to click
     */
    clickOnModalDialogBtn(btnName) {
        this.modalDialog.waitForVisible();

        //get all buttons from modal dialog footer
        let btns = this.modalDialogFooterButtons.value.filter(function(button) {
            return button.getAttribute('textContent').trim().includes(btnName);
        });

        if (btns !== []) {
            btns[0].waitForEnabled(e2eConsts.shortWaitTimeMs);
            btns[0].waitForVisible();
            //Click on filtered button
            return btns[0].click();
        } else {
            throw new Error('button with name ' + btnName + " not found on the " + this.modalDialogTitle + " dialog box");
        }

    }

    /**
     +     * Method for modal dialog to slide away
     +     */
    waitUntilModalDialogSlideAway() {
       //wait until report loading screen disappear
        browser.waitForVisible('.modal-dialog', e2eConsts.longWaitTimeMs, true);
        //Need this to stabilize DOM
        return browser.pause(e2eConsts.shortWaitTimeMs);
    }


}
module.exports = new modalDialogWindow();
