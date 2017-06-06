'use strict';

/**
 * Window that shows up after user click on Setting button on Application main screen.
 */
class appSettings {
    get settingsWindow() {
        let selector = '.configMenu';
        browser.waitForVisible(selector);
        return browser.element(selector);
    }

    get automationSettingsBtn() {
        let settingsWindow = this.settingsWindow;
        let selector = '.modifyAutomationSettings';
        browser.waitForVisible(selector);
        return settingsWindow.element(selector);
    }
}

module.exports = new appSettings();
