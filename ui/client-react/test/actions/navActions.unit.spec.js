/* jshint proto: true */

import Fluxxor from 'fluxxor';
import navActions from '../../src/actions/navActions';
import * as actions from '../../src/constants/actions';

describe('Nav Actions functions', () => {
    'use strict';

    let stores = {};
    let flux = new Fluxxor.Flux(stores);
    flux.addActions(navActions);

    var mockLocale = {
        changeLocale: function(locale) {
            return locale;
        }
    };

    beforeEach(() => {
        spyOn(flux.dispatchBinder, 'dispatch');
    });

    it('test show trouser action', () => {
        flux.actions.showTrouser();
        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.SHOW_TROUSER);
    });

    it('test hide trouser action', () => {
        flux.actions.hideTrouser();
        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.HIDE_TROUSER);
    });

    it('test toggle left nav action with state', () => {
        flux.actions.toggleLeftNav(true);
        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.TOGGLE_LEFT_NAV, true);
    });

    it('test toggle left nav action', () => {
        flux.actions.toggleLeftNav();
        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.TOGGLE_LEFT_NAV, undefined);
    });

    it('test searching action', () => {
        flux.actions.setSearching(true);
        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.SEARCHING, true);
    });

    it('test searchfor action', () => {
        flux.actions.searchFor('abc');
        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.SEARCH_FOR, 'abc');
    });

    it('test change locale action', () => {
        navActions.__Rewire__('Locale', mockLocale);
        spyOn(mockLocale, 'changeLocale');

        flux.actions.changeLocale('en-us');

        expect(mockLocale.changeLocale).toHaveBeenCalledWith('en-us');
        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.CHANGE_LOCALE);

        navActions.__ResetDependency__('Locale');
    });


});
