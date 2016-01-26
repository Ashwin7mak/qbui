import Fluxxor from 'fluxxor';
import reportDataActions from '../../src/actions/reportDataActions';
import * as actions from '../../src/constants/actions';
import Promise from 'bluebird';

let inputs = {appId: '1', tblId: '2', rptId: '3', formatted: true, facetExp: 'abc'};
let responseReportData = {
    data: {
        name: 'name'
    }
};
let responseResultData = {
    data: {
        fields: [],
        records: []
    }
};
let responseFacetData = {
    data: {
        facets: {
            name: 'test'
        }
    }
};

let responseResultQuery = {
    data: 'testQuery'
};
let mockPromiseSuccess = function(expectedResult){
    var p = Promise.defer();
    p.resolve(expectedResult);
    return p.promise;
};
let mockPromiseError = function(){
    var p = Promise.defer();
    p.reject({message:'some error'});
    return p.promise;
};
let mockPromiseException = function(){
    var p = Promise.defer();
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
            getReport(){
                return mockPromiseSuccess(responseReportData);
            }
            parseFacetExpression() {
                return mockPromiseError();
            }
        }
        class mockRecordService {
            constructor() {
            }
            getRecords(){
                return mockPromiseSuccess(responseResultData);
            }
        }
        reportDataActions.__Rewire__('ReportService', mockReportService);
        reportDataActions.__Rewire__('RecordService', mockRecordService);
        let promise = flux.actions.filterReport(inputs.appId, inputs.tblId, inputs.rptId, inputs.formatted, inputs.facetExp);

        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.LOAD_REPORT, {appId: inputs.appId, tblId: inputs.tblId, rptId: inputs.rptId});
        flux.dispatchBinder.dispatch.calls.reset();
        promise.then(function(){
            done();
        }).catch(function(){
            expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.LOAD_REPORT_FAILED);
            done();
        });
    });

    it('test filter report fail on get records', (done) => {
        class mockReportService {
            constructor() { }
            getReport(){
                return mockPromiseSuccess(responseReportData);
            }
            parseFacetExpression(){
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
        let promise = flux.actions.filterReport(inputs.appId, inputs.tblId, inputs.rptId, inputs.formatted, inputs.facetExp);

        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.LOAD_REPORT, {appId: inputs.appId, tblId: inputs.tblId, rptId: inputs.rptId});
        flux.dispatchBinder.dispatch.calls.reset();
        promise.then(function(){
            done();
        }).catch(function(){
            expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.LOAD_RECORDS_FAILED);
            done();
        });
    });

    it('test filter report exception on get records', (done) => {
        class mockReportService {
            constructor() { }
            getReport(){
                return mockPromiseSuccess(responseReportData);
            }
            parseFacetExpression(){
                return mockPromiseSuccess(responseResultQuery);
            }
        }
        class mockRecordService {
            constructor() {
            }
            getRecords(){
                return mockPromiseException();
            }
        }
        reportDataActions.__Rewire__('ReportService', mockReportService);
        reportDataActions.__Rewire__('RecordService', mockRecordService);
        let promise = flux.actions.filterReport(inputs.appId, inputs.tblId, inputs.rptId, inputs.formatted, inputs.facetExp);

        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.LOAD_REPORT, {appId: inputs.appId, tblId: inputs.tblId, rptId: inputs.rptId});
        flux.dispatchBinder.dispatch.calls.reset();
        promise.then(function(){
            done();
        }).catch(function(){
            expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.LOAD_REPORT_FAILED);
            done();
        });
    });

    it('test filter report fail on invalid params', (done) => {
        class mockReportService {
            constructor() { }
            getReport(){
                return mockPromiseSuccess(responseReportData);
            }
            parseFacetExpression(){
                return mockPromiseSuccess(responseResultQuery);
            }
        }
        class mockRecordService {
            constructor() {
            }
            getRecords(){
                return mockPromiseSuccess(responseResultData);
            }
        }
        reportDataActions.__Rewire__('ReportService', mockReportService);
        reportDataActions.__Rewire__('RecordService', mockRecordService);
        let promise = flux.actions.filterReport(1, 2, null, false);

        expect(flux.dispatchBinder.dispatch).not.toHaveBeenCalled();
        flux.dispatchBinder.dispatch.calls.reset();
        promise.then(function(){
            done();
        }).catch(function(){
            done();
        }).finally(function(){
            expect(promise.isRejected()).toBeTruthy();
            expect(flux.dispatchBinder.dispatch).not.toHaveBeenCalled();
            done();
        });
    });
});

describe('Report Data Actions -- Filter report Negative missing parameters', () => {
    'use strict';
    class mockReportService {
        constructor() {
        }
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
            return mockPromiseSuccess(responseResultData);
        }
    }

    beforeEach(() => {
        spyOn(flux.dispatchBinder, 'dispatch');
        reportDataActions.__Rewire__('ReportService', mockReportService);
        reportDataActions.__Rewire__('RecordService', mockRecordService);
    });

    afterEach(() => {
        reportDataActions.__ResetDependency__('ReportService');
        reportDataActions.__ResetDependency__('RecordService');
    });

    it('test filter report fail on missing appId', (done) => {
        //no app id
        let promise = flux.actions.filterReport(null, 2, 3, false, 'abc');
        expect(flux.dispatchBinder.dispatch).not.toHaveBeenCalled();
        flux.dispatchBinder.dispatch.calls.reset();
        promise.then(function() {
            done();
        }).catch(function() {
            done();
        }).finally(function() {
            expect(promise.isRejected()).toBeTruthy();
            expect(flux.dispatchBinder.dispatch).not.toHaveBeenCalled();
            done();
        });
    });

    it('test filter report fail on missing tableId', (done) => {
        //no table id
        let promise = flux.actions.filterReport(1, null, 3, false, 'abc');
        expect(flux.dispatchBinder.dispatch).not.toHaveBeenCalled();
        flux.dispatchBinder.dispatch.calls.reset();
        promise.then(function() {
            done();
        }).catch(function() {
            done();
        }).finally(function() {
            expect(promise.isRejected()).toBeTruthy();
            expect(flux.dispatchBinder.dispatch).not.toHaveBeenCalled();
            done();
        });
    });

    it('test filter report fail on missing reportId', (done) => {
        //no table id
        let promise = flux.actions.filterReport(1, 2, null, false, 'abc');
        expect(flux.dispatchBinder.dispatch).not.toHaveBeenCalled();
        flux.dispatchBinder.dispatch.calls.reset();
        promise.then(function() {
            done();
        }).catch(function() {
            done();
        }).finally(function() {
            expect(promise.isRejected()).toBeTruthy();
            expect(flux.dispatchBinder.dispatch).not.toHaveBeenCalled();
            done();
        });
    });

    it('test filter report fail on missing facetexpression', (done) => {
        //no facet expression
        let promise = flux.actions.filterReport(1, 2, 3, false, null);
        expect(flux.dispatchBinder.dispatch).not.toHaveBeenCalled();
        flux.dispatchBinder.dispatch.calls.reset();
        promise.then(function() {
            done();
        }).catch(function() {
            done();
        }).finally(function() {
            expect(promise.isRejected()).toBeTruthy();
            expect(flux.dispatchBinder.dispatch).not.toHaveBeenCalled();
            done();
        });
    });
});

describe('Report Data Actions -- load report Negative missing parameters', () => {
    'use strict';
    class mockReportService {
        constructor() {
        }

        getReport() {
            return mockPromiseSuccess(responseReportData);
        }

        getReportResults() {
            return mockPromiseSuccess(responseResultQuery);
        }

        getReportFacets() {
            return mockPromiseSuccess(responseFacetData);
        }
    }

    beforeEach(() => {
        spyOn(flux.dispatchBinder, 'dispatch');
        spyOn(mockReportService.prototype, 'getReportFacets');
        reportDataActions.__Rewire__('ReportService', mockReportService);
    });

    afterEach(() => {
        reportDataActions.__ResetDependency__('ReportService');
    });

    it('test load report with missing appId', (done) => {
        let promise = flux.actions.loadReport(null, 2, 3, false);
        expect(mockReportService.prototype.getReportFacets).not.toHaveBeenCalled();

        promise.then(function() {
            done();
        }).catch(function() {
            done();
        }).finally(function() {
            expect(promise.isRejected()).toBeTruthy();
            expect(flux.dispatchBinder.dispatch).not.toHaveBeenCalled();
            done();
        });
    });

    it('test load report with missing tblId', (done) => {
        let promise = flux.actions.loadReport(1, null, 3, false);
        expect(mockReportService.prototype.getReportFacets).not.toHaveBeenCalled();

        promise.then(function() {
            done();
        }).catch(function() {
            done();
        }).finally(function() {
            expect(promise.isRejected()).toBeTruthy();
            expect(flux.dispatchBinder.dispatch).not.toHaveBeenCalled();
            done();
        });
    });

    it('test load report with missing rptId', (done) => {
        let promise = flux.actions.loadReport(1, 2, null, false);
        expect(mockReportService.prototype.getReportFacets).not.toHaveBeenCalled();

        promise.then(function() {
            done();
        }).catch(function() {
            done();
        }).finally(function() {
            expect(promise.isRejected()).toBeTruthy();
            expect(flux.dispatchBinder.dispatch).not.toHaveBeenCalled();
            done();
        });
    });

    it('test throwing exception when getting report facets', (done) => {
        let promise = flux.actions.loadReport(1, 2, 3, false);
        expect(mockReportService.prototype.getReportFacets).toHaveBeenCalled();
        expect(flux.dispatchBinder.dispatch).toHaveBeenCalled();
        flux.dispatchBinder.dispatch.calls.reset();

        promise.then(function() {
            done();
        }).catch(function() {
            done();
        }).finally(function() {
            expect(promise.isRejected()).toBeTruthy();
            expect(flux.dispatchBinder.dispatch).not.toHaveBeenCalledWith(actions.LOAD_REPORT_FAILED);
            done();
        });
    });
});

describe('Report Data Actions -- load report exception', () => {
    'use strict';
    class mockReportService {
        constructor() {
        }
        getReport() {
            return mockPromiseSuccess(responseReportData);
        }
        getReportResults() {
            return mockPromiseSuccess(responseResultQuery);
        }
        getReportFacets() {
            return mockPromiseException();
        }
    }

    beforeEach(() => {
        spyOn(flux.dispatchBinder, 'dispatch');
        spyOn(mockReportService.prototype, 'getReportFacets');
        reportDataActions.__Rewire__('ReportService', mockReportService);
    });

    afterEach(() => {
        reportDataActions.__ResetDependency__('ReportService');
    });

    it('test throwing exception when loading a report', (done) => {

        let promise = flux.actions.loadReport(1, 2, 3, false);
        expect(mockReportService.prototype.getReportFacets).toHaveBeenCalled();
        expect(flux.dispatchBinder.dispatch).toHaveBeenCalled();
        flux.dispatchBinder.dispatch.calls.reset();

        let exception = false;
        promise.then(function() {
            done();
        }).catch(function() {
            exception = true;
            done();
        }).finally(function() {
            expect(promise.isRejected()).toBeTruthy();
            expect(exception === true).toBeTruthy();
            expect(flux.dispatchBinder.dispatch).not.toHaveBeenCalledWith(actions.LOAD_REPORT_FAILED);
            done();
        });
    });

});

