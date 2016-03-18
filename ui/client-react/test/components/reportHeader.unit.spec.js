import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReportHeader  from '../../src/components/report/reportHeader';
import FacetSelections  from '../../src/components/facet/facetSelections';
import Fluxxor from 'fluxxor';

describe('ReportHeader functions', () => {
    'use strict';

    let component;
    let navStore = Fluxxor.createStore({
        getState() {
            return {};
        }
    });
    let stores = {
        NavStore: new navStore()
    };

    let flux = new Fluxxor.Flux(stores);
    flux.actions = {
        toggleLeftNav() {
            return;
        },
        filterReport() {
            return;
        }
    };
    let selections = new FacetSelections();
    selections.addSelection(1, 'Development');
    const reportData = {
        data: {
            facets: [{
                id: 1, name: 'test', type: "TEXT",
                values: [{value: "a"}, {value: "b"}, {value: "c"}]
            }
            ]
        },
        selections: selections
    };


    beforeEach(() => {
        component = TestUtils.renderIntoDocument(<ReportHeader flux={flux} reportData={reportData}/>);
        spyOn(flux.actions, 'toggleLeftNav');
        spyOn(flux.actions, 'filterReport');
    });

    afterEach(() => {
        flux.actions.toggleLeftNav.calls.reset();
        flux.actions.filterReport.calls.reset();
    });

    it('test render of component', () => {

        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test toggle nav', () => {

        let toggleNav = TestUtils.findRenderedDOMComponentWithClass(component, "toggleNavButton");
        TestUtils.Simulate.click(toggleNav);

        expect(flux.actions.toggleLeftNav).toHaveBeenCalled();
    });

    it('test perform search', () => {

        let toggleNav = TestUtils.findRenderedDOMComponentWithClass(component, "toggleNavButton");
        TestUtils.Simulate.click(toggleNav);

        let filterSearchBox = TestUtils.scryRenderedDOMComponentsWithClass(component, "filterSearchBox");
        expect(filterSearchBox.length).toEqual(1);

        // check that search input is debounced

        var searchInput = filterSearchBox[0];
        var testValue = 'xxx';

        //simulate search string was input
        TestUtils.Simulate.change(searchInput, {target: {value: testValue}});
        expect(flux.actions.filterReport).toHaveBeenCalled();
    });

});
