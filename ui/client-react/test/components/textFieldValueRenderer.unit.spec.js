import React from 'react';
import TestUtils from 'react-addons-test-utils';

import TextFieldValueRenderer  from '../../src/components/fields/textFieldValueRenderer';

describe('TextFieldValueRenderer functions', () => {
    'use strict';
    var matchers = require('../reactJasmine');
    beforeEach(function() {
        jasmine.addMatchers(matchers(TestUtils));
    });
    let component;

    it('test render of component', () => {
        component = TestUtils.renderIntoDocument(<TextFieldValueRenderer />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render of component with value', () => {
        let text = "testing testing 1 2 3";
        component = TestUtils.renderIntoDocument(<TextFieldValueRenderer value={text}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        const textFieldValueRenderer = TestUtils.findRenderedDOMComponentWithTag(component, 'div');
        expect(textFieldValueRenderer).toHaveText(text);
    });

    it('test render of component with bold', () => {
        let text = "some text";
        component = TestUtils.renderIntoDocument(<TextFieldValueRenderer value={text} isBold={true}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let textFieldValueRenderer = TestUtils.findRenderedDOMComponentWithTag(component, 'div');
        expect(textFieldValueRenderer.classList.contains('bold')).toBeTruthy();
    });

});
