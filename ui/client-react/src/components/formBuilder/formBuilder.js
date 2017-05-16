import React, {Component, PropTypes} from 'react';
import QbForm from '../QBForm/qbform';
import {findFormElementKey} from '../../utils/formUtils';
import {findDOMNode} from 'react-dom';

import './formBuilder.scss';

const DRAG_PREVIEW_TIMEOUT = 50;

/**
 * A container that holds the DragDropContext. Drag and Drop can only occur with elements inside this container.
 * The state is temporary until the redux stores are developed.
 */
export class FormBuilder extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hasAnimation: false
        };

        this.elementCache = null;
        this.reorderTimeout = null;

        this.handleFormReorder = this.handleFormReorder.bind(this);
        this.removeField = this.removeField.bind(this);
        this.cancelFormReorder = this.cancelFormReorder.bind(this);
        this.cacheDragElement = this.cacheDragElement.bind(this);
        this.clearDragElementCache = this.clearDragElementCache.bind(this);
    }

    /**
     * When a user starts dragging an element, we make sure that element gets selected so there aren't multiple or incorrect selected elements.
     * Needed because a drag event will prevent a click event. Normally the click event would select the field.
     * @param dragItemProps
     */
    beginDrag = dragItemProps => {
        this.props.selectFieldOnForm(this.props.formId, dragItemProps.location);
    };

    /**
     * Moves the dragged item to the location of the item that it was dropped on.
     * @param newLocation
     * @param draggedItemProps
     * @param moveImmediately - Helps with testing. Change to true to ignore the timeout that helps with fast dragging.
     */
    handleFormReorder(newLocation, draggedItemProps, moveImmediately = false) {
        if (!this.props.moveFieldOnForm) {
            // Exit if the required action is not present
            return;
        }

        if (this.props.selectedFormElement) {
            let element = draggedItemProps.containingElement[findFormElementKey(draggedItemProps.containingElement)];

            if (moveImmediately) {
                return this.props.moveFieldOnForm(this.props.formId, newLocation, Object.assign({}, draggedItemProps, {containingElement: this.props.selectedFormElement}, {element}));
            }

            if (this.reorderTimeout) {
                clearTimeout(this.reorderTimeout);
            }

            // Add a short timeout so that very fast dragging doesn't cause multiple reorders
            this.reorderTimeout = setTimeout(() => {
                this.props.moveFieldOnForm(this.props.formId, newLocation, Object.assign({}, draggedItemProps, {containingElement: this.props.selectedFormElement}, {element}));
            }, DRAG_PREVIEW_TIMEOUT);
        }
    }

    removeField(location) {
        if (this.props.removeField) {
            return this.props.removeField(this.props.formId, location);
        }
    }
    /**
     * Cancels the timeout for a reorder
     */
    cancelFormReorder() {
        clearTimeout(this.reorderTimeout);
        this.reorderTimeout = null;
    }

    /**
     * Unlike mouse drag/drop events, touch drag events will freeze if the DOM node the touch event was attached to is unmounted.
     * To get around this limitation, we copy the DOM node that has the touch event listener to a div with class elementCache
     * That copy will not be unmounted for the duration of the drag event.
     * This function (cacheDragElement) is called when the element starts dragging to create a copy of the element and store in in
     * div.elementCache.
     * @param dragComponent
     */
    cacheDragElement(dragComponent) {
        if (this.elementCache && dragComponent) {
            this.elementCache.appendChild(findDOMNode(dragComponent));
        }
    }

    /**
     * See explanation in cacheDragElement.
     * This function is called on endDrag when dragging is complete. It will remove the element from the elementCache div.
     */
    clearDragElementCache() {
        if (this.elementCache) {
            while (this.elementCache.hasChildNodes()) {
                this.elementCache.removeChild(this.elementCache.lastChild);
            }
        }
    }

    render() {
        return (
            <div className="formBuilderContainer">
                <QbForm
                    formBuilderContainerContentElement={this.props.formBuilderContainerContentElement}
                    formFocus={this.props.formFocus}
                    selectedField={this.props.selectedField}
                    formBuilderUpdateChildrenTabIndex={this.props.formBuilderUpdateChildrenTabIndex}
                    edit={true}
                    editingForm={true}
                    formData={this.props.formData}
                    beginDrag={this.beginDrag}
                    handleFormReorder={this.handleFormReorder}
                    cacheDragElement={this.cacheDragElement}
                    clearDragElementCache={this.clearDragElementCache}
                    cancelFormReorder={this.cancelFormReorder}
                    updateAnimationState={this.props.updateAnimationState}
                    hasAnimation={true}
                    app={this.props.app}
                    tblId={this.props.tblId}
                    appUsers={[]}
                />
                <div className="elementCache" ref={elementCache => this.elementCache = elementCache} />
            </div>
        );
    }
}

FormBuilder.propTypes = {
    formId: PropTypes.string,

    formData: PropTypes.shape({
        fields: PropTypes.array,
        formMeta: PropTypes.object
    }),

    moveFieldOnForm: PropTypes.func,

    updateAnimationState: PropTypes.func,
};

FormBuilder.defaultProps = {
    showCustomDragLayer: true
};

/**
 * delay is used to allow a user to scroll on mobile
 * if a user wants to drag and drop, the screen must be pressed on for 50ms before dragging will start
 * */
export default FormBuilder;
