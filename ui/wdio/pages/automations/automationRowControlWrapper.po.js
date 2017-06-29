let RowControlWrapper = require('../common/controls/rowControlWrapper.po.js');

module.exports = class AutomationRowControlWrapper extends RowControlWrapper {
    constructor(rowControl) {
        super(rowControl);
    }

    /**
     * returns the value in name column
     */
    get name() {
        return this.cells[1].text;
    }

    clickEditButton() {
        this.cells[0].control.element('button').click();
    }
};
