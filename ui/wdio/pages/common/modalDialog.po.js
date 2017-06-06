'use strict';

class modalDialogWindow {
    get CREATE_TABLE_BTN() {return 'Create table';}
    get CREATE_TABLE_DLG_CANCEL_BTN() {return 'Cancel';}
    get TABLE_READY_DLG_OK_BTN() {return 'OK';}
    get TABLE_DELETE_BTN() {return 'Delete table';}
    get DELETE_BTN() {return 'Delete';}
    get DONT_DELETE_BTN() {return  "Don't delete";}

    get modalDialog() {
        // modal dialog
        return browser.element('.modal-dialog');
    }

    get modalDialogTitle() {
        // modal dialog title
        return this.modalDialog.element('.bodyContainer .modal-title .title').getAttribute('textContent');
    }

    get modalDialogFooterButtons() {
        // modal dialog footer buttons
        return this.modalDialog.elements('.modal-footer .buttons button');
    }

    get modalDialogPrimaryButton() {
        // modal dialog footer buttons
        return this.modalDialog.element('.modal-dialog .modal-footer .primaryButton');
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
            btns[0].click();
            //wait until loading screen disappear
            return browser.waitForVisible('.modal-dialog .bodyContainer', e2eConsts.mediumWaitTimeMs, true);
        } else {
            throw new Error('button with name ' + btnName + " not found on the " + this.modalDialogTitle + " dialog box");
        }

    }


}
module.exports = new modalDialogWindow();
