import Fluxxor from 'fluxxor';
import appsActions, {__RewireAPI__ as appsActionsRewireAPI} from '../../src/actions/appsActions';
import * as actions from '../../src/constants/actions';
import Promise from 'bluebird';
import {APP_ROUTE} from '../../src/constants/urlConstants';

describe('Apps Actions functions with Tables', () => {
    'use strict';

    let responseData = [{id: 'tableId', link: `${APP_ROUTE}/tableId`}];
    let appRoleResponeData = [4, 5, 6];

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
    }

    class mockRoleService {
        constructor() { }
        getAppRoles(id) {
            return Promise.resolve({data: appRoleResponeData});
        }
    }

    class mockRoleServiceFailure {
        constructor() { }
        getAppRoles(id) {
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
        spyOn(mockAppService.prototype, 'getAppUsers').and.callThrough();
        spyOn(mockRoleService.prototype, 'getAppRoles').and.callThrough();
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
        {name:'select app id', appId: 123, cached: false},
        {name:'select app id cached', appId: 123, cached: true}
    ];
    selectAppIdTests.forEach(function(test) {
        it(test.name, function(done) {
            flux.actions.selectedAppId = test.cached === true ? test.appId : '';
            flux.actions.selectAppId(test.appId).then(
                () => {
                    if (test.cached === true) {
                        expect(mockAppService.prototype.getAppUsers).not.toHaveBeenCalled();
                    } else {
                        expect(mockAppService.prototype.getAppUsers).toHaveBeenCalledWith(test.appId);
                        expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(2);
                        expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.SELECT_APP, test.appId]);
                        expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([actions.LOAD_APP_USERS_SUCCESS, responseData]);
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

    it("Test unassign Users", function(done) {
        var test = {appId: 187, userIds: 187, roleId: 1};
        appsActionsRewireAPI.__Rewire__('RoleService', mockRoleServiceFailure);
        flux.actions.unassignUsers(test.appId, test.roleId, test.userIds).then(
            () => {
                expect(false).toBe(true);
                done();
            },
            () => {
                expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([]);
                expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(0);
                done();
            }
        );
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
