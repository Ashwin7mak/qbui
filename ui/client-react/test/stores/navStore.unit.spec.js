import * as actions from '../../src/constants/actions';

import Store, {__RewireAPI__ as StoreRewireAPI} from '../../src/stores/navStore';
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
        StoreRewireAPI.__Rewire__('Locale', mockLocale);
        store = new Store();
        stores = {NavStore: store};
        flux = new Fluxxor.Flux(stores);

        spyOn(flux.store(STORE_NAME), 'emit');
    });

    afterEach(() => {
        flux.store(STORE_NAME).emit.calls.reset();

        store = null;
        StoreRewireAPI.__ResetDependency__('Locale');
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
