import * as types from './facetMenuTypes';
import _ from 'lodash';

let payload;

let initialState = {
    show: false,
    expandedFacetFields : [],
    moreRevealedFacetFields :[]
};

const facetMenuReducer = (state = initialState, action) => {

    let newState = _.cloneDeep(state);
    switch (action.type) {

    case types.SHOW_FACET_MENU: {
        newState.show = true;
        return newState;
    }

    case types.HIDE_FACET_MENU: {
        newState.show = false;
        return newState;
    }

    case types.TOGGLE_FACET_MENU: {
        return {
            ...newState,
            show: !newState.show
        };
    }

    case types.SET_FACETS_EXPANDED: {
        newState.expandedFacetFields = action.payload.expanded;
        return newState;
    }

    case types.SET_FACETS_MORE_REVEALED: {
        newState.moreRevealedFacetFields = action.payload.moreRevealed;
        return newState;
    }

    default:
        return state;
    }
};

export const getExpandedFacetFields = state => state && state.facets ? state.facets.expandedFacetFields : [];
export const getMoreRevealedFacetFields = state => state && state.facets ? state.facets.moreRevealedFacetFields : [];

export default facetMenuReducer;
