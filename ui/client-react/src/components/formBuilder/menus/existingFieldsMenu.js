import React, {PropTypes, Component} from 'react';
import ListOfElements from '../../../../../reuse/client/src/components/sideNavs/listOfElements';
import DraggableFieldTokenInMenu from '../draggableFieldTokenInMenu';
import {getFormByContext, getExistingFields} from '../../../reducers/forms';
import {CONTEXT} from '../../../actions/context';
import {connect} from 'react-redux';
import _ from 'lodash';
import Locale from '../../../../../reuse/client/src/locales/locale';

export class ExistingFieldsMenu extends Component {

    buildEmptyState = () => {
        let table = _.find(_.get(this.props, 'app.tables', []), {id: this.props.tblId}) || {};
        return Locale.getMessage('builder.existingEmptyState', {numberOfFields: this.props.numberOfFieldsOnForm, tableName: table.name});
    };

    render = () => {
        let {isCollapsed, toggleToolPaletteChildrenTabIndex, toolPaletteChildrenTabIndex, toolPaletteFocus, toolPaletteTabIndex, existingFields} = this.props;
        return (
            <ListOfElements
                tabIndex={toolPaletteTabIndex}
                childrenTabIndex={toolPaletteChildrenTabIndex}
                toggleChildrenTabIndex={toggleToolPaletteChildrenTabIndex}
                hasKeyBoardFocus={toolPaletteFocus}
                childElementRenderer={DraggableFieldTokenInMenu}
                isCollapsed={isCollapsed}
                animateChildren={true}
                elements={existingFields && existingFields.length > 0 ? [{children: existingFields, key: 'existingFields', title: Locale.getMessage('builder.formBuilder.existingFieldsMenuThisTableTitle'), collapsible: true, isOpen: true}] : undefined}
                isFilterable={true}
                hideTitle={false}
                emptyMessage={this.buildEmptyState()}
            />
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    let currentForm = getFormByContext(state, CONTEXT.FORM.VIEW);
    let currentFormId = _.has(currentForm, 'id') ? currentForm.id : [];
    return {
        existingFields: getExistingFields(state, currentFormId, ownProps.appId, ownProps.tblId),
        numberOfFieldsOnForm: _.get(currentForm, 'formData.formMeta.numberOfFieldsOnForm', 1)
    };
};

ExistingFieldsMenu.propTypes = {
    /**
     * Displays the menu in a collapsed state */
    isCollapsed: PropTypes.bool,

    /**
     * Displays the menu in an open state */
    isOpen: PropTypes.bool,

    /**
     * appId and tblId are required to get existing fields
     * */
    appId: PropTypes.string.isRequired,
    tblId: PropTypes.string.isRequired,
};

export default connect(mapStateToProps)(ExistingFieldsMenu);
