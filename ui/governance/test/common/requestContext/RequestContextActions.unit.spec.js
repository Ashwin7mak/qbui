import * as RequestContextActions from '../../../src/common/requestContext/RequestContextActions';
import RequestContextService from '../../../src/common/requestContext/RequestContextService';
import * as types from '../../../src/app/actionTypes';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Promise from 'bluebird';

describe('RequestContextActions', () => {

    var middleware =  [thunk];
    const mockStore = configureMockStore(middleware);

    const defaultServiceData = {
        realm: {
            name: "realm",
            id: 1
        },
        account: {
            name: "account",
            id: 1
        },
        user: {
            is: {
                accountAdmin: false,
                realmAdmin: false,
                csr: false
            }
        }
    };

    const defaultState = {
        RequestContext: {
            account: {},
            realm: {},
            currentUser: {},
            status: {}
        }
    };

    it('handles the standard case correctly', (done) => {
        const store = mockStore(defaultState);
        const accountId = 1;

        spyOn(RequestContextService.prototype, 'getRequestContext').and.returnValue(Promise.resolve({data: defaultServiceData}));

        const expectedActions = [
            {type: types.REQUEST_CONTEXT_FETCHING},
            {...defaultServiceData, type: types.REQUEST_CONTEXT_SUCCESS}
        ];

        return store
            .dispatch(RequestContextActions.fetchRequestContextIfNeeded(accountId))
            .then(() => {
                const actions = store.getActions();
                expect(actions).toEqual(expectedActions);
                done();
            });
    });

    it('handles the error case correctly', (done) => {
        const store = mockStore(defaultState);
        const accountId = 1;
        const error = "My Error";
        spyOn(RequestContextService.prototype, 'getRequestContext').and.returnValue(Promise.reject(error));

        const expectedActions = [
            {type: types.REQUEST_CONTEXT_FETCHING},
            {type: types.REQUEST_CONTEXT_FAILURE, error: error}
        ];

        return store
            .dispatch(RequestContextActions.fetchRequestContextIfNeeded(accountId))
            .then(() => {
                const actions = store.getActions();
                expect(actions).toEqual(expectedActions);
                done();
            });
    });

    it('handles the case when we are already fetched the desired account', () => {
        const accountId = 1;
        const store = mockStore({
            ...defaultState,
            RequestContext: {
                status: {
                    isFetching: false
                },
                account: {
                    id: accountId
                }
            }
        });

        const expectedActions = [];
        store.dispatch(RequestContextActions.fetchRequestContextIfNeeded(accountId));
        const actions = store.getActions();
        expect(actions).toEqual(expectedActions);
    });

    it('handles the case when we already currently fetching', () => {
        const accountId = 1;
        const store = mockStore({
            ...defaultState,
            RequestContext: {
                status: {
                    isFetching: true
                },
                account: {
                    id: accountId
                }
            }
        });

        const expectedActions = [];
        store.dispatch(RequestContextActions.fetchRequestContextIfNeeded(accountId));
        const actions = store.getActions();
        expect(actions).toEqual(expectedActions);
    });

    it('handles the case when previously fetched a different account', (done) => {
        const accountId = 1;
        const store = mockStore({
            ...defaultState,
            RequestContext: {
                status: {
                    isFetching: false
                },
                account: {
                    id: accountId + 1
                }
            }
        });

        spyOn(RequestContextService.prototype, 'getRequestContext').and.returnValue(Promise.resolve({data: defaultServiceData}));

        const expectedActions = [
            {type: types.REQUEST_CONTEXT_FETCHING},
            {...defaultServiceData, type: types.REQUEST_CONTEXT_SUCCESS}
        ];

        return store
            .dispatch(RequestContextActions.fetchRequestContextIfNeeded(accountId))
            .then(() => {
                const actions = store.getActions();
                expect(actions).toEqual(expectedActions);
                done();
            });
    });
});
