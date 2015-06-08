(function() {
    'use strict';

    var reportsApp = angular.module('quickbase.qbapp', ['ui.router', 'qbse.qbapp.dashboard', 'qbse.qbapp.reports.dashboard', 'qbse.qbapp.reports.manager', 'qbse.layout']);
    var reportsAppConfig = reportsApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider) {

        $stateProvider
            .state('qbapp', {
                url: '/:appId/:tableId',
                views: {
                    qbappHomeView: {
                        templateUrl: 'quickbase/qbapp/dashboard/appDashboard.html',
                        controller: 'AppDashboardCtrl'
                    }
                }
            })
            .state('reports', {
                url: '/reports/:appId/:tableId',
                views: {
                    qbappHomeView: {
                        templateUrl: 'quickbase/qbapp/reports/dashboard/reportsDashboard.html',
                        controller: 'ReportsDashboardCtrl'
                    }
                }
            })
            .state('reports/report', {
                url: '^/reports/apps/:appId/tables/:tableId/report/:id',
                parent: 'reports',
                views: {
                    navigationTarget: {
                        templateUrl: 'quickbase/qbapp/reports/reportManager/reportLayout.html',
                        controller: function($scope) {
                            $scope.showLayout = false;  // hide until we know user is authenticated
                            $scope.layout = 'quickbase/common/layoutManager/layouts/default.html';
                        }
                    }
                }
            })
            .state('report', {
                url: '^/apps/:appId/tables/:tableId/report/:id',
                views: {
                    qbappHomeView: {
                        templateUrl: 'quickbase/qbapp/reports/reportManager/reportLayout.html',
                        controller: function($scope) {
                            $scope.showLayout = false;   // hide until we know user is authenticated
                            $scope.layout = 'quickbase/common/layoutManager/shellNoNav.html';
                        }
                    }
                }
            });
    }]);

    reportsAppConfig.run(['$state', function($state) {
        $state.transitionTo('qbapp');
    }]);

}());
