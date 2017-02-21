import _ from 'lodash';

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
            sections[sectionIndex] = section;
        });

        tab.sections = sections;
        delete tab.id;
        tabs[index] = tab;
    });

    copyFormMeta.tabs = tabs;

    return copyFormMeta;
}
