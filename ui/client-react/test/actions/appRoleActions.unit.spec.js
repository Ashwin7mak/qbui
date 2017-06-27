import {__RewireAPI__ as AppRoleActionsRewireAPI} from '../../src/actions/appRoleActions';
import * as appRoleActions from '../../src/actions/appRoleActions';
import * as types from '../../src/actions/types';
import Promise from 'bluebird';
import mockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const middlewares = [thunk];
const roleStore = mockStore(middlewares);

Promise.onPossiblyUnhandledRejection(function() {
    // swallow the error..otherwise the log gets cluttered with the exception
});

function event(appId, type, content) {
    return {
        appId,
        type,
        content: content || null
    };
}

const appId = '1';
const userIds = ['1', '2'];
const userDetails = [{id: '1', roleId: 1}, {id: '2', roleId: 1}];
const roleId = '1';

class mockLogger {
    constructor() {}
    logException() {}
    debug() {}
    warn() {}
    error() {}
    parseAndLogError() {}
}


describe('App Role Actions success workflow tests', () => {

    const appRoles = [{"9": {"id": 9, "name": "none", "tableRights": {}, "fieldRights": {}, "description": "", "access": "NONE"}}];
    let mockResponseGetAppRoles = {
        data: [appRoles]
    };
    let mockResponseAssignUsers = {
        data: ['10']
    };

    class mockRoleService {
        getAppRoles() {
            return Promise.resolve(mockResponseGetAppRoles);
        }
        assignUsersToAppRole() {
            return Promise.resolve();
        }
        removeUsersFromAppRole() {
            return Promise.resolve();
        }
    }

    class mockAppService {
        getAppUsers() {
            return Promise.resolve(mockResponseAssignUsers);
        }
    }

    beforeEach(() => {
        spyOn(mockRoleService.prototype, 'getAppRoles').and.callThrough();
        spyOn(mockRoleService.prototype, 'assignUsersToAppRole').and.callThrough();
        spyOn(mockRoleService.prototype, 'removeUsersFromAppRole').and.callThrough();
        spyOn(mockAppService.prototype, 'getAppUsers').and.callThrough();
        AppRoleActionsRewireAPI.__Rewire__('RoleService', mockRoleService);
        AppRoleActionsRewireAPI.__Rewire__('AppService', mockAppService);
        AppRoleActionsRewireAPI.__Rewire__('Logger', mockLogger);
    });

    afterEach(() => {
        AppRoleActionsRewireAPI.__ResetDependency__('RoleService');
        AppRoleActionsRewireAPI.__ResetDependency__('AppService');
        AppRoleActionsRewireAPI.__ResetDependency__('Logger');
        mockRoleService.prototype.getAppRoles.calls.reset();
        mockRoleService.prototype.assignUsersToAppRole.calls.reset();
        mockRoleService.prototype.removeUsersFromAppRole.calls.reset();
        mockAppService.prototype.getAppUsers.calls.reset();
    });

    it('verify loadAppRoles action', (done) => {
        const expectedActions = [
            event(appId, types.LOAD_APP_ROLES),
            event(appId, types.LOAD_APP_ROLES_SUCCESS, {roles: mockResponseGetAppRoles.data})
        ];
        const store = roleStore({});
        return store.dispatch(appRoleActions.loadAppRoles(appId)).then(
            () => {
                expect(store.getActions()).toEqual(expectedActions);
                expect(mockRoleService.prototype.getAppRoles).toHaveBeenCalled();
                done();
            },
            () => {
                expect(false).toBe(true);
                done();
            });
    });

    it('verify assignUsersToAppRole action', (done) => {
        const expectedActions = [
            event(appId, types.ASSIGN_USERS_TO_APP_ROLE, {appUsers: mockResponseAssignUsers.data})
        ];
        const store = roleStore({});
        return store.dispatch(appRoleActions.assignUsersToAppRole(appId, roleId, userDetails)).then(
            () => {
                expect(store.getActions()).toEqual(expectedActions);
                expect(mockRoleService.prototype.assignUsersToAppRole).toHaveBeenCalled();
                expect(mockAppService.prototype.getAppUsers).toHaveBeenCalled();
                done();
            },
            () => {
                expect(false).toBe(true);
                done();
            });
    });

    it('verify assignUserToAppRole action', (done) => {
        const userId = '10';
        const expectedActions = [
            event(appId, types.ASSIGN_USERS_TO_APP_ROLE, {appUsers: [userId]})
        ];
        const store = roleStore({});
        return store.dispatch(appRoleActions.assignUserToAppRole(appId, roleId, userDetails)).then(
            () => {
                expect(store.getActions()).toEqual(expectedActions);
                expect(mockRoleService.prototype.assignUsersToAppRole).toHaveBeenCalled();
                expect(mockAppService.prototype.getAppUsers).toHaveBeenCalled();
                done();
            },
            () => {
                expect(false).toBe(true);
                done();
            });
    });

    it('verify removeUsersFromAppRole action', (done) => {
        const expectedActions = [
            event(appId, types.REMOVE_USERS_FROM_APP_ROLE, {roleId:roleId, userIds:userIds})
        ];
        const store = roleStore({});
        return store.dispatch(appRoleActions.removeUsersFromAppRole(appId, userDetails)).then(
            () => {
                expect(store.getActions()).toEqual(expectedActions);
                expect(mockRoleService.prototype.removeUsersFromAppRole).toHaveBeenCalled();
                done();
            },
            () => {
                expect(false).toBe(true);
                done();
            });
    });
});

describe('App Role Actions failure workflow', () => {

    let errorResponse = {
        response: {
            error: {status:500}
        }
    };
    class mockRoleService {
        getAppRoles() {
            return Promise.reject(errorResponse);
        }
        assignUsersToAppRole() {
            return Promise.reject(errorResponse);
        }
        removeUsersFromAppRole() {
            return Promise.reject(errorResponse);
        }
    }

    class mockAppService {
        getAppUsers() {
            return Promise.reject(errorResponse);
        }
    }

    beforeEach(() => {
        spyOn(mockRoleService.prototype, 'getAppRoles').and.callThrough();
        spyOn(mockRoleService.prototype, 'assignUsersToAppRole').and.callThrough();
        spyOn(mockRoleService.prototype, 'removeUsersFromAppRole').and.callThrough();
        spyOn(mockAppService.prototype, 'getAppUsers').and.callThrough();
        spyOn(mockLogger.prototype, 'parseAndLogError').and.callThrough();
        AppRoleActionsRewireAPI.__Rewire__('RoleService', mockRoleService);
        AppRoleActionsRewireAPI.__Rewire__('AppService', mockAppService);
        AppRoleActionsRewireAPI.__Rewire__('Logger', mockLogger);
    });

    afterEach(() => {
        AppRoleActionsRewireAPI.__ResetDependency__('RoleService');
        AppRoleActionsRewireAPI.__ResetDependency__('AppService');
        AppRoleActionsRewireAPI.__ResetDependency__('Logger');
        mockRoleService.prototype.getAppRoles.calls.reset();
        mockRoleService.prototype.assignUsersToAppRole.calls.reset();
        mockRoleService.prototype.removeUsersFromAppRole.calls.reset();
        mockAppService.prototype.getAppUsers.calls.reset();
        mockLogger.prototype.parseAndLogError.calls.reset();
    });

    let loadAppRolesTestCases = [
        {name:'verify missing appId parameter'},
        {name:'verify loadAppRoles reject response', appId:appId, rejectTest:true}
    ];

    loadAppRolesTestCases.forEach(testCase => {
        it(testCase.name, (done) => {
            let expectedActions = [];
            if (testCase.rejectTest === true) {
                expectedActions.push(event(testCase.appId, types.LOAD_APP_ROLES));
            }
            expectedActions.push(event(testCase.appId, types.LOAD_APP_ROLES_FAILED, {error:jasmine.any(Object)}));

            const store = roleStore({});
            return store.dispatch(appRoleActions.loadAppRoles(testCase.appId)).then(
                () => {
                    expect(false).toBe(true);
                    done();
                },
                () => {
                    expect(store.getActions()).toEqual(expectedActions);
                    if (testCase.rejectTest === true) {
                        expect(mockRoleService.prototype.getAppRoles).toHaveBeenCalled();
                    } else {
                        expect(mockRoleService.prototype.getAppRoles).not.toHaveBeenCalled();
                    }
                    done();
                });
        });
    });

    it('verify assignUsersToAppRole reject response', (done) => {
        const expectedActions = [];
        const store = roleStore({});
        return store.dispatch(appRoleActions.assignUsersToAppRole(appId, roleId, userIds)).then(
            () => {
                expect(false).toBe(true);
                done();
            },
            () => {
                expect(store.getActions()).toEqual(expectedActions);
                expect(mockRoleService.prototype.assignUsersToAppRole).toHaveBeenCalled();
                expect(mockLogger.prototype.parseAndLogError).toHaveBeenCalled();
                done();
            });
    });

    it('verify removeUsersFromAppRole reject response', (done) => {
        const expectedActions = [];
        const store = roleStore({});
        return store.dispatch(appRoleActions.removeUsersFromAppRole(appId, userIds)).then(
            () => {
                expect(false).toBe(true);
                done();
            },
            () => {
                expect(store.getActions()).toEqual(expectedActions);
                expect(mockRoleService.prototype.removeUsersFromAppRole).toHaveBeenCalled();
                expect(mockLogger.prototype.parseAndLogError).toHaveBeenCalled();
                done();
            });
    });

});
