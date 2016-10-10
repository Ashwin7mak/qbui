'use strict';

module.exports = TestUtils => ({
    toBeElement: () => ({
        compare: component =>
            ({pass: TestUtils.isElement(component)})
    }),


    toBeElementType: () => ({
        compare: (component, componentType) =>
            ({pass: TestUtils.isElementOfType(component, componentType)})
    }),


    toBeDom: () => ({
        compare: component =>
            ({pass: TestUtils.isDOMComponent(component)})
    }),


    toBeComponent: () => ({
        compare: component =>
            ({pass: TestUtils.isCompositeComponent(component)})
    }),


    toBeComponentType: () => ({
        compare: (component, componentType) =>
            ({pass: TestUtils.isCompositeComponentWithType(component, componentType)})
    }),


    /**
     * Validate if element's DOM node has text or matches the text regex
     */
    toHaveText: () => ({
        compare: (element, text) => {
            const regexp = text instanceof RegExp ? text : new RegExp(text, 'ig');
            let node = element;
            if (!TestUtils.isDOMComponent(element)) {
                node = element.getDOMNode();
            }
            const pass = node.textContent.match(regexp);
            const message = pass ?
                `Text "${text}" is found within an element` :
                `Text "${text}" is not found within an element`;
            return {pass, message};
        }
    })
});
