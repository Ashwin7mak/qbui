/**
 * Created by rbeyer on 12/15/16.
 */
import React from "react";
import TestUtils from "react-addons-test-utils";
import UrlFormulaFieldRenderer from "../../src/components/fields/urlFormulaFieldRenderer";

describe('UrlFormulaFieldRenderer: ', () => {
    'use strict';
    let component;

    it('test render of component', () => {
        component = TestUtils.renderIntoDocument(<UrlFormulaFieldRenderer />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render of component with no props', () => {
        component = TestUtils.renderIntoDocument(<UrlFormulaFieldRenderer />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let textFieldValueRenderer = TestUtils.findRenderedDOMComponentWithTag(component, 'div');
        expect(textFieldValueRenderer.classList.contains('emptyUrlFormula')).toBeTruthy();
    });

    it('test render of component with value prop', () => {
        let text = "some text";
        component = TestUtils.renderIntoDocument(<UrlFormulaFieldRenderer value={text}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let textFieldValueRenderer = TestUtils.findRenderedDOMComponentWithTag(component, 'div');
        expect(textFieldValueRenderer.classList.contains('filledUrlFormula')).toBeTruthy();
    });
});
