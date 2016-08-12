import React from 'react';
import TestUtils from 'react-addons-test-utils';

import TextField  from '../../src/components/fields/textField';

describe('TextField functions', () => {
    'use strict';
    var matchers = require('../reactJasmine');
    beforeEach(function() {
        jasmine.addMatchers(matchers(TestUtils));
    });
    let component;

    it('test render of component', () => {
        component = TestUtils.renderIntoDocument(<TextField />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render of component with value', () => {
        let text = "testing testing 1 2 3";
        component = TestUtils.renderIntoDocument(<TextField value={text}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        const textField = TestUtils.findRenderedDOMComponentWithTag(component, 'div');
        expect(textField).toHaveText(text);
    });

    it('test render of component with bold', () => {
        let text = "some text";
        component = TestUtils.renderIntoDocument(<TextField value={text} isBold={true}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let textField = TestUtils.findRenderedDOMComponentWithTag(component, 'div');
        expect(textField.classList.contains('bold')).toBeTruthy();
    });

});
