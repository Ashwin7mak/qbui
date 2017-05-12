import Fluxxor from 'fluxxor';
import appsActions, {__RewireAPI__ as appsActionsRewireAPI} from '../../src/actions/appsActions';
import * as actions from '../../src/constants/actions';
import Promise from 'bluebird';
import {APP_ROUTE} from '../../src/constants/urlConstants';

describe('Apps Actions functions with Tables', () => {
    'use strict';

    let responseData = [{id: 'tableId', link: `${APP_ROUTE}/tableId`}];
    let appRoleResponeData = [4, 5, 6];
    let responseComponentData = {
        users: [],
        app: [{id: 'tableId'}]
    };

    class mockAppService {
        constructor() { }
        getApps() {
            return Promise.resolve({data: responseData});
        }
        getApp(id) {
            return Promise.resolve({data: {id:'tableId'}});
        }
        getAppUsers(id) {
            return Promise.resolve({data: responseData});
        }
        getAppComponents(id) {
            return Promise.resolve({data: responseComponentData});
        }
    }

    class mockRoleService {
        constructor() { }
        getAppRoles(id) {
            return Promise.resolve({data: appRoleResponeData});
        }
        unassignUsersFromRole(appId, roleId, userIds) {
            return Promise.resolve({data: appRoleResponeData});
        }
    }

    class mockRoleServiceFailure {
        constructor() { }
        getAppRoles(id) {
            return Promise.reject(null);
        }
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
        spyOn(mockAppService.prototype, 'getApps').and.callThrough();
        spyOn(mockAppService.prototype, 'getApp').and.callThrough();
        spyOn(mockAppService.prototype, 'getAppComponents').and.callThrough();
        spyOn(mockAppService.prototype, 'getAppUsers').and.callThrough();
        spyOn(mockRoleService.prototype, 'getAppRoles').and.callThrough();
        spyOn(mockRoleService.prototype, 'unassignUsersFromRole').and.callThrough();
        spyOn(mockUserService.prototype, 'getUser').and.callThrough();
        appsActionsRewireAPI.__Rewire__('AppService', mockAppService);
        appsActionsRewireAPI.__Rewire__('RoleService', mockRoleService);
        appsActionsRewireAPI.__Rewire__('UserService', mockUserService);
    });

    afterEach(() => {
        appsActionsRewireAPI.__Rewire__('AppService', mockAppService);
        appsActionsRewireAPI.__Rewire__('RoleService', mockRoleService);
        appsActionsRewireAPI.__Rewire__('UserService', mockUserService);
    });

    var appsActionTests = [
        {name:'test load apps action', hydrate: true},
        {name:'test load apps action without tables', hydrate: false}
    ];

    appsActionTests.forEach(function(test) {
        it(test.name, function(done) {
            flux.actions.loadApps(test.withTables).then(
                () => {
                    expect(mockAppService.prototype.getApps).toHaveBeenCalled();
                    expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(2);
                    expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.LOAD_APPS]);
                    expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([actions.LOAD_APPS_SUCCESS, responseData]);
                    done();
                },
                () => {
                    expect(false).toBe(true);
                    done();
                }
            );
        });
    });

    var selectAppIdTests = [
        {name:'select app id', appId: 123},
        {name:'select app id of null', appId: null}
    ];
    selectAppIdTests.forEach(function(test) {
        it(test.name, function(done) {
            flux.actions.selectAppId(test.appId).then(
                () => {
                    if (test.appId) {
                        expect(mockAppService.prototype.getAppComponents).toHaveBeenCalled();
                        expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.SELECT_APP, test.appId]);
                        expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([actions.SELECT_APP_SUCCESS, jasmine.any(Object)]);
                        expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(2);
                    } else {
                        expect(mockAppService.prototype.getAppComponents).not.toHaveBeenCalled();
                        expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.SELECT_APP, test.appId]);
                        expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(1);
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

    var loadAppRolesTests = [
        {name:'load app roles with app roles not cached', appId: 187, cached: false, appRoles: [1]},
    ];
    loadAppRolesTests.forEach(function(test) {
        it(test.name, function(done) {
            flux.actions.loadAppRoles(test.appId).then(
                () => {
                    if (test.cached === true) {
                        expect(mockRoleService.prototype.getAppRoles).not.toHaveBeenCalled();
                    } else {
                        expect(mockRoleService.prototype.getAppRoles).toHaveBeenCalledWith(test.appId);
                        expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(1);
                        expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.LOAD_APP_ROLES_SUCCESS, appRoleResponeData]);
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

    var loadAppRolesNegativeTests = [
        {name:'fail load app roles with app id not cached', appId: 187, cached: false,  appRoles: [1]}
    ];
    loadAppRolesNegativeTests.forEach(function(test) {
        it(test.name, function(done) {
            appsActionsRewireAPI.__Rewire__('RoleService', mockRoleServiceFailure);
            flux.actions.appRoles = test.cached === true ? test.appRoles : [];
            flux.actions.loadAppRoles(test.appId).then(
                () => {
                    expect(false).toBe(true);
                    done();
                },
                () => {
                    expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.LOAD_APP_ROLES_FAILED]);
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

    it("Test Select Table Id ", function(done) {
        var test = {tableId: 1};
        appsActionsRewireAPI.__Rewire__('UserService', mockUserServiceFailure);
        var result = flux.actions.selectTableId(test.tableId);
        expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.SELECT_TABLE, 1]);
        expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(1);
        done();
    });


    it("Test updateTableProps", function(done) {
        var test = {tableId: 1, tableInfo: ''};
        appsActionsRewireAPI.__Rewire__('UserService', mockUserServiceFailure);
        var result = flux.actions.updateTableProps(test.tableId, test.tableInfo);
        expect(flux.dispatchBinder.dispatch.calls.argsFor(0)[0]).toEqual(actions.UPDATED_TABLE_PROPS);
        expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(1);
        done();
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
