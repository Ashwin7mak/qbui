import {pageLoadTime, gridStartTime} from "../../src/analytics/performanceTimingActions";
import * as types from "../../src/app/actionTypes";

let payload;

describe("Performance Timing Action", () => {
    it("gets the page load time", () => {
        expect(pageLoadTime()).toEqual({
            type: types.GET_PAGE_LOAD_TIME,
            payload
        });
    });

    it("gets the grid start time", () => {
        expect(gridStartTime()).toEqual({
            type: types.GET_GRID_START_TIME,
            payload
        });
    });
});
