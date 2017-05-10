import React, {PropTypes} from 'react';
import {supportedNewFieldTypesWithProperties} from '../newFieldTypes';
import ListOfElements from '../../../../../reuse/client/src/components/sideNavs/listOfElements';
import FieldTokenInMenu from '../fieldToken/fieldTokenInMenu';

const NewFieldsMenu = ({isCollapsed, isOpen, toggleToolPaletteChildrenTabIndex, toolPaletteChildrenTabIndex, toolPaletteFocus, toolPaletteTabIndex}) => (
    <ListOfElements
        tabIndex={toolPaletteTabIndex}
        childrenTabIndex={toolPaletteChildrenTabIndex}
        toggleChildrenTabIndex={toggleToolPaletteChildrenTabIndex}
        hasKeyBoardFocus={toolPaletteFocus}
        renderer={FieldTokenInMenu}
        isCollapsed={isCollapsed}
        isOpen={isOpen}
        elements={supportedNewFieldTypesWithProperties()}
        isFilterable={true}
        hideTitle={true}
    />
);

NewFieldsMenu.propTypes = {
    /**
     * Displays the menu in a collapsed state */
    isCollapsed: PropTypes.bool,

    /**
     * Displays the menu in an open state */
    isOpen: PropTypes.bool,

    /**
     * Sets the tabIndex for the listOfElement tab*/
    toolPaletteTabIndex: PropTypes.number,

    /**
     * Sets the tabIndex for the listOfElement tab*/
    toolPaletteChildrenTabIndex: PropTypes.number,

    /**
     * Toggles tool Palette children*/
    toggleToolPaletteChildrenTabIndex: PropTypes.func,

    /**
     * Focus for palette for keybaord nav*/
    toolPaletteFocus: PropTypes.bool
};

export default NewFieldsMenu;
