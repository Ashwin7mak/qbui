'use strict';

/**
 * This file uses the Page Object pattern to qbGrid based on governance page for test
 */

class qbGrid {

    get searchBox() {
        // Search textbox
        browser.element('.searchInput').waitForVisible();
        return browser.element('.searchInput');
    }

    get gridHeader() {
        // Grid column header row, returns all columns
        return $$('.qbHeader .qbHeaderCell');
    }

    get gridHeaderSortIcon() {
        // Grid column sort icon of each columns
        return $$('.qbIcon.iconUISturdy-caret-filled-down');
    }

    get gridRow() {
        // Grid current displayed rows
        return $$('.qbTbody .qbRow');
    }

    /**
     * Enter searching string in the seaching textbox
     * @param str - string to be searched
     */
    setSearchString(str) {
        try {
            this.searchBox.setValue(str);
            return this;
        } catch (err) {
            browser.logger.error('Error in enterSearchingString function:' + err);
        }
    }

    /**
     * Get total column counts
     */
    getTotalColumnCounts() {
        // total column counts
        return this.gridHeader.length;
    }

    /**
     * Get current view row counts
     */
    getCurrentViewRowCounts() {
        // total column counts
        return this.gridRow.length;
    }

}
module.exports = new qbGrid();
