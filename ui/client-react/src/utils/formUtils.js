import _ from 'lodash';

/**
 * The data structure of the formMeta has elements (array) of element. Element has a property, but it changes depending on the type.
 * E.g., Element.FormFieldElement.positionSameRow or Element.FormTextElement.positionSameRow
 * We don't know what type of element this might be (FormFieldElement, HeaderElement, FormTextElement, etc.)
 * so we are going to find it via duck typing. If it has a positionSameRow attribute, that is the one we want.
 * Returns the element key or undefined.
 * @param element
 * @returns {*}
 */
export function findFormElementKey(element) {
    if (!element || !_.isObject(element)) {
        return undefined;
    }

    return Object.keys(element).find(key => {
        return (element[key].positionSameRow !== undefined);
    });
}