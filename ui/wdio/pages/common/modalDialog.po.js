'use strict';

class modalDialogWindow {
    get CREATE_TABLE_BTN() {return 'Create table';}
    get CANCEL_BTN() {return 'Cancel';}
    get TABLE_READY_DLG_OK_BTN() {return 'OK';}
    get TABLE_DELETE_BTN() {return 'Delete table';}
    get DELETE_BTN() {return 'Delete';}
    get DONT_DELETE_BTN() {return  "Don't delete";}
    get REMOVE_BTN() {return  'Remove';}
    get ADD_TO_FORM_BTN() {return  'Add to form';}

    get modalDialog() {
        // modal dialog
        browser.element('.modal-dialog').waitForVisible();
        return browser.element('.modal-dialog');
    }

    get modalDialogCloseBtn() {
        // modal dialog
        browser.element('.modal-dialog .iconUISturdy-close').waitForVisible();
        return browser.element('.modal-dialog .iconUISturdy-close');
    }

    get modalDialogContainer() {
        //modal dialog container
        this.modalDialog.element('.bodyContainer').waitForVisible();
        return this.modalDialog.element('.bodyContainer');
    }

    get modalDialogTitle() {
        // modal dialog title
        this.modalDialogContainer.element('.modal-title').waitForVisible();
        return this.modalDialogContainer.element('.modal-title').getAttribute('textContent');
    }

    get modalDialogFooterButtons() {
        // modal dialog footer buttons
        this.modalDialog.element('.modal-footer .buttons button').waitForVisible();
        return this.modalDialog.elements('.modal-footer .buttons button');
    }

    get modalDialogPrimaryButton() {
        // modal dialog footer buttons
        this.modalDialog.element('.modal-footer .buttons .primaryButton').waitForVisible();
        return this.modalDialog.element('.modal-footer .buttons .primaryButton');
    }

    get modalDialogSecondaryButton() {
        // modal dialog footer buttons
        this.modalDialog.element('.modal-footer .buttons .secondaryButton').waitForVisible();
        return this.modalDialog.element('.modal-footer .buttons .secondaryButton');
    }

    get deletePromptTextField() {
        //Delete prompt textField
        this.modalDialog.element('.deleteTableDialogContent .prompt .deletePrompt').waitForVisible();
        return this.modalDialog.element('.deleteTableDialogContent .prompt .deletePrompt');
    }

    get modalDialogDropDownArrow() {
        //drop down arrow to expand the list
        browser.element('.modal-dialog .Select-arrow-zone').waitForVisible();
        return browser.element('.modal-dialog .Select-arrow-zone')
    }

    clickModalDialogAdvancedSettingsToggle() {
        //Toggle to expand advanced settings
        //Verify advanced settings is dispalyed and enabled after selecting table
        browser.element('.toggleAdvancedIcon.iconUISturdy-caret-down').waitForEnabled(e2eConsts.shortWaitTimeMs);
        //Click on advanced settings
        return browser.element('.toggleAdvancedIcon.iconUISturdy-caret-down').click();
    }

    get modalDialogAdvancedSettingsDropDownArrow() {
        //drop down arrow to expand the list
        browser.element('.modal-dialog .advancedSettings .Select-arrow-zone').waitForVisible();
        return browser.element('.modal-dialog .advancedSettings .Select-arrow-zone')
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
     * Method to click on modal dialog any drop down arrow
     */
    clickOnModalDialogDropDownArrow() {
        this.modalDialogDropDownArrow.waitForVisible();
        return this.modalDialogDropDownArrow.click();
    }

    /**
     * Method to click on modal dialog advanced settngs drop down arrow
     */
    clickOnModalDialogAdvancedSettingsDropDownArrow() {
        this.modalDialogAdvancedSettingsDropDownArrow.waitForVisible();
        return this.modalDialogAdvancedSettingsDropDownArrow.click();
    }

    /**
     * Method to click on modal dialog any drop down arrow
     */
    selectItemFromModalDialogDropDownList(listOption) {
        browser.waitForVisible('.Select-menu-outer');
        //get all options from the list
        var option = browser.elements('.Select-option').value.filter(function(optionText) {
            return optionText.element('div div').getText().includes(listOption);
        });

        if (option !== []) {
            //Click on filtered option
            option[0].element('div div').waitForVisible();
            option[0].element('div div').click();
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
            return button.getAttribute('textContent') === btnName;
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


}
module.exports = new modalDialogWindow();
