import {__RewireAPI__ as UserActionsRewireAPI} from '../../src/actions/userActions';
import * as UserActions from '../../src/actions/userActions';
import * as types from '../../src/actions/types';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import Promise from 'bluebird';

let appId = 'appId';
let userId = 'userId';
let searchTerm = 'searchTerm';

// we mock the Redux store when testing async action creators
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

class mockLogger {
    constructor() {}
    logException() {}
    debug() {}
    warn() {}
    error() {}
    parseAndLogError() {}
}

function event(type, id, content) {
    return {
        type,
        appId: id || null,
        content: content || null
    };
}

describe('App Actions success workflow functions', () => {

    let responseData = {
        data: {id: '1'}
    };
    class mockUserService {
        constructor() { }
        searchUsers() {
            return Promise.resolve(responseData);
        }
        getUser() {
            return Promise.resolve(responseData);
        }
    }

    beforeEach(() => {
        spyOn(mockUserService.prototype, 'searchUsers').and.callThrough();
        spyOn(mockUserService.prototype, 'getUser').and.callThrough();
        UserActionsRewireAPI.__Rewire__('UserService', mockUserService);
        UserActionsRewireAPI.__Rewire__('Logger', mockLogger);
    });

    afterEach(() => {
        UserActionsRewireAPI.__ResetDependency__('UserService');
        UserActionsRewireAPI.__ResetDependency__('Logger');
    });

    it('test load app owner', (done) => {
        // the mock store makes the actions dispatched available via getActions()
        // so we don't need to spy on the dispatcher etc.
        const expectedActions = [
            event(types.LOAD_APP_OWNER_SUCCESS, appId, responseData.data)
        ];

        const store = mockStore({});
        return store.dispatch(UserActions.loadAppOwner(appId, userId)).then(
            () => {
                expect(mockUserService.prototype.getUser).toHaveBeenCalledWith(userId);
                expect(store.getActions()).toEqual(expectedActions);
                done();
            },
            () => {
                expect(false).toEqual(true);
                done();
            });
    });

    it('test search users', (done) => {
        // the mock store makes the actions dispatched available via getActions()
        // so we don't need to spy on the dispatcher etc.
        const expectedActions = [
            event(types.SEARCH_USERS_SUCCESS, null, responseData.data)
        ];

        const store = mockStore({});
        return store.dispatch(UserActions.searchUsers(searchTerm)).then(
            () => {
                expect(mockUserService.prototype.searchUsers).toHaveBeenCalledWith(searchTerm);
                expect(store.getActions()).toEqual(expectedActions);
                done();
            },
            () => {
                expect(false).toEqual(true);
                done();
            });
    });

});

describe('App Actions error workflow functions', () => {

    let errorData = {
        response: 'some error'
    };
    class mockUserService {
        constructor() { }
        searchUsers() {
            return Promise.reject(errorData);
        }
        getUser() {
            return Promise.reject(errorData);
        }
    }

    beforeEach(() => {
        spyOn(mockUserService.prototype, 'searchUsers').and.callThrough();
        spyOn(mockUserService.prototype, 'getUser').and.callThrough();
        spyOn(mockLogger.prototype, 'parseAndLogError').and.callThrough();
        spyOn(mockLogger.prototype, 'error').and.callThrough();
        UserActionsRewireAPI.__Rewire__('UserService', mockUserService);
        UserActionsRewireAPI.__Rewire__('Logger', mockLogger);
    });

    afterEach(() => {
        UserActionsRewireAPI.__ResetDependency__('UserService');
        UserActionsRewireAPI.__ResetDependency__('Logger');
    });

    it('test load app owner with invalid response', (done) => {
        // the mock store makes the actions dispatched available via getActions()
        // so we don't need to spy on the dispatcher etc.
        const expectedActions = [
            event(types.LOAD_APP_OWNER_ERROR, appId, errorData)
        ];

        const store = mockStore({});
        return store.dispatch(UserActions.loadAppOwner(appId, userId)).then(
            () => {
                expect(false).toEqual(true);
                done();
            },
            () => {
                expect(mockLogger.prototype.parseAndLogError).toHaveBeenCalled();
                expect(mockUserService.prototype.getUser).toHaveBeenCalledWith(userId);
                expect(store.getActions()).toEqual(expectedActions);
                done();
            });
    });

    it('test load app owner with missing userId', (done) => {
        // the mock store makes the actions dispatched available via getActions()
        // so we don't need to spy on the dispatcher etc.
        const expectedActions = [
            event(types.LOAD_APP_OWNER_ERROR, appId, jasmine.any(Object))
        ];

        const store = mockStore({});
        return store.dispatch(UserActions.loadAppOwner(appId)).then(
            () => {
                expect(false).toEqual(true);
                done();
            },
            () => {
                expect(mockLogger.prototype.error).toHaveBeenCalled();
                expect(mockUserService.prototype.getUser).not.toHaveBeenCalled();
                expect(store.getActions()).toEqual(expectedActions);
                done();
            });
    });

    it('test search users with invalid response', (done) => {
        // the mock store makes the actions dispatched available via getActions()
        // so we don't need to spy on the dispatcher etc.
        const expectedActions = [
            event(types.SEARCH_USERS_FAIL)
        ];

        const store = mockStore({});
        return store.dispatch(UserActions.searchUsers(searchTerm)).then(
            () => {
                expect(false).toEqual(true);
                done();
            },
            () => {
                expect(mockLogger.prototype.parseAndLogError).toHaveBeenCalled();
                expect(mockUserService.prototype.searchUsers).toHaveBeenCalledWith(searchTerm);
                expect(store.getActions()).toEqual(expectedActions);
                done();
            });
    });

});
