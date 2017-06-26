import performanceTimingReducer, {getPageLoadTime, getGridLoadTime} from "../../src/analytics/performanceTimingReducer";
import * as types from "../../src/app/actionTypes";
import _ from "lodash";

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

    const mockPageLoadTime = 1.50;
    const mockGridLoadTime = 0.80;

    fit('returns correct initial state', () => {
        expect(performanceTimingReducer(undefined, {})).toEqual(initialState);
    });

    fit('shows the page load time', () => {
        expect(getPageLoadTime(jasmine.any(Number))).toEqual(mockPageLoadTime);
    });

    fit('shows the page load time', () => {
        expect(getGridLoadTime(jasmine.any(Number))).toEqual(_.subtract(mockPageLoadTime, mockGridLoadTime));
    });
});