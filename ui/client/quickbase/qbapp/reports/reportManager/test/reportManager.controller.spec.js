describe('Controller: ReportCtrl', function() {
    'use strict';
    // load the controller's module
    beforeEach(module('qbse.qbapp.reports.manager'));

    var scope, ReportModel, $httpBackend, gridConstants, controller;
    var appId='1', tableId='2', reportId='3';
    var reportName='reportName', companyName='companyName';

    // Initialize the controller and a mock scope
    beforeEach(
        inject(function($controller, $rootScope, _$httpBackend_, _ReportModel_, _gridConstants_, $q ) {
            scope = $rootScope.$new();
            ReportModel = _ReportModel_;
            gridConstants = _gridConstants_;
            //$httpBackend = _$httpBackend_;
            //$httpBackend.whenGET('/api/v1/apps/1/tables/2/reports/3').respond(200, {'id':'1'});

            var metaData = {appId:appId, tableId:tableId, reportId:reportId, name:reportName, company:companyName};
            spyOn(ReportModel, 'getMetaData').and.returnValue($q.when(metaData));

            controller = $controller('ReportCtrl',
                {$scope:scope, $stateParams:{appId:appId, tableId:tableId, id: reportId}, ReportModel:ReportModel, gridConstants:gridConstants });

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

});
