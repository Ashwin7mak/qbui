module.exports = class TableHeaderControlWrapper {
    constructor(rowControl) {
        this.rowControl = rowControl;
    }

    get cells() {
        let cells = this.rowControl.elements('th').value;
        let values = [];
        for (let counter = 0; counter < cells.length; counter++) {
            let cell = cells[counter];
            values[counter] = cell.getText();
        }
        return values;
    }
};
