/* jshint proto: true */

import Fluxxor from 'fluxxor';
import navActions, {__RewireAPI__ as navActionsRewireAPI} from '../../src/actions/navActions';
import * as actions from '../../src/constants/actions';
import Breakpoints from '../../src/utils/breakpoints';

describe('Nav Actions functions', () => {
    'use strict';

    let stores = {};
    let flux = new Fluxxor.Flux(stores);
    flux.addActions(navActions);

    beforeEach(() => {
        spyOn(flux.dispatchBinder, 'dispatch');
    });

    it('test searching action', () => {
        flux.actions.setSearching(true);
        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.SEARCHING, true);
    });

    it('test searchfor action', () => {
        flux.actions.searchFor('abc');
        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.SEARCH_FOR, 'abc');
    });

});
