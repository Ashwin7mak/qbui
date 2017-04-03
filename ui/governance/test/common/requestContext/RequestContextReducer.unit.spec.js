import RequestContextReducer from '../../../src/common/requestContext/RequestContextReducer';
import * as types from '../../../src/app/actionTypes';

const initialState = {
    realm: {},
    account: {},
    currentUser: {},
    status: {
        isFetching: false,
        error: null
    }
};

describe('Account Users Reducers Tests', () => {

    it('should have the correct initial state', () => {
        expect(RequestContextReducer(undefined, {})).toEqual(initialState);
    });

    it('should update the state to fetching', () => {
        const state = RequestContextReducer(initialState, {type: types.REQUEST_CONTEXT_FETCHING});
        expect(state.status.isFetching).toEqual(true);
    });

    it('should update the state to error', () => {
        const error = "Error";
        let state = RequestContextReducer(initialState, {type: types.REQUEST_CONTEXT_FETCHING});
        state = RequestContextReducer(state, {type: types.REQUEST_CONTEXT_FAILURE, error: error});
        expect(state.status.isFetching).toEqual(false);
        expect(state.status.error).toEqual(error);
    });

    it('should update realm/account/user', () => {
        let result = {
            realm: {
                name: "realm",
                id: 10
            },
            account: {
                name: "account",
                id: 10
            },
            user: {
                is: {
                    accountAdmin: false,
                    realmAdmin: false,
                    csr: false
                }
            }
        };

        let state = RequestContextReducer(initialState, {type: types.REQUEST_CONTEXT_FETCHING});
        state = RequestContextReducer(state, {type: types.REQUEST_CONTEXT_SUCCESS, ...result});
        expect(state.status.isFetching).toEqual(false);
        expect(state.status.error).toEqual(null);
    });
});
