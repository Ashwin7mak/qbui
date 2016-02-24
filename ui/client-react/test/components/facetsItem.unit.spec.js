import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import FacetsItem  from '../../src/components/facet/facetsItem';
import FacetSelections  from '../../src/components/facet/facetSelections';
import {ListGroup, Panel, ListGroupItem} from 'react-bootstrap';

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
                                                             fieldSelections={[]}
                                                             handleSelectValue={() => {}}
                                                             handleToggleCollapse={() => {}}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });


    it('test render facetItem with selected values', () => {
        let selected = new FacetSelections();
        selected.addSelection(22, 'b');
        component = TestUtils.renderIntoDocument(<FacetsItem facet={item}
                                                             fieldSelections={selected.getFieldSelections(22)}
                                                             handleSelectValue={() => {}}
                                                             handleToggleCollapse={() => {}}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render facetItem with selected values and clear a selection', () => {
        let selected = new FacetSelections();
        selected.addSelection(22, 'b');
        component = TestUtils.renderIntoDocument(<FacetsItem facet={item}
                                                             fieldSelections={selected.getFieldSelections(22)}
                                                             handleSelectValue={() => {}}
                                                             handleToggleCollapse={() => {}}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });


    it('test render facetItem value selection', () => {
        let selected = new FacetSelections();
        var callbacks = {
            handleSelectValue : function handleSelectValue(e, facet, value) {
            }
        };

        let element = (<FacetsItem facet={item}
                                   expanded={true}
                                   fieldSelections={[]}
                                   handleSelectValue={() => callbacks.handleSelectValue()}/>);
        component = TestUtils.renderIntoDocument(element);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        //click on field name to expand, values only rendered when expanded
        let facetName;
        expect(function() {facetName = TestUtils.findRenderedDOMComponentWithClass(component, 'facetName');}).not.toThrow();

        // check that facets values are there
        let items = TestUtils.scryRenderedComponentsWithType(component, ListGroupItem);
        expect(items.length).toBe(item.values.length);
        spyOn(callbacks, 'handleSelectValue').and.callThrough();

        // select first
        TestUtils.Simulate.click(ReactDOM.findDOMNode(items[0]));
        expect(callbacks.handleSelectValue).toHaveBeenCalled();

    });

    it('test render facetItem fieldname collapse ', () => {
        let selected = new FacetSelections();
        var callbacks = {
            handleToggleCollapse: function handleToggleCollapse() {
            }
        };

        component = TestUtils.renderIntoDocument(<FacetsItem facet={item}
                                                             fieldSelections={[]}
                                                             handleToggleCollapse={() => callbacks.handleToggleCollapse()}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let facetName;
        expect(function() {facetName = TestUtils.findRenderedDOMComponentWithClass(component, 'facetName');}).not.toThrow();
        spyOn(callbacks, 'handleToggleCollapse').and.callThrough();
        TestUtils.Simulate.click(ReactDOM.findDOMNode(facetName));
        expect(callbacks.handleToggleCollapse).toHaveBeenCalled();

    });

    it('test render facetItem clearFacet clear selects ', () => {
        let selected = new FacetSelections();
        selected.addSelection(22, 'b');
        selected.addSelection(22, 'c');

        var callbacks = {
            handleClearFieldSelects: function handleClearFieldSelects() {
            }
        };

        component = TestUtils.renderIntoDocument(<FacetsItem facet={item}
                                                             expanded={true}
                                                             fieldSelections={selected.getFieldSelections(22)}
                                                             handleClearFieldSelects={() => callbacks.handleClearFieldSelects()}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        let clearFacet;
        expect(function() {clearFacet = TestUtils.findRenderedDOMComponentWithClass(component, 'clearFacet');}).not.toThrow();
        spyOn(callbacks, 'handleClearFieldSelects').and.callThrough();
        TestUtils.Simulate.mouseDown(ReactDOM.findDOMNode(clearFacet));
        expect(callbacks.handleClearFieldSelects).toHaveBeenCalled();

    });

});

