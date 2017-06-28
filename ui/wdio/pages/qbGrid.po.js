'use strict';

class qbGrid {

    get filterSearchingBox() {
        // filter searching box
        browser.element('.searchInput').waitForVisible();
        return browser.element('.searchInput');
    }

    get gridHeader() {
        // Grid column header
        // var elem  = "browser.element('.qbHeader .qbHeaderCell:nth-child(" + col + "')";
        return $$('.qbHeader .qbHeaderCell');
    }

    get gridHeaderSortIcon() {
        // Grid column sort icon
        // var elem  = "browser.element('.qbHeader .qbHeaderCell:nth-child(" + col + ") .qbIcon.iconUISturdy-caret-filled-down')";
        return $$('.qbIcon.iconUISturdy-caret-filled-down');
    }

    get gridRow() {
        // Grid rows
        return $$('.qbTbody .qbRow');
    }

    /**
     * Enter searching string in the filter seaching box
     * @param searchingString
     */
    enterSearchingString(str) {
        try {
            this.filterSearchingBox.setValue(str);
        } catch (err) {
            browser.logger.error('Error in enterSearchingString function:' + err);
        }
    }

    /**
     * Return text of the given cell
     * @param row - row number of the cell
     * @param col - column number of the cell
     */
    // get gridCell(row, col) {
    //     var elem  = "browser.element('.qbTbody .qbRow:nth-child(" + row + "1) .qbCell:nth-child(" + col + ")')";
    //     elem.waitForVisible();
    //     return elem.getText();
    // }

    //* get column length
    totalColumnCounts() {
        // total column counts
        return this.gridHeader.length;
    }

    //* get current view row counts
    currentViewRowCounts() {
        // total column counts
        return this.gridRow.length;
    }

    /**
     * Validate column headers
     * @param expHeaders: expected headers
     */
    validateColumnHeaders(expHeaders) {
        let i = 0;
        let elem= "";
        try {
            for (i = 0; i < this.gridHeader.length(); i++) {
                elem  = "browser.element('.qbHeader .qbHeaderCell:nth-child(" + i + "')";
                elem.getText();
            }
        } catch (err) {
            browser.logger.error('Error in enterSearchingString function:' + err);
        }
    }


}
module.exports = new qbGrid();
