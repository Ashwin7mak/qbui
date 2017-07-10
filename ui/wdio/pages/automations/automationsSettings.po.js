/**
 * Windows with elements of Automations Settings opened right after user clicks 'Automation Settings' in App settings menu
 */
class automationsSettings {

    get pageTitle() {
        let elementControlWrapper = require('../common/controls/elementControlWrapper.po');
        return new elementControlWrapper('.automationSettings .automationListSettingsStage');
    }

    get automationsTable() {
        let AutomationsGrid = require('./automationsTableControlWrapper.po');
        return new AutomationsGrid();
    }

    get addButton() {
        let elementControlWrapper = require('../common/controls/elementControlWrapper.po');
        return new elementControlWrapper('.iconUISturdy-add-new-filled');
    }
}

module.exports = new automationsSettings();
