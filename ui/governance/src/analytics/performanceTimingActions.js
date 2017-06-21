import * as types from "../app/actionTypes";

export const pageLoadTime = (payload) => ({
    type: types.GET_PAGE_LOAD_TIME,
    payload
});

export const gridStartTime = (payload) => ({
    type: types.GET_GRID_START_TIME,
    payload
});
