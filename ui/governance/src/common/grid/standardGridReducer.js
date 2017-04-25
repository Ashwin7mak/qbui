import * as types from './standardGridActionTypes';

export const defaultGridState = {
    // the items currently displayed on the grid
    items: [],
    // the fields to sort the grid
    sortFids: [],
    // the pagination to apply to the grid
    pageNumber: 1,
    // the filter to apply to the grid
    filter : []
};

/**
 * Updates the state for a given grid
 *
 * @param state - the current state for a given grid
 * @param action - the action to apply
 * @returns {*}
 */
function grid(state = defaultGridState, action) {
    switch (action.type) {
    case types.SET_ITEMS:
        return {
            ...state,
            items: action.items
        };
    case types.SET_SORT:
        return {
            ...state,
            sortFids: action.remove ? [] : [(action.sortFid * (action.asc ? 1 : -1))]
        };
    case types.SET_PAGINATE:
        return {
            ...state,
            pageNumber: action.direction === "prev" ? state.pagination.pageNumber - 1 : state.pagination.pageNumber  + 1
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
function gridById(state = {}, action) {
    switch (action.type) {
    case types.SET_SORT:
    case types.SET_ITEMS:
    case types.SET_PAGINATE:
        return {
            ...state,
            [action.gridId]: grid(state[action.gridId], action)
        };
    default:
        return state;
    }
}

export default gridById;
