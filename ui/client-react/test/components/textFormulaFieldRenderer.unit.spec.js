/**
 * Created by rbeyer on 12/15/16.
 */
import React from "react";
import TestUtils from "react-addons-test-utils";
import TextFormulaFieldRenderer from "../../src/components/fields/textFormulaFieldRenderer";

describe('TextFormulaFieldRenderer: ', () => {
    'use strict';
    let component;

    it('test render of component', () => {
        component = TestUtils.renderIntoDocument(<TextFormulaFieldRenderer />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render of component with no props', () => {
        component = TestUtils.renderIntoDocument(<TextFormulaFieldRenderer />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let textFieldValueRenderer = TestUtils.findRenderedDOMComponentWithTag(component, 'div');
        expect(textFieldValueRenderer.classList.contains('emptyFormula')).toBeTruthy();
    });

    it('test render of component with value prop', () => {
        let text = "some text";
        component = TestUtils.renderIntoDocument(<TextFormulaFieldRenderer value={text}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let textFieldRenderer = TestUtils.scryRenderedDOMComponentsWithClass(component, 'textField');
        expect(textFieldRenderer.length).toEqual(1);
    });
});
