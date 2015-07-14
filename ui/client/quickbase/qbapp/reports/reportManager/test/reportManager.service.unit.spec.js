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

    it('validate metaData, formattedRecords and getFields API service calls', function() {

        var offset=15, rows=10;
        ReportService.getMetaData(appId, tableId, reportId).then ();
        ReportService.getFormattedRecords(appId, tableId, offset, rows).then ();
        ReportService.getFields(appId, tableId).then ();

        //  apply the promise and propagate to the then function..
        scope.$apply(function() {
         deferredReport.resolve();
         deferredApp.resolve();
         deferredRecord.resolve();
         deferredField.resolve();
        });

        //  NOTE: the expectations will get tested until after the above promise is fulfilled
        expect(ApiService.getReport).toHaveBeenCalledWith(appId, tableId, reportId);
        expect(ApiService.getApp).toHaveBeenCalledWith(appId);
        expect(ApiService.getFormattedRecords).toHaveBeenCalledWith(appId, tableId, offset, rows);
        expect(ApiService.getFields).toHaveBeenCalledWith(appId, tableId);
     });

    it('validate the API getReport service call', function() {

        var reportData, offset=15, rows=10;
        ReportService.getReport(appId, tableId, reportId, offset, rows).then (
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

        //  NOTE: the expectations will get tested until after the above promise is fulfilled
        expect(ApiService.runFormattedReport).toHaveBeenCalledWith(appId, tableId, reportId, offset, rows);
        expect(reportData.fields.length).toEqual(2);
        expect(reportData.records.length).toEqual(3);
     });

    it('validate the API getReportFields service call', function() {

        var reportData;
        ReportService.getReportFields(appId, tableId, reportId).then (
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

        //  NOTE: the expectations will get tested until after the above promise is fulfilled
        expect(ApiService.runFormattedReport).toHaveBeenCalledWith(appId, tableId, reportId, 0, 1);
        expect(reportData.length).toEqual(2);
        expect(reportData.records).not.toBeDefined();
     });

    it('validate the API getReportRecords service call', function() {

        var reportData, offset=15, rows=10;;
        ReportService.getReportRecords(appId, tableId, reportId, offset, rows).then (
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

        //  NOTE: the expectations will get tested until after the above promise is fulfilled
        expect(ApiService.runFormattedReport).toHaveBeenCalledWith(appId, tableId, reportId, offset, rows);
        expect(reportData.fields).not.toBeDefined();
        expect(reportData.length).toEqual(3);
     });

});
