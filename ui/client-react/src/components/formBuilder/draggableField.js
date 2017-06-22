import React, {PropTypes, Component} from 'react';
import {connect} from 'react-redux';
import {selectFieldOnForm, moveFieldOnForm, isInDraggingState, endDraggingState} from '../../actions/formActions';
import {updateFormAnimationState} from '../../actions/animationActions';
import {getFormByContext, getSelectedFormElement} from '../../reducers/forms';
import {findFormElementKey} from '../../utils/formUtils';
import {CONTEXT} from '../../actions/context';
import DragAndDrop from '../../../../reuse/client/src/components/dragAndDrop/dragAndDropElement';
import FieldElement from '../QBForm/fieldElement';
import FieldEditingTools from './fieldEditingTools/fieldEditingTools';
import _ from 'lodash';

const DRAG_PREVIEW_TIMEOUT = 30;

// For now, there is only a view form and the forms store is keyed by this context and not the actual formId
const formId = CONTEXT.FORM.VIEW;

export const DragAndDropField = DragAndDrop(FieldElement);


/**
 * A draggable field component for form builder.
 * @param FieldComponent
 * @param showFieldEditingTools
 * @returns {*}
 * @constructor
 */
export class DraggableField extends Component {
    static propTypes = {
        // Actions used to update state related to moving and selecting form elements
        moveFieldOnForm: PropTypes.func,
        selectFieldOnForm: PropTypes.func,
        isInDraggingState: PropTypes.func,
        endDraggingState: PropTypes.func,
        updateFormAnimationState: PropTypes.func,

        /**
         * The currently selected element on the form. */
        selectedFormElement: PropTypes.object,

        /**
         * Whether or not the token is dragging (helps control dragging state correctly) */
        isTokenInMenuDragging: PropTypes.bool,

        /**
         * Where the element is located on the form. */
        location: PropTypes.object,
    };

    beginDrag = dragItemProps => {
        if (this.props.isInDraggingState) {
            this.props.isInDraggingState(formId);
        }

        // When a user starts dragging an element, we make sure that element gets selected so there aren't multiple or
        // incorrect selected elements.
        // Needed because a drag event will prevent a click event. Normally the click event would select the field.
        if (this.props.selectFieldOnForm) {
            this.props.selectFieldOnForm(formId, this.props.location);
        }

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
        // Exit the function if dropTarget or dragItem is not provided
        if (!dragItemProps || !dropTargetProps) {
            return;
        }

        if (!dragItemProps.containingElement || _.get(dragItemProps, 'containingElement.id') !== _.get(dropTargetProps, 'containingElement.id')) {
            this.handleFormReorder(dropTargetProps.location, dragItemProps);
        }
    };

    endDrag = () => {
        if (this.props.endDraggingState) {
            this.props.endDraggingState(formId);
        }

        if (this.props.updateFormAnimationState) {
            this.props.updateFormAnimationState(false);
        }
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
            fieldEditingTools={FieldEditingTools}
        />;
    }
}

const mapStateToProps = (state, ownProps) => {
    const currentForm = getFormByContext(state, ownProps.formId || CONTEXT.FORM.VIEW);

    return {
        selectedField: (_.has(currentForm, 'selectedFields') ? currentForm.selectedFields[0] : undefined),
        selectedFormElement: (currentForm ? getSelectedFormElement(state, currentForm.id) : undefined),
        isTokenInMenuDragging: (_.has(currentForm, 'isDragging') ? currentForm.isDragging : undefined),
        isAnimating: state.animation.isFormAnimating
    };
};

const mapDispatchToProps = {
    moveFieldOnForm,
    selectFieldOnForm,
    isInDraggingState,
    updateFormAnimationState,
    endDraggingState
};

export default connect(mapStateToProps, mapDispatchToProps)(DraggableField);
