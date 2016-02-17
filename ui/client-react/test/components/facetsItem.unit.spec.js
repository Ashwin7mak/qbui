import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import FacetsItem  from '../../src/components/facet/facetsItem';
import FacetSelections  from '../../src/components/facet/facetSelections';

describe('FacetItem functions', () => {
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
                                                             fieldSelections={{}}
                                                             handleSelectValue={() => {}}
                                                             handleToggleCollapse={() => {}}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });


    it('test render facetItem with selected values', () => {
        let selected = new FacetSelections();
        selected.addSelection(22, 'b');
        component = TestUtils.renderIntoDocument(<FacetsItem facet={item}
                                                             fieldSelections={selected.getSelections()}
                                                             handleSelectValue={() => {}}
                                                             handleToggleCollapse={() => {}}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render facetItem with selected values and clear a selection', () => {
        let selected = new FacetSelections();
        selected.addSelection(22, 'b');
        component = TestUtils.renderIntoDocument(<FacetsItem facet={item}
                                                             fieldSelections={selected.getSelections()}
                                                             handleSelectValue={() => {}}
                                                             handleToggleCollapse={() => {}}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

});

