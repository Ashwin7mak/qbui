import Fluxxor from 'fluxxor';
import appsActions from '../../src/actions/appsActions';
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

    let stores = {};
    let flux = new Fluxxor.Flux(stores);
    flux.addActions(appsActions);

    beforeEach(() => {
        spyOn(flux.dispatchBinder, 'dispatch');
        spyOn(mockAppService.prototype, 'getApps').and.callThrough();
        spyOn(mockAppService.prototype, 'getApp').and.callThrough();
        spyOn(mockAppService.prototype, 'getAppUsers').and.callThrough();
        appsActions.__Rewire__('AppService', mockAppService);
    });

    afterEach(() => {
        appsActions.__ResetDependency__('AppService');
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

});
