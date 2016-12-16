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
        let numericFieldValueRenderer = TestUtils.findRenderedDOMComponentWithTag(component, 'div');
        expect(numericFieldValueRenderer.classList.contains('emptyFormula')).toBeTruthy();
    });

    it('test render of component with value prop', () => {
        let numberStr = {numberStr: "123"};
        component = TestUtils.renderIntoDocument(<NumericFormulaFieldRenderer value={numberStr} display="123"/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let numericFormulaFieldRenderer = TestUtils.scryRenderedDOMComponentsWithClass(component, 'filledFormula');
        let numericFieldRenderer = TestUtils.scryRenderedDOMComponentsWithClass(component, 'numericField');
        expect(numericFormulaFieldRenderer.length).toEqual(1);
        expect(numericFieldRenderer.length).toEqual(1);
    });

    it('test render of component with display prop', () => {
        let numberStr = "1337";
        component = TestUtils.renderIntoDocument(<NumericFormulaFieldRenderer display={numberStr}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let numericFormulaFieldRenderer = TestUtils.scryRenderedDOMComponentsWithClass(component, 'filledFormula');
        let numericFieldRenderer = TestUtils.scryRenderedDOMComponentsWithClass(component, 'numericField');
        expect(numericFormulaFieldRenderer.length).toEqual(1);
        expect(numericFieldRenderer.length).toEqual(1);
    });

    it('test render of component with all props', () => {
        let numberStr = {numberStr: "123"};
        let moreNumberStr = "1337";
        component = TestUtils.renderIntoDocument(<NumericFormulaFieldRenderer value={numberStr} display={moreNumberStr}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let numericFormulaFieldRenderer = TestUtils.scryRenderedDOMComponentsWithClass(component, 'filledFormula');
        let numericFieldRenderer = TestUtils.scryRenderedDOMComponentsWithClass(component, 'numericField');
        expect(numericFormulaFieldRenderer.length).toEqual(1);
        expect(numericFieldRenderer.length).toEqual(1);
    });
});
