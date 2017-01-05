
import formActions from '../../src/actions/formActions';
import {syncingForm, loadForm, editNewRecord, openRecordForEdit} from '../../src/actions/formActions';
import * as actions from '../../src/constants/actions';
import Promise from 'bluebird';

describe('Form Actions functions', () => {
    // 'use strict';
    //
    // let appId = 'appId';
    // let tblId = 'tblId';
    // let recordId = '2';
    // let responseData = {
    //     "formId": 1,
    //     "tableId": "0wbfabsaaaaac",
    //     "appId": "0wbfabsaaaaab"
    // };
    //
    // let stores = {};
    // let flux = new Fluxxor.Flux(stores);
    // flux.addActions(formActions);
    //
    // class mockFormService {
    //     constructor() { }
    //     getFormAndRecord() {
    //         return Promise.resolve({data: responseData});
    //     }
    //     getForm() {
    //         return Promise.resolve({data: responseData});
    //     }
    // }
    //
    // beforeEach(() => {
    //     spyOn(flux.dispatchBinder, 'dispatch');
    //     spyOn(mockFormService.prototype, 'getFormAndRecord').and.callThrough();
    //     spyOn(mockFormService.prototype, 'getForm').and.callThrough();
    //     formActions.__Rewire__('FormService', mockFormService);
    // });
    //
    // afterEach(() => {
    //     formActions.__ResetDependency__('FormService');
    // });
    //
    // var loadFormAndRecordTests = [
    //     {name:'test loadFormAndRecord action', appId: appId, tblId: tblId, recordId: recordId, formType:'formType'},
    //     {name:'test loadFormAndRecord isEdit=true action', appId: appId, tblId: tblId, recordId: recordId, formType:'formType', isEdit: true}
    // ];
    //
    // loadFormAndRecordTests.forEach(function(test) {
    //     it(test.name, function(done) {
    //         let loadAction = test.Edit ? actions.LOAD_EDIT_FORM_AND_RECORD : actions.LOAD_FORM_AND_RECORD;
    //         let successAction = test.Edit ? actions.LOAD_EDIT_FORM_AND_RECORD_SUCCESS : actions.LOAD_FORM_AND_RECORD_SUCCESS;
    //         flux.actions.loadFormAndRecord(test.appId, test.tblId, test.recordId).then(
    //             () => {
    //                 expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(2);
    //                 expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([loadAction]);
    //                 expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([successAction, responseData]);
    //                 done();
    //             },
    //             () => {
    //                 expect(false).toBe(true);
    //                 done();
    //             }
    //         );
    //     });
    // });
    //
    // var loadFormTests = [
    //     {name:'test loadGetFormTests isEdit=true action', appId: appId, tblId: tblId, recordId: recordId, formType: 'formType', isEdit: true},
    //     {name:'test loadGetFormTests isEdit=false action', appId: appId, tblId: tblId, recordId: recordId, formType: 'formType', isEdit: false}
    // ];
    //
    // loadFormTests.forEach(function(test) {
    //     it(test.name, function(done) {
    //         let loadAction = test.isEdit ? actions.LOAD_EDIT_FORM : actions.LOAD_FORM;
    //         let successAction = test.isEdit ? actions.LOAD_EDIT_FORM_SUCCESS : actions.LOAD_FORM_SUCCESS;
    //         flux.actions.loadForm(test.appId, test.tblId, test.recordId, test.formType, test.isEdit).then(
    //             () => {
    //                 expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(2);
    //                 expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([loadAction]);
    //                 expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([successAction, responseData]);
    //                 done();
    //             },
    //             () => {
    //                 expect(false).toBe(true);
    //                 done();
    //             }
    //         );
    //     });
    // });

    // it('test openRecordForEdit method', function(done) {
    //     flux.actions.openRecordForEdit(recordId);
    //
    //     expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(1);
    //     expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.EDIT_REPORT_RECORD, {recId: recordId}]);
    //     done();
    // });
    //
    // it('test EditNewRecord method', function(done) {
    //     flux.actions.editNewRecord(recordId);
    //
    //     expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(1);
    //     expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.EDIT_REPORT_RECORD, jasmine.any(Object)]);
    //     done();
    // });
    //
    // it('test saveForm method', function(done) {
    //     flux.actions.savingForm();
    //
    //     expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(1);
    //     expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.SAVE_FORM]);
    //     done();
    // });
    //
    // it('test saveFormFailed method', function(done) {
    //     var failureReason = 'failureReason';
    //     flux.actions.saveFormFailed(failureReason);
    //
    //     expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(2);
    //     expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.SAVE_FORM_FAILED, failureReason]);
    //     expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([actions.SHOW_ERROR_MSG_DIALOG]);
    //     done();
    // });
    //
    // it('test saveFormSuccess method', function(done) {
    //     flux.actions.saveFormSuccess();
    //
    //     expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(1);
    //     expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.SAVE_FORM_SUCCESS]);
    //     done();
    // });
    //
    // it('test syncingForm method', function(done) {
    //     flux.actions.syncingForm();
    //
    //     expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(1);
    //     expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.SYNCING_FORM]);
    //     done();
    // });

});
