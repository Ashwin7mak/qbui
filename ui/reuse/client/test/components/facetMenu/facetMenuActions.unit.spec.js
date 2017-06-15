import {showFacetMenu, hideFacetMenu, setFacetsExpanded, setFacetsMoreRevealed} from '../../../src/components/facets/facetMenuActions';
import {SHOW_FACET_MENU, HIDE_FACET_MENU, SET_FACETS_EXPANDED, SET_FACETS_MORE_REVEALED} from '../../../src/components/facets/facetMenuTypes';

let payload;

describe('Facet Button', () => {
    it('shows the menu', () => {
        expect(showFacetMenu()).toEqual({type: SHOW_FACET_MENU});
    });

    it('hides the menu', () => {
        expect(hideFacetMenu()).toEqual({type: HIDE_FACET_MENU});
    });

    it('expands the menu', () => {
        expect(setFacetsExpanded()).toEqual({
            type: SET_FACETS_EXPANDED,
            payload
        });
    });

    it('expands the menu and reveals more filters', () => {
        expect(setFacetsMoreRevealed()).toEqual({
            type: SET_FACETS_MORE_REVEALED,
            payload
        });
    });
});
