'use strict';

/**
 * Elements on top navigation bar that are application specific
 */
class appTopToolbar {
    get appSettingsBtn() {
        let appSettingsWindow = browser.element('li.link.globalAction.withDropdown.builder');
        return appSettingsWindow;
    }
}

module.exports = new appTopToolbar();
