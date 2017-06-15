import React from 'react';
import FieldUtils from '../../../utils/fieldUtils';
import ColumnTransformer from '../qbGrid/columnTransformer';

/**
 * A helper to transform reportData into a format that can be used in the columns by qbGrid
 * TODO:: Once AgGrid is removed, we can reduce these transformations and improve performance by doing these transformations only once in the reportDataStore
 * https://quickbase.atlassian.net/browse/MB-1920
 */
class ReportColumnTransformer extends ColumnTransformer {
    /**
     * Transforms columns from api data to a class that has helpers used by the QbGrid
     * @param columns
     * @returns {Array}
     */
    static transformColumnsForGrid(columns = []) {
        if (!columns || !Array.isArray(columns)) {
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
        let isHidden = data.isHidden;
        let isPlaceholder = data.isPlaceholder;

        return new ReportColumnTransformer(fieldId, data.fieldDef, headerLabel, headerClasses, headerLabelClasses, isHidden, isPlaceholder);
    }

    constructor(fieldId, fieldDef, headerLabel, headerClasses, headerLabelClasses, isHidden, isPlaceholder) {
        super(headerLabel, fieldId, headerClasses, headerLabelClasses, isHidden, isPlaceholder);

        this.fieldId = fieldId;
        this.fieldDef = fieldDef;
    }

    addHeaderMenu(component, props) {
        let propsCopy = Object.assign({}, props, {fieldDef: this.fieldDef});

        return super.addHeaderMenu(component, propsCopy);
    }
}

export default ReportColumnTransformer;
