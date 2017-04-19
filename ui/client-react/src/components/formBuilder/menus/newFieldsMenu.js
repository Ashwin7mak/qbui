import React, {PropTypes} from 'react';
import {supportedNewFieldTypesWithProperties} from '../newFieldTypes';
import ListOfElements from '../../../../../reuse/client/src/components/sideNavs/listOfElements';
import FieldTokenInMenu from '../fieldToken/fieldTokenInMenu';

const NewFieldsMenu = ({isCollapsed, isOpen, toggleToolPaletteChildrenTabIndex, toolPaletteChildrenTabIndex}) => (
    <ListOfElements
        toolPaletteChildrenTabIndex={toolPaletteChildrenTabIndex}
        toggleToolPaletteChildrenTabIndex={toggleToolPaletteChildrenTabIndex}
        renderer={FieldTokenInMenu}
        isCollapsed={isCollapsed}
        isOpen={isOpen}
        elements={supportedNewFieldTypesWithProperties()}
        isFilterable={true}
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
     * Toggles tool Palette children*/
    toggleTooPaletteChildrenTabIndex: PropTypes.func,

    /**
     * Toggles tool Palette children*/
    toolPaletteChildrenTabIndex: PropTypes.string
};

export default NewFieldsMenu;
