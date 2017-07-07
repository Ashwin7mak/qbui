let elementControlWrapper = require('../common/controls/elementControlWrapper.po.js');
let EmailBodyElementWrapper = require('./emailBodyElementWrapper.po');

/**
 * Edit view of single automation
 */
class emailAutomationEditView {
    get to() {
        return new elementControlWrapper('.emailField');
    }

    get name() {
        let control = browser.elements('div.fieldValueEditor > span > input').value[0];
        return new elementControlWrapper(null, control);
    }

    get subject() {
        let control = browser.elements('div.fieldValueEditor > span > input').value[2];
        return new elementControlWrapper(null, control);
    }

    get body() {
        return new EmailBodyElementWrapper('.inputDeleteIcon textarea');
    }

    get saveButton() {
        return new elementControlWrapper('.mainTrowserFooterButton span');
    }

    get cancelButton() {
        return new elementControlWrapper('.alternativeTrowserFooterButton');
    }
}

module.exports = new emailAutomationEditView();
