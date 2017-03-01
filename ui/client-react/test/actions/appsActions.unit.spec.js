import Fluxxor from 'fluxxor';
import appsActions, {__RewireAPI__ as appsActionsRewireAPI} from '../../src/actions/appsActions';
import * as actions from '../../src/constants/actions';
import constants from '../../../common/src/constants';
import Promise from 'bluebird';
import {APP_ROUTE} from '../../src/constants/urlConstants';

describe('Apps Actions functions with Tables', () => {
    'use strict';

    let responseData = [{id: 'tableId', link: `${APP_ROUTE}/tableId`}];

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
            return Promise.resolve({data: responseData});
        }
    }

    class mockRoleServiceFailure {
        constructor() { }
        getAppRoles(id) {
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
        appsActionsRewireAPI.__Rewire__('AppService', mockAppService);
        appsActionsRewireAPI.__Rewire__('RoleService', mockRoleService);
    });

    afterEach(() => {
        appsActionsRewireAPI.__Rewire__('AppService', mockAppService);
        appsActionsRewireAPI.__Rewire__('RoleService', mockRoleService);
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
        {name:'load app roles with app roles cached', appId: 123, cached: true, appRoles: [1, 2, 3]}
    ];
    loadAppRolesTests.forEach(function(test) {
        it(test.name, function(done) {
            flux.actions.appRoles = test.appRoles;
            flux.actions.loadAppRoles(test.appId).then(
                () => {
                    expect(mockRoleService.prototype.getAppRoles).toHaveBeenCalledWith(test.appId);
                    expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(1);
                    expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.LOAD_APP_ROLES_SUCCESS, responseData]);
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

});
