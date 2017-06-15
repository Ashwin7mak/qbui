import MenuItem from "react-bootstrap/lib/MenuItem";
import React from "react";

/**
 * Interface class defining what it means to provide
 * menu items for the HeaderMenuColumnTransform
 */
class HeaderMenuItem {
    /**
     * Provides an array of menu items to display for a given column
     * @param currentNumItems - the current number of menu items
     * @param columnDef - the definition of the current column to create menu items for
     * @returns [*] : an array of menu Items
     */
    getMenuItems(currentNumItems, columnDef, grid) {
        if (currentNumItems > 0) {
            return [<MenuItem divider key={currentNumItems} />];
        } else {
            return [];
        }
    }
}

export default HeaderMenuItem;
