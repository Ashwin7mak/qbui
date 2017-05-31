/**
 * Windows with elements of Automations Settings opened right after user clicks 'Automation Settings' in App settings menu
 */
class automationsSettings {

    get pageTitle() {
        return browser.element('.automationSettings .automationListSettingsStage');
    }

    get automationsTable() {
        let Table = require('../../controls/tableControlWrapper.js');
        let tableControl = new Table('.automationSettings--table');
        return tableControl;
    }
}

module.exports = new automationsSettings();
