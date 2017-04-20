import * as types from './standardGridActionTypes';

const defaultGridState = {
    sortFids: []
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
    case types.SET_SORT:
        return {
            ...state,
            sortFids: action.remove ? [] : [(action.sortFid * (action.asc ? 1 : -1))]
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
        return {
            ...state,
            [action.gridId]: grid(state[action.gridId], action)
        };
    default:
        return state;
    }
}

export default gridById;
