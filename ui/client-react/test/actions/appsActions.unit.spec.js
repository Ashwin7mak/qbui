import Fluxxor from 'fluxxor';
import appsActions, {__RewireAPI__ as appsActionsRewireAPI} from '../../src/actions/appsActions';
import * as actions from '../../src/constants/actions';
import Promise from 'bluebird';
import {APP_ROUTE} from '../../src/constants/urlConstants';

describe('Apps Actions functions with Tables', () => {
    'use strict';

    let responseData = [{id: 'tableId', link: `${APP_ROUTE}/tableId`}];
    let appRoleResponeData = [4, 5, 6];

    class mockRoleService {
        constructor() { }
        unassignUsersFromRole(appId, roleId, userIds) {
            return Promise.resolve({data: appRoleResponeData});
        }
    }

    class mockRoleServiceFailure {
        constructor() { }
        unassignUsersFromRole(appId, roleId, userIds) {
            return Promise.reject(null);
        }
    }

    class mockUserService {
        constructor() { }
        getUser(id) {
            return Promise.resolve({data: responseData});
        }
    }

    class mockUserServiceFailure {
        constructor() { }
        getUser(id) {
            return Promise.reject(null);
        }
    }

    let stores = {};
    let flux = new Fluxxor.Flux(stores);
    flux.addActions(appsActions);

    beforeEach(() => {
        spyOn(flux.dispatchBinder, 'dispatch');
        spyOn(mockRoleService.prototype, 'unassignUsersFromRole').and.callThrough();
        spyOn(mockUserService.prototype, 'getUser').and.callThrough();
        appsActionsRewireAPI.__Rewire__('RoleService', mockRoleService);
        appsActionsRewireAPI.__Rewire__('UserService', mockUserService);
    });

    afterEach(() => {
        appsActionsRewireAPI.__Rewire__('RoleService', mockRoleService);
        appsActionsRewireAPI.__Rewire__('UserService', mockUserService);
    });

    var unassignUsersTests = [
        {name:'unassign users from role', appId: 187, roleId:1, userIds:[1]}
    ];
    unassignUsersTests.forEach(function(test) {
        it(test.name, function(done) {
            flux.actions.unassignUsers(test.appId, test.roleId, test.userIds).then(
                () => {
                    expect(mockRoleService.prototype.unassignUsersFromRole).toHaveBeenCalledWith(test.appId, test.roleId, test.userIds);
                    expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(1);
                    expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.UNASSIGN_USERS_SUCCESS, {appId:test.appId, roleId:test.roleId, userIds:test.userIds}]);
                    done();
                },
                () => {
                    expect(false).toBe(true);
                    done();
                }
            );
        });
    });

    var loadFailUnassignUsersTests = [
        {name:'fail unassign users from role', appId: 187, roleId:1, userIds:[1]}
    ];
    loadFailUnassignUsersTests.forEach(function(test) {
        it(test.name, function(done) {
            appsActionsRewireAPI.__Rewire__('RoleService', mockRoleServiceFailure);
            flux.actions.unassignUsers(test.appId, test.roleId, test.userIds).then(
                () => {
                    expect(false).toBe(true);
                    done();
                },
                () => {
                    expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.UNASSIGN_USERS_FAILED]);
                    expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(1);
                    done();
                }
            );
        });
    });

    var loadAppOwnerTests = [
        {name:'load app owner', userId: 187, cached: false}
    ];
    loadAppOwnerTests.forEach(function(test) {
        it(test.name, function(done) {
            flux.actions.loadAppOwner(test.userId).then(
                () => {
                    if (test.cached === true) {
                        expect(mockUserService.prototype.getUser).not.toHaveBeenCalled();
                    } else {
                        expect(mockUserService.prototype.getUser).toHaveBeenCalledWith(test.userId);
                        expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(1);
                        expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.LOAD_APP_OWNER_SUCCESS, responseData]);
                    }
                    done();
                },
                () => {
                    expect(false).toBe(true);
                    done();
                }
            );
        });
    });

    var loadAppOwnerNegativeTests = [
        {name:'fail load app owner', userId: 187, cached: false}
    ];
    loadAppOwnerNegativeTests.forEach(function(test) {
        it(test.name, function(done) {
            appsActionsRewireAPI.__Rewire__('UserService', mockUserServiceFailure);
            flux.actions.loadAppOwner(test.userId).then(
                () => {
                    expect(false).toBe(true);
                    done();
                },
                () => {
                    expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.LOAD_APP_OWNER_FAILED]);
                    expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(1);
                    done();
                }
            );
        });
    });

    it("Test selectUsersRows", function(done) {
        var test = {selectedDetails: 1};
        appsActionsRewireAPI.__Rewire__('UserService', mockUserServiceFailure);
        var result = flux.actions.selectUsersRows(test.selectedDetails);
        expect(flux.dispatchBinder.dispatch.calls.argsFor(0)[0]).toEqual(actions.SELECT_USERS_DETAILS);
        expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(1);
        done();
    });

});
