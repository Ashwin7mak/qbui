import React, {Component, PropTypes} from 'react';
import {DragDropContext} from 'react-dnd';
import Html5Backend from 'react-dnd-html5-backend';
import QbForm from '../QBForm/qbform';
import FormBuilderUtils from '../../utils/formBuilderUtils';
import _ from 'lodash';

import './formBuilder.scss';

/**
 * A container that holds the DragDropContext. Drag and Drop can only occur with elements inside this container.
 * The state is temporary until the redux stores are developed.
 */
export class FormBuilder extends Component {
    constructor(props) {
        super(props);

        this.state = {
            formData: {fields: [], formMeta: {}}
        };

        this.handleFormReorder = this.handleFormReorder.bind(this);
    }

    componentDidMount() {
        // Until we have a store, copy over the current form to the state of this object so it can be modified
        this.setState({formData: this.props.formData});
    }

    /**
     * Moves the dragged item to the location of the item that it was dropped on.
     * @param newTabIndex
     * @param newSectionIndex
     * @param newOrderIndex
     * @param draggedItemProps
     */
    handleFormReorder(newTabIndex, newSectionIndex, newOrderIndex, draggedItemProps) {
        let formDataCopy = _.cloneDeep(this.state.formData);

        formDataCopy.formMeta = FormBuilderUtils.moveField(formDataCopy.formMeta, newTabIndex, newSectionIndex, newOrderIndex, draggedItemProps);

        this.setState({formData: formDataCopy});
    }

    render() {
        return (
            <div className="formBuilderContainer">
                <QbForm
                    edit={true}
                    editingForm={true}
                    formData={this.state.formData}
                    handleFormReorder={this.handleFormReorder}
                />
            </div>
        );
    }
}

FormBuilder.propTypes = {
    formData: PropTypes.shape({
        fields: PropTypes.array,
        formMeta: PropTypes.object
    }).isRequired
};

export default DragDropContext(Html5Backend)(FormBuilder);
