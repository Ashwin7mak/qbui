import React, {Component, PropTypes} from 'react';
import {DragDropContext} from 'react-dnd';
import Html5Backend from 'react-dnd-html5-backend';
import QbForm from '../QBForm/qbform';
import _ from 'lodash';

import './formBuilder.scss';

class FormBuilder extends Component {
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

    handleFormReorder(newTabIndex, newSectionIndex, newOrderIndex, draggedItemProps) {
        let formDataCopy = _.cloneDeep(this.state.formData);
        let formMeta = formDataCopy.formMeta;

        let elements = formMeta.tabs[newTabIndex].sections[newSectionIndex].elements;

        let elementsArray = Object.keys(elements).map(elementKey => {
            return elements[elementKey];
        });

        // Remove element
        // TODO:: This won't work for cross section drags. Need to update to have draggedItemProps include section and tabs indexes of dragged it
        elementsArray = elementsArray.filter(element => {
            return element.FormFieldElement.orderIndex !== draggedItemProps.orderIndex;
        });

        // Move element currently in that position
        // TODO:: Need to account for item being in the same tab/section or not
        let newPlacementIndex = (newOrderIndex < draggedItemProps.orderIndex ? newOrderIndex : (newOrderIndex - 1));
        elementsArray = [
            ...elementsArray.slice(0, newPlacementIndex),
            {FormFieldElement: draggedItemProps.element},
            ...elementsArray.slice(newPlacementIndex, elements.length)
        ];

        let newElementsObject = {};

        elementsArray.forEach((element, index) => {
            element.FormFieldElement.orderIndex = index;
            newElementsObject[index] = element;
        });

        formDataCopy.formMeta.tabs[newTabIndex].sections[newSectionIndex].elements = newElementsObject;

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
