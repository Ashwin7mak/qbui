import * as Types from "../../../src/app/actionTypes";
import RequestStatusReducer from "../../../src/common/reducer/RequestStatusReducer";

describe('Request Status Reducer', () => {
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
        error: null,
        isFetching: false
    };

    it('returns correct initial state', () => {
        expect(RequestStatusReducer(undefined, {})).toEqual(initialState);
    });

    it('returns correct state when request is a success', () => {
        expect(RequestStatusReducer(initialState, {type:Types.REQUEST_SUCCESS})).toEqual({
            error: null,
            isFetching: false
        });
    });

    it('returns correct state when request is being fetched', () => {
        expect(RequestStatusReducer(initialState, {type:Types.REQUEST_FETCHING})).toEqual({
            ...initialState,
            error: null,
            isFetching: true
        });
    });

    it('returns correct state when request is failed', () => {
        let data = {
            error: "error"
        };

        expect(RequestStatusReducer(initialState, {type:Types.REQUEST_FAILURE, error: data.error})).toEqual({
            ...initialState,
            error: data.error,
            isFetching: false
        });
    });
});

