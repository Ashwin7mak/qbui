import RequestContextReducer, {isFetching, getCurrentUser, getRealm} from "../../../src/common/requestContext/RequestContextReducer";
import * as types from "../../../src/app/actionTypes";

const initialState = {
    realm: {},
    account: {},
    currentUser: {},
    status: {
        isFetching: false,
        error: null
    }
};

describe('RequestContext Reducers Tests', () => {

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

    describe('selectors', () => {
        describe('isFetching', () => {
            it("should return true while fetching the request user's context", () => {
                expect(isFetching({RequestContext:{...initialState, status: {...initialState.status, isFetching: true}}})).toEqual(true);
            });
            it("should return false if the state isFetching is false AND we don't have the current user's information", () => {
                expect(isFetching({RequestContext:{...initialState}})).toEqual(true);
            });
            it("should return false while we have completed fetching the request user's context", () => {
                expect(isFetching({RequestContext:{...initialState, currentUser:{id: 1}}})).toEqual(false);
            });
        });
        describe('getCurrentUser', () => {
            it('should return the current user from the request context', () => {
                let user = {id: 1};
                expect(getCurrentUser({RequestContext:{...initialState, currentUser: user}})).toEqual(user);
            });
        });
        describe('getRealm', () => {
            it('should return the realm from the request context', () => {
                let realm = {id: 1};
                expect(getRealm({RequestContext:{...initialState, realm: realm}})).toEqual(realm);
            });
        });
    });



});
