import React, {PropTypes, Component} from 'react';
import ListOfElements from '../../../../../reuse/client/src/components/sideNavs/listOfElements';
import FieldTokenInExistingMenu from '../fieldToken/fieldTokenInMenu';
import {getFormByContext, getExistingFields} from '../../../reducers/forms';
import {CONTEXT} from '../../../actions/context';
import {connect} from 'react-redux';

export class ExistingFieldsMenu extends Component {

    render = () => {
        let {isCollapsed, isOpen, toggleToolPaletteChildrenTabIndex, toolPaletteChildrenTabIndex, toolPaletteFocus, toolPaletteTabIndex, existingFields} = this.props;
        return (
            <ListOfElements
                tabIndex={toolPaletteTabIndex}
                childrenTabIndex={toolPaletteChildrenTabIndex}
                toggleChildrenTabIndex={toggleToolPaletteChildrenTabIndex}
                hasKeyBoardFocus={toolPaletteFocus}
                renderer={FieldTokenInExistingMenu}
                isCollapsed={isCollapsed}
                animateChildren={true}
                elements={[{children: existingFields, key: 'existingFields', title: 'Existing Fields'}]}
                isOpen={isOpen}
                isFilterable={true}
                hideTitle={true}
            />
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    let currentForm = getFormByContext(state, CONTEXT.FORM.VIEW);
    let currentFormId = _.has(currentForm, 'id') ? currentForm.id : [];
    return {
        existingFields: getExistingFields(state, currentFormId, ownProps.appId, ownProps.tblId)
    };
};

ExistingFieldsMenu.propTypes = {
    /**
     * Displays the menu in a collapsed state */
    isCollapsed: PropTypes.bool,

    /**
     * Displays the menu in an open state */
    isOpen: PropTypes.bool,

    appId: PropTypes.string,
    tblId: PropTypes.string,
};

export default connect(mapStateToProps)(ExistingFieldsMenu);

