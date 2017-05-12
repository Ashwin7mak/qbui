// action creators
import * as types from './facetMenuTypes';

export const showFacetMenu = () => {
    return {type: types.SHOW_FACET_MENU};
};

export const hideFacetMenu = () => {
    return {type: types.HIDE_FACET_MENU};
};

export const toggleFacetMenu = () => {
    return {type: types.TOGGLE_FACET_MENU};
};

/**
 * Object that contains the data that is passed
 * payload.expanded is an array containing different ID's
 * @param payload
 * @returns {{type, payload: *}}
 */
export const setFacetsExpanded = (payload) => {
    return {
        type: types.SET_FACETS_EXPANDED,
        payload
    };
};

/**
 * Object that contains the data that is passed
 * payload.moreRevealed is an array containing different ID's
 * @param payload
 * @returns {{type, payload: *}}
 */
export const setFacetsMoreRevealed = (payload) => {
    return {
        type: types.SET_FACETS_MORE_REVEALED,
        payload
    };
};
