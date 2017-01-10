import React from 'react';
import _ from 'lodash';
import FieldUtils from '../../../utils/fieldUtils';

/**
 * A helper to transform reportData into a format that can be used by qbGrid
 * TODO:: Once AgGrid is removed, we can reduce these transformations and improve performance by doing these transformations only once in the reportDataStore
 */
class ColumnTransformer {
    /**
     * Transforms columns from api data to a class that has helpers used by the QbGrid
     * @param columns
     * @returns {Array}
     */
    static transformColumnsForGrid(columns = []) {
        if (!columns || !_.isArray(columns)) {
            return [];
        }

        return columns.map(column => {
            return ColumnTransformer.createFromApiColumn(column);
        });
    }

    /**
     * Transform a single column from data returned by the api to data that can be used by the QbGrid
     * @param data
     * @returns {ColumnTransformer}
     */
    static createFromApiColumn(data) {
        let fieldId = data.id;
        let headerLabel = data.headerName;
        let headerClasses = FieldUtils.getColumnHeaderClasses(data.fieldDef);

        return new ColumnTransformer(fieldId, headerLabel, headerClasses);
    }

    constructor(fieldId, headerLabel, headerClasses) {
        this.fieldId = fieldId;
        this.headerLabel = headerLabel;
        this.headerClasses = headerClasses;
        this.formatter = null;
    }

    /**
     * Formatters can be used by Reactabular to change what is rendered inside of a cell. This function
     * adds a formatter function that will be output in the column definitions for Reactabular.
     * @param formatterFunction
     * @returns {ColumnTransformer}
     */
    addFormatter(formatterFunction) {
        if (formatterFunction) {
            this.formatter = formatterFunction;
        }
        return this;
    }

    /**
     * Builds the object that is used by Reactabular to define the header row and
     * also is important for formatting cells in that column.
     * @returns {{property: *, header: {label: XML}}}
     */
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

export default ColumnTransformer;
