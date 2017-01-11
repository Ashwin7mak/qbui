import React from 'react';
import _ from 'lodash';
import FieldUtils from '../../../utils/fieldUtils';

/**
 * A helper class to build columns for the QbGrid
 */
class ColumnTransformer {
    /**
     * Creates the column instances that can be converted to a column used by QbGrid by calling getGridHeader()
     * @param headerLabel The text that appears in the header column (could also be a react component/Jsx)
     * @param headerClasses Any css classes to add to the column header element
     * @param cellIdentifierValue The value that identifies which cells belong to this column
     * (e.g., in a report, the fieldId is part of each cell data and is matched to the fieldId of the volumn. It is an actual value (e.g., 3) and not a property name (e.g., fieldId)
     */
    constructor(headerLabel, headerClasses, cellIdentifierValue) {
        this.headerLabel = headerLabel;
        this.headerClasses = headerClasses;
        this.cellIdentifierValue = cellIdentifierValue;
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
                        <MenuComponent {...this.headerMenuProps} />
                    </div>
                </span>
            );
        }

        let transformedColumn = {
            property: this.cellIdentifierValue,
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
