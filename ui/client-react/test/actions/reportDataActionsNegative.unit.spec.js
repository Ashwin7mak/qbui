import Fluxxor from 'fluxxor';
import reportDataActions, {__RewireAPI__ as reportDataActionsRewireAPI} from '../../src/actions/reportDataActions';
import * as actions from '../../src/constants/actions';
import constants from '../../../common/src/constants';
import Promise from 'bluebird';

let errorStatus = 404;
let errorMessage = "someError";
let errorObject = {
    message: errorMessage,
    status: errorStatus
};
let exStatus = 500;

let inputs = {
    appId: '1',
    tblId: '2',
    rptId: '3',
    formatted: true,
    filter: {
        facet: 'abc',
        search: ''
    },
    queryParams: {
        offset: constants.PAGE.DEFAULT_OFFSET,
        numRows: constants.PAGE.DEFAULT_NUM_ROWS,
        sortList: ''
    }
};

let filterReportInputs = {
    appId: inputs.appId,
    tblId: inputs.tblId,
    rptId: inputs.rptId,
    filter: {
        facet: 'abc',
        search: ''
    },
    offset: inputs.queryParams.offset,
    numRows: inputs.queryParams.numRows,
    sortList: inputs.queryParams.sortList
};

let responseReportData = {
    data: {
        name: 'name',
        sortList: ['2', '1:EQUALS']
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
    var p = Promise.defer();
    p.reject({response: "string".badFunction()});
    return p.promise;
};

let stores = {};
let flux = new Fluxxor.Flux(stores);
flux.addActions(reportDataActions);

class mockLogger {
    constructor() {}
    logException() {}
    debug() {}
    warn() {}
    error() {}
    parseAndLogError() {}
}

describe('Report Data Actions -- load a dynamic report that throws errors/exceptions', () => {
    'use strict';

    beforeEach(() => {
        spyOn(flux.dispatchBinder, 'dispatch');
        spyOn(mockLogger.prototype, 'logException').and.callThrough();
        reportDataActionsRewireAPI.__ResetDependency__('ReportService');
        reportDataActionsRewireAPI.__Rewire__('Logger', mockLogger);
    });
    afterEach(() => {
        reportDataActionsRewireAPI.__ResetDependency__('Logger');
    });

    it('test filter report fail on resolve facet', (done) => {
        class mockReportService {
            constructor() { }
            parseFacetExpression() {
                return mockPromiseError();
            }
            getDynamicReportResults() {
                return mockProcessSuccess(responseResultData);
            }
        }

        reportDataActionsRewireAPI.__Rewire__('ReportService', mockReportService);
        flux.actions.loadDynamicReport(inputs.appId, inputs.tblId, inputs.rptId, inputs.formatted, inputs.filter, inputs.queryParams).then(
            () => {
                expect(true).toBe(false);
                done();
            },
            () => {
                expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.LOAD_RECORDS, filterReportInputs]);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([actions.LOAD_RECORDS_FAILED, {response: errorObject}]);
                done();
            }
        );
    });

    it('test filter report error on get results', (done) => {
        class mockReportService {
            constructor() { }
            parseFacetExpression() {
                return mockPromiseSuccess(responseResultQuery);
            }
            getDynamicReportResults() {
                return mockPromiseError();
            }
        }

        reportDataActionsRewireAPI.__Rewire__('ReportService', mockReportService);
        flux.actions.loadDynamicReport(inputs.appId, inputs.tblId, inputs.rptId, inputs.formatted, inputs.filter, inputs.queryParams).then(
            () => {
                expect(true).toBe(false);
                done();
            },
            () => {
                expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.LOAD_RECORDS, filterReportInputs]);
                expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([actions.LOAD_RECORDS_FAILED, {response: errorObject}]);
                done();
            }
        );
    });

    it('test filter report exception on get results', (done) => {
        class mockReportService {
            constructor() { }
            parseFacetExpression() {
                return mockPromiseSuccess(responseResultQuery);
            }
            getDynamicReportResults() {
                return mockPromiseException();
            }
        }

        reportDataActionsRewireAPI.__Rewire__('ReportService', mockReportService);
        flux.actions.loadDynamicReport(inputs.appId, inputs.tblId, inputs.rptId, inputs.formatted, inputs.filter, inputs.queryParams).then(
            () => {
                expect(true).toBe(false);
                done();
            },
            () => {
                expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.LOAD_RECORDS, filterReportInputs]);
                expect(mockLogger.prototype.logException).toHaveBeenCalled();
                done();
            }
        );
    });

    it('test filter report exception on facet expression', (done) => {
        class mockReportService {
            constructor() { }
            parseFacetExpression() {
                return mockPromiseSuccess(null);
            }
            getDynamicReportResults() {
                return mockProcessSuccess(responseResultData);
            }
        }

        reportDataActionsRewireAPI.__Rewire__('ReportService', mockReportService);
        flux.actions.loadDynamicReport(inputs.appId, inputs.tblId, inputs.rptId, inputs.formatted, inputs.filter, inputs.queryParams).then(
            () => {
                expect(true).toBe(false);
                done();
            },
            () => {
                expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([actions.LOAD_RECORDS, filterReportInputs]);
                expect(mockLogger.prototype.logException).toHaveBeenCalled();
                done();
            }
        );
    });

});

describe('Report Data Actions -- load a dynamic report with missing parameters', () => {
    'use strict';
    class mockReportService {
        constructor() { }
        parseFacetExpression() {
            return mockPromiseSuccess(responseResultQuery);
        }
        getDynamicReportResults() {
            return mockPromiseSuccess(responseResultData);
        }
    }

    var filter = {facet: 'abc', search: ''};

    beforeEach(() => {
        spyOn(flux.dispatchBinder, 'dispatch');
        spyOn(mockReportService.prototype, 'parseFacetExpression');
        spyOn(mockReportService.prototype, 'getDynamicReportResults');
        reportDataActionsRewireAPI.__Rewire__('ReportService', mockReportService);
    });

    afterEach(() => {
        reportDataActionsRewireAPI.__ResetDependency__('ReportService');
    });

    var dataProvider = [
        {test:'test filter report with missing appId', appId:null, tblId:2, rptId:3},
        {test:'test filter report with missing tblId', appId:1, tblId:null, rptId:3},
        {test:'test filter report with missing rptId', appId:1, tblId:2, rptId:null}
    ];

    dataProvider.forEach(function(data) {
        it(data.test, (done) => {
            flux.actions.loadDynamicReport(data.appId, data.tblId, data.rptId, inputs.formatted, filter).then(
                () => {
                    expect(true).toBe(false);
                    done();
                },
                () => {
                    expect(mockReportService.prototype.parseFacetExpression).not.toHaveBeenCalled();
                    expect(mockReportService.prototype.getDynamicReportResults).not.toHaveBeenCalled();
                    expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.LOAD_RECORDS_FAILED, exStatus);
                    done();
                }
            );
        });
    });
});

describe('Report Data Actions -- load a report with missing parameters', () => {
    'use strict';
    class mockReportService {
        constructor() { }
        getReportResults() {
            return mockPromiseSuccess(responseReportData);
        }
    }

    beforeEach(() => {
        spyOn(flux.dispatchBinder, 'dispatch');
        spyOn(mockReportService.prototype, 'getReportResults');
        reportDataActionsRewireAPI.__Rewire__('ReportService', mockReportService);
    });

    afterEach(() => {
        reportDataActionsRewireAPI.__ResetDependency__('ReportService');
    });

    var dataProvider = [
        {test:'test load report with missing appId', appId:null, tblId:2, rptId:3},
        {test:'test load report with missing tblId', appId:1, tblId:null, rptId:3},
        {test:'test load report with missing rptId', appId:1, tblId:2, rptId:null}
    ];

    dataProvider.forEach(function(data) {
        it(data.test, (done) => {
            flux.actions.loadReport(data.appId, data.tblId, data.rptId, false, inputs.queryParams.offset, inputs.queryParams.numRows).then(
                () => {
                    expect(true).toBe(false);
                    done();
                },
                () => {
                    expect(mockReportService.prototype.getReportResults).not.toHaveBeenCalled();
                    expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.LOAD_REPORT_FAILED, exStatus);
                    done();
                }
            );
        });
    });
});


describe('Report Data Actions -- Load a report that throws error/exception', () => {
    'use strict';
    class mockReportService {
        constructor() { }
        getReportResults() {
            return mockPromiseError();
        }
    }

    beforeEach(() => {
        spyOn(flux.dispatchBinder, 'dispatch');
        reportDataActionsRewireAPI.__Rewire__('ReportService', mockReportService);
        spyOn(mockReportService.prototype, 'getReportResults').and.callThrough();
    });

    afterEach(() => {
        reportDataActionsRewireAPI.__ResetDependency__('ReportService');
    });

    var dataProvider = [
        {test:'test throwing exception when getting a report', func:flux.actions.loadReport, loadReportAct: actions.LOAD_REPORT, errAct: actions.LOAD_REPORT_FAILED}
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
                    expect(mockReportService.prototype.getReportResults).toHaveBeenCalled();
                    expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(2);
                    expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([data.loadReportAct, jasmine.any(Object)]);
                    expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([data.errAct, {response: errorObject}]);
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
        getDynamicReportResults() {
            return mockPromiseError();
        }
        parseFacetExpression() {
            return mockPromiseSuccess(responseResultQuery);
        }
    }

    beforeEach(() => {
        spyOn(flux.dispatchBinder, 'dispatch');
        reportDataActionsRewireAPI.__Rewire__('ReportService', mockReportService);
        spyOn(mockReportService.prototype, 'getDynamicReportResults').and.callThrough();
    });

    afterEach(() => {
        reportDataActionsRewireAPI.__ResetDependency__('ReportService');
        reportDataActionsRewireAPI.__ResetDependency__('RecordService');
    });

    var dataProvider = [
        {test:'test throwing exception when filtering a report', func:flux.actions.loadDynamicReport, loadAct: actions.LOAD_RECORDS, errAct: actions.LOAD_RECORDS_FAILED}
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
                    expect(mockReportService.prototype.getDynamicReportResults).toHaveBeenCalled();
                    expect(flux.dispatchBinder.dispatch.calls.count()).toEqual(2);
                    expect(flux.dispatchBinder.dispatch.calls.argsFor(0)).toEqual([data.loadAct, jasmine.any(Object)]);
                    expect(flux.dispatchBinder.dispatch.calls.argsFor(1)).toEqual([data.errAct, {response: errorObject}]);
                    done();
                }
            );
        });
    });
});
