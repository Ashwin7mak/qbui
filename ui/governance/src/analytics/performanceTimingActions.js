import * as types from "../app/actionTypes";

export const totalTime = (payload) => ({
    type: types.GET_TOTAL_TIME,
    payload
});

export const gridLoadTime = (payload) => ({
    type: types.GET_TOTAL_GRID_LOAD_TIME,
    payload
});
