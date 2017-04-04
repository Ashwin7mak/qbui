import * as recordActions from '../../src/actions/recordActions';
import {__RewireAPI__ as RecordActionsRewireAPI} from '../../src/actions/recordActions';
import * as types from '../../src/actions/types';
import {NEW_RECORD_VALUE} from '../../src/constants/urlConstants';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import Promise from 'bluebird';

Promise.onPossiblyUnhandledRejection(function() {
    // swallow the error..
});

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

describe('create Record Actions -- success workflow', () => {
    let newRecId = 34;
    let record = {
        fields: [],
        records: []
    };
    class mockRecordService {
        constructor() { }
        createRecord(appId, tblId, recd) {
            return Promise.resolve({data: {body: '{"id" : ' + newRecId + '}'}});
        }
        getRecord() {
            return Promise.resolve({data: record});
        }
    }

    let notificationSuccess = jasmine.createSpy();
    beforeEach(() => {
        spyOn(mockRecordService.prototype, 'createRecord').and.callThrough();
        RecordActionsRewireAPI.__Rewire__('RecordService', mockRecordService);
        RecordActionsRewireAPI.__Rewire__('NotificationManager', {success: notificationSuccess});
    });

    afterEach(() => {
        notificationSuccess.calls.reset();
        RecordActionsRewireAPI.__ResetDependency__('RecordService');
        RecordActionsRewireAPI.__ResetDependency__('NotificationManager');
    });

    const appId = '1';
    const tblId = '2';
    const recId = NEW_RECORD_VALUE;

    let fields = [
        {id: 4, builtIn: false, datatypeAttributes :true},
        {id: 5, builtIn: true}
    ];

    let newVal = {value:"hi", display:"there"};
    let recordChanges = {
        4:{fieldName : 'col_num', fieldDef: fields[0], newVal: newVal},
        5:{fieldName : 'col_builtin', fieldDef: fields[1], newVal: {value:"5", display:"no edit"}}
    };

    const expectedActions = [
        event(recId, types.SAVE_RECORD, {appId, tblId, recId, changes:recordChanges}),
        event(recId, types.SAVE_RECORD_SUCCESS, {appId, tblId, recId, report:jasmine.any(Object)}),
        event(recId, types.SAVE_RECORD_COMPLETE, {appId, tblId, recId})
    ];

    let testCases = [
        {name:'create new record - notifications on', showNotification: true},
        {name:'create new record - notifications off', showNotification: false}
    ];
    testCases.forEach((testCase) => {
        const store = mockStore({});
        it('create new record', (done) => {
            const params = {
                fields: fields,
                recordChanges: recordChanges,
                showNotificationOnSuccess: testCase.showNotification
            };

            return store.dispatch(recordActions.createRecord(appId, tblId, params)).then(
                () => {
                    expect(store.getActions()).toEqual(expectedActions);
                    if (testCase.showNotification) {
                        expect(notificationSuccess).toHaveBeenCalled();
                    } else {
                        expect(notificationSuccess).not.toHaveBeenCalled();
                    }
                    done();
                },
                () => {
                    expect(false).toEqual(true);
                    done();
                });
        });
    });
});

describe('create Record Actions -- create record failure', () => {
    let newRecId = 34;
    let record = {
        fields: [],
        records: []
    };
    let errorResponse = {
        data: {
            response: {
                errors: ['someError']
            }
        },
        response: {
            status: null,
            data: {
                response: {
                    status: null
                }
            }
        }
    };
    class mockRecordService {
        constructor() { }
        createRecord(appId, tblId, recd) {
            return Promise.reject(errorResponse);
        }
        getRecord() {
            return Promise.resolve({data: record});
        }
    }

    let notificationSuccess = jasmine.createSpy();
    let notificationError = jasmine.createSpy();
    beforeEach(() => {
        spyOn(mockRecordService.prototype, 'createRecord').and.callThrough();
        spyOn(mockRecordService.prototype, 'getRecord').and.callThrough();
        RecordActionsRewireAPI.__Rewire__('RecordService', mockRecordService);
        RecordActionsRewireAPI.__Rewire__('NotificationManager', {success: notificationSuccess, error: notificationError});
    });

    afterEach(() => {
        notificationSuccess.calls.reset();
        notificationError.calls.reset();
        mockRecordService.prototype.createRecord.calls.reset();
        mockRecordService.prototype.getRecord.calls.reset();
        RecordActionsRewireAPI.__ResetDependency__('RecordService');
        RecordActionsRewireAPI.__ResetDependency__('NotificationManager');
    });

    const appId = '1';
    const tblId = '2';
    const recId = NEW_RECORD_VALUE;

    let fields = [
        {id: 4, builtIn: false, datatypeAttributes :true},
        {id: 5, builtIn: true}
    ];

    let newVal = {value:"hi", display:"there"};
    let recordChanges = {
        4:{fieldName : 'col_num', fieldDef: fields[0], newVal: newVal},
        5:{fieldName : 'col_builtin', fieldDef: fields[1], newVal: {value:"5", display:"no edit"}}
    };

    let testCases = [
        {name: 'missing appId', appId: null, tblId: tblId, params:{recordChanges:recordChanges, fields:fields}},
        {name: 'missing tblId', appId: appId, tblId: null, params:{recordChanges:recordChanges, fields:fields}},
        {name: 'missing fields param', appId: appId, tblId: tblId, params:{recordChanges:recordChanges}}
    ];

    testCases.forEach((testCase) => {
        it(testCase.name, (done) => {
            const store = mockStore({});
            return store.dispatch(recordActions.createRecord(testCase.appId, testCase.tblId, testCase.params)).then(
                () => {
                    expect(false).toEqual(true);
                    done();
                },
                () => {
                    expect(mockRecordService.prototype.createRecord).not.toHaveBeenCalled();
                    expect(store.getActions()).toEqual([]);
                    expect(notificationError).toHaveBeenCalled();
                    done();
                });
        });
    });

    const expectedActions = [
        event(recId, types.SAVE_RECORD, {appId, tblId, recId, changes:recordChanges}),
        event(recId, types.SAVE_RECORD_ERROR, {appId, tblId, recId, errors:jasmine.any(Object)}),
        event(recId, types.SAVE_RECORD_COMPLETE, {appId, tblId, recId})
    ];

    let testCasesServices = [
        {name: 'createRecord error', appId: appId, tblId: tblId, params:{recordChanges:recordChanges, fields:fields}, errStatus:null, errorResponse:errorResponse},
        {name: 'createRecord error - 403', appId: appId, tblId: tblId, params:{recordChanges:recordChanges, fields:fields}, errStatus:403, errorResponse:errorResponse},
        {name: 'createRecord error - 404', appId: appId, tblId: tblId, params:{recordChanges:recordChanges, fields:fields}, errStatus:404, errorResponse:errorResponse},
        {name: 'createRecord error - 500', appId: appId, tblId: tblId, params:{recordChanges:recordChanges, fields:fields}, errStatus:500, errorResponse:errorResponse},
        {name: 'createRecord error with no errors', appId: appId, tblId: tblId, params:{recordChanges:recordChanges, fields:fields}, errStatus:null, errorResponse:{}},
    ];
    testCasesServices.forEach((testCase) => {
        it(testCase.name, (done) => {
            //  set the error status for each test
            errorResponse.response.status = testCase.errStatus;
            errorResponse.response.data.response.status = testCase.errStatus;

            //  set the error response returned by the mocked createRecord promise for each test
            errorResponse.data.response.errors = testCase.errorResponse;
            let errors = [];
            if (_.has(errorResponse, 'data.response.errors')) {
                errors = errorResponse.data.response.errors || [];
            }

            const store = mockStore({});
            return store.dispatch(recordActions.createRecord(testCase.appId, testCase.tblId, testCase.params)).then(
                () => {
                    expect(false).toEqual(true);
                    done();
                },
                () => {
                    expect(mockRecordService.prototype.createRecord).toHaveBeenCalled();
                    expect(mockRecordService.prototype.getRecord).not.toHaveBeenCalled();
                    expect(store.getActions()).toEqual(expectedActions);
                    if (testCase.errStatus) {
                        expect(notificationError).toHaveBeenCalled();
                    }
                    expect(notificationSuccess).not.toHaveBeenCalled();
                    done();
                });
        });
    });
});

describe('create Record Actions -- get record failure', () => {
    let newRecId = 34;
    let record = {
        fields: [],
        records: []
    };
    let errorResponse = {
        data: {
            response: {
                errors: ['someError']
            }
        },
        response: {
            status: null,
            data: {
                response: {
                    status: null
                }
            }
        }
    };
    class mockRecordService {
        constructor() { }
        createRecord(appId, tblId, recd) {
            return Promise.resolve({data: {body: '{"id" : ' + newRecId + '}'}});
        }
        getRecord() {
            return Promise.reject(errorResponse);
        }
    }

    let notificationSuccess = jasmine.createSpy();
    let notificationError = jasmine.createSpy();
    beforeEach(() => {
        spyOn(mockRecordService.prototype, 'createRecord').and.callThrough();
        spyOn(mockRecordService.prototype, 'getRecord').and.callThrough();
        RecordActionsRewireAPI.__Rewire__('RecordService', mockRecordService);
        RecordActionsRewireAPI.__Rewire__('NotificationManager', {success: notificationSuccess, error: notificationError});
    });

    afterEach(() => {
        notificationSuccess.calls.reset();
        notificationError.calls.reset();
        mockRecordService.prototype.createRecord.calls.reset();
        mockRecordService.prototype.getRecord.calls.reset();
        RecordActionsRewireAPI.__ResetDependency__('RecordService');
        RecordActionsRewireAPI.__ResetDependency__('NotificationManager');
    });

    const appId = '1';
    const tblId = '2';
    const recId = NEW_RECORD_VALUE;

    let fields = [
        {id: 4, builtIn: false, datatypeAttributes :true},
        {id: 5, builtIn: true}
    ];

    let newVal = {value:"hi", display:"there"};
    let recordChanges = {
        4:{fieldName : 'col_num', fieldDef: fields[0], newVal: newVal},
        5:{fieldName : 'col_builtin', fieldDef: fields[1], newVal: {value:"5", display:"no edit"}}
    };

    const expectedActions = [
        event(recId, types.SAVE_RECORD, {appId, tblId, recId, changes:recordChanges}),
        event(recId, types.SAVE_RECORD_ERROR, {appId, tblId, recId, errors:jasmine.any(Object)}),
        event(recId, types.SAVE_RECORD_COMPLETE, {appId, tblId, recId})
    ];

    let testCasesServices = [
        {name: 'getRecord failure with id', appId: appId, tblId: tblId, params:{recordChanges:recordChanges, fields:fields, recId:newRecId}},
        {name: 'getRecord failure without id', appId: appId, tblId: tblId, params:{recordChanges:recordChanges, fields:fields, recId:null}}

    ];
    testCasesServices.forEach((testCase) => {
        newRecId = testCase.recId;

        const store = mockStore({});
        return store.dispatch(recordActions.createRecord(testCase.appId, testCase.tblId, testCase.params)).then(
            () => {
                expect(false).toEqual(true);
                done();
            },
            () => {
                expect(mockRecordService.prototype.createRecord).toHaveBeenCalled();
                expect(mockRecordService.prototype.getRecord).toHaveBeenCalled();
                expect(store.getActions()).toEqual(expectedActions);
                expect(notificationError).toHaveBeenCalled();
                done();
            });
    });
});

describe('update Record Actions -- success workflow', () => {

    const appId = '1';
    const tblId = '2';
    const recId = 3;

    let record = {
        fields: [],
        records: []
    };
    let responseData = {appId, tblId, data: 'success'};
    class mockRecordService {
        constructor() { }
        saveRecord(a, b, c) {
            return Promise.resolve(responseData);
        }
        getRecord() {
            return Promise.resolve({data: record});
        }
    }

    let notificationSuccess = jasmine.createSpy();
    let notificationError = jasmine.createSpy();
    beforeEach(() => {
        spyOn(mockRecordService.prototype, 'saveRecord').and.callThrough();
        spyOn(mockRecordService.prototype, 'getRecord').and.callThrough();
        RecordActionsRewireAPI.__Rewire__('RecordService', mockRecordService);
        RecordActionsRewireAPI.__Rewire__('NotificationManager', {success: notificationSuccess, error: notificationError});
    });

    afterEach(() => {
        notificationSuccess.calls.reset();
        notificationError.calls.reset();
        mockRecordService.prototype.saveRecord.calls.reset();
        mockRecordService.prototype.getRecord.calls.reset();
        RecordActionsRewireAPI.__ResetDependency__('RecordService');
        RecordActionsRewireAPI.__ResetDependency__('NotificationManager');
    });

    let fields = [
        {id:6, name: "test"}
    ];
    let pendEdits = {
        recordChanges: {
            6: {
                fieldName: "test",
                fieldDef: fields[0],
                newVal: {value: "value", display: "display"}
            }
        },
        originalRecord: {
            fids: {6: {
                display: "oldDisplay",
                value: "oldValue",
                id: 6
            }}
        }
    };

    let changes = [
        {display : "display", fieldDef: fields[0], fieldName: "test", id: 6, value: "value"}
    ];

    const expectedActions = [
        event(recId, types.SAVE_RECORD, {appId, tblId, recId, changes:changes}),
        event(recId, types.SAVE_RECORD_SUCCESS, {appId, tblId, recId, report:jasmine.any(Object)})
    ];

    let testCases = [
        {name:'update record - notifications on', showNotification: true},
        {name:'update record - notifications off', showNotification: false}
    ];
    testCases.forEach((testCase) => {
        const store = mockStore({});
        it('update a record', (done) => {
            const params = {
                context: 'NAV',
                fields: fields,
                pendEdits: pendEdits,
                colList: [],
                showNotificationOnSuccess: testCase.showNotification
            };

            return store.dispatch(recordActions.updateRecord(appId, tblId, recId, params)).then(
                () => {
                    expect(store.getActions()).toEqual(expectedActions);
                    if (testCase.showNotification) {
                        expect(notificationSuccess).toHaveBeenCalled();
                    } else {
                        expect(notificationSuccess).not.toHaveBeenCalled();
                    }
                    done();
                },
                () => {
                    expect(false).toEqual(true);
                    done();
                });
        });
    });
});

describe('update Record Actions -- error workflow', () => {

    const appId = '1';
    const tblId = '2';
    const recId = 3;

    let record = {
        fields: [],
        records: []
    };
    let errorResponse = {
        data: {
            response: {
                errors: ['someError']
            }
        }
    };
    class mockRecordService {
        constructor() { }
        saveRecord(a, t, r) {
            return Promise.reject(errorResponse);
        }
        getRecord() {
            return Promise.reject({data: record});
        }
    }

    let notificationSuccess = jasmine.createSpy();
    let notificationError = jasmine.createSpy();
    beforeEach(() => {
        spyOn(mockRecordService.prototype, 'saveRecord').and.callThrough();
        spyOn(mockRecordService.prototype, 'getRecord').and.callThrough();
        RecordActionsRewireAPI.__Rewire__('RecordService', mockRecordService);
        RecordActionsRewireAPI.__Rewire__('NotificationManager', {success: notificationSuccess, error: notificationError});
    });

    afterEach(() => {
        notificationSuccess.calls.reset();
        notificationError.calls.reset();
        mockRecordService.prototype.saveRecord.calls.reset();
        mockRecordService.prototype.getRecord.calls.reset();
        RecordActionsRewireAPI.__ResetDependency__('RecordService');
        RecordActionsRewireAPI.__ResetDependency__('NotificationManager');
    });

    let fields = [
        {id:6, name: "test"}
    ];
    let pendEdits = {
        recordChanges: {
            6: {
                fieldName: "test",
                fieldDef: fields[0],
                newVal: {value: "value", display: "display"}
            }
        },
        originalRecord: {
            fids: {6: {
                display: "oldDisplay",
                value: "oldValue",
                id: 6
            }}
        }
    };

    let changes = [
        {display : "display", fieldDef: fields[0], fieldName: "test", id: 6, value: "value"}
    ];

    let testCases = [
        {name: 'missing appId', appId:null, tblId:tblId, recId:recId, pendEdit:pendEdits, fields:fields},
        {name: 'missing tblId', appId:appId, tblId:null, recId:recId, pendEdits:pendEdits, fields:fields},
        {name: 'missing recId', appId:appId, tblId:tblId, recId:null, pendEdits:pendEdits, fields:fields},
        {name: 'missing pendEdits', appId:appId, tblId:tblId, recId:null, pendEdits:null, fields:fields},
        {name: 'missing fields', appId:appId, tblId:tblId, recId:null, pendEdits:pendEdits, fields:null}
    ];

    testCases.forEach((testCase) => {
        it(testCase.name, (done) => {
            const params = {
                context: 'NAV',
                fields: testCase.fields,
                pendEdits: testCase.pendEdits,
                colList: [],
                showNotificationOnSuccess: true
            };

            const store = mockStore({});
            return store.dispatch(recordActions.updateRecord(testCase.appId, testCase.tblId, testCase.recId, params)).then(
                () => {
                    expect(false).toEqual(true);
                    done();
                },
                () => {
                    expect(mockRecordService.prototype.saveRecord).not.toHaveBeenCalled();
                    expect(store.getActions()).toEqual([]);
                    expect(notificationError).toHaveBeenCalled();
                    done();
                });
        });
    });

    let testCasesService = [
        {name: 'error updating record with error list', appId:appId, tblId:tblId, recId:recId, pendEdits:pendEdits, fields:fields, errorResponse: errorResponse},
        {name: 'error updating record', appId:appId, tblId:tblId, recId:recId, pendEdits:pendEdits, fields:fields, errorResponse: {}}
    ];
    testCasesService.forEach((testCase) => {
        it(testCase.name, (done) => {
            const params = {
                context: 'NAV',
                fields: testCase.fields,
                pendEdits: testCase.pendEdits,
                colList: [],
                showNotificationOnSuccess: true
            };

            //  set the error response returned by the mocked createRecord promise for each test
            errorResponse.data.response.errors = testCase.errorResponse;
            let errors = [];
            if (_.has(errorResponse, 'data.response.errors')) {
                errors = errorResponse.data.response.errors || [];
            }

            const expectedActions = [
                event(recId, types.SAVE_RECORD, {appId, tblId, recId, changes:changes}),
                event(recId, types.SAVE_RECORD_ERROR, {appId, tblId, recId, errors:errors})
            ];

            const store = mockStore({});
            return store.dispatch(recordActions.updateRecord(testCase.appId, testCase.tblId, testCase.recId, params)).then(
                () => {
                    expect(false).toEqual(true);
                    done();
                },
                () => {
                    expect(mockRecordService.prototype.getRecord).not.toHaveBeenCalled();
                    expect(store.getActions()).toEqual(expectedActions);
                    expect(notificationError).toHaveBeenCalled();
                    done();
                });
        });
    });
});

describe('update Record Actions -- getRecord error workflow', () => {

    const appId = '1';
    const tblId = '2';
    const recId = 3;

    let record = {
        fields: [],
        records: []
    };
    let errorResponse = {
        data: {
            response: {
                errors: ['someError']
            }
        }
    };
    let responseData = {appId, tblId, data: 'success'};
    class mockRecordService {
        constructor() { }
        saveRecord(a, b, c) {
            return Promise.resolve(responseData);
        }
        getRecord() {
            return Promise.reject(errorResponse);
        }
    }

    let notificationSuccess = jasmine.createSpy();
    let notificationError = jasmine.createSpy();
    beforeEach(() => {
        spyOn(mockRecordService.prototype, 'saveRecord').and.callThrough();
        spyOn(mockRecordService.prototype, 'getRecord').and.callThrough();
        RecordActionsRewireAPI.__Rewire__('RecordService', mockRecordService);
        RecordActionsRewireAPI.__Rewire__('NotificationManager', {success: notificationSuccess, error: notificationError});
    });

    afterEach(() => {
        notificationSuccess.calls.reset();
        notificationError.calls.reset();
        mockRecordService.prototype.saveRecord.calls.reset();
        mockRecordService.prototype.getRecord.calls.reset();
        RecordActionsRewireAPI.__ResetDependency__('RecordService');
        RecordActionsRewireAPI.__ResetDependency__('NotificationManager');
    });

    let fields = [
        {id:6, name: "test"}
    ];
    let pendEdits = {
        recordChanges: {
            6: {
                fieldName: "test",
                fieldDef: fields[0],
                newVal: {value: "value", display: "display"}
            }
        },
        originalRecord: {
            fids: {6: {
                display: "oldDisplay",
                value: "oldValue",
                id: 6
            }}
        }
    };
    let changes = [
        {display : "display", fieldDef: fields[0], fieldName: "test", id: 6, value: "value"}
    ];

    const expectedActions = [
        event(recId, types.SAVE_RECORD, {appId, tblId, recId, changes:changes}),
        event(recId, types.SAVE_RECORD_ERROR, {appId, tblId, recId, errors:errorResponse.data.response.errors})
    ];

    it('getRecord failure', (done) => {
        const params = {
            context: 'NAV',
            fields: fields,
            pendEdits: pendEdits,
            colList: [],
            showNotificationOnSuccess: true
        };

        const store = mockStore({});
        return store.dispatch(recordActions.updateRecord(appId, tblId, recId, params)).then(
            () => {
                expect(false).toEqual(true);
                done();
            },
            () => {
                expect(mockRecordService.prototype.saveRecord).toHaveBeenCalled();
                expect(mockRecordService.prototype.getRecord).toHaveBeenCalled();
                expect(store.getActions()).toEqual(expectedActions);
                expect(notificationError).toHaveBeenCalled();
                done();
            }
        );
    });
});

