import GetStatus from '../../../src/common/reducer/RequestStatusReducer';
import * as types from '../../../src/app/actionTypes';

describe('RequestStatusReducer', () => {
    const initialState = {
        isFetching: false,
        error: null
    };

    it('should have the correct initial state', () => {
        expect(GetStatus(undefined, {})).toEqual(initialState);
    });

    it('should update state to fetching when action is REQUEST_FETCHING_*', () => {
        expect(GetStatus(initialState, {type: types.REQUEST_FETCHING}))
            .toEqual({...initialState, isFetching: true});
        expect(GetStatus(initialState, {type: types.GET_USERS_FETCHING}))
            .toEqual({...initialState, isFetching: true});
        expect(GetStatus(initialState, {type: types.REQUEST_CONTEXT_FETCHING}))
            .toEqual({...initialState, isFetching: true});
    });

    it('should update state to error when action is REQUEST_FAILURE_*', () => {
        let state = {
            ...initialState,
            isFetching: true
        };
        let error = "Error!";
        expect(GetStatus(state, {type: types.REQUEST_FAILURE, error:error}))
            .toEqual({...state, isFetching: false, error: error});
        expect(GetStatus(state, {type: types.GET_USERS_FAILURE, error:error}))
            .toEqual({...state, isFetching: false, error: error});
        expect(GetStatus(state, {type: types.REQUEST_CONTEXT_FAILURE, error:error}))
            .toEqual({...state, isFetching: false, error: error});
    });

    it('should update state to success when action is REQUEST_SUCCESS_*', () => {
        let state = {
            ...initialState,
            isFetching: true
        };
        expect(GetStatus(state, {type: types.REQUEST_SUCCESS}))
            .toEqual({...state, isFetching: false, error: null});
        expect(GetStatus(state, {type: types.GET_USERS_SUCCESS}))
            .toEqual({...state, isFetching: false, error: null});
        expect(GetStatus(state, {type: types.REQUEST_CONTEXT_SUCCESS}))
            .toEqual({...state, isFetching: false, error: null});
    });
});
