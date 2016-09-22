import Fluxxor from 'fluxxor';
import recordActions from '../../src/actions/recordActions';
import * as actions from '../../src/constants/actions';
import Promise from 'bluebird';

let errorStatus = 404;

let inputs = {
    appId: '1',
    tblId: '2',
    rptId: '3',
    formatted: true,
    filter: {
        facet: 'abc',
        search: ''
    }
};
let mockPromiseError = function() {
    var p = Promise.defer();
    p.reject({response:{message:'someError', status:errorStatus}});
    return p.promise;
};

let stores = {};
let flux = new Fluxxor.Flux(stores);
flux.addActions(recordActions);


describe('Record actions Edit Record functions -- Negative', () => {
    'use strict';

    let changes = {};
    let newRecord = {};

    class mockRecordService {
        constructor() {}
        saveRecord(a, t, r, c) {
            return Promise.resolve({data:responseData});
        }
        deleteRecord(a, t, r) {
            return Promise.resolve({data:responseData});
        }
        deleteRecordBulk(a, t, r) {
            return Promise.resolve({data:responseData});
        }
    }

    beforeEach(() => {
        spyOn(flux.dispatchBinder, 'dispatch');
        spyOn(mockRecordService.prototype, 'saveRecord');
        spyOn(mockRecordService.prototype, 'deleteRecord');
        spyOn(mockRecordService.prototype, 'deleteRecordBulk');
        recordActions.__Rewire__('RecordService', mockRecordService);
    });

    afterEach(() => {
        recordActions.__ResetDependency__('RecordService');
    });
    var dataProvider = [
        {test:'test saveRecord with missing appId', appId:null, tblId:2, recId:3, changes:changes},
        {test:'test saveRecord with missing tblId', appId:1, tblId:null, recId:3, changes:changes},
        {test:'test saveRecord with missing recId', appId:1, tblId:2, recId:undefined, changes:changes},
        {test:'test saveRecord with null recId', appId:1, tblId:2, recId:null, changes:changes},
        {test:'test saveRecord with missing changes', appId:1, tblId:2, recId:3, changes:null}
    ];

    var saveNewDataProvider = [
        {test:'test saveNewDataProvider with missing appId', appId:null, tblId:2, record:newRecord},
        {test:'test saveNewDataProvider with missing tblId', appId:1, tblId:null, record:newRecord},
        {test:'test saveNewDataProvider with missing record', appId:1, tblId:2, record:null}
    ];

    var deleteDataProvider = [
        {test:'test deleteRecord with missing appId', appId:null, tblId:2, recId:3},
        {test:'test deleteRecord with missing tblId', appId:1, tblId:null, recId:3},
        {test:'test deleteRecord with missing recId', appId:1, tblId:2, recId:undefined}
    ];

    var deleteBulkDataProvider = [
        {test:'test deleteRecordBulk with missing appId', appId:null, tblId:2, recId:3},
        {test:'test deleteRecordBulk with missing tblId', appId:1, tblId:null, recId:3},
        {test:'test deleteRecordBulk with missing recIds', appId:1, tblId:2, recIds:undefined},
        {test:'test deleteRecordBulk with recIds length == 0', appId:1, tblId:2, recIds:[]}
    ];

    dataProvider.forEach(function(data) {

        it(data.test, (done) => {

            flux.actions.saveRecord(data.appId, data.tblId, data.recId, data.changes).then(
                () => {
                    expect(true).toBe(false);
                    done();
                },
                () => {
                    expect(mockRecordService.prototype.saveRecord).not.toHaveBeenCalled();
                    expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.SAVE_RECORD_FAILED, jasmine.any(Object));
                    done();
                }
            );
        });
    });

    saveNewDataProvider.forEach(function(data) {

        it(data.test, (done) => {
            flux.actions.saveNewRecord(data.appId, data.tblId, data.record).then(
                () => {
                    expect(true).toBe(false);
                    done();
                },
                () => {
                    expect(mockRecordService.prototype.deleteRecord).not.toHaveBeenCalled();
                    expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.ADD_RECORD_FAILED, jasmine.any(Object));
                    done();
                }
            );
        });
    });

    deleteDataProvider.forEach(function(data) {

        it(data.test, (done) => {
            flux.actions.deleteRecord(data.appId, data.tblId, data.recId).then(
                () => {
                    expect(true).toBe(false);
                    done();
                },
                () => {
                    expect(mockRecordService.prototype.deleteRecord).not.toHaveBeenCalled();
                    expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.DELETE_RECORD_FAILED, jasmine.any(Object));
                    done();
                }
            );
        });
    });

    deleteBulkDataProvider.forEach(function(data) {

        it(data.test, (done) => {
            flux.actions.deleteRecordBulk(data.appId, data.tblId, data.recId).then(
                () => {
                    expect(true).toBe(false);
                    done();
                },
                () => {
                    expect(mockRecordService.prototype.deleteRecordBulk).not.toHaveBeenCalled();
                    expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.DELETE_RECORD_BULK_FAILED, jasmine.any(Object));
                    done();
                }
            );
        });
    });
});

describe('Record actions Edit Record functions -- Error', () => {
    'use strict';

    let appId = '1';
    let tblId = '2';
    let recId = '3';
    let recIds = [1, 2, 3];

    class mockRecordService {
        constructor() {}
        deleteRecord(a, t, r) {
            return Promise.reject({message: "EXPLOSIONS!!!"});
        }
        deleteRecordBulk(a, t, r) {
            return Promise.reject({message: "EXPLOSIONS!!!"});
        }
    }

    let errorStores = {};
    let errorFlux = new Fluxxor.Flux(errorStores);
    errorFlux.addActions(recordActions);

    beforeEach(() => {
        spyOn(errorFlux.dispatchBinder, 'dispatch');
        spyOn(mockRecordService.prototype, 'deleteRecord').and.callThrough();
        spyOn(mockRecordService.prototype, 'deleteRecordBulk').and.callThrough();
        recordActions.__Rewire__('RecordService', mockRecordService);
    });

    afterEach(() => {
        recordActions.__ResetDependency__('RecordService');
    });

    it('test deleteRecord error', (done) => {
        errorFlux.actions.deleteRecord(appId, tblId, recId).then(
            () => {
                expect(true).toBe(false);
                done();
            },
            () => {
                expect(mockRecordService.prototype.deleteRecord).toHaveBeenCalled();
                expect(errorFlux.dispatchBinder.dispatch.calls.count()).toEqual(2);
                expect(errorFlux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.DELETE_RECORD_FAILED, jasmine.any(Object));
                done();
            }
        );
    });

    it('test deleteRecordBulk error', (done) => {
        errorFlux.actions.deleteRecordBulk(appId, tblId, recIds).then(
            () => {
                expect(true).toBe(false);
                done();
            },
            () => {
                expect(mockRecordService.prototype.deleteRecordBulk).toHaveBeenCalled();
                expect(errorFlux.dispatchBinder.dispatch.calls.count()).toEqual(2);
                expect(errorFlux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([actions.DELETE_RECORD_BULK_FAILED, jasmine.any(Object)]);
                done();
            }
        );
    });
});

describe('Record actions Edit Record functions -- errors / exceptions Negative', () => {
    'use strict';

    beforeEach(() => {
        spyOn(flux.dispatchBinder, 'dispatch');

    });
    afterEach(() => {
        recordActions.__ResetDependency__('RecordService');
    });


    it('test saveNewDataProvider fail on create record', (done) => {
        class mockRecordService {
            constructor() {
            }

            createRecord() {
                return mockPromiseError();
            }
        }
        recordActions.__Rewire__('RecordService', mockRecordService);
        flux.actions.saveNewRecord(inputs.appId, inputs.tblId, {}).then(
            () => {
                expect(true).toBe(false);
                done();
            },
            () => {
                expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.ADD_RECORD, {appId: inputs.appId, tblId:inputs.tblId, record: {}}]);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([actions.ADD_RECORD_FAILED,
                    jasmine.objectContaining({error: jasmine.any(Object)})]);
                done();
            }
        );
    });


    it('test saveNewRecord no returned record id', (done) => {
        class mockRecordService {
            constructor() {
            }

            createRecord() {
                return Promise.resolve({data: {}});
            }
        }
        flux.actions.saveNewRecord(inputs.appId, inputs.tblId, {}).then(
            () => {
                expect(mockRecordService.prototype.createRecord).toHaveBeenCalled();
                expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(2);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.ADD_RECORD,
                    {appId, tblId, record:newRecord}]);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([actions.ADD_RECORD_FAILED,
                    jasmine.objectContaining({error : jasmine.any(Object)})]);
                done();
            },
            () => {
                expect(true).toBe(true);
                done();
            }
        );
    });

});



