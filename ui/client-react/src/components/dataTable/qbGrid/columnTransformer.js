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

        return new ColumnTransformer(fieldId, data.fieldDef, headerLabel, headerClasses);
    }

    constructor(fieldId, fieldDef, headerLabel, headerClasses) {
        this.fieldId = fieldId;
        this.fieldDef = fieldDef;
        this.headerLabel = headerLabel;
        this.headerClasses = headerClasses;
        this.formatter = null;
        this.headerMenuComponent = null;
        this.headerMenuProps = null;
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
     * Add an additional component next to the column title. The component will receive any props that are available
     * for the column, but additional props (e.g., functions) that are the same across all columns can optionally be passed in.
     * @param component
     * @param props
     */
    addHeaderMenu(component, props) {
        this.headerMenuComponent = component;
        this.headerMenuProps = props;
        return this;
    }

    /**
     * Builds the object that is used by Reactabular to define the header row and
     * also is important for formatting cells in that column.
     * @params MenuComponent An optional React Element (e.g., menu dropdown) to display next to the header text
     * @returns {{property: *, header: {label: XML}}}
     */
    getGridHeader() {
        let headerComponent = <span className={this.headerClasses}>{this.headerLabel}</span>;

        if (this.headerMenuComponent) {
            // Need to do this transformation so that the variable can be recognized in JSX as a component
            let MenuComponent = this.headerMenuComponent;

            headerComponent = (
                <span className={this.headerClasses}>
                    {this.headerLabel}
                    <div className="headerMenu">
                        <MenuComponent fieldDef={this.fieldDef} {...this.headerMenuProps} />
                    </div>
                </span>
            );
        }

        let transformedColumn = {
            property: this.fieldId,
            header: {
                label: headerComponent,
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
