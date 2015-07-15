describe('Service: ReportService', function() {
    'use strict';

    // load the module
    beforeEach(function() {
        module('qbse.qbapp.reports.dashboard','quickbase.qbapp', 'qbse.templates');
    });

    var scope, ApiService, ReportsDashboardService;
    var deferred;
    var appId='1', tableId='2';

    beforeEach(
        inject(function($rootScope, _ReportsDashboardService_, _ApiService_, $q ) {
            ReportsDashboardService = _ReportsDashboardService_;
            scope = $rootScope.$new();
            ApiService = _ApiService_;

            deferred = $q.defer();
        })
    );

    it('validate resolved API getReports service call', function() {
        spyOn(ApiService, 'getReports').and.callFake(function() {
            return deferred.promise;
        });

        deferred.resolve();
        var promise = ReportsDashboardService.get(appId, tableId);
        scope.$apply();

        expect(ApiService.getReports).toHaveBeenCalledWith(appId, tableId);
        expect(promise.$$state.status).toEqual(1);
    });
    it('validate rejected API getReports service call', function() {
        spyOn(ApiService, 'getReports').and.callFake(function() {
            return deferred.promise;
        });

        deferred.reject();
        var promise = ReportsDashboardService.get(appId, tableId);
        scope.$apply();

        expect(ApiService.getReports).toHaveBeenCalledWith(appId, tableId);
        expect(promise.$$state.status).toEqual(2);
    });

    it('validate resolved API getApps service call', function() {
        spyOn(ApiService, 'getApps').and.callFake(function() {
            return deferred.promise;
        });

        deferred.resolve();
        var promise = ReportsDashboardService.getApps();
        scope.$apply();

        expect(ApiService.getApps).toHaveBeenCalledWith();
        expect(promise.$$state.status).toEqual(1);
    });
    it('validate rejected API getApps service call', function() {
        spyOn(ApiService, 'getApps').and.callFake(function() {
            return deferred.promise;
        });

        deferred.reject();
        var promise = ReportsDashboardService.getApps();
        scope.$apply();

        expect(ApiService.getApps).toHaveBeenCalledWith();
        expect(promise.$$state.status).toEqual(2);
    });

    it('validate resolved API getApp service call', function() {
        spyOn(ApiService, 'getApp').and.callFake(function() {
            return deferred.promise;
        });

        deferred.resolve();
        var promise = ReportsDashboardService.getApp(appId);
        scope.$apply();

        expect(ApiService.getApp).toHaveBeenCalledWith(appId);
        expect(promise.$$state.status).toEqual(1);
    });
    it('validate rejected API getApp service call', function() {
        spyOn(ApiService, 'getApp').and.callFake(function() {
            return deferred.promise;
        });

        deferred.reject();
        var promise = ReportsDashboardService.getApp(appId);
        scope.$apply();

        expect(ApiService.getApp).toHaveBeenCalledWith(appId);
        expect(promise.$$state.status).toEqual(2);
     });

});
