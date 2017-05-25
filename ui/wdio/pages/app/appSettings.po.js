'use strict';

/**
 * Window that shows up after user click on Setting button on Application main screen.
 */
class appSettings {
    get settingsWindow() {
        return browser.element('.configMenu');
    }

    get automationSettingsBtn() {
        let selector = '.modifyAutomationSettings';
        browser.waitForVisible(selector);
        return this.settingsWindow.element(selector);
    }
}

module.exports = new appSettings();
