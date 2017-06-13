import React, {PropTypes, Component} from 'react';
import ListOfElements from '../../../../../reuse/client/src/components/sideNavs/listOfElements';
import FieldTokenInMenu from '../fieldToken/fieldTokenInMenu';
import {getFormByContext, getExistingFields} from '../../../reducers/forms';
import {CONTEXT} from '../../../actions/context';
import {connect} from 'react-redux';
import _ from "lodash";
import Locale from "../../../../../reuse/client/src/locales/locale";

export class ExistingFieldsMenu extends Component {

    noExistingFields = () => {
        if (_.isEmpty(this.props.existingFields)) {
            let table = _.find(_.get(this.props, 'app.tables', []), {id: this.props.tblId}) || {};
            return Locale.getMessage('builder.existingEmptyState', {numberOfFields: this.props.numberOfFieldsOnForm, tableName: table.name});
        }
    };

    render = () => {
        let {isCollapsed, isOpen, toggleToolPaletteChildrenTabIndex, toolPaletteChildrenTabIndex, toolPaletteFocus, toolPaletteTabIndex, existingFields} = this.props;
        return (
            <ListOfElements
                tabIndex={toolPaletteTabIndex}
                childrenTabIndex={toolPaletteChildrenTabIndex}
                toggleChildrenTabIndex={toggleToolPaletteChildrenTabIndex}
                hasKeyBoardFocus={toolPaletteFocus}
                renderer={FieldTokenInMenu}
                isCollapsed={isCollapsed}
                animateChildren={true}
                elements={existingFields && existingFields.length > 0 ? [{children: existingFields, key: 'existingFields', title: 'Existing Fields'}] : undefined}
                isOpen={isOpen}
                isFilterable={true}
                hideTitle={true}
                emptyMessage={this.noExistingFields()}
                app={this.props.app}
            />
        );
    }
}

const mapStateToProps = (state, ownProps) => {

    let currentForm = getFormByContext(state, CONTEXT.FORM.VIEW);
    let currentFormId = _.has(currentForm, 'id') ? currentForm.id : [];
    return {
        existingFields: getExistingFields(state, currentFormId, ownProps.appId, ownProps.tblId),
        numberOfFieldsOnForm: (_.has(currentForm, "formData.formMeta.numberOfFieldsOnForm") ? currentForm.formData.formMeta.numberOfFieldsOnForm : 1),
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

