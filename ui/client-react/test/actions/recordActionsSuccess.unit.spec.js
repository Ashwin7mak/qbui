import Fluxxor from 'fluxxor';
import recordActions from '../../src/actions/recordActions';
import * as actions from '../../src/constants/actions';
import * as query from '../../src/constants/query';
import Promise from 'bluebird';

describe('Record actions - Edit Record functions -- success', () => {
    'use strict';

    let appId = '1';
    let tblId = '2';
    let recId = '3';
    let recIds = [1, 2, 3];
    let newRecId = 34;
    let responseData = {appId, tblId, data: 'success'};
    let record = {
        fields: [],
        records: []
    }

    class mockRecordService {
        constructor() {}
        saveRecord(a, t, r, c) {
            return Promise.resolve({data:responseData});
        }
        createRecord(a, t, r) {
            return Promise.resolve({data: {body: '{"id" : ' + newRecId + '}'}});
        }
        deleteRecord(a, b, r) {
            return Promise.resolve({data:responseData});
        }
        deleteRecordBulk(a, b, r) {
            return Promise.resolve({data:responseData});
        }
        getRecord(a, b, c, d) {
            return Promise.resolve({data: record});
        }
    }
    let stores = {};
    let flux = new Fluxxor.Flux(stores);
    flux.addActions(recordActions);

    beforeEach(() => {
        spyOn(flux.dispatchBinder, 'dispatch');
        spyOn(mockRecordService.prototype, 'saveRecord').and.callThrough();
        spyOn(mockRecordService.prototype, 'createRecord').and.callThrough();
        spyOn(mockRecordService.prototype, 'deleteRecord').and.callThrough();
        spyOn(mockRecordService.prototype, 'deleteRecordBulk').and.callThrough();
        spyOn(mockRecordService.prototype, 'getRecord').and.callThrough();
        recordActions.__Rewire__('RecordService', mockRecordService);
    });

    afterEach(() => {
        recordActions.__ResetDependency__('RecordService');
    });

    it('test deleteRecord', (done) => {
        flux.actions.deleteRecord(appId, tblId, recId).then(
            () => {
                expect(mockRecordService.prototype.deleteRecord).toHaveBeenCalled();
                expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(2);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([actions.DELETE_RECORD_SUCCESS, recId]);
                done();
            },
            () => {
                expect(true).toBe(false);
                done();
            }
        );
    });

    it('test deleteRecordBulk resolve', (done) => {
        flux.actions.deleteRecordBulk(appId, tblId, recIds).then(
            () => {
                expect(mockRecordService.prototype.deleteRecordBulk).toHaveBeenCalled();
                expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(2);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([actions.DELETE_RECORD_BULK_SUCCESS, recIds]);
                done();
            },
            () => {
                expect(true).toBe(false);
                done();
            }
        );
    });

    it('test saveRecord', (done) => {
        let fields = [{
            id:6,
            name: "test",
        }];
        let edits = {
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

        let changes = [{display : "display",
            fieldDef: fields[0],
            fieldName: "test",
            id: 6,
            value: "value"}];
        flux.actions.saveRecord(appId, tblId, recId, edits, fields).then(
                () => {
                    expect(mockRecordService.prototype.saveRecord).toHaveBeenCalled();
                    expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(3);
                    expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.SAVE_REPORT_RECORD,
                        {appId, tblId, recId, changes}]);
                    expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([actions.GET_RECORD,
                        {appId, tblId, recId, clist: '6'}]);
                    expect(flux.dispatchBinder.dispatch.calls.argsFor(2)).toEqual([actions.SAVE_RECORD_SUCCESS,
                        {appId, tblId, recId, record}]);
                    done();
                },
                () => {
                    expect(true).toBe(false);
                    done();
                }
            );
    });

    it('test saveNewRecord', (done) => {


        let attrs = {setting: true};
        let fields = [
            {
                id: 4,
                builtIn: false,
                datatypeAttributes :attrs
            },
            {
                id: 5,
                builtIn: true
            },
        ];
        let newVal = {value:"hi", display:"there"};

        let recordChanges = {
            4:{
                fieldName : 'col_num',
                fieldDef: fields[0],
                newVal: newVal,
            },
            5:{
                fieldName : 'col_builtin',
                fieldDef: fields[1],
                newVal: {value:"5", display:"no edit"},
            },
        };
        let newRec = [
            {
                fieldName: 'col_num',
                id:4,
                value: newVal.value,
                display:newVal.display,
                fieldDef: fields[0]
            }
        ];
        flux.actions.saveNewRecord(appId, tblId, recordChanges, fields).then(
                () => {
                    expect(mockRecordService.prototype.createRecord).toHaveBeenCalledWith(appId, tblId, newRec);
                    expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(3);
                    expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.ADD_RECORD,
                        {appId, tblId, changes:recordChanges}]);
                    expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([actions.GET_RECORD,
                        {appId, tblId, recId:newRecId, clist: '4.5'}]);
                    expect(flux.dispatchBinder.dispatch.calls.argsFor(2)).toEqual([actions.ADD_RECORD_SUCCESS,
                        {appId, tblId, record:record, recId:newRecId}]);
                    done();
                },
                () => {
                    expect(true).toBe(false);
                    done();
                }
            );
    });

});
