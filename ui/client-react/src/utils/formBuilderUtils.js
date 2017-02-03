const FormBuilderUtils = {
    moveField(formMeta, newTabIndex, newSectionIndex, newOrderIndex, draggedItemProps) {
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

        formMeta.tabs[newTabIndex].sections[newSectionIndex].elements = newElementsObject;
        return formMeta;
    }
};

export default FormBuilderUtils;
