module.exports = class RowControlWrapper {
    constructor(rowControl) {
        this.rowControl = rowControl;
    }

    /**
     *  Gets the cells' text in table row
     */
    get cells() {
        let cells = this.rowControl.elements('td').value;
        let values = [];
        for (let counter = 0; counter < cells.length; counter++) {
            let cell = cells[counter];
            values[counter] = cell.getText();
        }
        return values;
    }
};
