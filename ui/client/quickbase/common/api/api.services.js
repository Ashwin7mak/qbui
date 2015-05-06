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
     */
    angular
        .module('qbse.api', ['ngResource'])

        .factory('ApiService', ['$resource', function($resource) {

            var basePath = '/api';
            var realmsPath = basePath + '/realms';
            var healthPath = basePath + '/health';
            var ticketPath = basePath + '/ticket'; // this might not be exposed in node
            var appsPath = basePath + '/apps';
            var appPath = appsPath + '/:appId';
            var tablesPath = appPath + '/tables';
            var tablePath = tablesPath + '/:tableId';
            var fieldPath = tablePath + '/fields/:fieldId';
            var recordsPath = tablePath + '/records';
            var reportsPath = tablePath + '/reports';

            return {
                realms : $resource(realmsPath, {}, {
                    query: {
                        method : 'GET',
                        isArray: true
                    }
                }),
                health : $resource(healthPath, {}, {}),
                ticket : $resource(ticketPath, {}, {}),
                apps   : $resource(appsPath, {}, {
                    query: {
                        method : 'GET',
                        isArray: true
                    }
                }),
                app    : $resource(appPath, {}, {}),
                tables : $resource(tablesPath, {}, {
                    query: {method: 'GET', isArray: true}
                }),
                table  : $resource(tablePath, {}, {
                    update: {method: 'PUT'}
                }),
                field  : $resource(fieldPath, {}, {}),
                reports: $resource(reportsPath, {}, {}),
                records: $resource(recordsPath, {}, {
                    query: {
                        method           : 'GET',
                        isArray          : true,
                        transformResponse: function(data) {
                            return angular.fromJson(data);
                        }
                    }
                })
            };
        }]
    );
}());
