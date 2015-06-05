describe('Factory: ReportModel', function() {
    'use strict';

    var scope, ReportModel, ReportService, deferred;
    var appId='1', tableId='2', reportId='3';

    // load the module
    beforeEach(function() {
        module('qbse.qbapp.reports.manager');
    });

    beforeEach(
        inject(function($rootScope, _ReportModel_, _ReportService_, $q) {
            scope = $rootScope.$new();
            ReportModel = _ReportModel_;
            ReportService = _ReportService_;

            deferred = $q.defer();

            spyOn(ReportService, 'getReportFields').and.callFake(function() {
                return deferred.promise;
            });
            spyOn(ReportService, 'getReport').and.callFake(function() {
                return deferred.promise;
            });
            spyOn(ReportService, 'getMetaData').and.callFake(function() {
                return deferred.promise;
            });

        })
    );

    it('validate the getColumnData service call', function() {

        var columns;
        ReportModel.getColumnData(appId, tableId, reportId).then (
             function (value) {
                 columns = value;
             }
        );

        //  apply the promise and propagate to the then function..
        var fields = [
            {id:'1', name:'colName1', type:'NUMERIC'},
            {id:'2', name:'colName2', type:'TEXT'}];
        deferred.resolve(fields);
        scope.$apply();

        //  NOTE: the expectations will get tested until after the above promise is fulfilled
        expect(ReportService.getReportFields).toHaveBeenCalledWith(appId, tableId, reportId);

        //  expect 2 columns array with the below data
        expect(columns.length).toEqual(2);
        columns.forEach( function(column, idx) {
            expect(column.id).toEqual(fields[idx].id);
            expect(column.name).toEqual(fields[idx].name);
            expect(column.displayName).toEqual(fields[idx].name);
            expect(column.fieldType).toEqual(fields[idx].type);
        });
    });

    it('validate the getMetaData service call', function() {

        var metaData;
        ReportModel.getMetaData(appId, tableId, reportId).then (
             function (value) {
                 metaData = value;
             }
        );

        //  apply the promise and propagate to the then function..
        var reportName='reportName', reportDesc='reportDesc'
        var data = {appId:appId, tableId:tableId, reportId:reportId, name:reportName, description:reportDesc};
        deferred.resolve(data);
        scope.$apply();

        //  NOTE: the expectations will get tested until after the above promise is fulfilled
        expect(ReportService.getMetaData).toHaveBeenCalledWith(appId, tableId, reportId);

        //  expect 2 columns array with the below data
        expect(metaData.appId).toEqual(appId);
        expect(metaData.tableId).toEqual(tableId);
        expect(metaData.reportId).toEqual(reportId);
        expect(metaData.name).toEqual(reportName);
        expect(metaData.description).toEqual(reportDesc);
        expect(metaData.snapshot).toBeDefined();
    });

    it('validate the getData service call', function() {

        var reportData, offset=30, rows=10;
        ReportModel.getReportData(appId, tableId, reportId, offset, rows).then (
             function (value) {
                 reportData = value;
             }
        );

        //  apply the promise and propagate to the then function..
        var data = [
            {fields:[],
             records:[]}
            ];
        deferred.resolve(data);
        scope.$apply();

        //  NOTE: the expectations will get tested until after the above promise is fulfilled
        expect(ReportService.getReport).toHaveBeenCalledWith(appId, tableId, reportId, offset, rows);
        expect(reportData.length).toEqual(0);

    });

});
