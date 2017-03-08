import React, {Component, PropTypes} from 'react';
import {DragDropContext} from 'react-dnd';
import QbForm from '../QBForm/qbform';
import FormBuilderCustomDragLayer from './formBuilderCustomDragLayer';
import TouchBackend from 'react-dnd-touch-backend';
import {findFormElementKey} from '../../utils/formUtils';
import _ from 'lodash';

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

        this.handleFormReorder = this.handleFormReorder.bind(this);
        this.cancelFormReorder = this.cancelFormReorder.bind(this);
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
                    cancelFormReorder={this.cancelFormReorder}
                    hasAnimation={this.state.hasAnimation}
                    appUsers={[]}
                />
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
 * if a user wants to drag and drop, the screen must be pressed on for 150ms before dragging will start
 * */

export default DragDropContext(TouchBackend({enableMouseEvents: true, delay: 150}))(FormBuilder);
