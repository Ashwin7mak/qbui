import React, {PropTypes} from 'react';
import {supportedNewFieldTypesWithProperties} from '../newFieldTypes';
import ListOfElements from '../../../../../reuse/client/src/components/sideNavs/listOfElements';

const NewFieldsMenu = ({isCollapsed, isOpen}) => (
    <ListOfElements
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
    isOpen: PropTypes.bool
};

export default NewFieldsMenu;
