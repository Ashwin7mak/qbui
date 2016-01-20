import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import FilterSearchBox  from '../../src/components/facet/filterSearchBox';

describe('facetSearchBox functions', () => {
    'use strict';

    let component;

    it('test render FilterSearchBox', () => {
        component = TestUtils.renderIntoDocument(<FilterSearchBox/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });
    //TODO
});

