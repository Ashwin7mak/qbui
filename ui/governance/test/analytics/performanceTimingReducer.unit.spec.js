import performanceTimingReducer, {getPageLoadTime, getGridLoadTime} from "../../src/analytics/performanceTimingReducer";
import * as types from "../../src/app/actionTypes";
import _ from "lodash";

let mockPageLoadTime = 1.50;
let mockGridStartTime = 0.40;

describe('Performance Timing Reducer', () => {
    beforeEach(() => {
        jasmine.addMatchers({
            toDeepEqual: () => {
                return {
                    compare: (actual, expected) => {
                        return {pass: _.isEqual(actual, expected)};
                    }
                };
            }
        });
    });

    let initialState = {
        pageLoadTime: 0,
        gridStartTime: 0
    };

    it('returns correct initial state', () => {
        expect(performanceTimingReducer(undefined, {})).toEqual(initialState);
    });

    it('gets the page load time', () => {

        let pageLoadTimeAction = {
            type: types.GET_PAGE_LOAD_TIME,
            payload: mockPageLoadTime
        };

        expect(performanceTimingReducer(initialState, pageLoadTimeAction)).toEqual({...initialState, pageLoadTime: mockPageLoadTime});
    });

    it('gets the grid start time', () => {

        let gridStartTimeAction = {
            type: types.GET_GRID_START_TIME,
            payload: mockGridStartTime
        };

        expect(performanceTimingReducer(initialState, gridStartTimeAction)).toEqual({...initialState, gridStartTime: mockGridStartTime});
    });

    it('gets the page load time from state', () => {

        expect(getPageLoadTime({performanceTiming: {pageLoadTime: mockPageLoadTime}})).toEqual(mockPageLoadTime);
    });

    it('gets the grid load time from state', () => {

        expect(getGridLoadTime({performanceTiming: {pageLoadTime: mockPageLoadTime, gridStartTime: mockGridStartTime}})).toEqual(_.subtract(mockPageLoadTime, mockGridStartTime));
    });
});
