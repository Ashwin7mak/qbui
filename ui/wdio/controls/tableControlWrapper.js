module.exports = class TableControlWrapper {
    constructor(selector) {
        this.selector = selector;
    }

    get tableControl() {
        browser.waitForVisible(this.selector);
        let tableControl = browser.element(this.selector);
        return tableControl;
    }

    get header() {
        let headerControl = this.tableControl.element('thead > tr');
        let HeaderRowControlWrapper = require('./tableHeaderControlWrapper.js');
        let header = new HeaderRowControlWrapper(headerControl);
        return header;
    }

    get rows() {
        let rowControls = this.tableControl.elements('tbody > tr');

        let RowControlWrapper = require('./rowControllWrapper.js');
        let rows = [];
        for (let counter = 0; counter < rowControls.value.length; counter++) {
            rows[counter] = new RowControlWrapper(rowControls.value[counter]);
        }
        return rows;
    }

    get isVisible() {
        return browser.element(this.selector).isVisible;
    }
};
