import Fluxxor from 'fluxxor';
import appsActions from '../../src/actions/appsActions';
import * as actions from '../../src/constants/actions';
import constants from '../../../common/src/constants';
import Promise from 'bluebird';

describe('Apps Actions functions with Tables', () => {
    'use strict';

    let responseData = [{id:'tableId', link:'/qbase/app/tableId'}];

    class mockAppService {
        constructor() { }
        getApps() {
            return Promise.resolve({data: responseData});
        }
        getApp(id) {
            return Promise.resolve({data: {id:'tableId'}});
        }
        getApplicationStack(id) {
            return Promise.resolve({openInV3:true});
        }
        setApplicationStack(id, open) {
            return Promise.resolve();
        }
    }

    let stores = {};
    let flux = new Fluxxor.Flux(stores);
    flux.addActions(appsActions);

    beforeEach(() => {
        spyOn(flux.dispatchBinder, 'dispatch');
        spyOn(mockAppService.prototype, 'getApps').and.callThrough();
        spyOn(mockAppService.prototype, 'getApp').and.callThrough();
        spyOn(mockAppService.prototype, 'getApplicationStack').and.callThrough();
        spyOn(mockAppService.prototype, 'setApplicationStack').and.callThrough();
        appsActions.__Rewire__('AppService', mockAppService);
    });

    afterEach(() => {
        appsActions.__ResetDependency__('AppService');
    });

    var appsActionTests = [
        {name:'test load apps action', withTables: true},
        {name:'test load apps action without tables', withTables: false}
    ];

    appsActionTests.forEach(function(test) {
        it(test.name, function(done) {
            flux.actions.loadApps(test.withTables).then(
                () => {
                    expect(mockAppService.prototype.getApps).toHaveBeenCalled();
                    if (test.withTables === true) {
                        expect(mockAppService.prototype.getApp).toHaveBeenCalled();
                    } else {
                        expect(mockAppService.prototype.getApp).not.toHaveBeenCalled();
                    }
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

    var getApplicationStackTests = [
        {name:'test with appId', appId: 123}
    ];
    getApplicationStackTests.forEach(function(test) {
        it(test.name, function(done) {
            flux.actions.getApplicationStack(test.appId).then(
                () => {
                    if (test.appId) {
                        expect(mockAppService.prototype.getApplicationStack).toHaveBeenCalledWith(test.appId);
                    } else {
                        expect(mockAppService.prototype.getApplicationStack).not.toHaveBeenCalled();
                    }

                    //TODO add dispatch tests
                    done();
                },
                () => {
                    expect(false).toBe(true);
                    done();
                }
            );
        });
    });

    var setApplicationStackTests = [
        {name:'test set application stack - open in v3', appId: 123, openInV3: true},
        {name:'test set application stack - open in v2', appId: 123, openInV3: false}
    ];
    setApplicationStackTests.forEach(function(test) {
        it(test.name, function(done) {
            let param = {};
            param[constants.REQUEST_PARAMETER.OPEN_IN_V3] = test.openInV3;

            flux.actions.setApplicationStack(test.appId, test.openInV3).then(
                () => {
                    expect(mockAppService.prototype.setApplicationStack).toHaveBeenCalledWith(test.appId, param);

                    //TODO add dispatch tests
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
