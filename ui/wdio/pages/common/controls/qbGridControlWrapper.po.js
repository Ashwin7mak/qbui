let TableControlWrapper = require('./tableControlWrapper.po.js');

module.exports = class QbGridControlWrapper extends TableControlWrapper {
    constructor() {
        super('.qbGrid', null);
    }

    get headersText() {
        let headersElements = this.header.cells;
        return headersElements.map(headerElement => headerElement.text);
    }
};
