import _ from 'lodash';

/**
 * Final data structure:
 * formMeta: {
 *     tabs: [{
 *         sections: [{
 *             columns: [{ <- Columns are not currently implemented on EE/Node layer
 *                 rows: [{
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

    formDataCopy.formMeta.tabs = Object.keys(formData.formMeta.tabs).map(tabKey => {
        let tab = formData.formMeta.tabs[tabKey];

        tab.sections = Object.keys(tab.sections).map(sectionKey => {
            let section = tab.sections[sectionKey];

            section.rows = [];
            let currentRowIndex = -1;

            Object.keys(section.elements).forEach(elementKey => {
                let element = section.elements[elementKey];
                element.id = _.uniqueId('element-');

                if (!_.has(element, 'FormFieldElement') || !element.FormFieldElement.positionSameRow) {
                    currentRowIndex++;
                    section.rows.push({elements: [], orderIndex: currentRowIndex, id: _.uniqueId('row-')});
                }

                // Element hasn't been added to the last row, so we don't subtract one from the length for 0 based index of row.elements
                element.orderIndex = section.rows[section.rows.length - 1].elements.length;

                section.rows[currentRowIndex].elements.push(element);
            });

            // Assume a single column for now. Once columns are officially implemented we would get columns from the
            // data returned from the Node layer
            section.columns = [{rows: section.rows, orderIndex: 0, id: _.uniqueId('column-')}];
            section.id = _.uniqueId('section-');
            section.isEmpty = isSectionEmpty(section);

            return section;
        });

        tab.sections = _.sortBy(tab.sections, 'orderIndex');

        // delete tab.sections;
        tab.id = _.uniqueId('tab-');
        return tab;
    });

    formDataCopy.formMeta.tabs = _.sortBy(formDataCopy.formMeta.tabs, 'orderIndex');

    return formDataCopy;
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

export function convertFormToObjectForServer(formMeta) {
    // If it is not likely good formMeta data, then return it without trying to transform
    if (!_.has(formMeta, 'tabs')) {
        return formMeta;
    }

    let copyFormMeta = _.cloneDeep(formMeta);

    let tabs = {};

    copyFormMeta.tabs.forEach((tab, index) => {
        let sections = {};

        tab.sections.forEach((section, sectionIndex) => {
            let elements = [];

            // Only ever one column for now until server supports columns
            let rows = section.columns[0].rows;
            rows.forEach(row => {
                row.elements.forEach((element, elementIndex) => {
                    // We don't know what type of element this might be (FormFieldElement, HeaderElement, FormTextElement, etc.)
                    // so we are going to find it via duck typing. If it has a positionSameRow attribute, that is the one we want.
                    let formElementKey = Object.keys(element).find(key => {
                        return (element[key].positionSameRow !== undefined);
                    });

                    if (formElementKey) {
                        element[formElementKey].positionSameRow = (elementIndex > 0);
                    }

                    delete element.id;
                    elements.push(element);
                });
            });

            // We need to get all the deeply nested elements before we can accurately re-key them in order. That
            // is why elements is first an array, and then converted to an object last.
            let elementsObject = {};
            elements.forEach((element, elementIndex) => elementsObject[elementIndex] = element);

            // We are going to delete the pointer in the next step, so we need to make a copy first.
            section.elements = _.cloneDeep(elementsObject);

            delete section.columns;
            delete section.id;
            delete section.isEmpty;
            sections[sectionIndex] = section;
        });

        tab.sections = sections;
        delete tab.id;
        tabs[index] = tab;
    });

    copyFormMeta.tabs = tabs;

    return copyFormMeta;
}
