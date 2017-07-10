/**
 * This file uses the Page Object pattern to qbGrid based on governance page for test
 */
const sysDefVars = require('../config/sysDefVars');
class qbGrid {

    get searchBox() {
        // Search textbox
        return browser.element('.searchInput');
    }

    get gridHeaders() {
        // Grid column header row, returns all columns
        return $$('.qbHeader .qbHeaderCell');
    }

    get gridHeaderSortIcons() {
        // Grid column sort icon of each columns
        return $$('.qbIcon.iconUISturdy-caret-filled-down');
    }

    get gridRows() {
        // Grid rows
        return $$('.qbTbody .qbRow');
    }

    /**
     * Enter searching string in the seaching textbox
     * @param str - string to be searched
     */
    setSearchString(str) {
        try {
            this.searchBox.waitForVisible();
            this.searchBox.setValue(str);
            browser.pause(sysDefVars.VERY_SHORT_WAIT_MS);
            return this;
        } catch (err) {
            browser.logger.error('Error in setSearchString function:' + err);
        }
    }

    /**
     * Get total column counts
     */
    getColumnCounts() {
        // total column counts
        browser.pause(sysDefVars.VERY_SHORT_WAIT_MS);
        return this.gridHeaders.length;
    }

    /**
     * Get current view row counts
     */
    getRowCounts() {
        // total column counts
        return this.gridRows.length;
    }
    /**
     * Wait for governance page to fully load
     */
    waitForPageToFullyLoad() {
        this.searchBox.waitForVisible();
        return this;
    }

}
module.exports = new qbGrid();
