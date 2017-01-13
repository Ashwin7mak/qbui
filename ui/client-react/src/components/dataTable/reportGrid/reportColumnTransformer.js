import React from 'react';
import _ from 'lodash';
import FieldUtils from '../../../utils/fieldUtils';
import ColumnTransformer from '../qbGrid/columnTransformer';

/**
 * A helper to transform reportData into a format that can be used in the columns by qbGrid
 * TODO:: Once AgGrid is removed, we can reduce these transformations and improve performance by doing these transformations only once in the reportDataStore
 */
class ReportColumnTransformer extends ColumnTransformer {
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
            return ReportColumnTransformer.createFromApiColumn(column);
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
        let headerLabelClasses = FieldUtils.getColumnHeaderLabelClasses();

        return new ReportColumnTransformer(fieldId, data.fieldDef, headerLabel, headerClasses, headerLabelClasses);
    }

    constructor(fieldId, fieldDef, headerLabel, headerClasses, headerLabelClasses) {
        super(headerLabel, fieldId, headerClasses, headerLabelClasses);

        this.fieldId = fieldId;
        this.fieldDef = fieldDef;
    }

    addHeaderMenu(component, props) {
        let propsCopy = Object.assign({}, props, {fieldDef: this.fieldDef});

        return super.addHeaderMenu(component, propsCopy);
    }
}

export default ReportColumnTransformer;
