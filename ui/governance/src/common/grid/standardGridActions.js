import * as types from './standardGridActionTypes';

/**
 * Action to set the visible items for a given grid
 *
 * @param gridId - the id of the grid we want to update
 * @param items - the direction to paginate
 */
export const setItems = (gridId, items) => ({
    type: types.SET_ITEMS,
    gridId,
    items
});

/**
 * Action to set the desired sort order for a given grid
 *
 * @param gridId - the id of the grid we want to update
 * @param sortFid - the field id of the column we want to sort by
 * @param asc - whether we should sort ascending (if false sorts descending)
 * @param remove - removes sorting as this field
 */
export const setSort = (gridId, sortFid, asc, remove) => ({
    type: types.SET_SORT,
    sortFid,
    asc,
    gridId,
    remove
});

/**
 * Action to set the pagination order for a given grid
 *
 * @param gridId - the id of the grid we want to update
 * @param direction - the direction to paginate
 */
export const setPaginate = (gridId, direction) => ({
    type: types.SET_PAGINATE,
    gridId,
    direction
});

export const doSetItems = (gridId, items) => {
    return (dispatch, getState) => {
        dispatch(setItems(gridId, items));
    };
};

/**
 * Update function that delegates the work to a passed in update action
 * but first calculates the state of the particular grid we are interested in
 *
 * @param gridId - id of the grid we want to update
 * @param doUpdateAction - the custom update function for that grid
 * @returns {function(*, *)}
 */
export const doUpdate = (gridId, doUpdateAction) => {
    return (dispatch, getState) => {
        var gridState = getState().Grids[gridId] || {};
        dispatch(doUpdateAction(gridId, gridState));
    };
};
