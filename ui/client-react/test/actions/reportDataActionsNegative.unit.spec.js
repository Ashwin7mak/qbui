import Fluxxor from 'fluxxor';
import reportDataActions from '../../src/actions/reportDataActions';
import * as actions from '../../src/constants/actions';
import Promise from 'bluebird';

describe('Report Data Actions -- Filter report', () => {
    'use strict';

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
            getReport = mockPromiseSuccess(responseReportData);
            resolveFacetExpression = mockPromiseError();
        }
        class mockRecordService {
            constructor() {
            }
            getRecords = mockPromiseSuccess(responseResultData);
        }
        reportDataActions.__Rewire__('ReportService', mockReportService);
        reportDataActions.__Rewire__('RecordService', mockRecordService);
        let promise = flux.actions.filterReport(inputs.appId, inputs.tblId, inputs.rptId, inputs.formatted, inputs.facetExp);

        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.LOAD_REPORT, {appId, tblId, rptId});
        flux.dispatchBinder.dispatch.calls.reset();
        promise.then(function(){
            expect(promise.isRejected()).toBeTruthy();
            expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.LOAD_REPORT_FAILED);
            done();
        });
    });

    it('test filter report fail on get records', (done) => {
        class mockReportService {
            constructor() { }
            getReport = mockPromiseSuccess(responseReportData);
            resolveFacetExpression = mockPromiseSuccess(responseResultQuery);
        }
        class mockRecordService {
            constructor() {
            }
            getRecords = mockPromiseError();
        }
        reportDataActions.__Rewire__('ReportService', mockReportService);
        reportDataActions.__Rewire__('RecordService', mockRecordService);
        let promise = flux.actions.filterReport(inputs.appId, inputs.tblId, inputs.rptId, inputs.formatted, inputs.facetExp);

        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.LOAD_REPORT, {appId, tblId, rptId});
        flux.dispatchBinder.dispatch.calls.reset();
        promise.then(function(){
            expect(promise.isRejected()).toBeTruthy();
            expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.LOAD_RECORDS_FAILED);
            done();
        });
    });

    it('test filter report exception on get records', (done) => {
        class mockReportService {
            constructor() { }
            getReport = mockPromiseSuccess(responseReportData);
            resolveFacetExpression = mockPromiseSuccess(responseResultQuery);
        }
        class mockRecordService {
            constructor() {
            }
            getRecords = mockPromiseException();
        }
        reportDataActions.__Rewire__('ReportService', mockReportService);
        reportDataActions.__Rewire__('RecordService', mockRecordService);
        let promise = flux.actions.filterReport(inputs.appId, inputs.tblId, inputs.rptId, inputs.formatted, inputs.facetExp);

        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.LOAD_REPORT, {appId, tblId, rptId});
        flux.dispatchBinder.dispatch.calls.reset();
        promise.then(function(){
            expect(promise.isRejected()).toBeTruthy();
            expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.LOAD_REPORT_FAILED);
            done();
        });
    });

    it('test filter report fail on invalid params', (done) => {
        class mockReportService {
            constructor() { }
            getReport = mockPromiseSuccess(responseReportData);
            resolveFacetExpression = mockPromiseSuccess(responseResultQuery);
        }
        class mockRecordService {
            constructor() {
            }
            getRecords = mockPromiseException();
        }
        reportDataActions.__Rewire__('ReportService', mockReportService);
        reportDataActions.__Rewire__('RecordService', mockRecordService);
        let promise = flux.actions.filterReport(1, 2, null, false);

        expect(flux.dispatchBinder.dispatch).not.toHaveBeenCalled();
        flux.dispatchBinder.dispatch.calls.reset();
        promise.then(function(){
            expect(promise.isRejected()).toBeTruthy();
            expect(flux.dispatchBinder.dispatch).not.toHaveBeenCalled();
            done();
        });
    });

});
