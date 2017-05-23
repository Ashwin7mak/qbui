import {__RewireAPI__ as AppRoleActionsRewireAPI} from '../../src/actions/appRoleActions';
import * as appRoleActions from '../../src/actions/appRoleActions';
import * as types from '../../src/actions/types';
import Promise from 'bluebird';
import mockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const middlewares = [thunk];
const mockReportsStore = mockStore(middlewares);

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

describe('App Role Actions success workflow', () => {

    const appId = '1';
    const appRoles = [{"9": {"id": 9, "name": "none", "tableRights": {}, "fieldRights": {}, "description": "", "access": "NONE"}}];
    let mockResponseGetAppRoles = {
        data: [appRoles]
    };
    class mockRoleService {
        getAppRoles() {
            return Promise.resolve(mockResponseGetAppRoles);
        }
    }

    beforeEach(() => {
        spyOn(mockRoleService.prototype, 'getAppRoles').and.callThrough();
        AppRoleActionsRewireAPI.__Rewire__('RoleService', mockRoleService);
    });

    afterEach(() => {
        AppRoleActionsRewireAPI.__ResetDependency__('RoleService');
        mockRoleService.prototype.getAppRoles.calls.reset();
    });

    it('verify loadAppRoles action', (done) => {
        const expectedActions = [
            event(appId, types.LOAD_APP_ROLES),
            event(appId, types.LOAD_APP_ROLES_SUCCESS, {roles: mockResponseGetAppRoles.data})
        ];
        const store = mockReportsStore({});
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
});

describe('App Role Actions failure workflow', () => {

    const appId = '1';
    let errorResponse = {
        response: {
            error: {status:500}
        }
    };
    class mockRoleService {
        getAppRoles() {
            return Promise.reject(errorResponse);
        }
    }

    beforeEach(() => {
        spyOn(mockRoleService.prototype, 'getAppRoles').and.callThrough();
        AppRoleActionsRewireAPI.__Rewire__('RoleService', mockRoleService);
    });

    afterEach(() => {
        AppRoleActionsRewireAPI.__ResetDependency__('RoleService');
        mockRoleService.prototype.getAppRoles.calls.reset();
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

            const store = mockReportsStore({});
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
});
