import Fluxxor from 'fluxxor';
import tableActions from '../../src/actions/tableActions';
import * as actions from '../../src/constants/actions';
import Promise from 'bluebird';

let errorStatus = 404;
let exStatus = 500;

describe('Table Actions table negative tests(1) -- ', () => {
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
            p.reject({response:{message:'someError', status:errorStatus}});
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

describe('Table Actions table negative tests(2) -- ', () => {
    let appId = 'appId';
    let tblId = 'tblId';

    let stores = {};
    let flux = new Fluxxor.Flux(stores);
    flux.addActions(tableActions);

    class mockTableService {
        constructor() { }
        getHomePage() {
            var p = Promise.defer();
            p.resolve(null);
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
                expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(2);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([actions.LOAD_REPORT_FAILED, exStatus]);
                done();
            }
        );
    });
});
