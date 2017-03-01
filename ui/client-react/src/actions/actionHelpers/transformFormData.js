import _ from 'lodash';

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
 * We don't know what type of element this might be (FormFieldElement, HeaderElement, FormTextElement, etc.)
 * so we are going to find it via duck typing. If it has a positionSameRow attribute, that is the one we want.
 * Returns the element key or undefined.
 * @param element
 * @returns {*}
 */
function findFormElementKey(element) {
    return Object.keys(element).find(key => {
        return (element[key].positionSameRow !== undefined);
    });
}

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
 * Transforms the section.elements object into an array of rows that contain arrays of elements based on positionSameRow property
 * WARNING: Has side effects on section
 * @param section
 * @param currentRowIndex
 * @param elementKey
 */
function putElementsIntoRowsAndReIndex(section, currentRowIndex, elementKey) {
    let element = section.elements[elementKey];
    element.id = _.uniqueId('element-');

    // We need to use duck typing to find out if an element should be placed on a new row, because we don't know ahead of
    // time what the key is going to be (Could be FormFieldElement, FormHeaderElement, FormTextElement, etc.)
    let formElementKey = findFormElementKey(element);

    if (!formElementKey || !element[formElementKey].positionSameRow) {
        currentRowIndex++;
        section.rows.push({elements: [], orderIndex: currentRowIndex, id: _.uniqueId('row-')});
    }

    // Element hasn't been added to the last row, so we don't subtract one from the length for 0 based index of row.elements
    element.orderIndex = section.rows[section.rows.length - 1].elements.length;

    section.rows[currentRowIndex].elements.push(element);

    return currentRowIndex;
}

/**
 * Convert section Object into an array where each section has the following structure
 *
 * @param tab
 * @param sectionKey
 * @returns {*}
 */
function convertSectionsToArrayWithColumnsAndRowsOfElement(tab, sectionKey) {
    let section = tab.sections[sectionKey];

    section.rows = [];
    let currentRowIndex = -1;

    Object.keys(section.elements).forEach(elementKey => {
        currentRowIndex = putElementsIntoRowsAndReIndex(section, currentRowIndex, elementKey);
    });

    // Assume a single column for now. Once columns are officially implemented we would get columns from the
    // data returned from the Node layer
    section.columns = [{rows: section.rows, orderIndex: 0, id: _.uniqueId('column-')}];
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
            return convertSectionsToArrayWithColumnsAndRowsOfElement(tab, sectionKey);
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
    let rows = section.columns[0].rows;
    rows.forEach(row => {
        row.elements.forEach((element, elementIndex) => {
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
