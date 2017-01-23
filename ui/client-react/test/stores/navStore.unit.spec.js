import * as actions from '../../src/constants/actions';

import Store from '../../src/stores/navStore';
import Fluxxor from 'fluxxor';

describe('Test Nav Store', () => {
    'use strict';

    let store;
    const STORE_NAME = 'NavStore';
    let stores;
    let flux;

    let i18nBundle = 'i18nBundle';
    let locale = '12-34';

    var mockLocale = {
        getLocale: function() {
            return locale;
        },
        getI18nBundle: function() {
            return i18nBundle;
        }
    };

    beforeEach(() => {
        Store.__Rewire__('Locale', mockLocale);
        store = new Store();
        stores = {NavStore: store};
        flux = new Fluxxor.Flux(stores);

        spyOn(flux.store(STORE_NAME), 'emit');
    });

    afterEach(() => {
        flux.store(STORE_NAME).emit.calls.reset();

        store = null;
        Store.__ResetDependency__('Locale');
    });

    it('test default nav store state', () => {
        // verify default states
        expect(flux.store(STORE_NAME).state.i18n).toBe(i18nBundle);

        //  expect 3 bindActions
        expect(flux.store(STORE_NAME).__actions__.CHANGE_LOCALE).toBeDefined();
    });


    it('test change locale action', () => {

        let changeLocaleAction = {
            type: actions.CHANGE_LOCALE
        };
        spyOn(mockLocale, 'getI18nBundle');
        spyOn(flux.store(STORE_NAME), 'setLocaleBundle');

        flux.dispatcher.dispatch(changeLocaleAction);
        expect(flux.store(STORE_NAME).setLocaleBundle).toHaveBeenCalled();

        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(1);
    });

    it('test toggle mobile nav searchbar action', () => {

        let toggleSearchAction = {
            type: actions.TOGGLE_SEARCH
        };

        //  should be closed by default
        expect(flux.store('NavStore').state.searchBarOpen).toBeFalsy();

        flux.dispatcher.dispatch(toggleSearchAction);
        expect(flux.store('NavStore').state.searchBarOpen).toBeTruthy();
        expect(flux.store('NavStore').emit).toHaveBeenCalledWith('change');
        expect(flux.store('NavStore').emit.calls.count()).toBe(1);
        flux.store('NavStore').emit.calls.reset();

        flux.dispatcher.dispatch(toggleSearchAction);

        expect(flux.store('NavStore').emit).toHaveBeenCalledWith('change');
        expect(flux.store('NavStore').emit.calls.count()).toBe(1);
    });

    it('test searching action', () => {

        let toggleSearchingAction = {
            type: actions.SEARCHING,
            payload: true
        };

        expect(flux.store(STORE_NAME).state.searching).toBeFalsy();

        flux.dispatcher.dispatch(toggleSearchingAction);
        expect(flux.store(STORE_NAME).state.searching).toBeTruthy();
        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(1);
        flux.store(STORE_NAME).emit.calls.reset();
    });
});
