import React, {Component, PropTypes} from 'react';
import QbForm from '../QBForm/qbform';
import DraggableField from './draggableField';
import {findFormElementKey} from '../../utils/formUtils';

import './formBuilder.scss';

const DRAG_PREVIEW_TIMEOUT = 20;

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

        this.reorderTimeout = null;

        this.removeField = this.removeField.bind(this);
    }

    removeField(location) {
        if (this.props.removeField) {
            return this.props.removeField(this.props.formId, location);
        }
    }

    render() {
        return (
            <div className="formBuilderContainer">
                <QbForm
                    alternateFieldRenderer={DraggableField}
                    formBuilderContainerContentElement={this.props.formBuilderContainerContentElement}
                    formFocus={this.props.formFocus}
                    selectedField={this.props.selectedField}
                    formBuilderUpdateChildrenTabIndex={this.props.formBuilderUpdateChildrenTabIndex}
                    edit={true}
                    editingForm={true}
                    formData={this.props.formData}
                    hasAnimation={true}
                    app={this.props.app}
                    tblId={this.props.tblId}
                    appUsers={[]}
                />
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
