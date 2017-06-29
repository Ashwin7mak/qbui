let elementControlWrapper = require('../common/controls/elementControlWrapper.po.js');

/**
 * Elements on top navigation bar that are application specific
 */
class appTopToolbar {
    get appSettingsBtn() {
        let selector = '.qbIcon.iconUISturdy-settings';
        return new elementControlWrapper(selector);
    }
}

module.exports = new appTopToolbar();
