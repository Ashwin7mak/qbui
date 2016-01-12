import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import ActionIcon  from '../../src/components/actions/actionIcon';

describe('ActionIcon functions', () => {
    'use strict';

    let component;


    it('test render with hicon', () => {
        component = TestUtils.renderIntoDocument(<ActionIcon tip="tooltip" icon="email"/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render with glyphicon', () => {
        component = TestUtils.renderIntoDocument(<ActionIcon tip="tooltip" glyph="search"/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render with onclick', () => {
        let clicked = false;
        component = TestUtils.renderIntoDocument(<ActionIcon tip="tooltip" glyph="search" onClick={()=>{clicked = true;}}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        const link = TestUtils.findRenderedDOMComponentWithTag(component, "a").getDOMNode();
        TestUtils.Simulate.click(link);
        expect(clicked).toBe(true);

    });
});

