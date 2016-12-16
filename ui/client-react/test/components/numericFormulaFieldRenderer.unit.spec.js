/**
 * Created by rbeyer on 12/15/16.
 */
import React from "react";
import TestUtils from "react-addons-test-utils";
import NumericFormulaFieldRenderer from "../../src/components/fields/numericFormulaFieldRenderer";

describe('NumericFormulaFieldRenderer: ', () => {
    'use strict';
    let component;

    it('test render of component', () => {
        component = TestUtils.renderIntoDocument(<NumericFormulaFieldRenderer />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render of component with no props', () => {
        component = TestUtils.renderIntoDocument(<NumericFormulaFieldRenderer />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let textFieldValueRenderer = TestUtils.findRenderedDOMComponentWithTag(component, 'div');
        expect(textFieldValueRenderer.classList.contains('emptyNumericFormula')).toBeTruthy();
    });

    it('test render of component with value prop', () => {
        let numberStr = {numberStr: "123"};
        component = TestUtils.renderIntoDocument(<NumericFormulaFieldRenderer value={numberStr}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let textFieldValueRenderer = TestUtils.findRenderedDOMComponentWithTag(component, 'div');
        expect(textFieldValueRenderer.classList.contains('filledNumericFormula')).toBeTruthy();
    });

    it('test render of component with display prop', () => {
        let numberStr = "1337";
        component = TestUtils.renderIntoDocument(<NumericFormulaFieldRenderer display={numberStr}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let textFieldValueRenderer = TestUtils.findRenderedDOMComponentWithTag(component, 'div');
        expect(textFieldValueRenderer.classList.contains('filledNumericFormula')).toBeTruthy();
    });

    it('test render of component with all props', () => {
        let numberStr = {numberStr: "123"};
        let moreNumberStr = "1337";
        component = TestUtils.renderIntoDocument(<NumericFormulaFieldRenderer value={numberStr} display={moreNumberStr}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let textFieldValueRenderer = TestUtils.findRenderedDOMComponentWithTag(component, 'div');
        expect(textFieldValueRenderer.classList.contains('filledNumericFormula')).toBeTruthy();
    });
});
