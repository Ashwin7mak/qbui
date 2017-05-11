import * as types from "./standardGridActionTypes";
import FacetSelections from "../../../../reuse/client/src/components/facets/facetSelections";

export const defaultGridState = {
    // the items currently displayed on the grid
    items: [],
    // the fields to sort the grid
    sortFids: [],
    // the pagination to apply to the grid
    pagination: {filteredRecords: 0, totalRecords: 0, totalPages: 0, currentPage: 1, itemsPerPage: 10, firstRecordInCurrentPage: 0, lastRecordInCurrentPage: 0},
    // the filter search term to apply to the grid
    searchTerm : "",
    // the facets applied to this grid
    facets: {
        facetSelections: new FacetSelections(),     // current selected facets in this grid of the format
        facetFields:[]                             // current facet columns and values
    }
};

/**
 * Updates the state for a given grid
 *
 * @param state - the current state for a given grid
 * @param action - the action to apply
 * @returns {*}
 */
export function grid(state = defaultGridState, action) {
    switch (action.type) {
    case types.SET_ITEMS:
        return {
            ...state,
            items: action.items
        };
    case types.SET_SEARCH:
        return {
            ...state,
            searchTerm: action.searchTerm
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
    case types.SET_TOTALRECORDS:
        return {
            ...state,
            pagination: {
                ...state.pagination,
                totalRecords: action.totalRecords
            }
        };
    case types.SET_FACET_SELECTIONS:
        return {
            ...state,
            facets: {...state.facets, facetSelections: action.facetSelections}
        };
    case types.SET_FACET_FIELDS:
        return {
            ...state,
            facets: {...state.facets, facetFields: action.facetFields}
        };
    default:
        return state;
    }
}

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
export function gridById(state = {}, action) {
    switch (action.type) {
    case types.SET_SORT:
    case types.SET_ITEMS:
    case types.SET_PAGINATION:
    case types.SET_CURRENTPAGE_OFFSET:
    case types.SET_SEARCH:
    case types.SET_FACET_FIELDS:
    case types.SET_FACET_SELECTIONS:
    case types.SET_TOTALRECORDS:
        return {
            ...state,
            [action.gridId]: grid(state[action.gridId], action)
        };
    default:
        return state;
    }
}

export default gridById;
