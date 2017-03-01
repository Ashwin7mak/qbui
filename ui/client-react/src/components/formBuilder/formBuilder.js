import React, {Component, PropTypes} from 'react';
import {DragDropContext} from 'react-dnd';
import QbForm from '../QBForm/qbform';
import FormBuilderCustomDragLayer from './formBuilderCustomDragLayer';
import TouchBackend from 'react-dnd-touch-backend';
import './formBuilder.scss';

/**
 * A container that holds the DragDropContext. Drag and Drop can only occur with elements inside this container.
 * The state is temporary until the redux stores are developed.
 */
export class FormBuilder extends Component {
    constructor(props) {
        super(props);

        this.handleFormReorder = this.handleFormReorder.bind(this);
    }

    /**
     * Moves the dragged item to the location of the item that it was dropped on.
     * @param newLocation
     * @param draggedItemProps
     */
    handleFormReorder(newLocation, draggedItemProps) {
        if (this.props.moveFieldOnForm) {
            return this.props.moveFieldOnForm(this.props.formId, newLocation, draggedItemProps);
        }
    }

    render() {
        return (
            <div className="formBuilderContainer">
                {this.props.showCustomDragLayer && <FormBuilderCustomDragLayer />}
                <QbForm
                    edit={true}
                    editingForm={true}
                    formData={this.props.formData}
                    handleFormReorder={this.handleFormReorder}
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
