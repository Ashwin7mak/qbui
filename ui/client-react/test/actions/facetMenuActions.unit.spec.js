/* jshint proto: true */

import Fluxxor from 'fluxxor';
import facetMenuActions from '../../src/actions/facetMenuActions';
import * as actions from '../../src/constants/actions';

describe('Facet Menu Actions functions', () => {
    'use strict';

    let stores = {};
    let flux = new Fluxxor.Flux(stores);
    flux.addActions(facetMenuActions);

    beforeEach(() => {
        spyOn(flux.dispatchBinder, 'dispatch');
    });

    it('test show facet menu no param  action', () => {
        flux.actions.showFacetMenu();
        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.SHOW_FACET_MENU);
    });

    it('test show facet menu true param action', () => {
        flux.actions.showFacetMenu({show : true});
        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.SHOW_FACET_MENU);
    });

    it('test show facet menu false param action', () => {
        flux.actions.showFacetMenu({show : false});
        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.HIDE_FACET_MENU);
    });


    it('test set facets expanded array', () => {
        let payload = {};
        flux.actions.setFacetsExpanded(payload);
        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.SET_FACETS_EXPANDED, payload);
    });

    it('test set more revealed action', () => {
        let payload = {};
        flux.actions.setFacetsMoreRevealed(payload);
        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.SET_FACETS_MORE_REVEALED, payload);
    });

});
