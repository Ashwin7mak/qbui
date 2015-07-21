describe('Factory: ReportsDashboardModel', function() {
    'use strict';

    var scope, ReportsDashboardModel, ReportsDashboardService, deferred;
    var appId='1', tableId='2';

    // load the module
    beforeEach(function() {
        module('qbse.qbapp.reports.dashboard','quickbase.qbapp', 'qbse.templates');
    });

    beforeEach(
        inject(function($rootScope, _ReportsDashboardModel_, _ReportsDashboardService_, $q) {
            scope = $rootScope.$new();
            ReportsDashboardModel = _ReportsDashboardModel_;
            ReportsDashboardService = _ReportsDashboardService_;

            deferred = $q.defer();
        })
    );

    it('validate the get service', function() {

        spyOn(ReportsDashboardService, 'get').and.callFake(function() {
            return deferred.promise;
        });

        //  apply the promise and propagate to the then function..
        var reportData = [
            {id:'0', name:'name0'},
            {id:'1', name:'name1'},
            {id:'2', name:'name2'}];
        deferred.resolve(reportData);

        var reports;
        ReportsDashboardService.get(appId, tableId).then (
             function (value) {
                 reports = value;
             }
        );

        scope.$apply();

        //  NOTE: the expectations will get tested until after the above promise is fulfilled
        expect(ReportsDashboardService.get).toHaveBeenCalledWith(appId, tableId);
        expect(reports).toEqual(reportData);

    });

    it('validate the getApps service', function() {

        spyOn(ReportsDashboardService, 'getApps').and.callFake(function() {
            return deferred.promise;
        });

        //  apply the promise and propagate to the then function..
        var appsData = [
            {id:'0', name:'name0'},
            {id:'1', name:'name1'},
            {id:'2', name:'name2'}];
        deferred.resolve(appsData);

        var apps;
        ReportsDashboardService.getApps().then (
             function (value) {
                 apps = value;
             }
        );

        scope.$apply();

        //  NOTE: the expectations will get tested until after the above promise is fulfilled
        expect(ReportsDashboardService.getApps).toHaveBeenCalledWith();
        expect(apps).toEqual(appsData);

    });

    it('validate the getApp service', function() {

        spyOn(ReportsDashboardService, 'getApp').and.callFake(function() {
            return deferred.promise;
        });

        //  apply the promise and propagate to the then function..
        var appData = {id:'0', name:'name0'};
        deferred.resolve(appData);

        var app;
        ReportsDashboardService.getApp(appId).then (
             function (value) {
                 app = value;
             }
        );

        scope.$apply();

        //  NOTE: the expectations will get tested until after the above promise is fulfilled
        expect(ReportsDashboardService.getApp).toHaveBeenCalledWith(appId);
        expect(app).toEqual(appData);

    });

});
