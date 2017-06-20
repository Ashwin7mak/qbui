import * as types from "../app/actionTypes";
import _ from "lodash";

let initialState = {
    totalTimeTaken: " ",
    totalGridLoadTime: " "
};

const performanceTimingReducer = (state = initialState, action) => {
    let newState = _.cloneDeep(state);

    switch (action.type) {
    case types.GET_TOTAL_TIME: {
        newState.totalTimeTaken =  action.payload;
        return newState;
    }

    case types.GET_TOTAL_GRID_LOAD_TIME: {
        newState.totalGridLoadTime = action.payload;
        return newState;
    }

    default:
        return state;
    }
};

export const getTotalLoadingTime = state => state && state.performanceTimingReducer ? state.performanceTimingReducer.totalTimeTaken : "0 seconds";

export const getTotalGridLoadingTime = state => state && state.performanceTimingReducer ? state.performanceTimingReducer.totalGridLoadTime : "0 seconds";

export default performanceTimingReducer;



