import _ from 'lodash';
import Logger from '../../utils/logger';

/**
 * A helper class to move a field from one location in teh FormMetaData to another place in the data.
 * @type {{moveField}}
 */
const MoveFieldHelper = {
    moveField(formMeta, newTabIndex, newSectionIndex, newColumnIndex, newRowIndex, newElementIndex, draggedItemProps, sameRow = false) {
        if (!hasRequiredArguments(formMeta, newTabIndex, newSectionIndex, newColumnIndex, newRowIndex, newElementIndex, draggedItemProps)) {
            return formMeta;
        }

        let formMetaCopy = _.cloneDeep(formMeta);

        removeElementFromCurrentLocation(formMetaCopy, draggedItemProps);
        addElementToNewLocation(formMetaCopy, newTabIndex, newSectionIndex, newColumnIndex, newRowIndex, newElementIndex, draggedItemProps, sameRow);

        return formMetaCopy;
    }
};

// -- PRIVATE METHODS
function hasRequiredArguments(formMeta, newTabIndex, newSectionIndex, newColumnIndex, newRowIndex, newElementIndex, draggedItemProps) {
    let errors = [];
    const baseMessage = 'MoveFieldHelper Error:';

    if (!formMeta || !_.isObject(formMeta)) {
        errors.push(`${baseMessage} formMeta is required and must be an object`);
    }

    if (!_.isInteger(newTabIndex) || !_.isInteger(newSectionIndex) || !_.isInteger(newColumnIndex) || !_.isInteger(newRowIndex) || !_.isInteger(newElementIndex)) {
        errors.push(`${baseMessage} newTabIndex, newSectionIndex, newColumnIndex, newRowIndex, and newOrderIndex are required and must be an integer`);
    }

    if (!draggedItemProps || !_.isObject(draggedItemProps)) {
        errors.push(`${baseMessage} draggedItemProps is required and must be an object`);
    } else {
        if (
            !_.has(draggedItemProps, 'location') ||
            !_.isInteger(draggedItemProps.location.sectionIndex) ||
            !_.isInteger(draggedItemProps.location.columnIndex) ||
            !_.isInteger(draggedItemProps.location.rowIndex) ||
            !_.isInteger(draggedItemProps.location.elementIndex) ||
            !_.isObject(draggedItemProps.element)
        )
        {
            errors.push(`${baseMessage} draggedItemProps must have the following properties: location (with tabIndex, sectionIndex, columnIndex, rowIndex, elementIndex) and element`);
        }
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
    let {tabIndex, sectionIndex, columnIndex, rowIndex, elementIndex} = draggedItemProps.location;

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
 * @param newTabIndex
 * @param newSectionIndex
 * @param newColumnIndex
 * @param newRowIndex
 * @param newElementIndex
 * @param draggedItemProps
 * @param sameRow
 */
function addElementToNewLocation(formMetaData, newTabIndex, newSectionIndex, newColumnIndex, newRowIndex, newElementIndex, draggedItemProps, sameRow) {
    let column = formMetaData.tabs[newTabIndex].sections[newSectionIndex].columns[newColumnIndex];
    let rows = column.rows;

    if (sameRow) {
        // TODO:: Deal with adding an element to the same row
    } else {
        rows.splice(newRowIndex, 0, createNewRow(newRowIndex, [draggedItemProps.element]));
        updateOrderIndices(column, 'rows');
    }

    return formMetaData;
}

/**
 * Removes any empty columns or rows from a sectin
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

function createNewRow(rowIndex, elements) {
    return {
        id: _.uniqueId('row-'),
        orderIndex: rowIndex,
        elements: elements.map((element, elementIndex) => {
            element.orderIndex = elementIndex;
            return element;
        })
    }
}

export default MoveFieldHelper;
