describe('Controller: ReportCtrl', function() {
    'use strict';
    // load the controller's module
    beforeEach(module('qbse.qbapp.reports.manager'));

    var scope;
    var ReportModel;
    var gridConstants;
    var controller;
    var $log;
    var appId = '1';
    var tableId = '2';
    var reportId = '3';
    var reportName = 'reportName';
    var companyName = 'companyName';
    var deferredColumn;
    var deferredData;

    // Initialize the controller and a mock scope
    beforeEach(
            inject(function($controller, $rootScope, _$httpBackend_, _ReportModel_, _gridConstants_, $q, _$log_) {
                scope = $rootScope.$new();
                ReportModel = _ReportModel_;
                gridConstants = _gridConstants_;
                $log = _$log_;

                var metaData = {appId: appId, tableId: tableId, reportId: reportId, name: reportName, company: companyName};

                spyOn(ReportModel, 'getMetaData').and.returnValue($q.when(metaData));

                deferredColumn = $q.defer();
                deferredData = $q.defer();
                spyOn(ReportModel, 'getColumnData').and.callFake(function() {
                    return deferredColumn.promise;
                });
                spyOn(ReportModel, 'getReportData').and.callFake(function() {
                    return deferredData.promise;
                });

                controller = $controller('ReportCtrl',
                                         {$scope: scope, $stateParams: {appId: appId, tableId: tableId, id: reportId}, ReportModel: ReportModel, gridConstants: gridConstants});

                scope.$digest();
            })
    );

    it('validate the request parameters are properly set on the scope', function() {
        expect(scope.report.id).toEqual(reportId);
        expect(scope.report.appId).toEqual(appId);
        expect(scope.report.tableId).toEqual(tableId);
    });

    it('validate the meta data scope references', function() {
        //  all grid reports are expected to have these scope variables
        expect(ReportModel.getMetaData).toHaveBeenCalledWith(appId, tableId, reportId);
        expect(scope.report.name).toEqual(reportName);
        expect(scope.report.company).toEqual(companyName);
        expect(scope.report.dataService).toBeDefined();
        expect(scope.getContent()).toBeDefined();
        expect(scope.getStageContent()).toBeDefined();
        //  validate any grid option overrides
        expect(scope.report.qbseGridOptions.showGridFooter).toBeFalsy();
    });

    it('validate the data grid staging and content templates have content', function() {
        //  all reports expected to have staging and content template defined
        expect(scope.getStageContent().length).toBeGreaterThan(0);
        expect(scope.getContent().length).toBeGreaterThan(0);
    });

    it('validate the data grid report service callback for column data', function() {
        //  resolve the promise with the colData object
        var colData = {colData: true};
        deferredColumn.resolve(colData);

        expect(scope.report.dataService).toBeDefined();
        scope.report.dataService(gridConstants.SERVICE_REQ.COLS, 0, 10);
        expect(ReportModel.getColumnData).toHaveBeenCalledWith(appId, tableId, reportId);
    });

    it('validate the data grid report service callback for column data', function() {
        //  resolve the promise with the reportData object
        var rptData = {rptData: true};
        deferredData.resolve(rptData);

        var offset = 0, rows = 10;
        expect(scope.report.dataService).toBeDefined();
        scope.report.dataService(gridConstants.SERVICE_REQ.DATA, offset, rows);
        expect(ReportModel.getReportData).toHaveBeenCalledWith(appId, tableId, reportId, offset, rows);
    });

});
