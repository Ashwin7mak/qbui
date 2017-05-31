'use strict';

/**
 * Elements on top navigation bar that are application specific
 */
class appTopToolbar {
    get appSettingsBtn() {
        let selector = '.qbIcon.iconUISturdy-settings';
        browser.waitForVisible(selector);
        let appSettingsWindow = browser.element(selector);
        return appSettingsWindow;
    }
}

module.exports = new appTopToolbar();
