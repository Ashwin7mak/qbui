import _ from 'lodash';
import Logger from '../../utils/logger';

/**
 * A helper class to move a field from one location in teh FormMetaData to another place in the data.
 * @type {{moveField}}
 */
const MoveFieldHelper = {
    moveField(formMeta, newTabIndex, newSectionIndex, newOrderIndex, draggedItemProps) {
        if (!hasRequiredArguments(formMeta, newTabIndex, newSectionIndex, newOrderIndex, draggedItemProps)) {
            return formMeta;
        }

        let formMetaCopy = _.cloneDeep(formMeta);

        removeElementFromCurrentSection(formMetaCopy, draggedItemProps);
        addElementToNewSection(formMetaCopy, newTabIndex, newSectionIndex, newOrderIndex, draggedItemProps);

        return formMetaCopy;
    }
};

// -- PRIVATE METHODS
function hasRequiredArguments(formMeta, newTabIndex, newSectionIndex, newOrderIndex, draggedItemProps) {
    let errors = [];
    const baseMessage = 'MoveFieldHelper Error:';

    if (!formMeta || !_.isObject(formMeta)) {
        errors.push(`${baseMessage} formMeta is required and must be an object`);
    }

    if (!_.isInteger(newTabIndex) || !_.isInteger(newSectionIndex) || !_.isInteger(newOrderIndex)) {
        errors.push(`${baseMessage} newTabIndex, newSectionIndex, and newOrderIndex are required and must be an integer`);
    }

    if (!draggedItemProps || !_.isObject(draggedItemProps)) {
        errors.push(`${baseMessage} draggedItemProps is required and must be an object`);
    } else {
        let {tabIndex, sectionIndex, orderIndex, element} = draggedItemProps;
        if (!_.isInteger(tabIndex) || !_.isInteger(sectionIndex) || !_.isInteger(orderIndex) || !_.isObject(element)) {
            errors.push(`${baseMessage} draggedItemProps must have the following properties: tabIndex, sectionIndex, orderIndex, element`);
        }
    }

    let logger = new Logger(); // Rewire won't work during testing if this is defined at the top of the file
    errors.forEach(error => logger.error(error));

    return (errors.length === 0);
}

/**
 * Convert the elements object into an array that is easier to sort and filter
 * @param elementsObject
 */
function convertElementsObjectToArray(elementsObject = {}) {
    return Object.keys(elementsObject).map(elementKey => {
        return elementsObject[elementKey];
    });
}

/**
 * Convert the elements array back to an object expected by the forms api
 * @param elementsArray
 */
function convertElementsArrayToObject(elementsArray = []) {
    let elementsObject = {};
    elementsArray.forEach((element, index) => {
        element.FormFieldElement.orderIndex = index;
        elementsObject[index] = element;
    });
    return elementsObject;
}

/**
 * Remove an element from the array based on its order index
 * @param elementsArray
 * @param orderIndex
 */
function removeElementFromArray(elementsArray, orderIndex) {
    return elementsArray.filter(element => {
        return element.FormFieldElement.orderIndex !== orderIndex;
    });
}

/**
 * Add an element to a section
 * @param elementsArray
 * @param newOrderIndex
 * @param element
 * @returns {[*,*,*]}
 */
function addElementToSection(elementsArray, newOrderIndex, element) {
    return [
        ...elementsArray.slice(0, newOrderIndex),
        {FormFieldElement: element},
        ...elementsArray.slice(newOrderIndex, elementsArray.length)
    ];
}

/**
 * Identifies what the new orderIndex for the element should be in its new location.
 * We need to subtract one from the index if the element was above (lower index) the new element in the array
 * because we removed it in the function above so the order index are off by one assuming it is in the same section.
 * Cross tab or cross section moves do not need to account for other elements shifting around.
 * @param newTabIndex
 * @param currentTabIndex
 * @param newSectionIndex
 * @param currentSectionIndex
 * @param newOrderIndex
 * @param currentOrderIndex
 * @returns {*}
 */
function identifyNewOrderIndex(newTabIndex, currentTabIndex, newSectionIndex, currentSectionIndex, newOrderIndex, currentOrderIndex) {
    // Move element currently in that position

    if (newTabIndex !== currentTabIndex || newSectionIndex !== currentSectionIndex) {
        return newOrderIndex;
    } else {
        return (newOrderIndex < currentOrderIndex ? newOrderIndex : (newOrderIndex - 1));
    }
}

/**
 * Removes the element from where it currently exists in preparation for the move
 * WARNING: This function has side effects on the formMetaData passed in.
 * @param formMetaData
 * @param draggedItemProps
 * @returns {*}
 */
function removeElementFromCurrentSection(formMetaData, draggedItemProps) {
    let {tabIndex, sectionIndex, orderIndex} = draggedItemProps;

    let elements = formMetaData.tabs[tabIndex].sections[sectionIndex].elements;

    let elementsArray = convertElementsObjectToArray(elements);
    elementsArray = removeElementFromArray(elementsArray, orderIndex);

    formMetaData.tabs[tabIndex].sections[sectionIndex].elements = convertElementsArrayToObject(elementsArray);

    return formMetaData;
}

/**
 * Adds the element to its new position
 * WARNING: This function has side effects on the formMetaData passed in.
 * @param formMetaData
 * @param newTabIndex
 * @param newSectionIndex
 * @param newOrderIndex
 * @param draggedItemProps
 */
function addElementToNewSection(formMetaData, newTabIndex, newSectionIndex, newOrderIndex, draggedItemProps) {
    let {tabIndex, sectionIndex, orderIndex, element} = draggedItemProps;

    let elements = formMetaData.tabs[newTabIndex].sections[newSectionIndex].elements;
    let elementsArray = convertElementsObjectToArray(elements);

    let newPlacementIndex = identifyNewOrderIndex(newTabIndex, tabIndex, newSectionIndex, sectionIndex, newOrderIndex, orderIndex);

    elementsArray = addElementToSection(elementsArray, newPlacementIndex, element);
    formMetaData.tabs[newTabIndex].sections[newSectionIndex].elements = convertElementsArrayToObject(elementsArray);
}

export default MoveFieldHelper;
