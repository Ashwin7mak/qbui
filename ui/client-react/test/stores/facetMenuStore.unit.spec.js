import * as actions from '../../src/constants/actions';

import Store from '../../src/stores/facetMenuStore';
import Fluxxor from 'fluxxor';

describe('Test FacetMenuStore Store', () => {
    'use strict';

    let store;
    const STORE_NAME = 'FacetMenuStore';
    let stores;
    let flux;

    const show = 'show';
    const expandedFacetFields = 'expandedFacetFields';
    const moreRevealedFacetFields = 'moreRevealedFacetFields';

    beforeEach(() => {
        store = new Store();
        stores = {FacetMenuStore: store};
        flux = new Fluxxor.Flux(stores);

        spyOn(flux.store(STORE_NAME), 'emit');
    });

    afterEach(() => {
        flux.store(STORE_NAME).emit.calls.reset();
        store = null;
    });

    it('test default FacetMenuStore state', () => {
        // verify default states
        expect(flux.store(STORE_NAME).state.show).toBeFalsy();
        expect(Object.keys(flux.store(STORE_NAME).expandedFacetFields).length).toBe(0);
        expect(Object.keys(flux.store(STORE_NAME).moreRevealedFacetFields).length).toBe(0);

        //  expect bindActions
        expect(flux.store(STORE_NAME).__actions__.SHOW_FACET_MENU).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.HIDE_FACET_MENU).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.SET_FACETS_EXPANDED).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.SET_FACETS_MORE_REVEALED).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.LOAD_REPORT).toBeDefined();

    });
    it('test facet menu show action', () => {

        let showMenuAction = {
            type: actions.SHOW_FACET_MENU,
        };

        flux.dispatcher.dispatch(showMenuAction);
        expect(flux.store(STORE_NAME).state.show).toBeTruthy();

        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(1);
    });

    it('test facet menu hide action', () => {

        let hideMenuAction = {
            type: actions.HIDE_FACET_MENU,
        };

        flux.dispatcher.dispatch(hideMenuAction);
        expect(flux.store(STORE_NAME).state.show).toBeFalsy();

        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(1);
    });

    it('test set facets expanded action', () => {

        let expanded = {
            me: "expand"
        };

        let setFacetsExpandedAction = {
            type: actions.SET_FACETS_EXPANDED,
            expanded: expanded
        };

        flux.dispatcher.dispatch(setFacetsExpandedAction);
        expect(flux.store(STORE_NAME).state.expandedFacetFields).toEqual(expanded);

        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(1);
    });

    it('test set facets more revealed action', () => {

        let moreRevealed = {
            me: "moreRevealed"
        };

        let setFacetsMoreRevealed = {
            type: actions.SET_FACETS_MORE_REVEALED,
            moreRevealed: moreRevealed
        };

        flux.dispatcher.dispatch(setFacetsMoreRevealed);
        expect(flux.store(STORE_NAME).state.moreRevealedFacetFields).toEqual(moreRevealed);

        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(1);
    });

    it('test load Report action', () => {

        let loadReportAction = {
            type: actions.LOAD_REPORT,
        };

        flux.dispatcher.dispatch(loadReportAction);
        expect(flux.store(STORE_NAME).state.show).toEqual(false);

        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(1);
    });

    it('test getState function', () => {

        let state = flux.store(STORE_NAME).getState();

        //  expect the following to be returned when 'getting state'
        expect(state.show).toBe(false);
        expect(state.expandedFacetFields).toBe([]);
        expect(state.moreRevealedFacetFields).toBe([]);
    });

    it('test getState function after showing', () => {
        let searchStringAction = {
            type: actions.SHOW_FACET_MENU,
            payload: {
                string: "abc",
            }
        };
        flux.dispatcher.dispatch(searchStringAction);
        let state = flux.store(STORE_NAME).getState();

        expect(state.searchStringInput).toBeDefined(searchStringAction.payload.string);
    });

    it('test getState function after showing', () => {
        let action = {
            type: actions.SHOW_FACET_MENU,
        };
        flux.dispatcher.dispatch(action);
        let state = flux.store(STORE_NAME).getState();

        expect(state.show).toBeDefined(false);
    });

    it('test getState function after hiding', () => {
        let action = {
            type: actions.HIDE_FACET_MENU,
        };
        flux.dispatcher.dispatch(action);
        let state = flux.store(STORE_NAME).getState();

        expect(state.show).toBeDefined(true);
    });

    it('test getState function after expanded', () => {
        let action = {
            type: actions.SET_FACETS_EXPANDED,
            payload: {
                expanded: "abc",
            }
        };
        flux.dispatcher.dispatch(action);
        let state = flux.store(STORE_NAME).getState();

        expect(state.expandedFacetFields).toBeDefined(action.payload.expanded);
    });
    it('test getState function after moreRevealed', () => {
        let action = {
            type: actions.SET_FACETS_MORE_REVEALED,
            payload: {
                moreRevealed: "abc",
            }
        };
        flux.dispatcher.dispatch(action);
        let state = flux.store(STORE_NAME).getState();

        expect(state.moreRevealedFacetFields).toBeDefined(action.payload.moreRevealed);
    });

    it('test getState function after load Report', () => {
        let action = {
            type: actions.LOAD_REPORT,
        };
        flux.dispatcher.dispatch(action);
        let state = flux.store(STORE_NAME).getState();
        //  expect the following to be reset
        expect(state.show).toBe(false);
        expect(state.expandedFacetFields).toBe([]);
        expect(state.moreRevealedFacetFields).toBe([]);
    });
});
