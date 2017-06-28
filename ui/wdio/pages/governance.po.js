'use strict';

class governance {

    get filterSearchingBox() {
        // filter searching box
        browser.element('.searchInput').waitForVisible();
        return browser.element('.searchInput');
    }


    get qbGrid() {
        // filter searching box
        browser.element('.searchInput').waitForVisible();
        return browser.element('.searchInput');
    }

    /**
     * Enter searching string in the filter seaching box
     * @param searchingString
     */
    enterSearchingString(str) {
        try {
            this.filterSearchingBox.setValue(str);
        } catch (err) {
            browser.logger.error('Error in enterSearchingString function:' + err);
        }
    }


    get modalDialogTitle() {
        // modal dialog title
        this.modalDialogContainer.element('.modal-title').waitForVisible();
        return this.modalDialogContainer.element('.modal-title').getAttribute('textContent');
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
module.exports = new governance();
