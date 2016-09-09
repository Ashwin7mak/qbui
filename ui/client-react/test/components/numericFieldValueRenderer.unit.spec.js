import React from 'react';
import TestUtils from 'react-addons-test-utils';

import NumericFieldValueRenderer  from '../../src/components/fields/numericFieldValueRenderer';

describe('NumericFieldValueRenderer functions', () => {
    'use strict';
    var matchers = require('../reactJasmine');
    beforeEach(function() {
        jasmine.addMatchers(matchers(TestUtils));
    });
    let component;

    it('test render of component', () => {
        component = TestUtils.renderIntoDocument(<NumericFieldValueRenderer />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render of component with value', () => {
        let number = 23456;
        component = TestUtils.renderIntoDocument(<NumericFieldValueRenderer value={number}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        const numericFieldValueRenderer = TestUtils.findRenderedDOMComponentWithTag(component, 'div');
        expect(numericFieldValueRenderer).toHaveText(number);
    });

    it('test render of component with bold', () => {
        let number = 23456;
        component = TestUtils.renderIntoDocument(<NumericFieldValueRenderer value={number} isBold={true}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let numericFieldValueRenderer = TestUtils.findRenderedDOMComponentWithTag(component, 'div');
        expect(numericFieldValueRenderer.classList.contains('bold')).toBeTruthy();
    });

});
