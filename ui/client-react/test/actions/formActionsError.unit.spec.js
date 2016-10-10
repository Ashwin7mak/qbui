import Fluxxor from 'fluxxor';
import formActions from '../../src/actions/formActions';
import * as actions from '../../src/constants/actions';
import Promise from 'bluebird';

describe('Form Actions loadFormAndRecord negative tests -- ', () => {
    'use strict';

    let appId = 'appId';
    let tblId = 'tblId';
    let recordId = '2';
    let errorStatus = 404;
    let exStatus = 500;

    let stores = {};
    let flux = new Fluxxor.Flux(stores);
    flux.addActions(formActions);

    class mockFormService {
        constructor() { }
        getFormAndRecord() {
            var p = Promise.defer();
            p.reject({response:{message:'someError', status:errorStatus}});
            return p.promise;
        }
    }
    beforeEach(() => {
        spyOn(flux.dispatchBinder, 'dispatch');
        spyOn(mockFormService.prototype, 'getFormAndRecord').and.callThrough();
        formActions.__Rewire__('FormService', mockFormService);
    });

    afterEach(() => {
        formActions.__ResetDependency__('FormService');
    });

    it('test missing params', (done) => {
        flux.actions.loadFormAndRecord().then(
            () => {
                expect(true).toBe(false);
                done();
            },
            () => {
                expect(mockFormService.prototype.getFormAndRecord).not.toHaveBeenCalled();
                done();
            }
        );
    });
    it('test promise reject handling', (done) => {
        flux.actions.loadFormAndRecord(appId, tblId, recordId).then(
            () => {
                expect(true).toBe(false);
                done();
            },
            () => {
                expect(mockFormService.prototype.getFormAndRecord).toHaveBeenCalled();
                expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(2);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.LOAD_FORM_AND_RECORD]);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([actions.LOAD_FORM_AND_RECORD_FAILED, errorStatus]);
                done();
            }
        );
    });
});
