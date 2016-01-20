import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import FacetsItem  from '../../src/components/facets/facetsItem';

describe('facetItem functions', () => {
    'use strict';

    let component;

    it('test render', () => {
        component = TestUtils.renderIntoDocument(<FacetsItem/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });
});

