let ElementControlWrapper = require('./elementControlWrapper.po.js');

module.exports = class TableHeaderControlWrapper {
    constructor(rowControl) {
        this.rowControl = rowControl;
    }

    /**
     * Gets the table headers
     */
    get cells() {
        let cells = this.rowControl.elements('th').value;
        return cells.map(cell => new ElementControlWrapper(null, cell));
    }
};
