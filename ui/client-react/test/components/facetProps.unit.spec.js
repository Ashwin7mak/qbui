import React from 'react';
import {facetItemValueShape, facetShape, fieldSelections, facetsProp, validSelectionHashMap} from '../../src/components/facet/facetProps';

describe('FacetProps', () => {
    'use strict';

    it('test facetItemValueShape', () => {
        expect(facetItemValueShape).not.toBe(null);
        expect(facetItemValueShape.isRequired).not.toBe(null);
    });


    it('test facetShape', () => {
        expect(facetShape).not.toBe(null);
        expect(facetShape.isRequired).not.toBe(null);
    });


    it('test fieldSelections', () => {
        expect(fieldSelections).not.toBe(null);
        expect(fieldSelections.isRequired).not.toBe(null);
    });


    it('test facetsProp', () => {
        expect(facetsProp).not.toBe(null);
    });

    it('test validSelectionHashMap is an array', () => {
        expect(validSelectionHashMap).not.toBe(null);
        let result = validSelectionHashMap({testType: [1, 3, 4]}, 'testType', 'test', 'prop', 'testType');
        expect(result).toBe(null);
    });

    it('negative test validSelectionHashMap obj is a array ', () => {
        expect(validSelectionHashMap).not.toBe(null);
        let result = validSelectionHashMap({testType: {a: 1}}, 'testType', 'test', 'prop', 'testType');
        expect(result).not.toBe(null);
    });


});
