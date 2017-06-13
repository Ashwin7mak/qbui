import React from "react";
import HeaderMenuItem from "../headerMenuItem";
import SortMenuItem from "./sortMenuItem";

/**
 * Sub-class of HeaderMenuItem that supplies 2 menu items
 * to sort ASC and DESC.
 */
class SortMenuItems extends HeaderMenuItem {
    getMenuItems(currentNumItems, columnDef, grid) {
        let items = super.getMenuItems(currentNumItems, columnDef, grid);

        items.push(
            <SortMenuItem key="sortASC"
                          asc={true}
                          setSort={grid.props.setSort}
                          fieldDef={columnDef.fieldDef}
                          sortFids={grid.props.sortFids} />,

            <SortMenuItem key="sortDESC"
                          asc={false}
                          setSort={grid.props.setSort}
                          fieldDef={columnDef.fieldDef}
                          sortFids={grid.props.sortFids}
                          />
        );

        return items;
    }
}

export default SortMenuItems;
