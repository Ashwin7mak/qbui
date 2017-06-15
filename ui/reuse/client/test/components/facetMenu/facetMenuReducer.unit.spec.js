import facetMenuReducer, {getExpandedFacetFields, getMoreRevealedFacetFields, __RewireAPI__ as ReducerRewireAPI} from '../../../src/components/facets/facetMenuReducer';
import * as types from '../../../src/components/facets/facetMenuTypes';

import _ from 'lodash';

const mockExpandedFacets = [1];
const mockMoreRevealeadFacets = [5];

describe('facetMenuReducer', () => {
    beforeEach(() => {
        jasmine.addMatchers({
            toDeepEqual: () => {
                return {
                    compare: (actual, expected) => {
                        return {pass: _.isEqual(actual, expected)};
                    }
                };
            }
        });
    });

    let initialState = {
        show: false,
        expandedFacetFields : [],
        moreRevealedFacetFields :[]
    };

    let showMenuState = {
        show: true,
        expandedFacetFields : [],
        moreRevealedFacetFields :[]
    };

    it('returns correct initial state', () => {
        expect(facetMenuReducer(undefined, {})).toEqual(initialState);
    });

    it('show menu onClick', () => {
        expect(facetMenuReducer(initialState, {type:types.SHOW_FACET_MENU})).toEqual({
            show: true,
            expandedFacetFields : [],
            moreRevealedFacetFields :[]
        });
    });

    it('hide menu onClick', () => {
        expect(facetMenuReducer(showMenuState, {type:types.HIDE_FACET_MENU})).toEqual({
            show: false,
            expandedFacetFields : [],
            moreRevealedFacetFields :[]
        });
    });

    it('shows expanded facet fields onClick', () => {
        let data = {
            expanded: "expand"
        };

        let setFacetsExpandedAction = {
            type: types.SET_FACETS_EXPANDED,
            payload: data
        };
        expect(facetMenuReducer(initialState, setFacetsExpandedAction)).toEqual({...initialState, expandedFacetFields: data.expanded});
    });

    it('shows more expanded facet fields onClick', () => {
        let data = {
            moreRevealed: "moreRevealed"
        };

        let setFacetsMoreRevealedAction = {
            type: types.SET_FACETS_MORE_REVEALED,
            payload: data
        };
        expect(facetMenuReducer(initialState, setFacetsMoreRevealedAction)).toEqual({...initialState, moreRevealedFacetFields: data.moreRevealed});
    });

    it('gets Expanded Facet Fields from state', () => {
        expect(getExpandedFacetFields({facets: {expandedFacetFields: mockExpandedFacets}})).toEqual(mockExpandedFacets);
    });

    it('gets More Revealed Facet Fields from state', () => {
        expect(getMoreRevealedFacetFields({facets: {moreRevealedFacetFields: mockMoreRevealeadFacets}})).toEqual(mockMoreRevealeadFacets);
    });
});
