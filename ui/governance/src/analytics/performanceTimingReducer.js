import * as types from "../app/actionTypes";
import _ from "lodash";

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

export const getPageLoadTime = state => state.performanceTiming.pageLoadTime;

export const getGridLoadTime = state => _.round(_.subtract(state.performanceTiming.pageLoadTime, state.performanceTiming.gridStartTime), 2);

export default performanceTimingReducer;



