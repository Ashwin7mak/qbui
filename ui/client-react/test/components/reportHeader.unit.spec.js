import React from 'react';
import TestUtils from 'react-addons-test-utils';
import ReportHeader  from '../../src/components/report/reportHeader';
import FacetSelections  from '../../src/components/facet/facetSelections';
import Fluxxor from 'fluxxor';
import SearchBox from '../../src/components/search/searchBox';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {Provider} from "react-redux";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

import * as types from '../../src/actions/types';

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
        filterReport() {
            return;
        },
        filterSearchPending() {
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

    const initialState = {};
    let store;
    beforeEach(() => {
        store = mockStore(initialState);
        component = TestUtils.renderIntoDocument(
            <Provider store={store}>
                <ReportHeader flux={flux} reportData={reportData}/>
            </Provider>
        );
    });

    it('test render of component', () => {
        expect(TestUtils.isCompositeComponent(component)).toBeTruthy();
    });

    it('test toggle nav action is called', () => {
        let toggleNav = TestUtils.findRenderedDOMComponentWithClass(component, "toggleNavButton");
        TestUtils.Simulate.click(toggleNav);

        const actions = store.getActions();
        expect(actions[0].type).toEqual(types.TOGGLE_LEFT_NAV_EXPANDED);
    });

    it('test perform search', () => {
        let filterSearchBox = TestUtils.scryRenderedDOMComponentsWithClass(component, "smallHeaderSearchBox");
        expect(filterSearchBox.length).toEqual(1);
    });

});
