'use strict';

/**
 * Windows with elements of Automations Settings opened right after user clicks 'Automation Settings' in App settings menu
 */
class automationsSettings {
    get pageTitle() {
        return browser.element('//*[@class="automationListSettingsStage stageHeadLine"]');
    }

    get automationsTable() {
        return browser.element('.automationSettings--table table table-hover');
    }
}

module.exports = new automationsSettings();
