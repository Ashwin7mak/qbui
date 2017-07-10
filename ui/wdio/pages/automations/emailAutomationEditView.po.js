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
        return new elementControlWrapper(null, browser.element('div.automationSubject > span > input'));
    }

    get body() {
        return new EmailBodyElementWrapper('.inputDeleteIcon textarea');
    }

    get name() {
        return new elementControlWrapper(null, browser.element('div.automationName > span > input'));
    }

    get saveButton() {
        return new elementControlWrapper('.mainTrowserFooterButton span');
    }

    get cancelButton() {
        return new elementControlWrapper('.alternativeTrowserFooterButton');
    }

}

module.exports = new emailAutomationEditView();
