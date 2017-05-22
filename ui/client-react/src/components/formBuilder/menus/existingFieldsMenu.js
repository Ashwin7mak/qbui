import React, {PropTypes} from 'react';
import ListOfElements from '../../../../../reuse/client/src/components/sideNavs/listOfElements';
import FieldTokenInMenu from '../fieldToken/fieldTokenInMenu';

// import {getExistingFields} '..FROM FORMS.JS
// {/*elements={existiingFields()}*/}

const ExistingFieldsMenu = ({isCollapsed, isOpen, toggleToolPaletteChildrenTabIndex, toolPaletteChildrenTabIndex, toolPaletteFocus, toolPaletteTabIndex}) => (
    <ListOfElements
        tabIndex={toolPaletteTabIndex}
        childrenTabIndex={toolPaletteChildrenTabIndex}
        toggleChildrenTabIndex={toggleToolPaletteChildrenTabIndex}
        hasKeyBoardFocus={toolPaletteFocus}
        renderer={FieldTokenInMenu}
        isCollapsed={isCollapsed}
        isOpen={isOpen}
        //elements={existingFields}
        elements={[<div></div>]}
        isFilterable={true}
        hideTitle={true}
    />
);

ExistingFieldsMenu.propTypes = {
    /**
     * Displays the menu in a collapsed state */
    isCollapsed: PropTypes.bool,

    /**
     * Displays the menu in an open state */
    isOpen: PropTypes.bool
};

export default ExistingFieldsMenu;
