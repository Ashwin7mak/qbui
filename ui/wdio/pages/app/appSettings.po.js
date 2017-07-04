let elementControlWrapper = require('../common/controls/elementControlWrapper.po.js');

/**
 * Window that shows up after user click on Setting button on Application main screen.
 */
class appSettings {
    get automationSettingsBtn() {
        let selector = '.modifyAutomationSettings';
        return new elementControlWrapper(selector);
    }
}

module.exports = new appSettings();
