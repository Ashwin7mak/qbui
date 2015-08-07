describe('Factory: ReportModel', function() {
    'use strict';

    var scope;
    var ReportModel;
    var ReportService;
    var deferred;
    var $log;
    var appId ='1';
    var appName = 'A';
    var tableId = '2';
    var reportId = '3';

    // load the module
    beforeEach(function() {
        module('qbse.qbapp.reports.manager');
    });

    beforeEach(
        inject(function($rootScope, _ReportModel_, _ReportService_, $q, _$log_) {
            scope = $rootScope.$new();
            ReportModel = _ReportModel_;
            ReportService = _ReportService_;
            $log = _$log_;

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

    it('validate the resolved getColumnData service', function() {

        var columns;
        var promise = ReportModel.getColumnData(appId, tableId, reportId).then (
             function(value) {
                 columns = value;
             }
        );

        //  apply the promise and propagate to the then function..
        var fields = [
            {id:'0', name:'colName2', type:'TEXT'},
            {id:'1', name:'colName1', type:'NUMERIC', clientSideAttributes: {bold:true, width: 75} },
            {id:'2', name:'colName2', type:'TEXT', clientSideAttributes: {bold:false, width: 200}}];
        deferred.resolve(fields);
        scope.$apply();

        expect(promise.$$state.status).toEqual(1);

        //  NOTE: the expectations will get tested until after the above promise is fulfilled
        expect(ReportService.getReportFields).toHaveBeenCalledWith(appId, tableId, reportId);

        //  expect 3 columns array with the below data
        expect(columns.length).toEqual(3);
        columns.forEach( function(column, idx) {
            expect(column.id).toEqual(fields[idx].id);
            expect(column.name).toEqual(fields[idx].name);
            expect(column.displayName).toEqual(fields[idx].name);
            expect(column.fieldType).toEqual(fields[idx].type);
            switch (idx) {
                case 0:
                    expect(column.bold).toBeUndefined();
                    expect(column.width).toBeUndefined();
                    break;
                case 1:
                    expect(column.bold).toBeTruthy();
                    expect(column.width).toBeUndefined();
                    break;
                case 2:
                    expect(column.bold).toBeFalsy();
                    expect(column.width).toBeUndefined();
                    break;
            }
        });
    });

    it('validate the resolved getMetaData service call', function() {

        var metaData;
        var promise = ReportModel.getMetaData(appId, tableId, reportId).then (
             function(value) {
                 metaData = value;
             }
        );

        //  apply the promise and propagate to the then function..
        var reportName='reportName', reportDesc='reportDesc';
        var data = {
            rpt: {
                appId: appId,
                tableId: tableId,
                reportId: reportId,
                name: reportName,
                description: reportDesc
            },
            app: {
                name: appName
            }
        };
        deferred.resolve(data);
        scope.$apply();

        expect(promise.$$state.status).toEqual(1);

        //  NOTE: the expectations will get tested until after the above promise is fulfilled
        expect(ReportService.getMetaData).toHaveBeenCalledWith(appId, tableId, reportId);

        //  expect 2 columns array with the below data
        expect(metaData.appId).toEqual(appId);
        expect(metaData.tableId).toEqual(tableId);
        expect(metaData.reportId).toEqual(reportId);
        expect(metaData.name).toEqual(reportName);
        expect(metaData.description).toEqual(reportDesc);
        expect(metaData.appName).toEqual(appName);

    });

    it('validate the resolved getREportData service call with no data returned', function() {

        var reportData, offset=30, rows=10;
        var promise = ReportModel.getReportData(appId, tableId, reportId, offset, rows).then (
             function(value) {
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

        expect(promise.$$state.status).toEqual(1);

        //  NOTE: the expectations will get tested until after the above promise is fulfilled
        expect(ReportService.getReport).toHaveBeenCalledWith(appId, tableId, reportId, offset, rows);
        expect(reportData.length).toEqual(0);

    });

    it('validate the resolved getReportData service call with data', function() {

        var reportData, offset=30, rows=10;
        var promise = ReportModel.getReportData(appId, tableId, reportId, offset, rows).then (
             function(value) {
                 reportData = value;
             }
        );

        var fields = [
            {id:'1', name:'colName2', type:'TEXT'},
            {id:'2', name:'colName1', type:'NUMERIC'}];

        //  apply the promise and propagate to the then function..
        var data =
            {fields:fields,
             records:[
                 [{id:'1',display:{align:'left', width:100}}],
                 [{id:'2',display:{align:'left', width:200}}],
             ]
            };
        deferred.resolve(data);
        scope.$apply();

        expect(promise.$$state.status).toEqual(1);

        //  NOTE: the expectations will get tested until after the above promise is fulfilled
        expect(ReportService.getReport).toHaveBeenCalledWith(appId, tableId, reportId, offset, rows);
        expect(reportData.length).toEqual(2);

    });

    it('validate the rejected getColumnData service', function() {

        var columns;
        var promise = ReportModel.getColumnData(appId, tableId, reportId).then (
             function(value) {
                 columns = value;
             }
        );

        //  apply the promise and propagate to the then function..
        var errResp = {msg:'error',status:500};
        deferred.reject(errResp);
        scope.$apply();

        expect(promise.$$state.status).toEqual(2);
        expect(ReportService.getReportFields).toHaveBeenCalledWith(appId, tableId, reportId);
    });

    it('validate the rejected getMetaData service call', function() {

        var metaData;
        var promise = ReportModel.getMetaData(appId, tableId, reportId).then (
             function(value) {
                 metaData = value;
             }
        );

        var errResp = {msg:'error',status:500};
        deferred.reject(errResp);
        scope.$apply();

        expect(promise.$$state.status).toEqual(2);
        expect(ReportService.getMetaData).toHaveBeenCalledWith(appId, tableId, reportId);
    });


    it('validate the rejected getReportData service call', function() {

        var reportData, offset=30, rows=10;
        var promise = ReportModel.getReportData(appId, tableId, reportId, offset, rows).then (
             function(value) {
                 reportData = value;
             }
        );

        var errResp = {msg:'error',status:500};
        deferred.reject(errResp);
        scope.$apply();

        expect(promise.$$state.status).toEqual(2);
        expect(ReportService.getReport).toHaveBeenCalledWith(appId, tableId, reportId, offset, rows);

    });


});
