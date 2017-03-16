import reducer, {__RewireAPI__ as RecordReducerRewireAPI} from '../../src/reducers/record';
import * as types from '../../src/actions/types';
import {UNSAVED_RECORD_ID} from "../../src/constants/schema";

function event(id, type, content) {
    return {
        id: id,
        type: type,
        content: content || null
    };
}

let initialState = [];
let appId = '1';
let tblId = '2';

describe('Record reducer delete functions', () => {

    let testCases = [
        {'name':'delete a single record start state', recIds: [1]},
        {'name':'delete a group of records start state', recIds: [1, 2, 3]}
    ];
    testCases.forEach(testCase => {
        let states;
        it(testCase.name, (done) => {
            //  start delete records state
            let ev = event(testCase.recIds[0], types.DELETE_RECORDS, {appId, tblId, recIds:testCase.recIds});
            states = reducer(initialState, ev);

            expect(states.length).toEqual(testCase.recIds.length);
            states.forEach(state => {
                expect(state.pendEdits).toBeDefined();
                expect(state.pendEdits.saving).toEqual(true);
            });
            done();
        });

        //  delete records error state..use existing store state to add errors
        let errors = [
            {msg: 'error message 1'},
            {msg: 'error message 2'}
        ];
        let errorTestCases = [
            {'name':'delete error state with no error block', errors:[], isValid:false},
            {'name':'delete error state with no error block defined', isValid:false},
            {'name':'delete error state with error block', errors:errors, isValid:true}
        ];
        errorTestCases.forEach(errorTestCase => {
            it(errorTestCase.name, (done) => {
                let ev = event(testCase.recIds[0], types.DELETE_RECORDS_ERROR, {
                    appId,
                    tblId,
                    recIds: testCase.recIds,
                    errors: errorTestCase.errors
                });
                const errorStates = reducer(states, ev);
                if (errorTestCase.isValid) {
                    expect(errorStates.length).toEqual(testCase.recIds.length);
                    errorStates.forEach(state => {
                        expect(state.pendEdits).toBeDefined();
                        expect(state.pendEdits.saving).toEqual(true);
                        expect(state.pendEdits.editErrors.errors.length).toEqual(errorTestCase.errors.length);
                        expect(state.pendEdits.editErrors.ok).toEqual(false);
                    });
                } else {
                    //  no change in state if invalid/missing errors list
                    expect(errorStates).toEqual(states);
                }
                done();
            });
        });

        ////  delete records completed state..use existing store state
        it('delete records complete state', (done) => {
            let ev = event(testCase.recIds[0], types.DELETE_RECORDS_COMPLETE, {appId, tblId, recIds: testCase.recIds});
            const completeState = reducer(states, ev);

            expect(completeState.length).toEqual(testCase.recIds.length);
            completeState.forEach(state => {
                expect(state.pendEdits).toBeDefined();
                expect(state.pendEdits.saving).toEqual(false);
                expect(state.pendEdits.editErrors.errors.length).toEqual(0);
                expect(state.pendEdits.editErrors.ok).toEqual(true);
            });
            done();
        });
    });
});

describe('Record reducer open record', () => {

    let initialState = [];
    let testCases = [
        {testCase:'open record with navigateAfterSave false', recId:1, nextRecordId:10, previousRecordId:20, navigateAfterSave:false, nextOrPreviousEdit:'11'},
        {testCase:'open record with navigateAfterSave true ', recId:1, nextRecordId:10, previousRecordId:20, navigateAfterSave:true, nextOrPreviousEdit:'11'},
        {testCase:'open record with missing input', recId:1, nextRecordId:10, previousRecordId:20}
    ];
    testCases.forEach(testCase => {
        it(testCase.name, (done) => {
            const obj = {
                recId: testCase.recId,
                nextRecordId: testCase.nextRecordId,
                previousRecordId: testCase.previousRecordId,
                navigateAfterSave: testCase.navigateAfterSave,
                nextOrPreviousEdit: testCase.nextOrPreviousEdit
            };
            const state = reducer(initialState, event(testCase.recId, types.OPEN_RECORD, obj));
            const record = state[0];

            expect(record.id).toEqual(testCase.recId);
            expect(record.recId).toEqual(testCase.recId);
            expect(record.nextRecordId).toEqual(testCase.nextRecordId);
            expect(record.previousRecordId).toEqual(testCase.previousRecordId);
            expect(record.navigateAfterSave).toEqual(testCase.navigateAfterSave || false);
            expect(record.nextOrPreviousEdit).toEqual(testCase.nextOrPreviousEdit || '');
            done();
        });
    });
});

describe('Record reducer save record events', () => {
    let saveState = [];
    let changes = {};
    let recId = 3;

    class mockRecordModel {
        constructor() { }
        setRecordChanges(a, b, c) { }
        setRecordSaveSuccess(a, b, c) { }
        setRecordSaveError(a, b, c, e) { }
        setSaving(b) { }
        get() { }
        set(a) { }
    }

    beforeEach(() => {
        spyOn(mockRecordModel.prototype, 'setRecordChanges').and.callThrough();
        spyOn(mockRecordModel.prototype, 'setRecordSaveSuccess').and.callThrough();
        spyOn(mockRecordModel.prototype, 'setRecordSaveError').and.callThrough();
        spyOn(mockRecordModel.prototype, 'setSaving').and.callThrough();
        spyOn(mockRecordModel.prototype, 'get').and.callThrough();
        spyOn(mockRecordModel.prototype, 'set').and.callThrough();
        RecordReducerRewireAPI.__Rewire__('RecordModel', mockRecordModel);
    });

    afterEach(() => {
        mockRecordModel.prototype.get.calls.reset();
        mockRecordModel.prototype.set.calls.reset();
        mockRecordModel.prototype.setSaving.calls.reset();
        mockRecordModel.prototype.setRecordSaveError.calls.reset();
        mockRecordModel.prototype.setRecordSaveSuccess.calls.reset();
        mockRecordModel.prototype.setRecordChanges.calls.reset();
        RecordReducerRewireAPI.__ResetDependency__('RecordModel');
    });

    let testCases = [
        {testCase: 'save new record', appId: appId, tblId: tblId, recId: recId, changes: changes, recordInStore: false},
        {testCase: 'save existing record', appId: appId, tblId: tblId, recId: recId, changes: changes, recordInStore: true}
    ];
    testCases.forEach(testCase => {
        it(testCase.name, (done) => {
            const obj = {
                appId: testCase.appId,
                tblId: testCase.tblId,
                recId: testCase.recId,
                changes: testCase.changes
            };

            saveState = reducer(saveState, event(testCase.recId, types.SAVE_RECORD, obj));
            const record = saveState[0];

            expect(mockRecordModel.prototype.setRecordChanges).toHaveBeenCalled();
            if (testCase.recordInStore) {
                expect(mockRecordModel.prototype.get).not.toHaveBeenCalled();
                expect(mockRecordModel.prototype.set).toHaveBeenCalled();
            } else {
                expect(mockRecordModel.prototype.get).toHaveBeenCalled();
                expect(mockRecordModel.prototype.set).not.toHaveBeenCalled();
            }
            done();
        });
    });

    let errors = [
        {msg: 'error message 1'},
        {msg: 'error message 2'}
    ];
    let errorTestCases = [
        {'name': 'save record error - record not in store', appId:appId, tblId:tblId, recId:99, errors:errors, recordInStore:false},
        {'name': 'save record error - record in store', appId:appId, tblId:tblId, recId:recId, errors:errors, recordInStore:true}
    ];
    errorTestCases.forEach(testCase => {
        it(testCase.name, (done) => {
            const obj = {
                appId: testCase.appId,
                tblId: testCase.tblId,
                recId: testCase.recId,
                errors: testCase.errors
            };
            saveState = reducer(saveState, event(testCase.recId, types.SAVE_RECORD_ERROR, obj));
            if (testCase.recordInStore) {
                expect(mockRecordModel.prototype.set).toHaveBeenCalled();
                expect(mockRecordModel.prototype.setRecordSaveError).toHaveBeenCalled();
            } else {
                expect(mockRecordModel.prototype.set).not.toHaveBeenCalled();
                expect(mockRecordModel.prototype.setRecordSaveError).not.toHaveBeenCalled();
            }
            done();
        });
    });

    let successTestCases = [
        {'name': 'save record success - record not in store', appId:appId, tblId:tblId, recId:99, recordInStore:false},
        {'name': 'save record error - record in store', appId:appId, tblId:tblId, recId:recId,  recordInStore:true}
    ];
    successTestCases.forEach(testCase => {
        it(testCase.name, (done) => {
            const obj = {
                appId: testCase.appId,
                tblId: testCase.tblId,
                recId: testCase.recId
            };
            saveState = reducer(saveState, event(testCase.recId, types.SAVE_RECORD_SUCCESS, obj));
            if (testCase.recordInStore) {
                expect(mockRecordModel.prototype.setSaving).toHaveBeenCalledWith(false);
                expect(mockRecordModel.prototype.setRecordSaveSuccess).toHaveBeenCalled();
            } else {
                expect(mockRecordModel.prototype.setSaving).not.toHaveBeenCalled();
                expect(mockRecordModel.prototype.setRecordSaveSuccess).not.toHaveBeenCalled();
            }
            done();
        });
    });

    let completeTestCases = [
        {'name': 'save record complete - record not in store', appId:appId, tblId:tblId, recId:99, recordInStore:false},
        {'name': 'save record complete - record in store', appId:appId, tblId:tblId, recId:recId,  recordInStore:true}
    ];
    completeTestCases.forEach(testCase => {
        it(testCase.name, (done) => {
            const obj = {
                appId: testCase.appId,
                tblId: testCase.tblId,
                recId: testCase.recId
            };
            saveState = reducer(saveState, event(testCase.recId, types.SAVE_RECORD_COMPLETE, obj));
            if (testCase.recordInStore) {
                expect(mockRecordModel.prototype.setSaving).toHaveBeenCalledWith(false, true);
            } else {
                expect(mockRecordModel.prototype.setSaving).not.toHaveBeenCalled();
            }
            done();
        });
    });
});

describe('Record reducer edit record events', () => {
    let changes = {};
    let recId = 3;
    let mockModel = {id:recId, pendEdits:{}};

    class mockRecordModel {
        constructor() { }
        setEditRecordStart(a) { }
        setEditRecordChange(a) { }
        setEditRecordValidate(a) { }
        get() {
            return mockModel;
        }
        set(a) { }
    }

    beforeEach(() => {
        spyOn(mockRecordModel.prototype, 'get').and.callThrough();
        spyOn(mockRecordModel.prototype, 'set').and.callThrough();
        spyOn(mockRecordModel.prototype, 'setEditRecordStart').and.callThrough();
        spyOn(mockRecordModel.prototype, 'setEditRecordChange').and.callThrough();
        spyOn(mockRecordModel.prototype, 'setEditRecordValidate').and.callThrough();
        RecordReducerRewireAPI.__Rewire__('RecordModel', mockRecordModel);
    });

    afterEach(() => {
        mockRecordModel.prototype.get.calls.reset();
        mockRecordModel.prototype.set.calls.reset();
        mockRecordModel.prototype.setEditRecordStart.calls.reset();
        mockRecordModel.prototype.setEditRecordChange.calls.reset();
        mockRecordModel.prototype.setEditRecordValidate.calls.reset();
        RecordReducerRewireAPI.__ResetDependency__('RecordModel');
    });

    let testCases = [
        {name: 'start edit record..not in store', recId:recId, recordInStore: false},
        {name: 'start edit record..in store', recId: recId, changes: changes, recordInStore: true}
    ];
    testCases.forEach(testCase => {
        it(testCase.name, (done) => {
            const obj = {
                appId:appId,
                tblId:tblId,
                recId:testCase.recId,
                origRec: {},
                changes: {},
                isInlineEdit: true,
                fieldToStartEditing: null
            };
            mockRecordModel.prototype.setEditRecordStart.calls.reset();

            let recordState = reducer(initialState, event(testCase.recId, types.EDIT_RECORD_START, obj));
            if (testCase.recordInStore) {
                mockRecordModel.prototype.setEditRecordStart.calls.reset();
                recordState = reducer(recordState, event(testCase.recId, types.EDIT_RECORD_START, obj));
            }
            const record = recordState[0];

            expect(mockRecordModel.prototype.setEditRecordStart).toHaveBeenCalled();
            expect(record.id).toEqual(testCase.recId);

            done();
        });
    });

    testCases = [

        {name: 'change edit record..not in store', recId:recId, recordInStore: false},
        {name: 'change edit record..in store', recId: recId, changes: changes, recordInStore: true}
    ];
    testCases.forEach(testCase => {
        it(testCase.name, (done) => {
            const obj = {
                appId:appId,
                tblId:tblId,
                recId:testCase.recId,
                origRec: {},
                changes: {},
                isInlineEdit: true,
                fieldToStartEditing: null
            };

            let recordState = reducer(initialState, event(testCase.recId, types.EDIT_RECORD_CHANGE, obj));
            if (testCase.recordInStore) {
                mockRecordModel.prototype.set.calls.reset();
                mockRecordModel.prototype.setEditRecordStart.calls.reset();
                mockRecordModel.prototype.setEditRecordChange.calls.reset();
                recordState = reducer(recordState, event(testCase.recId, types.EDIT_RECORD_CHANGE, obj));
            }
            const record = recordState[0];

            if (testCase.recordInStore) {
                expect(mockRecordModel.prototype.set).toHaveBeenCalled();
            } else {
                expect(mockRecordModel.prototype.setEditRecordStart).toHaveBeenCalled();
            }

            expect(mockRecordModel.prototype.setEditRecordChange).toHaveBeenCalled();
            expect(record.id).toEqual(testCase.recId);
            done();
        });
    });

    testCases = [
        {name: 'validate edit record..not in store', recId:recId, recordInStore: false},
        {name: 'validate edit record..in store', recId: recId, changes: changes, recordInStore: true}
    ];
    testCases.forEach(testCase => {
        it(testCase.name, (done) => {
            const obj = {
                recId:testCase.recId,
                fieldDef: {},
                fieldLabel: {},
                value: {},
                checkRequired: null
            };

            if (testCase.recordInStore) {
                //  need to put a record in the store before verifying..
                let recordState = reducer(initialState, event(testCase.recId, types.EDIT_RECORD_START, obj));
                mockRecordModel.prototype.set.calls.reset();
                mockRecordModel.prototype.setEditRecordValidate.calls.reset();
                reducer(recordState, event(testCase.recId, types.EDIT_RECORD_VALIDATE_FIELD, obj));
            } else {
                reducer(initialState, event(testCase.recId, types.EDIT_RECORD_VALIDATE_FIELD, obj));
            }

            if (testCase.recordInStore) {
                expect(mockRecordModel.prototype.set).toHaveBeenCalled();
                expect(mockRecordModel.prototype.setEditRecordValidate).toHaveBeenCalled();
            } else {
                expect(mockRecordModel.prototype.set).not.toHaveBeenCalled();
                expect(mockRecordModel.prototype.setEditRecordValidate).not.toHaveBeenCalled();
            }

            done();
        });
    });

    testCases = [
        {name: 'cancel edit record..not in store', recId:recId, recordInStore: false},
        {name: 'cancel edit record..in store', recId: recId, recordInStore: true}
    ];
    testCases.forEach(testCase => {
        it(testCase.name, (done) => {
            const obj = {
                appId: appId,
                tblId: tblId,
                recId: testCase.recid
            };

            if (testCase.recordInStore) {
                //  need to put a record in the store before verifying..
                let recordState = reducer(initialState, event(testCase.recId, types.EDIT_RECORD_START, obj));
                recordState = reducer(recordState, event(testCase.recId, types.EDIT_RECORD_CANCEL, obj));
                expect(recordState[0].pendEdits).not.toBeDefined();
            } else {
                let recordState = reducer(initialState, event(testCase.recId, types.EDIT_RECORD_CANCEL, obj));
                expect(recordState).toEqual(initialState);
            }

            done();
        });
    });

});


