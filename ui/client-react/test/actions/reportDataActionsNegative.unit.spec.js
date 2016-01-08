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
            resolveFacetExpression() {
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
            resolveFacetExpression(){
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
            resolveFacetExpression(){
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
            resolveFacetExpression(){
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
        resolveFacetExpression() {
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

