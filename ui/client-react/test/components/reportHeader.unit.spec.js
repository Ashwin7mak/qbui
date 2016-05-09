import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReportHeader  from '../../src/components/report/reportHeader';
import FacetSelections  from '../../src/components/facet/facetSelections';
import Fluxxor from 'fluxxor';
import SearchBox from '../../src/components/search/searchBox';

describe('ReportHeader functions', () => {
    'use strict';

    let component;
    let navStore = Fluxxor.createStore({
        getState() {
            return {};
        }
    });
    let reportDataSearchStore = Fluxxor.createStore({
        getState() {
            return {searchStringInput :''};
        }
    });
    let stores = {
        NavStore: new navStore(),
        ReportDataSearchStore: new reportDataSearchStore()
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
    let mockCallbacks = {};

    beforeEach(() => {

        mockCallbacks = {
            searchHappened : function(value) {
            }
        };
        spyOn(mockCallbacks, 'searchHappened').and.callThrough();
        spyOn(flux.actions, 'toggleLeftNav');

        component = TestUtils.renderIntoDocument(<ReportHeader flux={flux} reportData={reportData}
                                                               searchTheString={mockCallbacks.searchHappened}
        />);
    });

    afterEach(() => {
        flux.actions.toggleLeftNav.calls.reset();
        mockCallbacks.searchHappened.calls.reset();
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

        let filterSearchBox = TestUtils.scryRenderedComponentsWithType(component, SearchBox);

        let searchInputBox = TestUtils.scryRenderedDOMComponentsWithClass(filterSearchBox[0], "searchInput");
        expect(searchInputBox.length).toEqual(1);

        var searchInput = searchInputBox[0];
        var testValue = 'xxx';

        //simulate search string was input
        TestUtils.Simulate.change(searchInput, {target: {value: testValue}});
        expect(mockCallbacks.searchHappened).toHaveBeenCalled();
    });

});
