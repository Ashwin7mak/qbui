'use strict';

class modalDialogWindow {
    get CREATE_TABLE_BTN() {return 'Create table';}
    get CANCEL_BTN() {return 'Cancel';}
    get TABLE_READY_DLG_OK_BTN() {return 'OK';}
    get TABLE_DELETE_BTN() {return 'Delete table';}
    get DELETE_BTN() {return 'Delete';}
    get DONT_DELETE_BTN() {return  "Don't delete";}
    get REMOVE_BTN() {return  "Remove";}

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
