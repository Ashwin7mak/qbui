'use strict';

class modelDialog {
    get CREATE_TABLE_BTN() {return 'Create table';}
    get CREATE_TABLE_DLG_CANCEL_BTN() {return 'Cancel';}
    get TABLE_READY_DLG_OK_BTN() {return 'OK';}
    get TABLE_DELETE_BTN() {return 'Delete table';}
    get TABLE_DONT_DELETE_BTN() {return  "Don't delete";}

    get modelDialog() {
        // model dialog
        return browser.element('.modal-dialog');
    }

    get modelDialogTitle() {
        // model dialog title
        return this.modelDialog.element('.bodyContainer .modal-title .title').getAttribute('textContent');
    }

    get modelDialogFooterButtons() {
        // model dialog footer buttons
        return this.modelDialog.elements('.modal-footer .buttons button');
    }

    /**
     * Method to click on model dialog button
     * @dialogTitle to verify the dialog
     * @btnName to click
     */
    clickOnModelDialogBtn(btnName) {
        this.modelDialog.waitForVisible();

        //get all buttons from model dialog footer
        let btns = this.modelDialogFooterButtons.value.filter(function(button) {
            return button.getAttribute('textContent') === btnName;
        });

        if (btns !== []) {
            btns[0].waitForEnabled(e2eConsts.shortWaitTimeMs);
            //Click on filtered button
            return btns[0].click();
        } else {
            throw new Error('button with name ' + btnName + " not found on the " + this.modelDialogTitle + " dialog box");
        }

    }


}
module.exports = new modelDialog();
