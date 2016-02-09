import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import FacetsItem  from '../../src/components/facet/facetsItem';

describe('facetItem functions', () => {
    'use strict';

    let component;
    let item = {
        id:22,
        name:"test",
        type:"text",
        values:[{value:"a"}, {value:"b"}, {value:"c"}]
    };

    it('test render facetItem', () => {
        component = TestUtils.renderIntoDocument(<FacetsItem facet={item}
                                                             handleSelectValue={() => {}}
                                                             handleToggleCollapse={() => {}}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });
    //TODO

});

