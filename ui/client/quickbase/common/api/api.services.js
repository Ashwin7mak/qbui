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

    ApiService.$inject = ['Restangular', 'qbUtility', 'apiConstants', '$cookieStore'];

    function ApiService(Restangular, qbUtility, apiConstants, $cookies) {

        // get the auth session ticket from the cookie.  If it's invalid or not found, the
        // requested endPoint will respond with a 403 status, which is handles in api.modules.js by
        // the RestangularProvider.setErrorInterceptor.
        //
        function getTicket() {
            return $cookies.get(apiConstants.TICKET_COOKIE);
        }

        function setFormattedRecordsQueryParams(type, offset, rows) {
            var queryParams = {format: 'display'};
            if (qbUtility.isInt(offset) && qbUtility.isInt(rows)) {
                queryParams.offset = offset;
                queryParams.numRows = rows;
            }
            return queryParams;
        }

        var service = {
            getApp: function(appId) {
                var httpHeaders = {ticket: getTicket()};
                return Restangular.one(apiConstants.APPS, appId).withHttpConfig(httpHeaders).get();
            },

            getFields: function(appId, tableId) {
                var httpHeaders = {ticket: getTicket()};
                return Restangular.one(apiConstants.APPS,appId).one(apiConstants.TABLES,tableId).one(apiConstants.FIELDS).withHttpConfig(httpHeaders).get();
            },

            getField: function(appId, tableId, fieldId) {
                var httpHeaders = {ticket: getTicket()};
                return Restangular.one(apiConstants.APPS,appId).one(apiConstants.TABLES,tableId).one(apiConstants.FIELDS,fieldId).withHttpConfig(httpHeaders).get();
            },

            getFormattedRecords: function(appId, tableId, offset, rows) {
                var queryParams = setFormattedRecordsQueryParams('display', offset, rows);
                return this.getRecords(appId, tableId, queryParams);
            },
            getRawRecords: function(appId, tableId, offset, rows) {
                var queryParams = setFormattedRecordsQueryParams('raw', offset, rows);
                return this.getRecords(appId, tableId, queryParams);
            },
            getRecords: function(appId, tableId, queryParams) {
                var httpHeaders = {ticket: getTicket()};
                return Restangular.one(apiConstants.APPS, appId).one(apiConstants.TABLES,tableId).one(apiConstants.RECORDS).withHttpConfig(httpHeaders).get(queryParams ? queryParams : {});
            },

            getReport: function(appId, tableId, reportId) {
                var httpHeaders = {ticket: getTicket()};
                return Restangular.one(apiConstants.APPS, appId).one(apiConstants.TABLES,tableId).one(apiConstants.REPORTS,reportId).withHttpConfig(httpHeaders).get();
            },

            getReports: function(appId, tableId) {
                var httpHeaders = {ticket: getTicket()};
                return Restangular.one(apiConstants.APPS, appId).one(apiConstants.TABLES,tableId).one(apiConstants.REPORTS).withHttpConfig(httpHeaders).get();
            },

            runReport: function(appId, tableId, reportId) {
                var httpHeaders = {ticket: getTicket()};
                return Restangular.one(apiConstants.APPS, appId).one(apiConstants.TABLES,tableId).one(apiConstants.REPORTS,reportId).one('results').withHttpConfig(httpHeaders).get();
            }
        };

        return service;

    }



})();
