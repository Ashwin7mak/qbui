import Fluxxor from 'fluxxor';
import tableActions from '../../src/actions/tableActions';
import * as actions from '../../src/constants/actions';
import Promise from 'bluebird';

let errorStatusCode = 404;
let errorStatus = {
    response: {
        message: 'someError',
        status: errorStatusCode
    }
};
let exStatus = 500;

describe('Table Actions table negative tests -- error conditions', () => {
    'use strict';

    let appId = 'appId';
    let tblId = 'tblId';

    let stores = {};
    let flux = new Fluxxor.Flux(stores);
    flux.addActions(tableActions);

    class mockTableService {
        constructor() { }
        getHomePage() {
            var p = Promise.defer();
            p.reject({response:{message:'someError', status:errorStatusCode}});
            return p.promise;
        }
    }
    beforeEach(() => {
        spyOn(flux.dispatchBinder, 'dispatch');
        spyOn(mockTableService.prototype, 'getHomePage').and.callThrough();
        tableActions.__Rewire__('TableService', mockTableService);
    });

    afterEach(() => {
        tableActions.__ResetDependency__('TableService');
    });

    it('test missing params', (done) => {
        flux.actions.loadTableHomePage().then(
            () => {
                expect(true).toBe(false);
                done();
            },
            () => {
                expect(mockTableService.prototype.getHomePage).not.toHaveBeenCalled();
                expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(1);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.LOAD_REPORT_FAILED, exStatus]);

                done();
            }
        );
    });
    it('test promise reject handling', (done) => {
        flux.actions.loadTableHomePage(appId, tblId).then(
            () => {
                expect(true).toBe(false);
                done();
            },
            () => {
                expect(mockTableService.prototype.getHomePage).toHaveBeenCalled();
                expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(2);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([actions.LOAD_REPORT_FAILED, errorStatus]);
                done();
            }
        );
    });
});

describe('Table Actions table negative tests -- exception condition', () => {
    let appId = 'appId';
    let tblId = 'tblId';

    let stores = {};
    let flux = new Fluxxor.Flux(stores);
    flux.addActions(tableActions);

    class mockTableService {
        constructor() { }
        getHomePage() {
            var p = Promise.defer();
            p.reject(null);
            return p.promise;
        }
    }

    class mockLogger {
        constructor() {}
        logException() {}
        debug() {}
        warn() {}
        error() {}
        parseAndLogError() {}
    }

    beforeEach(() => {
        spyOn(flux.dispatchBinder, 'dispatch');
        spyOn(mockTableService.prototype, 'getHomePage').and.callThrough();
        spyOn(mockLogger.prototype, 'logException').and.callThrough();
        tableActions.__Rewire__('TableService', mockTableService);
        tableActions.__Rewire__('Logger', mockLogger);
    });

    afterEach(() => {
        tableActions.__ResetDependency__('TableService');
        tableActions.__ResetDependency__('Logger');
        flux.dispatchBinder.dispatch.calls.reset();
    });


    it('test exception handling', (done) => {
        flux.actions.loadTableHomePage(appId, tblId).then(
            () => {
                expect(true).toBe(false);
                done();
            },
            () => {
                expect(mockTableService.prototype.getHomePage).toHaveBeenCalled();
                expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(1);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.LOAD_REPORT, {appId, tblId, rptId:null, offset:undefined, numRows:undefined}]);
                expect(mockLogger.prototype.logException).toHaveBeenCalled();
                done();
            }
        );
    });
});
