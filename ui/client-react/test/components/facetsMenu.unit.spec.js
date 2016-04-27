import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import FacetsAspect  from '../../src/components/facet/facetsAspect';
import FacetSelections  from '../../src/components/facet/facetSelections';
import FacetsItem  from '../../src/components/facet/facetsItem';
import FacetsList  from '../../src/components/facet/facetsList';
import FacetsMenu  from '../../src/components/facet/facetsMenu';
import facetMenuActions from '../../src/actions/facetMenuActions';
import Store from '../../src/stores/facetMenuStore';
import * as actions from '../../src/constants/actions';

import _ from 'lodash';
import Fluxxor from 'fluxxor';


describe('FacetsMenu functions', () => {
    'use strict';
    let stores = {
        FacetMenuStore:  new Store()
    };

    let flux = new Fluxxor.Flux(stores);
    flux.addActions(facetMenuActions);

    let component;
    let reportDataParams = {reportData: {loading:false}};
    const fakeReportData_valid = {
        data: {
            facets : [{id:1, name:'test', type:"TEXT",
                        values:[{value:"a"}, {value:"b"}, {value:"c"}]}
                ]
        }
    };
    const fakeReportDataNoFacets_valid = {
        data: {
            facets : []
        }
    };
    var I18nMessageMock = React.createClass({
        render() {
            return (
                <div>test</div>
            );
        }
    });

    beforeEach(() => {
        FacetsList.__Rewire__('I18nMessage', I18nMessageMock);
        FacetsItem.__Rewire__('I18nMessage', I18nMessageMock);
        FacetsAspect.__Rewire__('I18nMessage', I18nMessageMock);
        FacetsMenu.__Rewire__('I18nMessage', I18nMessageMock);
        flux.store('FacetMenuStore').initMenu();
    });

    afterEach(() => {
        FacetsList.__ResetDependency__('I18nMessage');
        FacetsItem.__ResetDependency__('I18nMessage');
        FacetsAspect.__ResetDependency__('I18nMessage');
        FacetsMenu.__ResetDependency__('I18nMessage');
    });

    let reportParams = {appId:1, tblId:2, rptId:3};

    it('test render FacetsMenu no facets', () => {
        component = TestUtils.renderIntoDocument(<FacetsMenu flux={flux} params={reportParams} popoverId="test"
                                                             reportData={reportDataParams} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test render FacetsMenu', () => {
        component = TestUtils.renderIntoDocument(<FacetsMenu flux={flux} params={reportParams} popoverId="test"
                                                             reportData={fakeReportData_valid} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });


    it('test render FacetsMenu with facets open', () => {
        component = TestUtils.renderIntoDocument(<FacetsMenu flux={flux} params={reportParams} popoverId="test"
                                                             allInitiallyCollapsed={false} reportData={fakeReportData_valid} />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });


    it('test render FacetsMenu click facet button', () => {
        component = TestUtils.renderIntoDocument(<FacetsMenu flux={flux}  params={reportParams} popoverId="test"
                                                             allInitiallyCollapsed={false}
                                                             reportData={fakeReportData_valid}
                                                             />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        expect(component.state.show).toBeFalsy();
        let facetButtons = TestUtils.findRenderedDOMComponentWithClass(component, "facetButtons");
        TestUtils.Simulate.click(facetButtons);
        expect(component.state.show).toBeTruthy();
    });

    describe('test render FacetsMenu no values', () => {
        let mountPoint;

        beforeEach(() => {
            mountPoint = document.createElement('div');
            document.body.appendChild(mountPoint);
        });

        afterEach(() => {
            ReactDOM.unmountComponentAtNode(mountPoint);
            document.body.removeChild(mountPoint);
        });

        it('no values message shows when there are no values', () => {

            component =  ReactDOM.render(<FacetsMenu flux={flux}  popoverId="test" params={reportParams}
                                                                 allInitiallyCollapsed={true}
                                                                 reportData={fakeReportDataNoFacets_valid}
            />, mountPoint);
            const testContainer = ReactDOM.findDOMNode(component);

            expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

            expect(component.state.show).toBeFalsy();

            let facetButtons = TestUtils.findRenderedDOMComponentWithClass(component, "facetButtons");
            TestUtils.Simulate.click(facetButtons);
            expect(component.state.show).toBeTruthy();

            //verify the no values message appears
            let noFacetValues =  document.getElementsByClassName("noFacetValues");
            expect(noFacetValues.length).toBe(1);
        });
    });

    it('test render FacetsMenu shows selection tokens', () => {
        let selected = new FacetSelections();
        selected.addSelection(1, 'a');
        selected.addSelection(1, 'c');
        var callbacks = {
            onFacetDeselect : function onFacetDeselect(e, facet, value) {
            }
        };
        component = TestUtils.renderIntoDocument(<FacetsMenu flux={flux}  params={reportParams}
                                                             popoverId="test"
                                                             allInitiallyCollapsed={false}
                                                             reportData={fakeReportData_valid}
                                                             selectedValues={selected}
                                                             onFacetDeselect={(e, facet, value) => callbacks.onFacetDeselect(e, facet, value)}
        />);
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
        expect(component.state.show).toBeFalsy();

        // selection tokens rendered
        let tokens = TestUtils.scryRenderedDOMComponentsWithClass(component, "selectedTokenName");
        expect(tokens.length).toEqual(2);

        //click on token doesn't deselects
        spyOn(callbacks, 'onFacetDeselect').and.callThrough();
        tokens = TestUtils.scryRenderedDOMComponentsWithClass(component, "selectedTokenName");
        TestUtils.Simulate.click(tokens[1]);
        expect(callbacks.onFacetDeselect).not.toHaveBeenCalled();

        //click on clear icon deselects
        let tokenClears = TestUtils.scryRenderedDOMComponentsWithClass(component, "clearFacet");
        TestUtils.Simulate.click(tokenClears[1]);
        expect(callbacks.onFacetDeselect).toHaveBeenCalledWith(jasmine.any(Object), jasmine.any(Object), 'c');
        callbacks.onFacetDeselect.calls.reset();

    });

    // todo update to handle wrapped component and click to show/collapse
    xdescribe('Expand/Collapse sections', () => {
        let mountPoint;

        beforeEach(() => {
            mountPoint = document.createElement('div');
            document.body.appendChild(mountPoint);
        });

        afterEach(() => {
            ReactDOM.unmountComponentAtNode(mountPoint);
            document.body.removeChild(mountPoint);
        });

        it('test render FacetsMenu click facet section expand ', () => {

            component = ReactDOM.render(<FacetsMenu flux={flux}  params={reportParams}
                                                                    allInitiallyCollapsed={true}
                                                                    reportData={fakeReportData_valid} />
                                                        , mountPoint);
            const testContainer = ReactDOM.findDOMNode(component);
            expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

            let facetsMenu = component;

            // show the menu
            var facetButtons = TestUtils.findRenderedDOMComponentWithClass(facetsMenu, 'facetButtons');
            TestUtils.Simulate.click(facetButtons);
            expect(facetsMenu.state.show).toBeTruthy();
            // expand the facet panel
            component.setFacetCollapsed({id:1}, false);

            // make sure it rendered
            var popupLists = document.getElementsByClassName('facetMenuPopup');
            expect(popupLists.length).toBe(1);
            let popupList = popupLists[0];
            //console.log("popupList expanded: " + popupList.innerHTML);

            // check that the field facet exists
            let facetPanels = popupList.getElementsByClassName('panel');
            expect(facetPanels.length).toBe(1);
            let facetPanel = facetPanels[0];

            //ensure its in the expanded list
            expect(_.includes(component.state.expandedFacetFields, 1)).toBeTruthy();

            let panelCollapses = facetPanel.getElementsByClassName('panel-collapse');
            expect(panelCollapses.length).toBe(1);

            //console.log("should expand " + panelCollapses.innerHTML);
            expect(panelCollapses[0].innerText).toBe('abc');
            //and not hidden
            expect(panelCollapses[0].style.height).not.toBe("0px");


        });


        it('test render FacetsMenu click facet section collapse ', () => {
            component = ReactDOM.render(<FacetsMenu flux={flux}  params={reportParams}
                                                    popoverId="test"
                                                    allInitiallyCollapsed={true}
                                                    reportData={fakeReportData_valid} />
                , mountPoint);
            const testContainer = ReactDOM.findDOMNode(component);
            expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

            let facetsMenu = component;

            // show the menu
            var facetButtons = TestUtils.findRenderedDOMComponentWithClass(facetsMenu, 'facetButtons');
            TestUtils.Simulate.click(facetButtons);
            expect(facetsMenu.state.show).toBeTruthy();

            // make sure it rendered
            var popupLists = document.getElementsByClassName('facetMenuPopup');
            expect(popupLists.length).toBe(1);
            let popupList = popupLists[0];

            // check that tht field facet exists
            let facetPanels = popupList.getElementsByClassName('panel');
            expect(facetPanels.length).toBe(1);
            let facetPanel = facetPanels[0];

            // expand the facet panel
            component.handleToggleCollapse(null, {id:1});
            // then collapse the facet panel
            component.handleToggleCollapse(null, {id:1});

            //ensure its not  the expanded list
            expect(_.includes(component.state.expandedFacetFields, 1)).toBeFalsy();

            // and not visible
            let panelCollapses = facetPanel.getElementsByClassName('panel-collapse');
            expect(panelCollapses.length).toBe(1);
            expect(panelCollapses[0].style.height).toBe("0px"); //collapsed height

        });
    });

    describe('Show More', () => {

        let mountPoint;
        const fakeReportLongData_valid = {
            data: {
                facets : [{id:1, name:'test', type:"TEXT",
                            values:[{value:"a"}, {value:"b"}, {value:"c"}, {value:"d"}, {value:"e"}, {value:"f"}]}
                ]
            }
        };
        beforeEach(() => {
            mountPoint = document.createElement('div');
            document.body.appendChild(mountPoint);
        });

        afterEach(() => {
            ReactDOM.unmountComponentAtNode(mountPoint);
            document.body.removeChild(mountPoint);
        });

        it('test render FacetsMenu click facet reveal', () => {

            component = ReactDOM.render(<FacetsMenu flux={flux}  params={reportParams}
                                                    popoverId="test"
                                                    allInitiallyCollapsed={false}
                                                    maxInitRevealed={4}
                                                    reportData={fakeReportLongData_valid} />
                , mountPoint);
            const testContainer = ReactDOM.findDOMNode(component);
            expect(TestUtils.isCompositeComponent(component)).toBeTruthy();

            let facetsMenu = component;

            // show the menu
            var facetButtons = TestUtils.findRenderedDOMComponentWithClass(facetsMenu, 'facetButtons');
            TestUtils.Simulate.click(facetButtons);
            expect(facetsMenu.state.show).toBeTruthy();

            // make sure it rendered
            var popupLists = document.getElementsByClassName('facetMenuPopup');
            expect(popupLists.length).toBe(1);
            let popupList = popupLists[0];

            // not initially revealed
            expect(component.isRevealed(fakeReportLongData_valid.data.facets[0].id)).toBeFalsy();

            // reveal the long facet values
            component.handleRevealMore(null, fakeReportLongData_valid.data.facets[0]);
            expect(component.isRevealed(fakeReportLongData_valid.data.facets[0].id)).toBeTruthy();

        });


    });

});

