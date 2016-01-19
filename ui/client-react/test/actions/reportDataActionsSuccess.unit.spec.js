import Fluxxor from 'fluxxor';
import reportDataActions from '../../src/actions/reportDataActions';
import * as actions from '../../src/constants/actions';
import Promise from 'bluebird';

describe('Report Data Actions Load Report functions -- success', () => {
    'use strict';

    let appId = '1';
    let tblId = '2';
    let rptId = '3';
    let facetExp = 'abc';
    let responseReportData = {
        data: {
            name: 'name'
        }
    };
    let responseResultData = {
        data: {
            test: 'test'
        }
    };
    let responseFacetData = {
        data: {
            facets: {
                test: 'test'
            }
        }
    };

    let response = {
        name: responseReportData.data.name,
        data: responseResultData.data,
        facets: responseFacetData.data
    };

    let promise;
    class mockReportService {
        constructor() { }
        getReport() {
            var p = Promise.defer();
            p.resolve(responseReportData);
            return p.promise;
        }
        getReportResults() {
            var p = Promise.defer();
            p.resolve(responseResultData);
            return p.promise;
        }
        getReportFacets() {
            var p = Promise.defer();
            p.resolve(responseFacetData);
            return p.promise;
        }
    }

    let stores = {};
    let flux = new Fluxxor.Flux(stores);
    flux.addActions(reportDataActions);

    beforeEach(() => {
        spyOn(flux.dispatchBinder, 'dispatch');
        reportDataActions.__Rewire__('ReportService', mockReportService);
    });

    afterEach(() => {
        reportDataActions.__ResetDependency__('ReportService');
        promise = null;
    });

    it('test load report action with report parameters', (done) => {
        promise = flux.actions.loadReport(appId, tblId, rptId, true, facetExp);

        //expect a load report event to get fired before the promise returns
        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.LOAD_REPORT, {appId, tblId, rptId});
        flux.dispatchBinder.dispatch.calls.reset();
        promise.then(function(){
            expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.LOAD_REPORT_SUCCESS, response);
            done();
        });
    });
});

describe('Report Data Actions Filter Report functions -- success', () => {
    'use strict';

    let appId = '1';
    let tblId = '2';
    let rptId = '3';
    let facetExp = 'abc';
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

    let promise;
    class mockReportService {
        constructor() { }
        getReport() {
            var p = Promise.defer();
            p.resolve(responseReportData);
            return p.promise;
        }
        parseFacetExpression() {
            var p = Promise.defer();
            p.resolve(responseResultQuery);
            return p.promise;
        }
    }
    class mockRecordService {
        constructor() {}
        getRecords() {
            var p = Promise.defer();
            p.resolve(responseResultData);
            return p.promise;
        }
    }
    let stores = {};
    let flux = new Fluxxor.Flux(stores);
    flux.addActions(reportDataActions);

    beforeEach(() => {
        spyOn(flux.dispatchBinder, 'dispatch');
        reportDataActions.__Rewire__('ReportService', mockReportService);
        reportDataActions.__Rewire__('RecordService', mockRecordService);
    });

    afterEach(() => {
        reportDataActions.__ResetDependency__('ReportService');
        reportDataActions.__ResetDependency__('RecordService');
        promise = null;
    });


    it('test filter report action with parameters', (done) => {
        promise = flux.actions.filterReport(appId, tblId, rptId, true, facetExp);

        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.LOAD_REPORT, {appId, tblId, rptId});
        flux.dispatchBinder.dispatch.calls.reset();
        promise.then(function() {
            expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.LOAD_RECORDS_SUCCESS, responseResultData.data);
            done();
        });
    });
});
