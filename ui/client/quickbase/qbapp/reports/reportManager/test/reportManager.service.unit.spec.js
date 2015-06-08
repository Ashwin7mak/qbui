describe('Service: ReportService', function() {
    'use strict';

    // load the module
    beforeEach(function() {
        module('qbse.qbapp.reports.manager');
    });

    var scope, ApiService, ReportService;
    var deferredReport, deferredRecord, deferredField, deferredFormatted;
    var appId='1', tableId='2', reportId='3';

    beforeEach(
        inject(function($rootScope, _ReportService_, _ApiService_, $q ) {
            ReportService = _ReportService_;
            scope = $rootScope.$new();
            ApiService = _ApiService_;

            deferredReport = $q.defer();
            deferredRecord = $q.defer();
            deferredField = $q.defer();
            deferredFormatted = $q.defer();

            spyOn(ApiService, 'getReport').and.callFake(function() {
                return deferredReport.promise;
            });
            spyOn(ApiService, 'getFormattedRecords').and.callFake(function() {
                return deferredRecord.promise;
            });
            spyOn(ApiService, 'getFields').and.callFake(function() {
                return deferredField.promise;
            });
            spyOn(ApiService, 'runFormattedReport').and.callFake(function() {
                return deferredFormatted.promise;
            });
        })
    );

    it('validate the API service calls', function() {

        var offset=15, rows=10;
        ReportService.getMetaData(appId, tableId, reportId).then ();
        ReportService.getFormattedRecords(appId, tableId, offset, rows).then ();
        ReportService.getFields(appId, tableId).then ();
        ReportService.getReport(appId, tableId, reportId, offset, rows).then ();

        //  apply the promise and propagate to the then function..
        scope.$apply(function() {
         deferredReport.resolve();
         deferredRecord.resolve();
         deferredField.resolve();
         deferredFormatted.resolve();
        });

        //  NOTE: the expectations will get tested until after the above promise is fulfilled
        expect(ApiService.getReport).toHaveBeenCalledWith(appId, tableId, reportId);
        expect(ApiService.getFormattedRecords).toHaveBeenCalledWith(appId, tableId, offset, rows);
        expect(ApiService.getFields).toHaveBeenCalledWith(appId, tableId);
        expect(ApiService.runFormattedReport).toHaveBeenCalledWith(appId, tableId, reportId, offset, rows);
     });

});
