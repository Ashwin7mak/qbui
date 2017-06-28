let ElementControlWrapper = require('./elementControlWrapper.po.js');

module.exports = class TableControlWrapper extends ElementControlWrapper {
    constructor(selector) {
        super(selector, null);
    }

    /**
     * Gets the headers row in table
     */
    get header() {
        let headerControl = this.control.element('thead > tr');
        let HeaderRowControlWrapper = require('./tableHeaderControlWrapper.po.js');
        let header = new HeaderRowControlWrapper(headerControl);
        return header;
    }

    /**
     * Gets the rows in table
     */
    get rows() {
        let rowControls = this.control.elements('tbody > tr');

        let RowControlWrapper = require('./rowControlWrapper.po.js');
        return rowControls.value.map(rowControl => new RowControlWrapper(rowControl));
    }
};
