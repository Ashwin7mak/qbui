import React from "react";
import _ from "lodash";
import ColumnTransform from "./columnTransform";
import Icon from "../../../../../reuse/client/src/components/icon/icon";
import Button from "react-bootstrap/lib/Button";
import Dropdown from "react-bootstrap/lib/Dropdown";

/**
 * This transform takes the React tabular column definition
 * and adds a header formatter that adds a menu to each header.
 * The list of items in each menu is controlled via an array of
 * HeaderMenuItem's that is passed via props as menuItemClasses.
 */
class HeaderMenuColumnTransform extends ColumnTransform {
    /**
     * Constructor
     * @param grid - reference to the StandardGrid parent
     * @param props - an object with the schema as follows:
     * {
     *     menuItemClasses: HeaderMenuItem[]
     * }
     */
    constructor(grid, props) {
        super(grid, props);
        this.menuItems = this.props.menuItemsClasses.map((menuItemClass) => new menuItemClass());
    }

    /**
     * Formatter function that will be added to the column definitions array of header formatters
     * @param value - The header content so far
     * @param extra - Data from react tabular.
     * @returns JSX describing the header content for the given column
     */
    headerFormatter(value, extra) {
        return (
            <span className="gridHeaderCell">
                <span className="gridHeaderLabel">{value}</span>
                <div className="headerMenu">
                    <Dropdown bsStyle="default" noCaret id="dropdown-no-caret">
                        <Button tabIndex="0" bsRole="toggle" className={"dropdownToggle iconActionButton"}>
                            <Icon icon="caret-filled-down"/>
                        </Button>

                        <Dropdown.Menu>
                            {_.reduce(this.menuItems, (itemsSoFar, menuItem) => {
                                return itemsSoFar.concat(menuItem.getMenuItems(itemsSoFar.length, extra.column, this.grid));
                            }, [])}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </span>
        );
    }

    /**
     * Adds the formatter to the column's definition
     * @param column - the original columns
     * @returns [*] : a new column definition
     */
    apply(columns) {
        let boundFormatterFn = this.headerFormatter.bind(this);

        return columns.map(column => ({
            ...column,
            header: {
                ...column.header,
                formatters: [...(column.header.formatters || []), boundFormatterFn]
            }
        }));
    }
}

export default HeaderMenuColumnTransform;
