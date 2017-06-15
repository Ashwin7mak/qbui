import * as types from "./standardGridActionTypes";
import FacetSelections from "../../../../reuse/client/src/components/facets/facetSelections";

export const defaultGridState = {
    // the items currently displayed on the grid
    items: [],
    // the sort field IDs that is currently applied to the grid
    sortFids: [],
    // the pagination to apply to the grid
    pagination: {
        // the total items after filtering
        totalFilteredItems: 0,
        // the total items before filtering
        totalItems: 0,
        // the total pages we have
        totalPages: 0,
        // the current page user is viewing
        currentPage: 1,
        // the total items that need to be displayed
        itemsPerPage: 10,
        // the first and last item index of the page
        firstItemIndexInCurrentPage: 0,
        lastItemIndexInCurrentPage: 0},
    // the filter search term that is currently applied to the grid
    searchTerm : "",
    // the facets applied to this grid
    facets: {
        // current selected facets in this grid of the format
        facetSelections: new FacetSelections(),
        // The facet columns and its values in the format in the grid
        // [{id: id, name: *, type: FACET_FIELDS[fieldID].type, values: [{id: id, value: aFacet}
        facetFields:[]
    }
};

/**
 * Updates the state for a given grid
 *
 * @param state - the current state for a given grid
 * @param action - the action to apply
 * @returns {*}
 */
export const grid = (state = defaultGridState, action) => {
    switch (action.type) {
    case types.SET_ITEMS:
        return {
            ...state,
            items: action.items
        };
    case types.SET_SEARCH:
        return {
            ...state,
            searchTerm: action.searchTerm || ''
        };
    case types.SET_SORT:
        return {
            ...state,
            sortFids: action.remove ? [] : [(action.sortFid * (action.asc ? 1 : -1))]
        };
    case types.SET_CURRENTPAGE_OFFSET:
        if (state.items.length === 0 ||
            (state.pagination.currentPage + action.offset <= 0) ||
            (state.pagination.currentPage + action.offset > state.pagination.totalPages)) {
            return state;
        }

        return {
            ...state,
            pagination: {
                ...state.pagination,
                currentPage: state.pagination.currentPage + action.offset
            }
        };
    case types.SET_PAGINATION:
        return {
            ...state,
            pagination: {
                ...state.pagination, ...action.pagination
            }
        };
    case types.SET_TOTAL_ITEMS:
        return {
            ...state,
            pagination: {
                ...state.pagination,
                totalItems: action.totalItems
            }
        };
    case types.SET_FACET_SELECTIONS:
        return {
            ...state,
            facets: {...state.facets, facetSelections: action.facetSelections}
        };
    default:
        return state;
    }
};

/**
 * All grid states will be held in an uber state object that will be indexed
 * by gridId. This way we can support multiple grids on a page using the same
 * standard grid infastructure
 *
 * Thus the uber state will look something like :
 * {
 *     grid1: {
 *         sortFids: []
 *         filters: []
 *         ...
 *     },
 *     grid2: {
 *         sortFids: []
 *         filters: []
 *         ...
 *     }
 * }
 * @param state - the state of all grids
 * @param action - the action to apply
 * @returns {{}}
 */
export const gridById = (state = {}, action) => {
    switch (action.type) {
    case types.SET_SORT:
    case types.SET_ITEMS:
    case types.SET_PAGINATION:
    case types.SET_CURRENTPAGE_OFFSET:
    case types.SET_SEARCH:
    case types.SET_FACET_SELECTIONS:
    case types.SET_TOTAL_ITEMS:
        return {
            ...state,
            [action.gridId]: grid(state[action.gridId], action)
        };
    default:
        return state;
    }
};

export default gridById;
