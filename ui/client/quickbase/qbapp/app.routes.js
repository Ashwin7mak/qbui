(function() {
    'use strict';

    var reportsApp = angular.module('quickbase.qbapp', ['ui.router', 'qbse.qbapp.dashboard', 'qbse.qbapp.reports.dashboard', 'qbse.qbapp.reports.manager', 'qbse.layout']);
    var reportsAppConfig = reportsApp.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $stateProvider
            .state('qbapp', {
                url: '/qbapp/:appId/:tableId',
                views: {
                    qbappHomeView: {
                        templateUrl: 'quickbase/qbapp/dashboard/appDashboard.html',
                        controller: 'AppDashboardCtrl'
                    }
                }
            })
            .state('reports', {
                url: '/qbapp/reports/:appId/:tableId',
                views: {
                    qbappHomeView: {
                        templateUrl: 'quickbase/qbapp/reports/dashboard/reportsDashboard.html',
                        controller: 'ReportsDashboardCtrl'
                    }
                }
            })
            .state('reports/report', {
                url: '/qbapp/reports/apps/:appId/tables/:tableId/report/:id',
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
                url: '/qbapp/apps/:appId/tables/:tableId/report/:id',
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
