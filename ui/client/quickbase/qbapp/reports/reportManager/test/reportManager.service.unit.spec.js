describe('Service: ReportService', function() {
    'use strict';

    // load the module
    beforeEach(function() {
        module('qbse.qbapp.reports.manager');
    });

    var scope, ApiService, ReportService;
    var deferredReport, deferredApp, deferredRecord, deferredField, deferredFormattedReport;
    var appId='1', tableId='2', reportId='3';

    beforeEach(
        inject(function($rootScope, _ReportService_, _ApiService_, $q ) {
            ReportService = _ReportService_;
            scope = $rootScope.$new();
            ApiService = _ApiService_;

            deferredReport = $q.defer();
            deferredApp = $q.defer();
            deferredRecord = $q.defer();
            deferredField = $q.defer();
            deferredFormattedReport = $q.defer();

            spyOn(ApiService, 'getReport').and.callFake(function() {
                return deferredReport.promise;
            });
            spyOn(ApiService, 'getApp').and.callFake(function() {
                return deferredApp.promise;
            });
            spyOn(ApiService, 'getFormattedRecords').and.callFake(function() {
                return deferredRecord.promise;
            });
            spyOn(ApiService, 'getFields').and.callFake(function() {
                return deferredField.promise;
            });
            spyOn(ApiService, 'runFormattedReport').and.callFake(function() {
                return deferredFormattedReport.promise;
            });
        })
    );

    it('validate resolved promise for metaData, formattedRecords and getFields API service calls', function() {

        var offset=15, rows=10;
        var metaPromise = ReportService.getMetaData(appId, tableId, reportId).then ();
        var recordsPromise = ReportService.getFormattedRecords(appId, tableId, offset, rows).then ();
        var fieldsPromise = ReportService.getFields(appId, tableId).then ();

        //  apply the promise and propagate to the then function..
        scope.$apply(function() {
         deferredReport.resolve();
         deferredApp.resolve();
         deferredRecord.resolve();
         deferredField.resolve();
        });

        //  NOTE: the expectations will not get tested until after the above promise is fulfilled
        expect(ApiService.getReport).toHaveBeenCalledWith(appId, tableId, reportId);
        expect(ApiService.getApp).toHaveBeenCalledWith(appId);
        expect(ApiService.getFormattedRecords).toHaveBeenCalledWith(appId, tableId, offset, rows);
        expect(ApiService.getFields).toHaveBeenCalledWith(appId, tableId);

        expect(metaPromise.$$state.status).toEqual(1);
        expect(recordsPromise.$$state.status).toEqual(1);
        expect(fieldsPromise.$$state.status).toEqual(1);

    });

    it('validate rejected promise for metaData, formattedRecords and getFields API service calls', function() {

        var offset=15, rows=10;
        var metaPromise = ReportService.getMetaData(appId, tableId, reportId).then ();
        var rptPromise = ReportService.getFormattedRecords(appId, tableId, offset, rows).then ();
        var fldPromise = ReportService.getFields(appId, tableId).then ();

        //  apply the promise and propagate to the then function..
        var errResp = {msg:'error'};
        scope.$apply(function() {
         deferredReport.reject(errResp);
         deferredApp.reject(errResp);
         deferredRecord.reject(errResp);
         deferredField.reject(errResp);
        });

        //  NOTE: the expectations will not get tested until after the above promise is fulfilled
        expect(ApiService.getReport).toHaveBeenCalledWith(appId, tableId, reportId);
        expect(ApiService.getApp).toHaveBeenCalledWith(appId);
        expect(ApiService.getFormattedRecords).toHaveBeenCalledWith(appId, tableId, offset, rows);
        expect(ApiService.getFields).toHaveBeenCalledWith(appId, tableId);

        //  Expect the error promise to be returned
        expect(metaPromise.$$state.status).toEqual(2);
        expect(rptPromise.$$state.status).toEqual(2);
        expect(fldPromise.$$state.status).toEqual(2);

    });

    it('validate resolved API getReport service call', function() {

        var reportData, offset=15, rows=10;
        var promise = ReportService.getReport(appId, tableId, reportId, offset, rows).then (
             function (value) {
                 reportData = value;
             }
        );

        //  apply the promise and propagate to the then function..
        scope.$apply(function() {
         deferredFormattedReport.resolve(
             {fields:[{id:'1'},{id:'2'}],
              records:[{id:'10'},{id:'11'},{id:'3'}]
             }
         );
        });

        //  NOTE: the expectations will not get tested until after the above promise is fulfilled
        expect(ApiService.runFormattedReport).toHaveBeenCalledWith(appId, tableId, reportId, offset, rows);
        expect(reportData.fields.length).toEqual(2);
        expect(reportData.records.length).toEqual(3);
        expect(promise.$$state.status).toEqual(1);
    });

    it('validate rejected API getReport service call', function() {

        var offset=15, rows=10;
        var promise = ReportService.getReport(appId, tableId, reportId, offset, rows);

        var errResp = {msg:'error',status:500};
        scope.$apply(function() {
            deferredFormattedReport.reject(errResp);
        });

        //  NOTE: the expectations will get tested until after the above promise is fulfilled
        expect(ApiService.runFormattedReport).toHaveBeenCalledWith(appId, tableId, reportId, offset, rows);
        expect(promise.$$state.status).toEqual(2);
    });

    it('validate resolved API getReportFields service call', function() {

        var reportData;
        var promise = ReportService.getReportFields(appId, tableId, reportId).then (
             function (value) {
                 reportData = value;
             }
        );

        //  apply the promise and propagate to the then function..
        scope.$apply(function() {
         deferredFormattedReport.resolve(
             {fields:[{id:'1'},{id:'2'}],
              records:[{id:'10'},{id:'11'},{id:'3'}]
             }
         );
        });

        //  NOTE: the expectations will not get tested until after the above promise is fulfilled
        expect(ApiService.runFormattedReport).toHaveBeenCalledWith(appId, tableId, reportId, 0, 1);
        expect(reportData.length).toEqual(2);
        expect(reportData.records).not.toBeDefined();
        expect(promise.$$state.status).toEqual(1);
    });

    it('validate rejected API getReportFields service call', function() {

        var promise = ReportService.getReportFields(appId, tableId, reportId);

        var errResp = {msg:'error',status:500};
        scope.$apply(function() {
            deferredFormattedReport.reject(errResp);
        });

        //  NOTE: the expectations will get tested until after the above promise is fulfilled
        expect(ApiService.runFormattedReport).toHaveBeenCalledWith(appId, tableId, reportId, 0, 1);
        expect(promise.$$state.status).toEqual(2);
    });

    it('validate resolved API getReportRecords service call', function() {

        var reportData, offset=15, rows=10;
        var promise = ReportService.getReportRecords(appId, tableId, reportId, offset, rows).then (
             function (value) {
                 reportData = value;
             }
        );

        //  apply the promise and propagate to the then function..
        scope.$apply(function() {
         deferredFormattedReport.resolve(
             {fields:[{id:'1'},{id:'2'}],
              records:[{id:'10'},{id:'11'},{id:'3'}]
             }
         );
        });

        //  NOTE: the expectations will not get tested until after the above promise is fulfilled
        expect(ApiService.runFormattedReport).toHaveBeenCalledWith(appId, tableId, reportId, offset, rows);
        expect(reportData.fields).not.toBeDefined();
        expect(reportData.length).toEqual(3);
        expect(promise.$$state.status).toEqual(1);
    });
    it('validate rejected API getReportRecords service call', function() {

        var offset=15, rows=10;
        var promise = ReportService.getReportRecords(appId, tableId, reportId, offset, rows);

        var errResp = {msg:'error',status:500};
        scope.$apply(function() {
            deferredFormattedReport.reject(errResp);
        });

        //  NOTE: the expectations will not get tested until after the above promise is fulfilled
        expect(ApiService.runFormattedReport).toHaveBeenCalledWith(appId, tableId, reportId, offset, rows);
        expect(promise.$$state.status).toEqual(2);
    });

});
