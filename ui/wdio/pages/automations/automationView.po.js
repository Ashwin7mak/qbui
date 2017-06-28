let elementControlWrapper = require('../common/controls/elementControlWrapper.po.js');

/**
 * View of single automation
 */
class automationView {
    get automationName() {
        return new elementControlWrapper('.automationViewName .value');
    }

    get actionDescription() {
        return new elementControlWrapper('.automationViewAction .value');
    }

    get editButton() {
        return new elementControlWrapper('.iconUISturdy-edit');
    }
}

module.exports = new automationView();
