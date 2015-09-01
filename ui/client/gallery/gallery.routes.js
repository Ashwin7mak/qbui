(function() {
    'use strict';

    /**
     * This is used as a preview of the common components
     * for developers internally.
     */
    angular
            .module('quickbase.gallery')
            .config(['$stateProvider', '$urlRouterProvider', 'ExampleDataProvider', CommonRoutes]);

    CommonRoutes.$inject = ['$stateProvider', '$urlRouterProvider'];
    function CommonRoutes($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/home');

        $stateProvider
                .state('home', {
                    url: '/home'
                })
                .state('grid', {
                    url         : '/grid',
                    templateUrl : 'gallery/grid/gridExample.html',
                    controller  : 'GridExampleController',
                    controllerAs: 'example',
                    resolve     : {
                        gridData: function($q, ExampleData) {
                            var gridInfo = $q.defer();

                            // decide what data to use
                            var exampleSize = 'Large';
                            var requestSize = location.search.replace(/^.*?\=/, '');
                            if (requestSize.toLowerCase() === 'large' ||
                                requestSize.toLowerCase() === 'small') {
                                exampleSize = requestSize;
                            }
                            // load up example data &schema
                            var schemaPromise = ExampleData.get({file: 'mockRecordsSchema', size: exampleSize});
                            var dataPromise = ExampleData.get({file: 'mockRecords', size: exampleSize});

                            // after the example data is resolved, resolve the grid Info columns and data
                            $q.all([schemaPromise.$promise, dataPromise.$promise]).then(function(resolvedGridData) {
                                gridInfo.resolve({
                                    exampleSize   : exampleSize,
                                    getColumns    : function() {
                                        //ui-grid expects array of column header names
                                        return resolvedGridData[0];
                                    },
                                    getDataPromise: function() {
                                        // ui-grid expects promise of data
                                        return dataPromise.$promise;
                                    }
                                });
                            });
                            return gridInfo.promise;
                        }
                    }
                });

    }

}());
