import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';
import {selectFieldOnForm, moveFieldOnForm, isInDraggingState, endDraggingState} from '../../actions/formActions';
import {updateFormAnimationState} from '../../actions/animationActions';
import {getFormByContext, getSelectedFormElement} from '../../reducers/forms';
import {findFormElementKey} from '../../utils/formUtils';
import {CONTEXT} from '../../actions/context';
import DragAndDrop from './dragAndDropField';
import FieldElement from '../QBForm/fieldElement';
import _ from 'lodash';

const DRAG_PREVIEW_TIMEOUT = 30;

// For now, there is only a view form and the forms store is keyed by this context and not the actual formId
const formId = CONTEXT.FORM.VIEW;

const DragAndDropField = DragAndDrop(FieldElement);


/**
 * A draggable field component for form builder.
 * @param FieldComponent
 * @param showFieldEditingTools
 * @returns {*}
 * @constructor
 */
class DraggableField extends Component {
    static propTypes = {
        // Actions used to update state related to moving and selecting form elements
        moveFieldOnForm: PropTypes.func,
        selectFieldOnForm: PropTypes.func,

        // The currently selected element on the form.
        selectedFormElement: PropTypes.object,

        isTokenInMenuDragging: PropTypes.bool
    };

    beginDrag = dragItemProps => {
        this.props.isInDraggingState(formId);

        // When a user starts dragging an element, we make sure that element gets selected so there aren't multiple or
        // incorrect selected elements.
        // Needed because a drag event will prevent a click event. Normally the click event would select the field.
        this.props.selectFieldOnForm(formId, this.props.location);

        return dragItemProps;
    };

    /**
     * Moves the dragged item to the location of the item that it was dropped on.
     * @param newLocation
     * @param draggedItemProps
     * @param moveImmediately - Helps with testing. Change to true to ignore the timeout that helps with fast dragging.
     */
    handleFormReorder = (newLocation, draggedItemProps, moveImmediately = false) => {
        if (!this.props.moveFieldOnForm) {
            // Exit if the required action is not present
            return;
        }

        if (this.props.selectedFormElement) {
            let element = this.props.selectedFormElement[findFormElementKey(this.props.selectedFormElement)];

            if (moveImmediately) {
                return this.props.moveFieldOnForm(formId, newLocation, Object.assign({}, draggedItemProps, {containingElement: this.props.selectedFormElement}, {element}));
            }

            if (this.reorderTimeout) {
                clearTimeout(this.reorderTimeout);
            }

            // Add a short timeout so that very fast dragging doesn't cause multiple reorders
            this.reorderTimeout = setTimeout(() => {
                this.props.moveFieldOnForm(formId, newLocation, Object.assign({}, draggedItemProps, {containingElement: this.props.selectedFormElement}, {element}));
            }, DRAG_PREVIEW_TIMEOUT);
        }
    };

    onHover = (dropTargetProps, dragItemProps) => {
        if (!dragItemProps.containingElement || dragItemProps.containingElement.id !== dropTargetProps.containingElement.id) {
            this.handleFormReorder(dropTargetProps.location, dragItemProps);
        }
    };

    endDrag = () => {
        this.props.endDraggingState(formId);
        this.props.updateFormAnimationState(false);
    };

    isDragging = item => {
        return (_.isEqual(this.props.location, this.props.selectedField) && this.props.isTokenInMenuDragging);
    };

    render() {
        return <DragAndDropField
            {...this.props}
            beginDrag={this.beginDrag}
            onHover={this.onHover}
            checkIsDragging={this.isDragging}
            endDrag={this.endDrag}
        />
    }
}

const mapStateToProps = (state, ownProps) => {
    const currentForm = getFormByContext(state, ownProps.formId || CONTEXT.FORM.VIEW);

    return {
        selectedFormElement: (currentForm ? getSelectedFormElement(state, currentForm.id) : undefined)
    }
};

const mapDispatchToProps = {
    moveFieldOnForm,
    selectFieldOnForm,
    isInDraggingState,
    updateFormAnimationState,
    endDraggingState
};

export default connect(mapStateToProps, mapDispatchToProps)(DraggableField);
