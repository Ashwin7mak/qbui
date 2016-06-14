import Fluxxor from 'fluxxor';
import tableActions from '../../src/actions/tableActions';
import * as actions from '../../src/constants/actions';
import Promise from 'bluebird';

describe('Table Actions loadFormAndRecord negative tests -- ', () => {
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
            p.reject({message:'someError'});
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
                expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.LOAD_REPORT_FAILED]);

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
                expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(1);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.LOAD_REPORT_FAILED, {error: {message:'someError'}}]);
                done();
            }
        );
    });
});
