import thunk from 'redux-thunk';
import Promise from 'bluebird';
import configureMockStore from 'redux-mock-store';

import {updateLoadingUserStatus, updateLoggedInUser, getLoggedInUser, UPDATE_LOGGED_IN_USER, UPDATE_USER_LOADING_STATUS, __RewireAPI__ as UserActionsRewireAPI} from 'REUSE/actions/userActions';

const testUser = {id: 13};

class MockUserService {
    getRequestUser() {}
}

class MockLogger {
    error(_message, _error) {}
}

describe('UserActions', () => {
    beforeEach(() => {
        UserActionsRewireAPI.__Rewire__('Logger', MockLogger);
    });

    afterEach(() => {
        UserActionsRewireAPI.__ResetDependency__('Logger');
    });

    describe('updateLoadingUserStatus', () => {
        it('sends an event to update the loading status for the currently logged in user', () => {
            expect(updateLoadingUserStatus(false)).toEqual({type: UPDATE_USER_LOADING_STATUS, isLoading: false});
            expect(updateLoadingUserStatus(true)).toEqual({type: UPDATE_USER_LOADING_STATUS, isLoading: true});
        });
    });

    describe('updateLoggedInUser', () => {
        it('sends an event to update the user', () => {
            const result = updateLoggedInUser(testUser);
            expect(result.type).toEqual(UPDATE_LOGGED_IN_USER);
            expect(result.user).toEqual(testUser);
        });

        it('resets the loading state after the user is updated', () => {
            const result = updateLoggedInUser();

            expect(result.isLoading).toEqual(false);
        });
    });

    describe('getLoggedInUser', () => {
        const middlewares = [thunk];
        const mockStore = configureMockStore(middlewares);

        beforeEach(() => {
            UserActionsRewireAPI.__Rewire__('UserService', MockUserService);
        });

        afterEach(() => {
            UserActionsRewireAPI.__ResetDependency__('UserService');
        });

        it('updates the currently logged in user after the api returns successfully', (done) => {
            spyOn(MockUserService.prototype, 'getRequestUser').and.returnValue(Promise.resolve({data: testUser}));

            const expectedActions = [
                {type: UPDATE_USER_LOADING_STATUS, isLoading: true},
                {type: UPDATE_LOGGED_IN_USER, user: testUser, isLoading: false}
            ];

            const store = mockStore({});

            return store.dispatch(getLoggedInUser()).then(
                () => {
                    expect(store.getActions()).toEqual(expectedActions);
                    done();
                },
                () => {
                    expect(false).toBe(true);
                    done();
                }
            );
        });

        it('resets the loading status and logs an error when the api fails', (done) => {
            spyOn(MockUserService.prototype, 'getRequestUser').and.returnValue(Promise.reject('some error'));

            const expectedActions = [
                {type: UPDATE_USER_LOADING_STATUS, isLoading: true},
                {type: UPDATE_USER_LOADING_STATUS, isLoading: false}
            ];

            const store = mockStore({});

            return store.dispatch(getLoggedInUser()).then(
                () => {
                    expect(false).toBe(true);
                    done();
                },
                () => {
                    expect(store.getActions()).toEqual(expectedActions);
                    done();
                }
            );
        });
    });
});
