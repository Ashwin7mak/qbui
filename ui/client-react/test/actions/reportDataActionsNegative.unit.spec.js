import Fluxxor from 'fluxxor';
import reportDataActions from '../../src/actions/reportDataActions';
import * as actions from '../../src/constants/actions';
import Promise from 'bluebird';

let errorStatus = 404;
let exStatus = 500;

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
let loadReportInputs = {
    appId: inputs.appId,
    tblId: inputs.tblId,
    rptId: inputs.rptId
};

let filterReportInputs = {
    appId: inputs.appId,
    tblId: inputs.tblId,
    rptId: inputs.rptId,
    filter: {
        facet: 'abc',
        search: ''
    },
    offset: 0,
    numRows: 20,
    sortList: ""
};

let responseReportData = {
    data: {
        name: 'name',
        sortList: ['2', '1:V']
    }
};
let responseResultData = {
    data: {
        fields: [],
        records: [],
        facets: {
            name: 'test'
        }
    }
};
let responseResultQuery = {
    data: 'testQuery'
};
let mockPromiseSuccess = function(expectedResult) {
    return Promise.resolve(expectedResult);
};
let mockPromiseError = function() {
    var p = Promise.defer();
    p.reject({response:{message:'someError', status:errorStatus}});
    return p.promise;
};
let mockPromiseException = function() {
    throw new Error("error");
};

let stores = {};
let flux = new Fluxxor.Flux(stores);
flux.addActions(reportDataActions);


describe('Report Data Actions -- Filter report Negative', () => {
    'use strict';

    beforeEach(() => {
        spyOn(flux.dispatchBinder, 'dispatch');

    });
    afterEach(() => {
        reportDataActions.__ResetDependency__('ReportService');
        reportDataActions.__ResetDependency__('RecordService');
    });

    it('test filter report fail on resolve facet', (done) => {
        class mockReportService {
            constructor() { }
            getReport() {
                return mockPromiseSuccess(responseReportData);
            }
            parseFacetExpression() {
                return mockPromiseError();
            }
        }
        class mockRecordService {
            constructor() {
            }
            getRecords() {
                return mockPromiseSuccess(responseResultData);
            }
        }
        reportDataActions.__Rewire__('ReportService', mockReportService);
        reportDataActions.__Rewire__('RecordService', mockRecordService);
        flux.actions.getFilteredRecords(inputs.appId, inputs.tblId, inputs.rptId, {format:inputs.formatted}, inputs.filter).then(
            () => {
                expect(true).toBe(false);
                done();
            },
            () => {
                expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.LOAD_RECORDS, jasmine.any(Object)]);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([actions.LOAD_RECORDS_FAILED, errorStatus]);
                done();
            }
        );
    });

    it('test filter report fail on get records', (done) => {
        class mockReportService {
            constructor() { }
            getReport() {
                return mockPromiseSuccess(responseReportData);
            }
            parseFacetExpression() {
                return mockPromiseSuccess(responseResultQuery);
            }
        }
        class mockRecordService {
            constructor() {
            }
            getRecords() {
                return mockPromiseError();
            }
        }
        reportDataActions.__Rewire__('ReportService', mockReportService);
        reportDataActions.__Rewire__('RecordService', mockRecordService);
        flux.actions.getFilteredRecords(inputs.appId, inputs.tblId, inputs.rptId, {format:inputs.formatted, offset:0, numRows:20}, inputs.filter, {}).then(
            () => {
                expect(true).toBe(false);
                done();
            },
            () => {
                expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.LOAD_RECORDS, filterReportInputs]);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([actions.LOAD_RECORDS_FAILED, errorStatus]);
                done();
            }
        );
    });

    it('test filter report exception on get records', (done) => {
        class mockReportService {
            constructor() { }
            getReport() {
                return mockPromiseSuccess(responseReportData);
            }
            parseFacetExpression() {
                return mockPromiseSuccess(responseResultQuery);
            }
        }
        class mockRecordService {
            constructor() {
            }
            getRecords() {
                return mockPromiseException();
            }
        }
        reportDataActions.__Rewire__('ReportService', mockReportService);
        reportDataActions.__Rewire__('RecordService', mockRecordService);
        flux.actions.getFilteredRecords(inputs.appId, inputs.tblId, inputs.rptId, {format:inputs.formatted}, inputs.filter).then(
            () => {
                expect(true).toBe(false);
                done();
            },
            () => {
                expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.LOAD_RECORDS, filterReportInputs]);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([actions.LOAD_RECORDS_FAILED, exStatus]);
                done();
            }
        );
    });

});

describe('Report Data Actions -- Filter report Negative missing parameters', () => {
    'use strict';
    class mockReportService {
        constructor() { }
        getReport() {
            return mockPromiseSuccess(responseReportData);
        }
        getReportDataAndFacets() {
            return mockPromiseSuccess(responseResultData);
        }
    }
    class mockRecordService {
        constructor() { }
        getRecords() {
            return mockPromiseSuccess(responseResultData);
        }
    }

    var filter = {facet: 'abc', search: ''};

    beforeEach(() => {
        spyOn(flux.dispatchBinder, 'dispatch');
        spyOn(mockReportService.prototype, 'getReport');
        spyOn(mockRecordService.prototype, 'getRecords');
        reportDataActions.__Rewire__('ReportService', mockReportService);
        reportDataActions.__Rewire__('RecordService', mockRecordService);
    });

    afterEach(() => {
        reportDataActions.__ResetDependency__('ReportService');
        reportDataActions.__ResetDependency__('RecordService');
    });

    var dataProvider = [
        {test:'test filter report with missing appId', appId:null, tblId:2, rptId:3},
        {test:'test filter report with missing tblId', appId:1, tblId:null, rptId:3},
        {test:'test filter report with missing rptId', appId:1, tblId:2, rptId:null}
    ];

    dataProvider.forEach(function(data) {
        it(data.test, (done) => {
            flux.actions.getFilteredRecords(data.appId, data.tblId, data.rptId, {format:false}, filter).then(
                () => {
                    expect(true).toBe(false);
                    done();
                },
                () => {
                    expect(mockReportService.prototype.getReport).not.toHaveBeenCalled();
                    expect(mockRecordService.prototype.getRecords).not.toHaveBeenCalled();
                    expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.LOAD_RECORDS_FAILED, exStatus);
                    done();
                }
            );
        });
    });
});

describe('Report Data Actions -- load report Negative missing parameters', () => {
    'use strict';
    class mockReportService {
        constructor() { }
        getReport() {
            return mockPromiseSuccess(responseReportData);
        }
        getReportDataAndFacets() {
            return mockPromiseSuccess(responseResultData);
        }
    }

    beforeEach(() => {
        spyOn(flux.dispatchBinder, 'dispatch');
        spyOn(mockReportService.prototype, 'getReport');
        reportDataActions.__Rewire__('ReportService', mockReportService);
    });

    afterEach(() => {
        reportDataActions.__ResetDependency__('ReportService');
    });

    var dataProvider = [
        {test:'test load report with missing appId', appId:null, tblId:2, rptId:3},
        {test:'test load report with missing tblId', appId:1, tblId:null, rptId:3},
        {test:'test load report with missing rptId', appId:1, tblId:2, rptId:null}
    ];

    dataProvider.forEach(function(data) {
        it(data.test, (done) => {
            flux.actions.loadReport(data.appId, data.tblId, data.rptId, false).then(
                () => {
                    expect(true).toBe(false);
                    done();
                },
                () => {
                    expect(mockReportService.prototype.getReport).not.toHaveBeenCalled();
                    expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.LOAD_REPORT_FAILED, exStatus);
                    done();
                }
            );
        });
    });
});


describe('Report Data Actions -- Fetch a report negative', () => {
    'use strict';
    class mockReportService {
        constructor() { }
        getReport() {
            return mockPromiseError();
        }
        getReportRecordsCount() {
            return mockPromiseSuccess(responseReportData);
        }
    }

    class mockRecordService {
        constructor() { }
        getRecords() {
            return mockPromiseError();
        }
    }

    beforeEach(() => {
        spyOn(flux.dispatchBinder, 'dispatch');
        reportDataActions.__Rewire__('ReportService', mockReportService);
        reportDataActions.__Rewire__('RecordService', mockRecordService);
        spyOn(mockReportService.prototype, 'getReport').and.callThrough();
    });

    afterEach(() => {
        reportDataActions.__ResetDependency__('ReportService');
        reportDataActions.__ResetDependency__('RecordService');
    });

    var dataProvider = [
        {test:'test throwing exception when getting a report', func:flux.actions.loadReport, loadReportAct: actions.LOAD_REPORT, loadReportRecordsCountAct: actions.LOAD_REPORT_RECORDS_COUNT, errAct: actions.LOAD_REPORT_FAILED, recordsCountSuccAct: actions.LOAD_REPORT_RECORDS_COUNT_SUCCESS},
    ];
    var filter = {facet: 'abc', search: ''};

    dataProvider.forEach(function(data) {
        it(data.test, (done) => {
            data.func.apply(null, [1, 2, 3, false, 1, 10]).then(
                () => {
                    expect(true).toBe(false);
                    done();
                },
                () => {
                    expect(mockReportService.prototype.getReport).toHaveBeenCalled();
                    expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(4);
                    expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([data.loadReportAct, jasmine.any(Object)]);
                    expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([data.loadReportRecordsCountAct, jasmine.any(Object)]);
                    expect(flux.dispatchBinder.dispatch.calls.argsFor(2)).toEqual([data.errAct, errorStatus]);
                    expect(flux.dispatchBinder.dispatch.calls.argsFor(3)).toEqual([data.recordsCountSuccAct, jasmine.any(Object)]);
                    done();
                }
            );
        });
    });
});

describe('Report Data Actions -- Fetch a report with reports count fetch failure', () => {
    'use strict';
    class mockReportService {
        constructor() { }
        getReport() {
            return mockPromiseSuccess(responseReportData);
        }
        getReportRecordsCount() {
            return mockPromiseError();
        }
    }

    beforeEach(() => {
        spyOn(flux.dispatchBinder, 'dispatch');
        reportDataActions.__Rewire__('ReportService', mockReportService);
        spyOn(mockReportService.prototype, 'getReport').and.callThrough();
        spyOn(mockReportService.prototype, 'getReportRecordsCount').and.callThrough();
    });

    afterEach(() => {
        reportDataActions.__ResetDependency__('ReportService');
    });

    var dataProvider = [
        {test:'test throwing exception when loading a report', func:flux.actions.loadReport, loadReportAct: actions.LOAD_REPORT, loadReportRecordsCountAct: actions.LOAD_REPORT_RECORDS_COUNT, errAct: actions.LOAD_REPORT_RECORDS_COUNT_FAILED},
    ];

    dataProvider.forEach(function(data) {
        it(data.test, (done) => {
            data.func.apply(null, [1, 2, 3, false, 1, 10]).then(
                () => {
                    expect(true).toBe(false);
                    done();
                },
                () => {
                    expect(mockReportService.prototype.getReport).toHaveBeenCalled();
                    expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(3);
                    expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([data.loadReportAct, jasmine.any(Object)]);
                    expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([data.loadReportRecordsCountAct, jasmine.any(Object)]);
                    expect(flux.dispatchBinder.dispatch.calls.argsFor(2)).toEqual([data.errAct, errorStatus]);
                    done();
                }
            );
        });
    });
});

describe('Report Data Actions -- ', () => {
    'use strict';
    class mockReportService {
        constructor() { }
        getReport() {
            return mockPromiseError();
        }
        parseFacetExpression() {
            return mockPromiseSuccess(responseResultQuery);
        }
    }

    class mockRecordService {
        constructor() { }
        getRecords() {
            return mockPromiseError();
        }
    }

    beforeEach(() => {
        spyOn(flux.dispatchBinder, 'dispatch');
        reportDataActions.__Rewire__('ReportService', mockReportService);
        reportDataActions.__Rewire__('RecordService', mockRecordService);
        spyOn(mockReportService.prototype, 'getReport').and.callThrough();
    });

    afterEach(() => {
        reportDataActions.__ResetDependency__('ReportService');
        reportDataActions.__ResetDependency__('RecordService');
    });

    var dataProvider = [
        {test:'test throwing exception when filtering a report', func:flux.actions.getFilteredRecords, loadAct: actions.LOAD_RECORDS, errAct: actions.LOAD_RECORDS_FAILED}
    ];
    var filter = {facet: 'abc', search: ''};

    dataProvider.forEach(function(data) {
        it(data.test, (done) => {
            data.func.apply(null, [1, 2, 3, false, filter]).then(
                () => {
                    expect(true).toBe(false);
                    done();
                },
                () => {
                    expect(mockReportService.prototype.getReport).toHaveBeenCalled();
                    expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(2);
                    expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([data.loadAct, jasmine.any(Object)]);
                    expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([data.errAct, errorStatus]);
                    done();
                }
            );
        });
    });
});

describe('Report Data Actions -- ', () => {
    'use strict';
    class mockReportService {
        constructor() { }
        getReport() {
            return mockPromiseError();
        }
        parseFacetExpression() {
            return mockPromiseError();
        }
    }

    class mockRecordService {
        constructor() { }
        getRecords() {
            return mockPromiseError();
        }
    }

    beforeEach(() => {
        spyOn(flux.dispatchBinder, 'dispatch');
        reportDataActions.__Rewire__('ReportService', mockReportService);
        reportDataActions.__Rewire__('RecordService', mockRecordService);
        spyOn(mockReportService.prototype, 'getReport').and.callThrough();
    });

    afterEach(() => {
        reportDataActions.__ResetDependency__('ReportService');
        reportDataActions.__ResetDependency__('RecordService');
    });

    var dataProvider = [
        {test:'test throwing exception when filtering a report', func:flux.actions.getFilteredRecords, loadAct: actions.LOAD_RECORDS, errAct:actions.LOAD_RECORDS_FAILED}
    ];
    var filter = {facet: 'abc', search: ''};

    dataProvider.forEach(function(data) {
        it(data.test, (done) => {
            data.func.apply(null, [1, 2, 3, false, filter]).then(
                () => {
                    expect(true).toBe(false);
                    done();
                },
                () => {
                    expect(mockReportService.prototype.getReport).toHaveBeenCalled();
                    expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(2);
                    expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([data.loadAct, jasmine.any(Object)]);
                    expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([data.errAct, errorStatus]);
                    done();
                }
            );
        });
    });
});

describe('Report Data Actions Edit Report functions -- Negative', () => {
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
        reportDataActions.__Rewire__('RecordService', mockRecordService);
    });

    afterEach(() => {
        reportDataActions.__ResetDependency__('RecordService');
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

describe('Report Data Actions Edit Report functions -- Error', () => {
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
    errorFlux.addActions(reportDataActions);

    beforeEach(() => {
        spyOn(errorFlux.dispatchBinder, 'dispatch');
        spyOn(mockRecordService.prototype, 'deleteRecord').and.callThrough();
        spyOn(mockRecordService.prototype, 'deleteRecordBulk').and.callThrough();
        reportDataActions.__Rewire__('RecordService', mockRecordService);
    });

    afterEach(() => {
        reportDataActions.__ResetDependency__('RecordService');
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

describe('Report Data record edit Actions -- errors / exceptions Negative', () => {
    'use strict';

    beforeEach(() => {
        spyOn(flux.dispatchBinder, 'dispatch');

    });
    afterEach(() => {
        reportDataActions.__ResetDependency__('RecordService');
    });


    it('test saveNewDataProvider fail on create record', (done) => {
        class mockRecordService {
            constructor() {
            }

            createRecord() {
                return mockPromiseError();
            }
        }
        reportDataActions.__Rewire__('RecordService', mockRecordService);
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

