import _ from 'lodash';
import {findFormElementKey} from '../../utils/formUtils';

/**
 * Final data structure:
 * formMeta: {
 *     tabs: [{
 *         sections: [{
 *             columns: [{ <- Columns are not currently implemented on EE/Node layer
 *                 rows: [{ <- Rows are not supported on the server. These are determined based on an elements positionSameRow property.
 *                     elements: []
 *                 }]
 *             }]
 *         }]
 *     }]
 * }
 * @param formData
 * @returns {*}
 */
export function convertFormToArrayForClient(formData) {
    // If it is not likely good formMeta data, then return it without trying to transform
    if (!_.has(formData, 'formMeta.tabs')) {
        return formData;
    }

    let formDataCopy = _.cloneDeep(formData);

    formDataCopy.formMeta.tabs = convertTabsToArrayStructure(formDataCopy.formMeta.tabs);
    formDataCopy.formMeta.tabs = _.sortBy(formDataCopy.formMeta.tabs, 'orderIndex');

    return formDataCopy;
}


/**
 * Final data structure:
 * formMeta: {
 *   tabs: {
 *      0: {
 *        sections: {
 *          0: {
 *            elements: {
 *               0: {
 *                  // Element
 *               }
 *            }
 *          }
 *        }
 *      }
 *   }
 * }
 * @param formMeta
 * @returns {*}
 */
export function convertFormToObjectForServer(formMeta) {
    // If it is not likely good formMeta data, then return it without trying to transform
    if (!_.has(formMeta, 'tabs')) {
        return formMeta;
    }

    let copyFormMeta = _.cloneDeep(formMeta);

    let tabs = {};

    copyFormMeta.tabs.forEach((tab, index) => {
        tab.sections = convertSectionsToObjectStructure(tab);

        // Remove keys added for use in the client UI
        delete tab.id;

        tabs[index] = tab;
    });

    copyFormMeta.tabs = tabs;

    return copyFormMeta;
}

// -- PRIVATE FUNCTIONS --

/**
 * Currently the server returns a section with a property of elements so we can check that directly.
 * If element structure changes to match UI structure, this function may need to deeply check for elements in a section.
 * section -> columns -> rows -> elements (if any row, in any column, has an element, then this is false)
 * @param section
 * @returns {boolean}
 */
function isSectionEmpty(section) {
    return (section.elements.length === 0);
}

/**
 * Adds an element to a column
 * WARNING: Has side effects on section and column
 * @param section
 * @param column
 * @param elementKey
 */
function addElement(section, column, elementKey) {
    let element = section.elements[elementKey];
    element.id = _.uniqueId('element-');

    // Element hasn't been added to the column yet, so we don't subtract one from the length for 0 based index of row.elements
    element.orderIndex = column.elements.length;

    column.elements.push(element);

    return column;
}

/**
 * Convert section Object into an array where each section has the following structure
 *
 * @param tab
 * @param sectionKey
 * @returns {*}
 */
function convertSectionsToArrayWithColumnsOfElement(tab, sectionKey) {
    let section = tab.sections[sectionKey];

    // Assume a single column for now. Once columns are officially implemented we would get columns from the
    // data returned from the Node layer
    section.columns = [{elements: [], orderIndex: 0, id: _.uniqueId('column-')}];

    Object.keys(section.elements).forEach(elementKey => {
        addElement(section, section.columns[0], elementKey);
    });

    section.id = _.uniqueId('section-');
    section.isEmpty = isSectionEmpty(section);

    return section;
}

/**
 * Create the array based structure for tabs
 * WARNING: Has side effects on tab.sections.
 * @param tabs
 * @returns {Array}
 */
function convertTabsToArrayStructure(tabs) {
    return Object.keys(tabs).map(tabKey => {
        let tab = tabs[tabKey];

        tab.sections = Object.keys(tab.sections).map(sectionKey => {
            return convertSectionsToArrayWithColumnsOfElement(tab, sectionKey);
        });

        tab.sections = _.sortBy(tab.sections, 'orderIndex');

        // delete tab.sections;
        tab.id = _.uniqueId('tab-');
        return tab;
    });
}

/**
 * Convert the section array based layout to the one currently supported by the server in which the section only has an elements property
 * @param section
 * @returns {Array}
 */
function removeColumnsAndRowsFrom(section) {
    let elements = [];

    // Only ever one column for now until server supports columns
    section.columns.forEach(column => {
        column.elements.forEach((element, elementIndex) => {
            let formElementKey = findFormElementKey(element);
            if (formElementKey) {
                element[formElementKey].positionSameRow = (elementIndex > 0);
            }

            delete element.id;
            elements.push(element);
        });
    });

    return elements;
}

/**
 * Converts each tab to an object-based structure for the server from the array-structure used on the client
 * WARNING: Has side effects on tab and its child elements
 * @param tab
 * @returns {Array|*}
 */
function convertSectionsToObjectStructure(tab) {
    let sections = {};

    tab.sections.forEach((section, sectionIndex) => {
        let elements = removeColumnsAndRowsFrom(section);

        // We need to get all the deeply nested elements before we can accurately re-key them in order. That
        // is why elements is first an array, and then converted to an object last.
        let elementsObject = {};
        elements.forEach((element, elementIndex) => {
            delete element.orderIndex;
            elementsObject[elementIndex] = element;
        });

        // We are going to delete the pointer in the next step, so we need to make a copy first.
        section.elements = _.cloneDeep(elementsObject);

        // Remove keys added for use in the UI
        delete section.columns;
        delete section.rows;
        delete section.id;
        delete section.isEmpty;

        sections[sectionIndex] = section;
    });

    return sections;
}
