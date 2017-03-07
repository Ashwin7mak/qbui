import React, {Component, PropTypes} from 'react';
import {DragDropContext} from 'react-dnd';
import QbForm from '../QBForm/qbform';
import FormBuilderCustomDragLayer from './formBuilderCustomDragLayer';
import TouchBackend from 'react-dnd-touch-backend';
import './formBuilder.scss';
import {findFormElementKey} from '../../utils/formUtils';
import _ from 'lodash';
import {findDOMNode} from 'react-dom';
import Device from '../../utils/device';

import './formBuilder.scss';

const DRAG_PREVIEW_TIMEOUT = 75;

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

        this.handleFormReorder = this.handleFormReorder.bind(this);
        this.cancelFormReorder = this.cancelFormReorder.bind(this);
        this.cacheDragElement = this.cacheDragElement.bind(this);
        this.clearDragElementCache = this.clearDragElementCache.bind(this);
        this.reorderTimeout = null;
    }

    /**
     * Moves the dragged item to the location of the item that it was dropped on.
     * @param newLocation
     * @param draggedItemProps
     * @param moveImmediately - Helps with testing. Change to true to ignore the timeout that helps with fast dragging.
     */
    handleFormReorder(newLocation, draggedItemProps, moveImmediately = false) {
        if (this.props.moveFieldOnForm && _.has(draggedItemProps, 'containingElement')) {
            let element = draggedItemProps.containingElement[findFormElementKey(draggedItemProps.containingElement)];

            if (moveImmediately) {
                return this.props.moveFieldOnForm(this.props.formId, newLocation, Object.assign({}, draggedItemProps, {element}));
            }

            if (this.reorderTimeout) {
                clearTimeout(this.reorderTimeout);
            }

            // Add a short timeout so that very fast dragging doesn't cause multiple reorders
            this.reorderTimeout = setTimeout(() => {
                this.props.moveFieldOnForm(this.props.formId, newLocation, Object.assign({}, draggedItemProps, {element}));
            }, DRAG_PREVIEW_TIMEOUT);
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
     * Unlike mouse drag/drop events, touch drag events will freeze if the DOM node the event was attached to is unmounted.
     * To get around this limitation, we create a copy of the DOM node with the touch event listener in an div.elementCache
     * node so that it will not be unmounted. This function (cacheDragElement) is called when the element starts dragging.
     * @param dragComponent
     */
    cacheDragElement(dragComponent) {
        if (this.elementCache && dragComponent) {
            findDOMNode(this.elementCache).appendChild(findDOMNode(dragComponent));
        }
    }

    /**
     * See explanation in cacheDragElement.
     * This function is called on endDrag when dragging is complete. It will remove the element from the elementCache div.
     */
    clearDragElementCache() {
        if (this.elementCache) {
            let elementCacheInDom = findDOMNode(this.elementCache);
            while (elementCacheInDom.hasChildNodes()) {
                elementCacheInDom.removeChild(elementCacheInDom.lastChild);
            }
        }
    }

    render() {
        return (
            <div className="formBuilderContainer">

                <label style={{display: 'none'}} id="reactabularToggle">
                    <input type="checkbox" checked={this.state.hasAnimation} onChange={evt => this.setState({hasAnimation: !this.state.hasAnimation})} />
                    Has drag animation
                </label>
                {this.props.showCustomDragLayer && <FormBuilderCustomDragLayer />}
                <QbForm
                    edit={true}
                    editingForm={true}
                    formData={this.props.formData}
                    handleFormReorder={this.handleFormReorder}
                    cacheDragElement={this.cacheDragElement}
                    clearDragElementCache={this.clearDragElementCache}
                    cancelFormReorder={this.cancelFormReorder}
                    hasAnimation={!Device.isTouch()}
                    appUsers={[]}
                />
                <div className="elementCache" ref={elementCache => this.elementCache = elementCache} />
            </div>
        );
    }
}

FormBuilder.propTypes = {
    formId: PropTypes.string.isRequired,

    showCustomDragLayer: PropTypes.bool,

    formData: PropTypes.shape({
        fields: PropTypes.array,
        formMeta: PropTypes.object
    }).isRequired,

    moveFieldOnForm: PropTypes.func
};

FormBuilder.defaultProps = {
    showCustomDragLayer: true
};

/**
 * delay is used to allow a user to scroll on mobile
 * if a user wants to drag and drop, the screen must be pressed on for 50ms before dragging will start
 * */
export default DragDropContext(TouchBackend({enableMouseEvents: true, delay: 50}))(FormBuilder);
