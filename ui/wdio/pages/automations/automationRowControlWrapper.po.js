let RowControlWrapper = require('../common/controls/rowControlWrapper.po.js');

module.exports = class AutomationRowControlWrapper extends RowControlWrapper {
    constructor(rowControl) {
        super(rowControl);
    }

    get name() {
        return this.cells[1].text;
    }

    edit() {
        this.cells[0].control.element('button').click();
    }
};
