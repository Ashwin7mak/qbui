module.exports = class TableControlWrapper {
    constructor(selector) {
        this.selector = selector;
    }

    /**
     * Gets the table UI control
     */
    get tableControl() {
        browser.waitForVisible(this.selector);
        let tableControl = browser.element(this.selector);
        return tableControl;
    }

    /**
     * Gets the headers row in table
     */
    get header() {
        let headerControl = this.tableControl.element('thead > tr');
        let HeaderRowControlWrapper = require('./tableHeaderControlWrapper.js');
        let header = new HeaderRowControlWrapper(headerControl);
        return header;
    }

    /**
     * Gets the rows in table
     */
    get rows() {
        let rowControls = this.tableControl.elements('tbody > tr');

        let RowControlWrapper = require('./rowControllWrapper.js');
        let rows = [];
        for (let counter = 0; counter < rowControls.value.length; counter++) {
            rows[counter] = new RowControlWrapper(rowControls.value[counter]);
        }
        return rows;
    }

    /**
     * Get the 'Visible' property of UI element
     */
    get isVisible() {
        let control = browser.element(this.selector);
        return control.isVisible();
    }
};
