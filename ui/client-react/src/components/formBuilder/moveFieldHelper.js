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

        removeElementFromCurrentLocation(formMetaCopy, draggedItemProps);
        addElementToNewLocation(formMetaCopy, newLocation, draggedItemProps);

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
        !_.isInteger(newLocation.rowIndex) ||
        !_.isInteger(newLocation.elementIndex)
    ) {
        errors.push(`${baseMessage} newLocation is missing or missing props: newTabIndex, newSectionIndex, newColumnIndex, newRowIndex, and newOrderIndex are required and must be an integer`);
    }

    if (!draggedItemProps || !_.isObject(draggedItemProps)) {
        errors.push(`${baseMessage} draggedItemProps is required and must be an object`);
    }

    if (
        draggedItemProps && (
            !_.has(draggedItemProps, 'location') ||
            !_.isInteger(draggedItemProps.location.sectionIndex) ||
            !_.isInteger(draggedItemProps.location.columnIndex) ||
            !_.isInteger(draggedItemProps.location.rowIndex) ||
            !_.isInteger(draggedItemProps.location.elementIndex) ||
            !_.isObject(draggedItemProps.element)
        )
    ) {
        errors.push(`${baseMessage} draggedItemProps must have the following properties: location (with tabIndex, sectionIndex, columnIndex, rowIndex, elementIndex) and element`);
    }


    let logger = new Logger(); // Rewire won't work during testing if this is defined at the top of the file
    errors.forEach(error => logger.error(error));

    return (errors.length === 0);
}

/**
 * Removes the element from where it currently exists in preparation for the move
 * WARNING: This function has side effects on the formMetaData passed in.
 * @param formMetaData
 * @param draggedItemProps
 * @returns {*}
 */
function removeElementFromCurrentLocation(formMetaData, draggedItemProps) {
    let updatedElementLocation = findCurrentElementLocation(formMetaData, draggedItemProps.containingElement);

    if (!updatedElementLocation) {
        // Element doesn't yet appear on the form so we can safely return the existing formMetaData without removing anything
        return formMetaData;
    }

    let {tabIndex, sectionIndex, columnIndex, rowIndex, elementIndex} = updatedElementLocation;

    let row = formMetaData.tabs[tabIndex].sections[sectionIndex].columns[columnIndex].rows[rowIndex];

    row.elements = row.elements.filter(element => {
        return element.orderIndex !== elementIndex;
    });

    updateOrderIndices(row, 'elements');
    clearEmptyElementsFromSection(formMetaData, tabIndex, sectionIndex, columnIndex);

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
    let {tabIndex, sectionIndex, columnIndex, rowIndex, elementIndex} = newLocation;
    let column = formMetaData.tabs[tabIndex].sections[sectionIndex].columns[columnIndex];
    let rows = column.rows;

    rows.splice(rowIndex, 0, createNewRow(rowIndex, [draggedItemProps.containingElement]));
    updateOrderIndices(column, 'rows');

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

    if (column.rows.length === 0) {
        formMetaData.tabs[tabIndex].sections[sectionIndex].columns = columns.filter(currentColumn => currentColumn.orderIndex !== columnIndex);
        updateOrderIndices(formMetaData.tabs[tabIndex].sections[sectionIndex], 'columns');
    } else {
        column.rows = column.rows.filter(row => row.elements.length > 0);
        updateOrderIndices(column, 'rows');
    }

    return formMetaData;
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
 * Build a new row that holds an array of elements passed in as a second parameter.
 * @param rowIndex
 * @param elements
 * @returns {{id: (string|*), orderIndex: *, elements}}
 */
function createNewRow(rowIndex, elements) {
    return {
        id: _.uniqueId('row-'),
        orderIndex: rowIndex,
        elements: elements.map((element, elementIndex) => {
            element.orderIndex = elementIndex;
            return element;
        })
    };
}

/**
 * Finds the location of the current element nested within the formMeta
 * @param formMeta
 * @param element
 * @returns {*}
 */
function findCurrentElementLocation(formMeta, element) {
    let tabIndex = 0;
    let sectionIndex = 0;
    let columnIndex = 0;
    let rowIndex = 0;
    let elementIndex = 0;
    let foundElement = null;

    // Use .some to improve efficiency of query. Some function will stop the loop as soon as it returns truthy.
    formMeta.tabs.some(tab => {
        return tab.sections.some(section => {
            tabIndex = tab.orderIndex;
            return section.columns.some(column => {
                columnIndex = column.orderIndex;
                return column.rows.some(row => {
                    rowIndex = row.orderIndex;
                    return row.elements.some(currentElement => {
                        foundElement = currentElement;
                        return currentElement.id === element.id;
                    });
                })
            });
        });
    });

    return (foundElement ? {tabIndex, sectionIndex, columnIndex, rowIndex, elementIndex} : undefined);
}

export default MoveFieldHelper;
