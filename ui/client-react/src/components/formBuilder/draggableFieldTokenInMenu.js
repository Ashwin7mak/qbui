import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';
import DraggableTokenInMenu from '../../../../reuse/client/src/components/dragAndDrop/elementToken/draggableTokenInMenu';
import {endDraggingState, isInDraggingState, addFieldToForm, selectFieldOnForm} from '../../actions/formActions';
import {getFormByContext, getSelectedFormElement} from '../../reducers/forms';
import {updateFormAnimationState} from '../../actions/animationActions';
import {draggingLinkToRecord} from '../../actions/relationshipBuilderActions';
import {CONTEXT} from '../../actions/context';
import FieldFormats from '../../utils/fieldFormats';
import _ from 'lodash';

/**
 * A component which allows the field token to be clicked and dragged. The click and drag cannot be on the same element because drag
 * will take precedence over click, making the element un-clickable.
 *
 * In addition, it allows some extra methods to be passed through to the DraggableField component which is
 * not possible if this component only had one layer.
 */
export class DraggableFieldTokenInMenu extends Component {
    clickToAddToForm = () => {
        const {selectedField, formId, appId, tblId, relatedField} = this.props;
        this.props.addFieldToForm(formId, appId, tblId, selectedField, relatedField);
    };

    /**
     * This is called when the field token is dragged over a droppable target on the form
     * It adds the field if it has not been added yet.
     * @param dropTargetProps
     * @param _dragItemProps
     */
    onHoverBeforeAdded = (dropTargetProps, _dragItemProps) => {
        const {formId, appId, tblId, relatedField} = this.props;
        this.props.addFieldToForm(formId, appId, tblId, dropTargetProps.location, relatedField);
    };

    beginDrag = (dragItemProps) => {
        this.props.isInDraggingState(this.props.formId);
        // Deselect any selected fields on the form, because we are dragging from the menu.
        this.props.selectFieldOnForm(this.props.formId, null);

        if (this.props.type === FieldFormats.LINK_TO_RECORD) {
            this.props.draggingLinkToRecord(true);
        }

        return {
            id: dragItemProps.containingElement.id,
            location: dragItemProps.location,
            relatedField: dragItemProps.relatedField,
            onHover: dragItemProps.onHover
        };
    };

    /**
     * It resets the state when dragging is complete so the new field can be added again
     */
    endDrag = () => {
        this.props.endDraggingState(this.props.formId);
        this.props.updateFormAnimationState(false);
        this.props.draggingLinkToRecord(false);
    };

    render() {
        return (
            <DraggableTokenInMenu
                {...this.props}
                onClick={this.clickToAddToForm}
                tabIndex={this.props.tabIndex}
                onKeyDown={this.onEnterClickToAdd}
                onHoverBeforeAdded={this.onHoverBeforeAdded}
                beginDrag={this.beginDrag}
                endDrag={this.endDrag}
            />
        );
    }
}

DraggableFieldTokenInMenu.propTypes = {
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
     * Tabindex */
    toolPaletteChildrenTabIndex: PropTypes.number
};

const mapStateToProps = state => {
    let currentForm = getFormByContext(state, CONTEXT.FORM.VIEW);

    return {
        formId: _.get(currentForm, 'id'),
        appId: _.get(currentForm, 'formData.formMeta.appId'),
        tblId: _.get(currentForm, 'formData.formMeta.tableId'),
        selectedField: (_.has(currentForm, 'selectedFields') ? currentForm.selectedFields[0] : null),
        selectedFormElement: (currentForm ? getSelectedFormElement(state, currentForm.id) : undefined),
        isTokenInMenuDragging: (_.has(currentForm, 'isDragging') ? currentForm.isDragging : undefined)
    };
};

const mapDispatchToProps = {
    updateFormAnimationState,
    endDraggingState,
    isInDraggingState,
    addFieldToForm,
    selectFieldOnForm,
    draggingLinkToRecord
};

export default connect(mapStateToProps, mapDispatchToProps)(DraggableFieldTokenInMenu);
