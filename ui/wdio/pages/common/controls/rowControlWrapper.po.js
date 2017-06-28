let ElementControlWrapper = require('./elementControlWrapper.po.js');

module.exports = class RowControlWrapper extends ElementControlWrapper {
    constructor(rowControl) {
        super(null, rowControl);
    }

    /**
     *  Gets the cell elements in table row
     */
    get cells() {
        let cells = this.control.elements('td').value;
        return cells.map(cell => new ElementControlWrapper(null, cell));
    }
};
