import Fluxxor from 'fluxxor';
import formActions, {__RewireAPI__ as formActionsRewireAPI} from '../../src/actions/formActions';
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
        getForm() {
            var p = Promise.defer();
            p.reject({response:{message:'someError', status:errorStatus}});
            return p.promise;
        }
    }
    beforeEach(() => {
        spyOn(flux.dispatchBinder, 'dispatch');
        spyOn(mockFormService.prototype, 'getFormAndRecord').and.callThrough();
        spyOn(mockFormService.prototype, 'getForm').and.callThrough();
        formActionsRewireAPI.__Rewire__('FormService', mockFormService);
    });

    afterEach(() => {
        formActionsRewireAPI.__ResetDependency__('FormService');
    });

    it('test missing params loadFormAndRecord', (done) => {
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
    it('test missing params loadForm', (done) => {
        flux.actions.loadForm().then(
            () => {
                expect(true).toBe(false);
                done();
            },
            () => {
                expect(mockFormService.prototype.getForm).not.toHaveBeenCalled();
                done();
            }
        );
    });

    it('test promise reject handling loadFormAndRecord', (done) => {
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
    it('test promise reject handling loadForm', (done) => {
        flux.actions.loadForm(appId, tblId, recordId).then(
            () => {
                expect(true).toBe(false);
                done();
            },
            () => {
                expect(mockFormService.prototype.getForm).toHaveBeenCalled();
                expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(2);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.LOAD_FORM]);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([actions.LOAD_FORM_FAILED, errorStatus]);
                done();
            }
        );
    });
});
