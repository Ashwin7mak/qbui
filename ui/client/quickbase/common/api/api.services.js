(function() {
    'use strict';

    /**
     * Service to provide interface to the java QuickBase tomcat api
     * the default resource methods available are
     *    'get'
     *    'save'
     *    'query'
     *    'remove'
     *    'delete'
     *
     */

    angular.module('qbse.api').service('ApiService', ApiService);

    ApiService.$inject = ['Restangular', 'qbUtility', 'apiConstants'];

    function ApiService(Restangular, qbUtility, apiConstants) {

        function setQueryParams(format, offset, rows) {
            var queryParams = {};
            if (format) {
                queryParams.format = format;
            }
            if (qbUtility.isInt(offset) && qbUtility.isInt(rows)) {
                queryParams.offset = offset;
                queryParams.numRows = rows;
            }
            return queryParams;
        }

        function runTheReport(appId, tableId, reportId, queryParams) {
            return Restangular.one(apiConstants.APPS, appId).one(apiConstants.TABLES, tableId).one(apiConstants.REPORTS, reportId).one('results').get(queryParams);
        }

        function getTheRecords(appId, tableId, queryParams) {
            return Restangular.one(apiConstants.APPS, appId).one(apiConstants.TABLES, tableId).one(apiConstants.RECORDS).get(queryParams);
        }

        var service = {
            getApp: function(appId) {
                return Restangular.one(apiConstants.APPS, appId).get();
            },

            getApps: function() {
                return Restangular.one(apiConstants.APPS).get();
            },

            getFields: function(appId, tableId) {
                return Restangular.one(apiConstants.APPS, appId).one(apiConstants.TABLES, tableId).one(apiConstants.FIELDS).get();
            },

            getField: function(appId, tableId, fieldId) {
                return Restangular.one(apiConstants.APPS, appId).one(apiConstants.TABLES, tableId).one(apiConstants.FIELDS, fieldId).get();
            },

            getRecords         : function(appId, tableId, offset, rows) {
                var queryParams = setQueryParams(null, offset, rows);
                return getTheRecords(appId, tableId, queryParams);
            },
            getFormattedRecords: function(appId, tableId, offset, rows) {
                var queryParams = setQueryParams('display', offset, rows);
                return getTheRecords(appId, tableId, queryParams);
            },

            getReport: function(appId, tableId, reportId) {
                return Restangular.one(apiConstants.APPS, appId).one(apiConstants.TABLES, tableId).one(apiConstants.REPORTS, reportId).get();
            },

            getReports: function(appId, tableId) {
                return Restangular.one(apiConstants.APPS, appId).one(apiConstants.TABLES, tableId).one(apiConstants.REPORTS).get();
            },

            runReport         : function(appId, tableId, reportId, offset, rows) {
                var queryParams = setQueryParams(null, offset, rows);
                return runTheReport(appId, tableId, reportId, queryParams);
            },
            runFormattedReport: function(appId, tableId, reportId, offset, rows) {
                var queryParams = setQueryParams('display', offset, rows);
                return runTheReport(appId, tableId, reportId, queryParams);
            }
        };

        return service;

    }


})();
