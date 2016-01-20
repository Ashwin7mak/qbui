import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import FacetsItem  from '../../src/components/facet/facetsItem';

describe('facetItem functions', () => {
    'use strict';

    let component;
    let item = {
        fid:22,
        name:"test",
        values:["a", "b", "c"]
    };
    it('test render facetItem', () => {
        component = TestUtils.renderIntoDocument(<FacetsItem facet={item}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });
    //TODO

});

