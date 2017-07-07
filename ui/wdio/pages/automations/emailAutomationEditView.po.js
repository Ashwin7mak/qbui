let elementControlWrapper = require('../common/controls/elementControlWrapper.po.js');
let EmailBodyElementWrapper = require('./emailBodyElementWrapper.po');

/**
 * Edit view of single automation
 */
class emailAutomationEditView {
    get to() {
        return new elementControlWrapper('.emailField');
    }

    get subject() {
        return new elementControlWrapper(null, this._getInputFields()[2]);
    }

    get body() {
        return new EmailBodyElementWrapper('.inputDeleteIcon textarea');
    }

    get name() {
        return new elementControlWrapper(null, this._getInputFields()[0]);
    }

    get saveButton() {
        return new elementControlWrapper('.mainTrowserFooterButton span');
    }

    get cancelButton() {
        return new elementControlWrapper('.alternativeTrowserFooterButton');
    }

    _getInputFields() {
        return browser.elements('div.fieldValueEditor > span > input').value;
    }
}

module.exports = new emailAutomationEditView();
