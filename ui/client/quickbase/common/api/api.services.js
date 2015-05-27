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

    ApiService.$inject = ['Restangular', '$cookieStore'];

    function ApiService(Restangular, $cookies) {

        // get the auth session ticket from the cookie.  If it's invalid or not found, the
        // requested endPoint will respond with a 403 status, which is handles in api.modules.js by
        // the RestangularProvider.setErrorInterceptor.
        //
        function getTicket() {
            return $cookies.get('ticket');
        }

        function setFormattedRecordsQueryParams(type, offset, rows) {
            var queryParams = {format: 'display'};
            if (isInt(offset) && isInt(rows)) {
                queryParams.offset = offset;
                queryParams.numRows = rows;
            }
            return queryParams;
        }

        // TODO: move into a common utility module
        function isInt(val) {
            return (typeof val==='number' && (val%1)===0);
        }

        var service = {
            getApp: function(appId) {
                var httpHeaders = {ticket: getTicket()};
                return Restangular.one('apps', appId).withHttpConfig(httpHeaders).get();
            },

            getFields: function(appId, tableId) {
                var httpHeaders = {ticket: getTicket()};
                return Restangular.one('apps',appId).one('tables',tableId).one('fields').withHttpConfig(httpHeaders).get();
            },

            getField: function(appId, tableId, fieldId) {
                var httpHeaders = {ticket: getTicket()};
                return Restangular.one('apps',appId).one('tables',tableId).one('fields',fieldId).withHttpConfig(httpHeaders).get();
            },

            getReport: function(appId, tableId, reportId) {
                var httpHeaders = {ticket: getTicket()};
                return Restangular.one('apps', appId).one('tables',tableId).one('reports',reportId).withHttpConfig(httpHeaders).get();
            },

            getFormattedRecords: function(appId, tableId, offset, rows) {
                //  TODO move into constants
                var queryParams = setFormattedRecordsQueryParams('display', offset, rows);
                return this.getRecords(appId, tableId, queryParams);
            },
            getRawRecords: function(appId, tableId, offset, rows) {
                //  TODO move into constants
                var queryParams = setFormattedRecordsQueryParams('raw', offset, rows);
                return this.getRecords(appId, tableId, queryParams);
            },
            getRecords: function(appId, tableId, queryParams) {
                var httpHeaders = {ticket: getTicket()};
                return Restangular.one('apps', appId).one('tables',tableId).one('records').withHttpConfig(httpHeaders).get(queryParams ? queryParams : {});
            },

            runReport: function(appId, tableId, reportId) {
                var httpHeaders = {ticket: getTicket()};
                return Restangular.one('apps', appId).one('tables',tableId).one('reports',reportId).one('results').withHttpConfig(httpHeaders).get();
            }
        };

        return service;

    }



})();
