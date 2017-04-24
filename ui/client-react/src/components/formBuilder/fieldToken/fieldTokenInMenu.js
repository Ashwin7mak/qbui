import React, {PropTypes, Component} from 'react';
import {connect} from "react-redux";
import FieldToken from './fieldToken';
import Tooltip from '../../../../../reuse/client/src/components/tooltip/tooltip';
import {addNewFieldToForm, updateNewFieldId} from "../../../actions/formActions";
import {getFormByContext, getSelectedFormElement} from '../../../reducers/forms';
import {CONTEXT} from '../../../actions/context';
import _ from 'lodash';
import DraggableField from '../draggableField';

/**
 * A FieldToken that is extended to be displayed in a menu (i.e., Tool Palette) when building a form.
 * TODO: This will eventually be decorated with other methods like onClick for adding it to the form. */
export class FieldTokenInMenu extends Component {
    render() {
        const fieldToken = <FieldToken isDragging={false} {...this.props} />;

        if (this.props.tooltipText) {
            return (
                <Tooltip location="right" plainMessage={this.props.tooltipText}>
                    {fieldToken}
                </Tooltip>
            );
        }

        return fieldToken;
    }
}

export class DraggableFieldToken extends Component {
    clickToAddToForm = () => {
        let {selectedField, formId, appId, tblId, relatedField} = this.props;
        this.props.addNewFieldToForm(formId, appId, tblId, selectedField, relatedField);
    };

    beginDrag = () => {
        this.clickToAddToForm();
    };

    render() {
        const Element = DraggableField(FieldTokenInMenu, false);

        return (
            <div onClick={this.clickToAddToForm}>
                <Element {...this.props} beginDrag={this.beginDrag} />
            </div>
        );
    }
}

FieldTokenInMenu.propTypes = {
    /**
     * What field type does this token represent? */
    type: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    /**
     * What title should be used on the field token? */
    title: PropTypes.string.isRequired,

    /**
     * Text to display in a tooltip. It should be localized. */
    tooltipText: PropTypes.string,

    /**
     * Can optionally show the token in a collapsed state (icon only) */
    isCollapsed: PropTypes.bool,

    /**
     * Holds information about the new field created to represent this element while dragging and once dropped */
    newField: PropTypes.obj
};

const mapStateToProps = state => {
    let currentForm = getFormByContext(state, CONTEXT.FORM.VIEW);
    let selectedField = (_.has(currentForm, 'selectedFields') ? currentForm.selectedFields[0] : null);

    return {
        formId: _.get(currentForm, 'id'),
        appId: _.get(currentForm, 'formData.formMeta.appId'),
        tblId: _.get(currentForm, 'formData.formMeta.tableId'),
        selectedField: selectedField,
        selectedFormElement: (currentForm ? getSelectedFormElement(state, currentForm.id) : undefined),
        newFieldId: (currentForm ? currentForm.newFieldId : null)
    };
};

const mapDispatchToProps = {
    addNewFieldToForm,
    updateNewFieldId
};

export default connect(mapStateToProps, mapDispatchToProps)(DraggableFieldToken);
