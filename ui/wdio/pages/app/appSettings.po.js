'use strict';

/**
 * Window that shows up after user click on Setting button on Application main screen.
 */
class appSettings {
    get settingsWindow() {
        return browser.element('.configMenu');
    }

    get automationSettingsBtn() {
        return this.settingsWindow.element('.modifyAutomationSettings');
    }
}

module.exports = new appSettings();