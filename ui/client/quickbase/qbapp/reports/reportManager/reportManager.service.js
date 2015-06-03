(function() {
    'use strict';

    angular.module('qbse.qbapp.reports.manager')
        .service('ReportService',['$q', 'ApiService', ReportManagerService]);

    function ReportManagerService($q, ApiService) {

        /**
         * Return the meta report information for the given appId, tableId and reportId
         *
         * @param appId
         * @param tableId
         * @param reportId
         * @returns {deferred.promise|{then, always}}
         */
        this.getMetaReport = function(appId, tableId, reportId) {
            var deferred = $q.defer();

            ApiService.getReport(appId, tableId, reportId ).then(
                function(report) {
                    console.log('GetReport: Success callback');
                    deferred.resolve(report);
                },
                function(resp) {
                    console.log('GetReport: failure callback');
                    deferred.reject(resp);
                }
            );

            return deferred.promise;
        };

        /**
         * Return all records for the given appId and tableId
         *
         * @param appId
         * @param tableId
         * @param offset
         * @param rows
         * @returns {deferred.promise|{then, always}}
         */
        this.getFormattedRecords = function(appId, tableId, offset, rows) {
            var deferred = $q.defer();

            ApiService.getFormattedRecords(appId, tableId, offset, rows).then(
                function(records) {
                    console.log('GetFormattedRecords: Success callback');
                    deferred.resolve(records);
                },
                function(resp) {
                    console.log('GetRecords: failure callback');
                    deferred.reject(resp);
                }
            );

            return deferred.promise;
        };

        /**
         * Return all fields for the given appid and tableId
         *
         * @param appId
         * @param tableId
         * @returns {deferred.promise|{then, always}}
         */
        this.getFields = function(appId, tableId) {
            var deferred = $q.defer();

            ApiService.getFields(appId, tableId).then(
                function(fields) {
                    console.log('GetFields: Success callback');
                    deferred.resolve(fields);
                },
                function(resp) {
                    console.log('GetFields: failure callback');
                    deferred.reject(resp);
                }
            );

            return deferred.promise;
        };

        this.getReportFields = function(appId, tableId, reportId) {
            var deferred = $q.defer();

            var offset=0;
            var rows=1;
            ApiService.runFormattedReport(appId, tableId, reportId, offset, rows).then(
                function(report) {
                    console.log('runFormattedReport: Success callback');
                    deferred.resolve(report.fields);
                },
                function(resp) {
                    console.log('runFormattedReport: failure callback');
                    deferred.reject(resp);
                }
            );

            return deferred.promise;
        };

        this.getReportRecords = function(appId, tableId, reportId, offset, rows) {
            var deferred = $q.defer();

            ApiService.runFormattedReport(appId, tableId, reportId, offset, rows).then(
                function(report) {
                    console.log('runFormattedReport: Success callback');
                    deferred.resolve(report.records);
                },
                function(resp) {
                    console.log('runFormattedReport: failure callback');
                    deferred.reject(resp);
                }
            );

            return deferred.promise;
        };

        this.getReport = function(appId, tableId, reportId, offset, rows) {
            var deferred = $q.defer();

            ApiService.runFormattedReport(appId, tableId, reportId, offset, rows).then(
                function(report) {
                    console.log('runFormattedReport: Success callback');
                    deferred.resolve(report);
                },
                function(resp) {
                    console.log('runFormattedReport: failure callback');
                    deferred.reject(resp);
                }
            );

            return deferred.promise;
        };

    }

}());
