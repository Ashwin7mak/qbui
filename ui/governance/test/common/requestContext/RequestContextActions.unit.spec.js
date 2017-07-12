import * as RequestContextActions from "../../../src/common/requestContext/RequestContextActions";
import {__RewireAPI__ as RequestContextActionsRewireAPI} from "../../../src/common/requestContext/RequestContextActions";
import RequestContextService from "../../../src/common/requestContext/RequestContextService";
import * as types from "../../../src/app/actionTypes";
import WindowLocationUtils from "../../../../client-react/src/utils/windowLocationUtils";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import Promise from "bluebird";
import {FORBIDDEN, INTERNAL_SERVER_ERROR} from "../../../../client-react/src/constants/urlConstants";

describe('RequestContextActions', () => {
    class mockLogger {
        constructor() {}
        logException() {}
        debug() {}
        warn() {}
        error() {}
        parseAndLogError() {}
    }

    const mockWindowUtils = {
        update: url => url,
    };

    beforeEach(() => {
        spyOn(mockWindowUtils, 'update');
        RequestContextActionsRewireAPI.__Rewire__('WindowLocationUtils', mockWindowUtils);
        RequestContextActionsRewireAPI.__Rewire__('Logger', mockLogger);
    });

    afterEach(() => {
        RequestContextActionsRewireAPI.__ResetDependency__('WindowLocationUtils', mockWindowUtils);
        RequestContextActionsRewireAPI.__ResetDependency__('Logger');
    });

    let middleware =  [thunk];
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

    it('handles the standard case correctly with standardized JSON returned from DotNet', (done) => {
        const store = mockStore(defaultState);
        const accountId = 1;

        spyOn(RequestContextService.prototype, 'getRequestContext').and.returnValue(Promise.resolve({data: {
            errorCode: 200,
            errorMessage: "",
            data: defaultServiceData
        }}));

        const expectedActions = [
            {type: types.REQUEST_CONTEXT_FETCHING},
            {...defaultServiceData, type: types.REQUEST_CONTEXT_SUCCESS}
        ];

        return store
            .dispatch(RequestContextActions.fetchRequestContextIfNeeded(accountId))
            .then(() => {
                expect(store.getActions()).toEqual(expectedActions);
                expect(mockWindowUtils.update).not.toHaveBeenCalled();
            }, error => expect(false).toEqual(true)).then(done, done);
    });

    // TODO: Remove this test after July Current Stack Release in favor of the test above
    // We are standardizing the Json returned by DotNet
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
                expect(store.getActions()).toEqual(expectedActions);
                expect(mockWindowUtils.update).not.toHaveBeenCalled();
            }, error => expect(false).toEqual(true)).then(done, done);
    });

    it('does nothing when receiving a 401 error case', (done) => {
        const store = mockStore(defaultState);
        const accountId = 1;
        const error = {response: {status:401}};
        spyOn(RequestContextService.prototype, 'getRequestContext').and.returnValue(Promise.reject(error));

        const expectedActions = [
            {type: types.REQUEST_CONTEXT_FETCHING},
            {type: types.REQUEST_CONTEXT_FAILURE, error: error}
        ];

        return store
            .dispatch(RequestContextActions.fetchRequestContextIfNeeded(accountId))
            .then(() => {
                expect(store.getActions()).toEqual(expectedActions);
                expect(mockWindowUtils.update).not.toHaveBeenCalledWith(FORBIDDEN);
                expect(mockWindowUtils.update).not.toHaveBeenCalledWith(INTERNAL_SERVER_ERROR);
            }, e => expect(false).toEqual(true)).then(done, done);
    });

    it('handles a 403 error case correctly', (done) => {
        const store = mockStore(defaultState);
        const accountId = 1;
        const error = {response: {status:403}};
        spyOn(RequestContextService.prototype, 'getRequestContext').and.returnValue(Promise.reject(error));

        const expectedActions = [
            {type: types.REQUEST_CONTEXT_FETCHING},
            {type: types.REQUEST_CONTEXT_FAILURE, error: error}
        ];

        return store
            .dispatch(RequestContextActions.fetchRequestContextIfNeeded(accountId))
            .then(() => {
                expect(store.getActions()).toEqual(expectedActions);
                expect(mockWindowUtils.update).toHaveBeenCalledWith(FORBIDDEN);
            }, e => expect(false).toEqual(true)).then(done, done);
    });

    it('handles any other error case correctly', (done) => {
        const store = mockStore(defaultState);
        const accountId = 1;
        const error = {response: {status: 500}};
        spyOn(RequestContextService.prototype, 'getRequestContext').and.returnValue(Promise.reject(error));

        const expectedActions = [
            {type: types.REQUEST_CONTEXT_FETCHING},
            {type: types.REQUEST_CONTEXT_FAILURE, error: error}
        ];

        return store
            .dispatch(RequestContextActions.fetchRequestContextIfNeeded(accountId))
            .then(() => {
                expect(store.getActions()).toEqual(expectedActions);
                expect(mockWindowUtils.update).toHaveBeenCalledWith(INTERNAL_SERVER_ERROR);
            }, e => expect(false).toEqual(true)).then(done, done);
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
