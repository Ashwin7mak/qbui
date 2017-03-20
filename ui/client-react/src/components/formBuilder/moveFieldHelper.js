import _ from 'lodash';
import Logger from '../../utils/logger';

/**
 * A helper class to move a field from one location in teh FormMetaData to another place in the data.
 * @type {{moveField}}
 */
const MoveFieldHelper = {
    moveField(formMeta, newLocation, draggedItemProps) {
        if (!hasRequiredArguments(formMeta, newLocation, draggedItemProps)) {
            return formMeta;
        }

        if (newLocation ===  findCurrentElementLocation(formMeta, draggedItemProps.containingElement)) {
            // Location hasn't changed so return existing form structure
            return formMeta;
        }

        let formMetaCopy = _.cloneDeep(formMeta);

        removeElementFromCurrentLocationById(formMetaCopy, draggedItemProps);
        addElementToNewLocation(formMetaCopy, newLocation, draggedItemProps);

        return formMetaCopy;
    },

    removeField(formMeta, location) {
        let formMetaCopy = _.cloneDeep(formMeta);
        removeElementFromCurrentLocation(formMetaCopy, location);

        return formMetaCopy;
    },

    keyBoardMoveFieldUp(formMeta, currentLocation) {
        let formMetaCopy = _.cloneDeep(formMeta);
        swapFieldLocation(formMetaCopy, currentLocation, -1);

        return formMetaCopy;
    },

    keyBoardMoveFieldDown(formMeta, currentLocation) {
        let formMetaCopy = _.cloneDeep(formMeta);
        swapFieldLocation(formMetaCopy, currentLocation, 1);

        return formMetaCopy;
    }
};

// -- PRIVATE METHODS
function hasRequiredArguments(formMeta, newLocation, draggedItemProps) {
    let errors = [];
    const baseMessage = 'MoveFieldHelper Error:';

    if (!formMeta || !_.isObject(formMeta)) {
        errors.push(`${baseMessage} formMeta is required and must be an object`);
    }

    if (
        !newLocation ||
        !_.isInteger(newLocation.tabIndex) ||
        !_.isInteger(newLocation.sectionIndex) ||
        !_.isInteger(newLocation.columnIndex) ||
        !_.isInteger(newLocation.elementIndex)
    ) {
        errors.push(`${baseMessage} newLocation is missing or missing props: newTabIndex, newSectionIndex, newColumnIndex, and newOrderIndex are required and must be an integer`);
    }

    if (!draggedItemProps || !_.isObject(draggedItemProps)) {
        errors.push(`${baseMessage} draggedItemProps is required and must be an object`);
    }

    if (
        draggedItemProps && (
            !_.has(draggedItemProps, 'location') ||
            !_.isInteger(draggedItemProps.location.sectionIndex) ||
            !_.isInteger(draggedItemProps.location.columnIndex) ||
            !_.isInteger(draggedItemProps.location.elementIndex) ||
            !_.isObject(draggedItemProps.element)
        )
    ) {
        errors.push(`${baseMessage} draggedItemProps must have the following properties: location (with tabIndex, sectionIndex, columnIndex, elementIndex) and element`);
    }


    let logger = new Logger(); // Rewire won't work during testing if this is defined at the top of the file
    errors.forEach(error => logger.error(error));

    return (errors.length === 0);
}

function removeElementFromCurrentLocationById(formMetaData, draggedItemProps) {
    let updatedElementLocation = findCurrentElementLocation(formMetaData, draggedItemProps.containingElement);

    if (!updatedElementLocation) {
        // Element doesn't yet appear on the form so we can safely return the existing formMetaData without removing anything
        return formMetaData;
    }
    removeElementFromCurrentLocation(formMetaData, updatedElementLocation);
}

/**
 * Removes the element from where it currently exists in preparation for the move
 * WARNING: This function has side effects on the formMetaData passed in.
 * @param formMetaData
 * @param draggedItemProps
 * @returns {*}
 */
function removeElementFromCurrentLocation(formMetaData, location) {
    let {tabIndex, sectionIndex, columnIndex, elementIndex} = location;

    let column = formMetaData.tabs[tabIndex].sections[sectionIndex].columns[columnIndex];

    column.elements = column.elements.filter(element => {
        return element.orderIndex !== elementIndex;
    });

    updateOrderIndices(column, 'elements');
    clearEmptyElementsFromSection(formMetaData, tabIndex, sectionIndex, columnIndex);

    return formMetaData;
}

function swapFieldLocation(formMetaData, currentLocation, newLocation) {
    let {tabIndex, sectionIndex, columnIndex, elementIndex} = currentLocation;

    let newElementIndex = elementIndex + newLocation;

    let column = formMetaData.tabs[tabIndex].sections[sectionIndex].columns[columnIndex];

    let swappedElement = column.elements[newElementIndex];
    column.elements[newElementIndex] = column.elements[elementIndex];
    column.elements[elementIndex] = swappedElement;

    updateOrderIndices(column, 'elements');

    return formMetaData;
}

/**
 * Adds the element to its new position
 * WARNING: This function has side effects on the formMetaData passed in.
 * @param formMetaData
 * @param newLocation
 * @param draggedItemProps
 * @param sameRow
 */
function addElementToNewLocation(formMetaData, newLocation, draggedItemProps) {
    let {tabIndex, sectionIndex, columnIndex, elementIndex} = newLocation;
    let columns = formMetaData.tabs[tabIndex].sections[sectionIndex].columns;
    let column = columns[columnIndex];

    if (!column) {
        column = buildNewColumn(columns.length);
        columns.push(column);
    }

    column.elements.splice(elementIndex, 0, draggedItemProps.containingElement);
    updateOrderIndices(column, 'elements');

    return formMetaData;
}

/**
 * Removes any empty columns or rows from a section
 * WARNING: This function has side effects on the formMetaData passed in.
 * @param formMetaData
 * @param tabIndex
 * @param sectionIndex
 * @param columnIndex
 * @returns {*}
 */
function clearEmptyElementsFromSection(formMetaData, tabIndex, sectionIndex, columnIndex) {
    let columns = formMetaData.tabs[tabIndex].sections[sectionIndex].columns;
    let column = columns[columnIndex];

    if (column.elements.length === 0) {
        formMetaData.tabs[tabIndex].sections[sectionIndex].columns = columns.filter(currentColumn => currentColumn.orderIndex !== columnIndex);
        updateOrderIndices(formMetaData.tabs[tabIndex].sections[sectionIndex], 'columns');
    }

    return formMetaData;
}

function buildNewColumn(numberOfExistingColumns) {
    return {
        id: _.uniqueId('column-'),
        orderIndex: numberOfExistingColumns,
        elements: []
    };
}

/**
 * Update the order indexes for an array of elements. Pass in the parent and the name of the property that holds the array
 * that needs to be re-indexed.
 * @param item
 * @param property
 * @returns {*}
 */
function updateOrderIndices(item, property) {
    if (item[property].length === 0) {
        return item;
    }

    item[property].map((element, index) => {
        element.orderIndex = index;
        return element;
    });

    return item;
}

/**
 * Finds the location of the current element by id nested within the formMeta
 * @param formMeta
 * @param element
 * @returns {*}
 */
function findCurrentElementLocation(formMeta, element) {
    let tabIndex = 0;
    let sectionIndex = 0;
    let columnIndex = 0;
    let elementIndex = 0;
    let foundElement = null;

    // Use .some to improve efficiency of query. ".some" function will stop the loop as soon as it returns truthy.
    formMeta.tabs.some(tab => {
        tabIndex = tab.orderIndex;
        return tab.sections.some(section => {
            sectionIndex = section.orderIndex;
            return section.columns.some(column => {
                columnIndex = column.orderIndex;
                return column.elements.some(currentElement => {
                    elementIndex = currentElement.orderIndex;
                    foundElement = currentElement;
                    return currentElement.id === element.id;
                });
            });
        });
    });

    return (foundElement ? {tabIndex, sectionIndex, columnIndex, elementIndex} : undefined);
}

export default MoveFieldHelper;
