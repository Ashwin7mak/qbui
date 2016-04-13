import Fluxxor from 'fluxxor';
import reportDataActions from '../../src/actions/reportDataActions';
import * as actions from '../../src/constants/actions';
import Promise from 'bluebird';

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
    p.reject({message:'someError'});
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
        flux.actions.getFilteredRecords(inputs.appId, inputs.tblId, inputs.rptId, inputs.formatted, inputs.filter).then(
            () => {
                expect(true).toBe(false);
                done();
            },
            () => {
                expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.LOAD_RECORDS, jasmine.any(Object)]);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([actions.LOAD_RECORDS_FAILED, jasmine.any(Object)]);
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
        flux.actions.getFilteredRecords(inputs.appId, inputs.tblId, inputs.rptId, inputs.formatted, inputs.filter, {}).then(
            () => {
                expect(true).toBe(false);
                done();
            },
            () => {
                expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.LOAD_RECORDS, filterReportInputs]);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([actions.LOAD_RECORDS_FAILED,
                                jasmine.objectContaining({error : jasmine.any(Object)})]);
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
        flux.actions.getFilteredRecords(inputs.appId, inputs.tblId, inputs.rptId, inputs.formatted, inputs.filter).then(
            () => {
                expect(true).toBe(false);
                done();
            },
            () => {
                expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.LOAD_RECORDS, filterReportInputs]);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([actions.LOAD_RECORDS_FAILED,
                    jasmine.objectContaining({exception : jasmine.any(Object)})]);
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
            flux.actions.getFilteredRecords(data.appId, data.tblId, data.rptId, false, filter).then(
                () => {
                    expect(true).toBe(false);
                    done();
                },
                () => {
                    expect(mockReportService.prototype.getReport).not.toHaveBeenCalled();
                    expect(mockRecordService.prototype.getRecords).not.toHaveBeenCalled();
                    expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.LOAD_RECORDS_FAILED, jasmine.any(Object));
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
                    expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.LOAD_REPORT_FAILED);
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
            return mockPromiseSuccess(responseReportData);
        }
        getReportDataAndFacets() {
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
        {test:'test throwing exception when loading a report', func:flux.actions.loadReport, act: actions.LOAD_REPORT_FAILED},
        {test:'test throwing exception when filtering a report', func:flux.actions.getFilteredRecords, act:actions.LOAD_RECORDS_FAILED}
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
                    expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(data.act, jasmine.any(Object));
                    done();
                }
            );
        });
    });

});

