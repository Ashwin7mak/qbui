import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import ActionIcon  from '../../src/components/actions/actionIcon';

describe('ActionIcon functions', () => {
    'use strict';

    let component;


    it('test render with qbicon', () => {
        component = TestUtils.renderIntoDocument(<ActionIcon tip="tooltip" icon="email"/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });



    it('test render with onclick', () => {
        let clicked = false;
        component = TestUtils.renderIntoDocument(<ActionIcon tip="tooltip" icon="search" onClick={()=>{clicked = true;}}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

        const link = TestUtils.findRenderedDOMComponentWithTag(component, "a");
        TestUtils.Simulate.click(link);
        expect(clicked).toBe(true);

    });
});

