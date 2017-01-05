import React from 'react';
import _ from 'lodash';
import FieldUtils from '../../../utils/fieldUtils';

class Column {
    static transformColumnsForGrid(columns = []) {
        if (!columns || !_.isArray(columns)) {
            return [];
        }

        return columns.map(column => {
            return Column.createFromApiColumn(column);
        });
    }

    static createFromApiColumn(data) {
        let fieldId = data.id;
        let headerLabel = data.headerName;
        let headerClasses = FieldUtils.getColumnHeaderClasses(data.fieldDef);

        return new Column(fieldId, headerLabel, headerClasses);
    }

    constructor(fieldId, headerLabel, headerClasses) {
        this.fieldId = fieldId;
        this.headerLabel = headerLabel;
        this.headerClasses = headerClasses;
    }

    addFormatter(formatterFunction) {
        if (formatterFunction) {
            this.formatter = formatterFunction;
        }
        return this;
    }

    gridHeader() {
        let transformedColumn = {
            property: this.fieldId,
            header: {
                label: <span className={this.headerClasses}>{this.headerLabel}</span>,
            }
        };

        if (this.formatter) {
            transformedColumn.cell = {
                formatters: [this.formatter]
            };
        }

        return transformedColumn;
    }
}

export default Column;
