import * as recordActions from '../../src/actions/recordActions';
import {__RewireAPI__ as RecordActionsRewireAPI} from '../../src/actions/recordActions';
import * as types from '../../src/actions/types';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import Promise from 'bluebird';

// we mock the Redux store when testing async action creators
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

function event(id, type, content) {
    return {
        id: id,
        type: type,
        content: content || null
    };
}

describe('Open/edit Record actions', () => {
    it('Open a record', () => {
        let obj = {
            recId: 1,
            nextRecordId: 2,
            previousRecordId: 3
        };
        expect(recordActions.openRecord(obj.recId, obj.nextRecordId, obj.previousRecordId)).toEqual(event(obj.recId, types.OPEN_RECORD, obj));
    });

    let obj1 = {
        appId: 1,
        tblId: 2,
        recId: 3,
        origRec: {'origRec':1},
        changes: {'changes':2},
        isInlineEdit: true,
        fieldToStartEditing: null
    };
    let obj2 = {
        appId: 1,
        tblId: 2,
        recId: 3
    };
    let testCases = [
        {name:'Edit a record:start', func:recordActions.editRecordStart, type:types.EDIT_RECORD_START, obj:obj1, expectation:event(obj1.recId, types.EDIT_RECORD_START, obj1)},
        {name:'Edit a record:change', func:recordActions.editRecordChange, type:types.EDIT_RECORD_CHANGE, obj:obj1, expectation:event(obj1.recId, types.EDIT_RECORD_CHANGE, obj1)},
        {name:'Edit a record:cancel', func:recordActions.editRecordCancel, type:types.EDIT_RECORD_CANCEL, obj:obj2, expectation:event(obj2.recId, types.EDIT_RECORD_CANCEL, obj2)}
    ];

    testCases.forEach((testCase) => {
        it(testCase.name, () => {
            /*eslint-disable no-invalid-this */
            expect(testCase.func.apply(this, [testCase.obj.appId, testCase.obj.tblId, testCase.obj.recId, testCase.obj.origRec,
                testCase.obj.changes, testCase.obj.isInlineEdit, testCase.obj.fieldToStartEditing])).toEqual(testCase.expectation);
        });
    });

    it('Validate a record', () => {
        let obj = {
            recId: 1,
            fieldDef: 'fieldDef',
            fieldLabel: 'fieldLabel',
            value: 'value',
            checkRequired: true
        };
        expect(recordActions.editRecordValidateField(obj.recId, obj.fieldDef, obj.fieldLabel, obj.value, obj.checkRequired)).toEqual(event(obj.recId, types.EDIT_RECORD_VALIDATE_FIELD, obj));
    });
});

describe('Delete Record Actions -- success workflow', () => {
    class mockRecordService  {
        constructor() { }
        deleteRecords(appId, tblId, recIds) {
            return Promise.resolve();
        }
    }

    let notificationSuccess = jasmine.createSpy();
    beforeEach(() => {
        spyOn(mockRecordService.prototype, 'deleteRecords').and.callThrough();
        RecordActionsRewireAPI.__Rewire__('RecordService', mockRecordService);
        RecordActionsRewireAPI.__Rewire__('NotificationManager', {success: notificationSuccess});
    });

    afterEach(() => {
        RecordActionsRewireAPI.__ResetDependency__('RecordService');
        RecordActionsRewireAPI.__ResetDependency__('NotificationManager');
    });

    const appId = '1';
    const tblId = '2';
    let testCases = [
        {name: 'delete a list of records', func:recordActions.deleteRecords, recIds:[1, 2, 3]},
        {name: 'delete a record', func:recordActions.deleteRecord, recIds: 1}
    ];

    testCases.forEach((testCase) => {
        it(testCase.name, (done) => {
            const expectedRecIds = Array.isArray(testCase.recIds) ? testCase.recIds : [testCase.recIds];
            const expectedActions = [
                event(expectedRecIds[0], types.DELETE_RECORDS, {appId, tblId, recIds:expectedRecIds}),
                event(expectedRecIds[0], types.REMOVE_REPORT_RECORDS, {appId, tblId, recIds:expectedRecIds}),
                event(expectedRecIds[0], types.DELETE_RECORDS_COMPLETE, {appId, tblId, recIds:expectedRecIds})
            ];

            const store = mockStore({});
            /*eslint-disable no-invalid-this */
            return store.dispatch(testCase.func.apply(this, [appId, tblId, testCase.recIds, 'name'])).then(
                () => {
                    expect(store.getActions()).toEqual(expectedActions);
                    expect(notificationSuccess).toHaveBeenCalled();
                    done();
                },
                () => {
                    expect(false).toEqual(true);
                    done();
                });
        });
    });
});

describe('Delete Record Actions -- invalid parameters', () => {
    class mockRecordService  {
        constructor() { }
        deleteRecords(appId, tblId, recIds) {
            return Promise.reject();
        }
    }

    let notificationSuccess = jasmine.createSpy();
    let notificationError = jasmine.createSpy();
    beforeEach(() => {
        spyOn(mockRecordService.prototype, 'deleteRecords').and.callThrough();
        RecordActionsRewireAPI.__Rewire__('RecordService', mockRecordService);
        RecordActionsRewireAPI.__Rewire__('NotificationManager', {success: notificationSuccess, error: notificationError});
    });

    afterEach(() => {
        RecordActionsRewireAPI.__ResetDependency__('RecordService');
        RecordActionsRewireAPI.__ResetDependency__('NotificationManager');
    });

    let testCases = [
        {name: 'missing appId', appId: null, tblId: 1, recIds:[1, 2, 3]},
        {name: 'missing tblId', appId: 1, tblId: null, recIds:[1, 2, 3]},
        {name: 'missing recId', appId: 1, tblId: 2, recIds:null},
        {name: 'empty recId', appId: 1, tblId: 2, recIds:[]}
    ];

    testCases.forEach((testCase) => {
        it(testCase.name, (done) => {
            const store = mockStore({});
            return store.dispatch(recordActions.deleteRecords(testCase.appId, testCase.tblId, testCase.recIds, 'name')).then(
                () => {
                    expect(false).toEqual(true);
                    done();
                },
                () => {
                    expect(notificationSuccess).not.toHaveBeenCalled();
                    expect(notificationError).toHaveBeenCalled();
                    done();
                });
        });
    });
});

describe('Delete Record Actions -- failure workflow', () => {
    let errorResponse = {
        data: {
            response: {
                errors: [
                    'error1',
                    'error2'
                ]
            }
        }
    };
    class mockRecordService  {
        constructor() { }
        deleteRecords(appId, tblId, recIds) {
            return Promise.reject(errorResponse);
        }
    }

    let notificationSuccess = jasmine.createSpy();
    let notificationError = jasmine.createSpy();
    beforeEach(() => {
        spyOn(mockRecordService.prototype, 'deleteRecords').and.callThrough();
        RecordActionsRewireAPI.__Rewire__('RecordService', mockRecordService);
        RecordActionsRewireAPI.__Rewire__('NotificationManager', {success: notificationSuccess, error: notificationError});
    });

    afterEach(() => {
        RecordActionsRewireAPI.__ResetDependency__('RecordService');
        RecordActionsRewireAPI.__ResetDependency__('NotificationManager');
    });

    const appId = '1';
    const tblId = '2';
    const recIds = [1, 2, 3];
    const expectedActions = [
        event(recIds[0], types.DELETE_RECORDS, {appId, tblId, recIds}),
        event(recIds[0], types.DELETE_RECORDS_ERROR, {appId, tblId, recIds, errors:errorResponse.data.response.errors}),
        event(recIds[0], types.DELETE_RECORDS_COMPLETE, {appId, tblId, recIds})
    ];

    it('deleteRecord promise reject', (done) => {
        const store = mockStore({});
        return store.dispatch(recordActions.deleteRecords(appId, tblId, recIds, 'name')).then(
            () => {
                expect(false).toEqual(true);
                done();
            },
            () => {
                expect(store.getActions()).toEqual(expectedActions);
                expect(notificationSuccess).not.toHaveBeenCalled();
                expect(notificationError).toHaveBeenCalled();
                done();
            });
    });
});

