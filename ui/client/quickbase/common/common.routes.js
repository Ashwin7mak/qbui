(function() {
    'use strict';
    function CommonRoutes($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/home');

        $stateProvider
            .state('home', {
                url: '/home'
            })
            .state('grid', {
                url: '/grid',
                templateUrl: 'quickbase/common/grid/gridExample.html',
                controller:'GridExampleController',
                controllerAs:'example',
                resolve: {
                    testdata: function() {
                        return 'testdata';
                    }
                }
                // resolve: {
                //    data: function(ItemsService) {
                //        return ItemsService.getItem();
                //    }
                //}
            });

    }

    angular.module('quickbase.common', ['ui.router', 'gridExample','gridExampleService']);

    angular.module('quickbase.common').config(['$stateProvider', '$urlRouterProvider', CommonRoutes]);


}());
