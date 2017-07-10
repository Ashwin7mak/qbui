import * as types from "../app/actionTypes";
import _ from "lodash";
import { createSelector } from 'reselect';

let initialState = {
    pageLoadTime: 0,
    gridStartTime: 0
};

const performanceTimingReducer = (state = initialState, action) => {
    switch (action.type) {
    case types.GET_PAGE_LOAD_TIME: {
        return {
            ...state,
            pageLoadTime: action.payload
        };
    }

    case types.GET_GRID_START_TIME: {
        return {
            ...state,
            gridStartTime: action.payload
        };
    }

    default:
        return state;
    }
};

/**
 * Selector for the gridStartTime
 * @param state
 * @returns {float} the time the grid started loading
 */
const gridStartTimeSelector = state => state.performanceTiming.gridStartTime;

/**
 * Selector for the pageLoadTime
 * @param state
 * @returns {float} the time the page took to load
 */
export const getPageLoadTime = state => state.performanceTiming.pageLoadTime;

/**
 * Selector for the gridLoadTime
 * @returns {integer} the total time it took for the grid to load
 */
export const getGridLoadTime = createSelector(
    getPageLoadTime,
    gridStartTimeSelector,
    (pageLoadTime, gridStartTime) =>  _.subtract(pageLoadTime, gridStartTime)
);

export default performanceTimingReducer;



