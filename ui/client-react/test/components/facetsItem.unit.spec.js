import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import FacetsAspect  from '../../src/components/facet/facetsAspect';
import FacetsItem  from '../../src/components/facet/facetsItem';
import FacetSelections  from '../../src/components/facet/facetSelections';
import {ListGroup, Panel, ListGroupItem} from 'react-bootstrap';


describe('FacetsItem functions', () => {
    'use strict';

    var I18nMessageMock = React.createClass({
        render: function() {
            return (
                <div>test</div>
            );
        }
    });

    beforeEach(() => {
        FacetsItem.__Rewire__('I18nMessage', I18nMessageMock);
        FacetsAspect.__Rewire__('I18nMessage', I18nMessageMock);
    });

    afterEach(() => {
        FacetsItem.__ResetDependency__('I18nMessage');
        FacetsAspect.__ResetDependency__('I18nMessage');
    });

    let component;
    let item = {
        id:22,
        name:"test",
        type:"TEXT",
        values:[{value:"a"}, {value:"b"}, {value:"c"}]
    };


    it('test render facetsItem', () => {
        component = TestUtils.renderIntoDocument(<FacetsItem facet={item}
                                                             fieldSelections={[]}
                                                             handleSelectValue={() => {}}
                                                             handleToggleCollapse={() => {}}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });


    it('test render facetsItem with selected values', () => {
        let selected = new FacetSelections();
        selected.addSelection(22, 'b');
        component = TestUtils.renderIntoDocument(<FacetsItem facet={item}
                                                             fieldSelections={selected.getFieldSelections(22)}
                                                             handleSelectValue={() => {}}
                                                             handleToggleCollapse={() => {}}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render facetsItem with selected values and clear a selection', () => {
        let selected = new FacetSelections();
        selected.addSelection(22, 'b');
        component = TestUtils.renderIntoDocument(<FacetsItem facet={item}
                                                             fieldSelections={selected.getFieldSelections(22)}
                                                             handleSelectValue={() => {}}
                                                             handleToggleCollapse={() => {}}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });


    it('test render facetsItem value selection', () => {
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

    it('test render facetsItem fieldname collapse ', () => {
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

    it('test render facetsItem clearFacet clear selects ', () => {
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



    it('test render no values', () => {
        let emptyItem = {
            id:55,
            name:"test",
            type:"TEXT",
            values:[]
        };

        component = TestUtils.renderIntoDocument(<FacetsItem facet={emptyItem}
                                                             fieldSelections={[]}
                                                             handleSelectValue={() => {}}
                                                             expanded={true}
                                                             handleToggleCollapse={() => {}}/>);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        expect(function() {TestUtils.findRenderedDOMComponentWithClass(component, 'noOptions');}).not.toThrow();
    });


    describe('FacetsItem functions', () => {
        let bigItem = {
            id: 55,
            name: "test",
            type: "TEXT",
            values: [{value: "a"}, {value: "b"}, {value: "c"}, {value: "d"}, {value: "e"}, {value: "f"}, {value: "g"}]
        };

        it('test render lots of values hidden', () => {
            component = TestUtils.renderIntoDocument(<FacetsItem facet={bigItem}
                                                                 fieldSelections={[]}
                                                                 handleSelectValue={() => {}}
                                                                 expanded={true}
                                                                 isRevealed={false}
                                                                 maxInitRevealed={4}
                                                                 handleToggleCollapse={() => {}}/>);
            expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
            expect(function() {
                TestUtils.findRenderedDOMComponentWithClass(component, 'listMore');
            }).not.toThrow();
        });


        it('test render lots of values shown', () => {

            component = TestUtils.renderIntoDocument(<FacetsItem facet={bigItem}
                                                                 fieldSelections={[]}
                                                                 handleSelectValue={() => {}}
                                                                 expanded={true}
                                                                 isRevealed={true}
                                                                 maxInitRevealed={4}
                                                                 handleToggleCollapse={() => {}}/>);
            expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
            expect(function() {
                TestUtils.findRenderedDOMComponentWithClass(component, 'listMore');
            }).toThrow();
        });

        it('test render lots of values hidden and clicked to reveal', () => {
            var callbacks = {
                handleRevealMore : function handleRevealMore(e, facet, value) {
                }
            };

            component = TestUtils.renderIntoDocument(<FacetsItem facet={bigItem}
                                                                 fieldSelections={[]}
                                                                 handleSelectValue={() => {}}
                                                                 handleRevealMore={() => callbacks.handleRevealMore()}
                                                                 expanded={true}
                                                                 isRevealed={false}
                                                                 maxInitRevealed={4}
                                                                 handleToggleCollapse={() => {}}
            />);
            expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

            spyOn(callbacks, 'handleRevealMore').and.callThrough();
            let moreButton =  TestUtils.findRenderedDOMComponentWithClass(component, 'listMore');
            TestUtils.Simulate.click(ReactDOM.findDOMNode(moreButton));
            expect(callbacks.handleRevealMore).toHaveBeenCalled();
        });

    });

    describe('facetsItem -- shouldComponentUpdate when any its props change', () => {
        var initialProps  = {
            facet : item,
            fieldSelections :new FacetSelections(),
            isRevealed: false,
            expanded : false
        };

        beforeEach(() => {
            component = TestUtils.renderIntoDocument(
                <FacetsItem facet={initialProps.facet}
                            expanded={initialProps.expanded}
                            isRevealed={initialProps.isRevealed}
                            fieldSelections={initialProps.fieldSelections}
                />);

        });

        afterEach(() => {
        });

        var dataProvider = [
            {
                test:'test filter change expanded',
                changes: function(prop) {
                    prop.expanded = true;
                }
            },
            {
                test:'test filter change isRevealed',
                changes: function(prop) {
                    prop.isRevealed = true;
                }
            },
            {
                test:'test filter change fieldSelections',
                changes: function(prop) {
                    let selected = new FacetSelections();
                    selected.addSelection(22, 'b');
                    prop.fieldSelections = selected;
                }
            },
        ];

        dataProvider.forEach(function(data) {
            it(data.test, function() {
                // no change initially
                expect(component.shouldComponentUpdate(component.props, component.state)).toBeFalsy();

                // change data prop
                let nextProps = _.clone(component.props, true);
                data.changes(nextProps);
                expect(component.shouldComponentUpdate(nextProps, component.state)).toBeTruthy();
            });
        });
    });


});

