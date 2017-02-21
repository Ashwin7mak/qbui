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
     * @param newTabIndex
     * @param newSectionIndex
     * @param newOrderIndex
     * @param draggedItemProps
     */
    handleFormReorder(newTabIndex, newSectionIndex, newOrderIndex, draggedItemProps) {
        if (this.props.moveFieldOnForm) {
            return this.props.moveFieldOnForm(this.props.formId, newTabIndex, newSectionIndex, newOrderIndex, draggedItemProps);
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


export default DragDropContext(TouchBackend({enableMouseEvents: true}))(FormBuilder);
