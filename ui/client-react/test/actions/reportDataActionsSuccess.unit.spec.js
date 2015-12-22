/* jshint proto: true */

import Fluxxor from 'fluxxor';
import reportDataActions from '../../src/actions/reportDataActions';
import * as actions from '../../src/constants/actions';
import Promise from 'bluebird';

describe('Report Data Actions Loadreport functions -- success', () => {
    'use strict';

    let appId = '1';
    let tblId = '2';
    let rptId = '3';
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
    let response = {
        name: responseReportData.data.name,
        data: responseResultData.data
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
        filterReport() {
            var p = Promise.defer();
            p.resolve(responseResultData);
            return p.promise;
        }
    }

    let stores = {};
    let flux = new Fluxxor.Flux(stores);
    flux.addActions(reportDataActions);

    beforeEach((done) => {
        spyOn(flux.dispatchBinder, 'dispatch');
        reportDataActions.__Rewire__('ReportService', mockReportService);

        promise = flux.actions.loadReport(appId, tblId, rptId, true);

        //  expect a load report event to get fired before the promise returns
        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.LOAD_REPORT, {appId, tblId, rptId});
        flux.dispatchBinder.dispatch.calls.reset();

        promise.then(
            function() {
                done();
            },
            function() {
                done();
            }
        );

    });

    afterEach(() => {
        reportDataActions.__ResetDependency__('ReportService');
        promise = null;
    });

    it('test load report action with report parameters', () => {
        expect(promise.isFulfilled()).toBeTruthy();
        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.LOAD_REPORT_SUCCESS, response);
    });
});

describe('Report Data Actions Filterreport functions -- success', () => {
    'use strict';

    let appId = '1';
    let tblId = '2';
    let rptId = '3';
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
    let responseResultQuery = {
        data: "testQuery"
    };
    let response = {
        name: responseReportData.data.name,
        query: responseResultQuery.data,
        clist: undefined,
        slist: undefined,
        data: responseResultData.data
    };

    let promise;
    class mockReportService {
        constructor() { }
        getReport() {
            var p = Promise.defer();
            p.resolve(responseReportData);
            return p.promise;
        }
        resolveFacetExpression() {
            var p = Promise.defer();
            p.resolve(responseResultQuery);
            return p.promise;
        }
    }
    class mockRecordService {
        constructor() {
        }
        getRecords() {
            var p = Promise.defer();
            p.resolve(responseResultData);
            return p.promise;
        }
    }
    let stores = {};
    let flux = new Fluxxor.Flux(stores);
    flux.addActions(reportDataActions);

    beforeEach((done) => {
        spyOn(flux.dispatchBinder, 'dispatch');
        reportDataActions.__Rewire__('ReportService', mockReportService);
        reportDataActions.__Rewire__('RecordService', mockRecordService);

        promise = flux.actions.filterReport(appId, tblId, rptId, false);

        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.LOAD_REPORT, {appId, tblId, rptId});
        flux.dispatchBinder.dispatch.calls.reset();

        promise.then(
            function() {
                done();
            },
            function() {
                done();
            }
        );

    });

    afterEach(() => {
        reportDataActions.__ResetDependency__('ReportService');
        reportDataActions.__ResetDependency__('RecordService');
        promise = null;
    });


    it('test filter report action with parameters', () => {
        expect(promise.isFulfilled()).toBeTruthy();
        expect(flux.dispatchBinder.dispatch).toHaveBeenCalledWith(actions.LOAD_RECORDS_SUCCESS, response);
    });

});
