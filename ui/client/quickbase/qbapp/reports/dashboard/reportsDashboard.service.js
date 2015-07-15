(function() {
    'use strict';

    angular.module('qbse.qbapp.reports.dashboard')
        .service('ReportsDashboardService', ReportsDashboardService);

    ReportsDashboardService.$inject = ['$q', 'ApiService'];

    function ReportsDashboardService($q, ApiService) {

        var service = {
            get: function(appId, tableId) {

                var deferred = $q.defer();

                ApiService.getReports(appId, tableId).then(
                    function(reports) {
                        deferred.resolve(reports);
                    },
                    function(resp) {
                        deferred.reject(resp);
                    }
                );

                return deferred.promise;

            },

            getApps: function() {
                var deferred = $q.defer();

                ApiService.getApps().then(
                    function(apps) {
                        deferred.resolve(apps);
                    },
                    function(resp) {
                        deferred.reject(resp);
                    }
                );

                return deferred.promise;
            },

            getApp: function(appId) {
                var deferred = $q.defer();

                ApiService.getApp(appId).then(
                    function(app) {
                        deferred.resolve(app);
                    },
                    function(resp) {
                        deferred.reject(resp);
                    }
                );

                return deferred.promise;
            }
        };

        return service;
    }

}());
