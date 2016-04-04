import * as actions from '../../src/constants/actions';

import Store from '../../src/stores/reportDataSearchStore';
import Fluxxor from 'fluxxor';

describe('Test ReportDataSearchFilter Store', () => {
    'use strict';

    let store;
    const STORE_NAME = 'ReportDataSearchStore';
    let stores;
    let flux;

    const searchStringInput = 'searchStringInput';

    beforeEach(() => {
        store = new Store();
        stores = {ReportDataSearchStore: store};
        flux = new Fluxxor.Flux(stores);

        spyOn(flux.store(STORE_NAME), 'emit');
    });

    afterEach(() => {
        flux.store(STORE_NAME).emit.calls.reset();
        store = null;
    });

    it('test default report search filter store state', () => {
        // verify default states
        expect(flux.store(STORE_NAME).state.searchStringInput).toBeFalsy();

        //  expect bindActions
        expect(flux.store(STORE_NAME).__actions__.FILTER_SEARCH_PENDING).toBeDefined();

    });
    it('test search input pending action', () => {

        let searchPendingAction = {
            type: actions.FILTER_SEARCH_PENDING,
            payload: {
                string: "abc",
            }
        };

        flux.dispatcher.dispatch(searchPendingAction);
        expect(flux.store(STORE_NAME).state.searchStringInput).toEqual('abc');

        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(1);
    });

    it('test getState function', () => {

        let state = flux.store(STORE_NAME).getState();

        //  expect the following to be returned when 'getting state'
        expect(state.searchStringInput).toBe('');
    });

    it('test getState function after search is pending', () => {
        let searchStringAction = {
            type: actions.FILTER_SEARCH_PENDING,
            payload: {
                string: "abc",
            }
        };
        flux.dispatcher.dispatch(searchStringFilterAction);
        let state = flux.store(STORE_NAME).getState();

        expect(state.searchStringInput).toBeDefined(searchStringInput);
    });
});
