import React, {PropTypes} from 'react';
import {supportedNewFieldTypesWithProperties} from '../newFieldTypes';
import ListOfElements from '../../../../../reuse/client/src/components/sideNavs/listOfElements';
import DraggableFieldTokenInMenu from '../fieldToken/draggableFieldTokenInMenu';

const NewFieldsMenu = (props) => {

    // don't include table data connections section until we know it's allowed
    let omittedFieldGroups = props.includeNewRelationship ? [] : ['tableDataConnections'];

    return (
        <ListOfElements
            tabIndex={props.toolPaletteTabIndex}
            childrenTabIndex={props.toolPaletteChildrenTabIndex}
            toggleChildrenTabIndex={props.toggleToolPaletteChildrenTabIndex}
            hasKeyBoardFocus={props.toolPaletteFocus}
            renderer={DraggableFieldTokenInMenu}
            isCollapsed={props.isCollapsed}
            isOpen={props.isOpen}
            elements={supportedNewFieldTypesWithProperties(omittedFieldGroups)}
            isFilterable={true}
            hideTitle={true}
        />);
};

NewFieldsMenu.propTypes = {
    /**
     * Displays the menu in a collapsed state */
    isCollapsed: PropTypes.bool,

    /**
     * Displays the menu in an open state */
    isOpen: PropTypes.bool,

    /**
     * Sets the tabIndex for the listOfElement tab */
    toolPaletteTabIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

    /**
     * Sets the tabIndex for the listOfElement tab */
    toolPaletteChildrenTabIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

    /**
     * Toggles tool Palette children */
    toggleToolPaletteChildrenTabIndex: PropTypes.func,

    /**
     * Focus for palette for keyboard nav */
    toolPaletteFocus: PropTypes.bool,

    /**
     * Determines whether the "Add New Relationship" field type appears in the list. */
    includeNewRelationship: PropTypes.bool

};


export default NewFieldsMenu;
