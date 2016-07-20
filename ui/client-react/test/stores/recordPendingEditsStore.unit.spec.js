import * as actions from '../../src/constants/actions';

import Store from '../../src/stores/recordPendingEditsStore';
import Fluxxor from 'fluxxor';

describe('Test recordPendingEdits Store ', () => {
    'use strict';

    let store;
    const STORE_NAME = 'RecordPendingEditsStore';
    let stores;
    let flux;
    let appTableRecPayload = {
        appId : 'a',
        tblId : 'b',
        recId : 4
    };

    beforeEach(() => {
        store = new Store();
        stores = {RecordPendingEditsStore: store};
        flux = new Fluxxor.Flux(stores);

        spyOn(flux.store(STORE_NAME), 'emit');
    });

    afterEach(() => {
        flux.store(STORE_NAME).emit.calls.reset();
        store = null;
    });

    it('test default recordPendingEdits store state', () => {
        // verify default states
        expect(flux.store(STORE_NAME).isPendingEdit).toBeFalsy();
        expect(flux.store(STORE_NAME).currentEditingAppId).toBeDefined();
        expect(flux.store(STORE_NAME).currentEditingTableId).toBeDefined();
        expect(flux.store(STORE_NAME).currentEditingRecordId).toBeDefined();
        expect(flux.store(STORE_NAME).originalRecord).toBeDefined();
        expect(flux.store(STORE_NAME).recordChanges).toEqual({});
        expect(flux.store(STORE_NAME).commitChanges.length).toBe(0);

        //  expect these bindActions
        expect(flux.store(STORE_NAME).__actions__.RECORD_EDIT_START).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.RECORD_EDIT_CHANGE_FIELD).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.RECORD_EDIT_CANCEL).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.RECORD_EDIT_SAVE).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.SAVE_REPORT_RECORD).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.SAVE_REPORT_RECORD_SUCCESS).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.SAVE_REPORT_RECORD_FAILED).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.ADD_REPORT_RECORD).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.ADD_REPORT_RECORD_SUCCESS).toBeDefined();
        expect(flux.store(STORE_NAME).__actions__.ADD_REPORT_RECORD_FAILED).toBeDefined();

    });

    it('test RecordEditStart recordPendingEdits action', () => {
        let original = {origRec : {rec:'info'}};
        let changes = {};
        let recordEditStartAction = {
            type: actions.RECORD_EDIT_START,
            payload : Object.assign({}, appTableRecPayload, original, {changes})
        };

        flux.dispatcher.dispatch(recordEditStartAction);
        expect(flux.store(STORE_NAME).currentEditingRecordId).toEqual(appTableRecPayload.recId);
        expect(flux.store(STORE_NAME).currentEditingAppId).toEqual(appTableRecPayload.appId);
        expect(flux.store(STORE_NAME).currentEditingTableId).toEqual(appTableRecPayload.tblId);
        expect(flux.store(STORE_NAME).recordChanges).toEqual({});
        expect(flux.store(STORE_NAME).originalRecord).toEqual(original.origRec);
        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(1);
    });

    it('test RecordEditStart no info recordPendingEdits action', () => {
        let recordEditStartAction = {
            type: actions.RECORD_EDIT_START,
            payload : {}
        };

        flux.dispatcher.dispatch(recordEditStartAction);
        expect(flux.store(STORE_NAME).currentEditingRecordId).not.toBeDefined();
        expect(flux.store(STORE_NAME).currentEditingAppId).not.toBeDefined();
        expect(flux.store(STORE_NAME).currentEditingTableId).not.toBeDefined();
        expect(flux.store(STORE_NAME).recordChanges).toEqual({});
        expect(flux.store(STORE_NAME).originalRecord).not.toBeDefined();

        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(1);
    });

    it('test RecordEditChangeField recordPendingEdits action', () => {
        let changes = {changes : {
            fid: 5,
            fieldName: 'Company',
            values: {
                oldVal : "abc",
                newVal : "xyz"
            }
        }};
        let recordEditChangeFieldAction = {
            type: actions.RECORD_EDIT_CHANGE_FIELD,
            payload : Object.assign({}, appTableRecPayload, changes)
        };

        flux.dispatcher.dispatch(recordEditChangeFieldAction);
        expect(flux.store(STORE_NAME).currentEditingRecordId).toEqual(appTableRecPayload.recId);
        expect(flux.store(STORE_NAME).currentEditingAppId).toEqual(appTableRecPayload.appId);
        expect(flux.store(STORE_NAME).currentEditingTableId).toEqual(appTableRecPayload.tblId);
        expect(flux.store(STORE_NAME).recordChanges[changes.changes.fid].oldVal).toEqual(changes.changes.values.oldVal);
        expect(flux.store(STORE_NAME).recordChanges[changes.changes.fid].newVal).toEqual(changes.changes.values.newVal);
        expect(flux.store(STORE_NAME).recordChanges[changes.changes.fid].fieldName).toEqual(changes.changes.fieldName);
        expect(flux.store(STORE_NAME).isPendingEdit).toBeTruthy();

        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(1);
    });

    it('test RecordEditCancel recordPendingEdits action', () => {
        let recordEditCancelAction = {
            type: actions.RECORD_EDIT_CANCEL
        };

        flux.dispatcher.dispatch(recordEditCancelAction);
        expect(flux.store(STORE_NAME).isPendingEdit).toBeFalsy();
        expect(flux.store(STORE_NAME).recordChanges).toEqual({});
        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(1);
    });

    it('test RecordEditSave no edits recordPendingEdits action', () => {
        let recordEditSaveAction = {
            type: actions.RECORD_EDIT_SAVE,
            payload : Object.assign({}, appTableRecPayload)
        };
        flux.dispatcher.dispatch(recordEditSaveAction);
        expect(flux.store(STORE_NAME).isPendingEdit).toBeFalsy();
        expect(flux.store(STORE_NAME).emit).not.toHaveBeenCalledWith('change');
        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(0);
    });

    it('test RecordEditSave with edits recordPendingEdits action', () => {
        let changes = {changes : {
            fid: 5,
            fieldName: 'Company',
            values: {
                oldVal : "abc",
                newVal : "xyz"
            }
        }};
        let recordEditChangeFieldAction = {
            type: actions.RECORD_EDIT_CHANGE_FIELD,
            payload : Object.assign({}, appTableRecPayload, changes)
        };

        flux.dispatcher.dispatch(recordEditChangeFieldAction);
        let recordEditSaveAction = {
            type: actions.RECORD_EDIT_SAVE,
            payload : Object.assign({}, appTableRecPayload)
        };

        flux.dispatcher.dispatch(recordEditSaveAction);
        expect(flux.store(STORE_NAME).isPendingEdit).toBeTruthy();
        expect(flux.store(STORE_NAME).emit).toHaveBeenCalledWith('change');
        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(2);
    });


    it('test onSaveRecord action', () => {
        let changes = {changes : {
            fid: 5,
            fieldName: 'Company',
            values: {
                oldVal : "abc",
                newVal : "xyz"
            }
        }};
        let onSaveRecordAction = {
            type: actions.SAVE_REPORT_RECORD,
            payload : Object.assign({}, appTableRecPayload, changes)

        };

        flux.dispatcher.dispatch(onSaveRecordAction);
        expect(flux.store(STORE_NAME).currentEditingAppId).toEqual(appTableRecPayload.appId);
        expect(flux.store(STORE_NAME).currentEditingTableId).toEqual(appTableRecPayload.tblId);
        expect(flux.store(STORE_NAME).currentEditingRecordId).toEqual(appTableRecPayload.recId);
        expect(flux.store(STORE_NAME).emit).not.toHaveBeenCalledWith('change');
        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(0);
    });

    it('test SaveRecordSuccess recordPendingEdits action', () => {
        let saveRecordSuccessAction = {
            type: actions.SAVE_REPORT_RECORD_SUCCESS,
            payload : Object.assign({}, appTableRecPayload)
        };

        flux.dispatcher.dispatch(saveRecordSuccessAction);
        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(1);
    });

    it('test SaveRecordSuccess with changes recordPendingEdits action', () => {

        let changes = {changes : {
            fid: 5,
            fieldName: 'Company',
            values: {
                oldVal : "abc",
                newVal : "xyz"
            }
        }};
        let recordEditChangeFieldAction = {
            type: actions.RECORD_EDIT_CHANGE_FIELD,
            payload : Object.assign({}, appTableRecPayload, changes)
        };

        flux.dispatcher.dispatch(recordEditChangeFieldAction);

        let recordEditSaveAction = {
            type: actions.RECORD_EDIT_SAVE,
            payload : Object.assign({}, appTableRecPayload)
        };
        flux.dispatcher.dispatch(recordEditSaveAction);

        let saveRecordSuccessAction = {
            type: actions.SAVE_REPORT_RECORD_SUCCESS,
            payload : Object.assign({}, appTableRecPayload)
        };

        flux.dispatcher.dispatch(saveRecordSuccessAction);
        expect(flux.store(STORE_NAME).isPendingEdit).toBe(false);
        expect(flux.store(STORE_NAME).currentEditingRecordId).toEqual(appTableRecPayload.recId);
        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(3);
    });

    it('test SaveRecordFailed recordPendingEdits action', () => {
        let changes = {changes : {
            fid: 5,
            fieldName: 'Company',
            values: {
                oldVal : "abc",
                newVal : "xyz"
            }
        }};
        let recordEditChangeFieldAction = {
            type: actions.RECORD_EDIT_CHANGE_FIELD,
            payload : Object.assign({}, appTableRecPayload, changes)
        };

        flux.dispatcher.dispatch(recordEditChangeFieldAction);
        let recordEditSaveAction = {
            type: actions.RECORD_EDIT_SAVE,
            payload : Object.assign({}, appTableRecPayload)
        };
        flux.dispatcher.dispatch(recordEditSaveAction);


        let saveRecordFailedAction = {
            type: actions.SAVE_REPORT_RECORD_FAILED,
            payload : Object.assign({}, appTableRecPayload)
        };

        flux.dispatcher.dispatch(saveRecordFailedAction);
        expect(flux.store(STORE_NAME).isPendingEdit).toBe(true);
        expect(flux.store(STORE_NAME).currentEditingRecordId).toEqual(appTableRecPayload.recId);
        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(3);
    });

    it('test onSaveAddedRecord action', () => {
        let changes = {changes : {
            fid: 5,
            fieldName: 'Company',
            values: {
                oldVal : "abc",
                newVal : "xyz"
            }
        }};
        let onSaveAddedRecordAction = {
            type: actions.ADD_REPORT_RECORD,
            payload : Object.assign({}, appTableRecPayload, {recId: null}, changes)

        };

        flux.dispatcher.dispatch(onSaveAddedRecordAction);
        expect(flux.store(STORE_NAME).currentEditingAppId).toEqual(appTableRecPayload.appId);
        expect(flux.store(STORE_NAME).currentEditingTableId).toEqual(appTableRecPayload.tblId);
        expect(flux.store(STORE_NAME).currentEditingRecordId).toEqual(null);
        expect(flux.store(STORE_NAME).emit).not.toHaveBeenCalledWith('change');
        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(0);
    });

    it('test onAddRecordSuccess recordPendingEdits action', () => {
        let changes = {changes : {
            fid: 5,
            fieldName: 'Company',
            values: {
                oldVal : "abc",
                newVal : "xyz"
            }
        }};
        let onSaveAddedRecordAction = {
            type: actions.ADD_REPORT_RECORD,
            payload : Object.assign({}, appTableRecPayload, {recId: null}, changes)

        };

        flux.dispatcher.dispatch(onSaveAddedRecordAction);

        let recordEditSaveAction = {
            type: actions.RECORD_EDIT_SAVE,
            payload : Object.assign({}, appTableRecPayload)
        };
        flux.dispatcher.dispatch(recordEditSaveAction);


        let onAddRecordSuccessAction = {
            type: actions.ADD_REPORT_RECORD_SUCCESS,
            payload : Object.assign({}, appTableRecPayload)
        };

        flux.dispatcher.dispatch(onAddRecordSuccessAction);
        expect(flux.store(STORE_NAME).currentEditingRecordId).toEqual(appTableRecPayload.recId);
        expect(flux.store(STORE_NAME).isPendingEdit).toBeFalsy();
        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(1);
    });

    it('test onAddRecordFailed recordPendingEdits action', () => {
        let onAddRecordFailedAction = {
            type: actions.ADD_REPORT_RECORD_FAILED,
            payload : Object.assign({}, appTableRecPayload)
        };

        flux.dispatcher.dispatch(onAddRecordFailedAction);
        expect(flux.store(STORE_NAME).emit.calls.count()).toBe(1);
    });



    it('test getState function', () => {

        let state = flux.store(STORE_NAME).getState();

        //  expect the following to be returned when 'getting state'
        expect(state.isPendingEdit).toBeDefined();
        expect(state.currentEditingAppId).toBeDefined();
        expect(state.currentEditingRecordId).toBeDefined();
        expect(state.originalRecord).toBeDefined();
        expect(state.recordChanges).toBeDefined();
        expect(state.commitChanges).toBeDefined();

    });


});
