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
        this.getMetaData = function(appId, tableId, reportId) {
            var deferred = $q.defer();

            $q.all({
                rpt: ApiService.getReport(appId, tableId, reportId),
                app: ApiService.getApp(appId)
            }).then(
                function(report) {
                    deferred.resolve(report);
                },
                function(resp) {
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
                    deferred.resolve(records);
                },
                function(resp) {
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
                    deferred.resolve(fields);
                },
                function(resp) {
                    deferred.reject(resp);
                }
            );

            return deferred.promise;
        };

        /**
         * Return the fields for a given report.  The rest endpoint requires the rows query
         * parameter to be gt zero, so even though we are only interested in the report fields
         * and not the actual report data, we must call the api endpoint with 1 row requested.
         *
         * @param appId
         * @param tableId
         * @param reportId
         * @returns {*}
         */
        this.getReportFields = function(appId, tableId, reportId) {
            var deferred = $q.defer();

            var offset=0;
            var rows=1;
            ApiService.runFormattedReport(appId, tableId, reportId, offset, rows).then(
                function(report) {
                    deferred.resolve(report.fields);
                },
                function(resp) {
                    deferred.reject(resp);
                }
            );

            return deferred.promise;
        };

        /**
         * Return formatted data records only for a given report, offset and rows.
         * If no offset and/or rows, then all data is returned.
         *
         * @param appId
         * @param tableId
         * @param reportId
         * @param offset
         * @param rows
         *
         * @returns {*}
         */
        this.getReportRecords = function(appId, tableId, reportId, offset, rows) {
            var deferred = $q.defer();

            ApiService.runFormattedReport(appId, tableId, reportId, offset, rows).then(
                function(report) {
                    deferred.resolve(report.records);
                },
                function(resp) {
                    deferred.reject(resp);
                }
            );

            return deferred.promise;
        };

        /**
         * Return formatted report data(fields, data) for a given report, offset and rows.
         * If no offset and/or rows, then all data is returned.
         *
         * @param appId
         * @param tableId
         * @param reportId
         * @param offset
         * @param rows
         *
         * @returns {*}
         */
        this.getReport = function(appId, tableId, reportId, offset, rows) {
            var deferred = $q.defer();

            ApiService.runFormattedReport(appId, tableId, reportId, offset, rows).then(
                function(report) {
                    deferred.resolve(report);
                },
                function(resp) {
                    deferred.reject(resp);
                }
            );

            return deferred.promise;
        };

    }

}());
