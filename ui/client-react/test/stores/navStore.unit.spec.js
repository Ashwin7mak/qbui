import * as actions from '../../src/constants/actions';

import Store from '../../src/stores/navStore';
import Fluxxor from 'fluxxor';

describe('Test Nav Store', () => {
    'use strict';

    let store;
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
    }

    beforeEach(() => {
        Store.__Rewire__('Locale', mockLocale);
        store = new Store();
        stores = {NavStore: store};
        flux = new Fluxxor.Flux(stores);

        spyOn(flux.store('NavStore'), 'emit');
    });

    afterEach(() => {
        flux.store('NavStore').emit.calls.reset();

        store = null;
        Store.__ResetDependency__('Locale');
    });

    it('test default nav store state', () => {
        // verify default states
        expect(flux.store('NavStore').state.leftNavOpen).toBeTruthy();
        expect(flux.store('NavStore').state.mobileLeftNavOpen).toBeFalsy();
        expect(flux.store('NavStore').state.trouserOpen).toBeFalsy();
        expect(flux.store('NavStore').state.i18n).toBe(i18nBundle);

        //  expect 4 bindActions
        expect(flux.store('NavStore').__actions__.SHOW_TROUSER).toBeDefined();
        expect(flux.store('NavStore').__actions__.HIDE_TROUSER).toBeDefined();
        expect(flux.store('NavStore').__actions__.TOGGLE_LEFT_NAV).toBeDefined();
        expect(flux.store('NavStore').__actions__.CHANGE_LOCALE).toBeDefined();
    });


    it('test change locale action', () => {

        let changeLocaleAction = {
            type: actions.CHANGE_LOCALE
        }
        spyOn(mockLocale, 'getI18nBundle');
        spyOn(flux.store('NavStore'), 'setLocaleBundle');

        flux.dispatcher.dispatch(changeLocaleAction);
        expect(flux.store('NavStore').setLocaleBundle).toHaveBeenCalled();

        expect(flux.store('NavStore').emit).toHaveBeenCalledWith('change');
        expect(flux.store('NavStore').emit.calls.count()).toBe(1);
    });

    it('test open/close trouser action', () => {

        let showTrouserAction = {
            type: actions.SHOW_TROUSER
        }
        let hideTrouserAction = {
            type: actions.HIDE_TROUSER
        }

        //  should be closed by default
        expect(flux.store('NavStore').state.trouserOpen).toBeFalsy();

        flux.dispatcher.dispatch(showTrouserAction);
        expect(flux.store('NavStore').state.trouserOpen).toBeTruthy();
        expect(flux.store('NavStore').emit).toHaveBeenCalledWith('change');
        expect(flux.store('NavStore').emit.calls.count()).toBe(1);
        flux.store('NavStore').emit.calls.reset();

        flux.dispatcher.dispatch(hideTrouserAction);
        expect(flux.store('NavStore').state.trouserOpen).toBeFalsy();

        expect(flux.store('NavStore').emit).toHaveBeenCalledWith('change');
        expect(flux.store('NavStore').emit.calls.count()).toBe(1);
    });

    it('test toggle mobile nav searchbar action', () => {

        let toggleSearchAction = {
            type: actions.TOGGLE_SEARCH
        }

        //  should be closed by default
        expect(flux.store('NavStore').state.searchBarOpen).toBeFalsy();

        flux.dispatcher.dispatch(toggleSearchAction);
        expect(flux.store('NavStore').state.searchBarOpen).toBeTruthy();
        expect(flux.store('NavStore').emit).toHaveBeenCalledWith('change');
        expect(flux.store('NavStore').emit.calls.count()).toBe(1);
        flux.store('NavStore').emit.calls.reset();

        flux.dispatcher.dispatch(toggleSearchAction);
        expect(flux.store('NavStore').state.trouserOpen).toBeFalsy();

        expect(flux.store('NavStore').emit).toHaveBeenCalledWith('change');
        expect(flux.store('NavStore').emit.calls.count()).toBe(1);
    });

    it('test toggle left nav action', () => {

        let toggleLeftNavAction = {
            type: actions.TOGGLE_LEFT_NAV
        }

        expect(flux.store('NavStore').state.leftNavOpen).toBeTruthy();
        expect(flux.store('NavStore').state.mobileLeftNavOpen).toBeFalsy();

        flux.dispatcher.dispatch(toggleLeftNavAction);
        expect(flux.store('NavStore').state.leftNavOpen).toBeFalsy();
        expect(flux.store('NavStore').state.mobileLeftNavOpen).toBeTruthy();
        expect(flux.store('NavStore').emit).toHaveBeenCalledWith('change');
        expect(flux.store('NavStore').emit.calls.count()).toBe(1);
        flux.store('NavStore').emit.calls.reset();

        flux.dispatcher.dispatch(toggleLeftNavAction);
        expect(flux.store('NavStore').state.leftNavOpen).toBeTruthy();
        expect(flux.store('NavStore').state.mobileLeftNavOpen).toBeFalsy();

        expect(flux.store('NavStore').emit).toHaveBeenCalledWith('change');
        expect(flux.store('NavStore').emit.calls.count()).toBe(1);
    });

});