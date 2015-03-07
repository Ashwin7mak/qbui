(function () {
    'use strict';

    var reportsApp = angular.module('quickbase.qbapp', ['ui.router', 'qbapp.dashboard', 'qbapp.reports.dashboard', 'qbapp.reports.manager']),
        reportsAppConfig = reportsApp.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider) {

            $stateProvider
                .state('qbapp', {
                    url: '/',
                    views: {
                        'qbappHomeView': {
                            templateUrl: 'quickbase/qbapp/dashboard/appDashboard.html',
                            controller: 'AppDashboardCtrl'
                        }
                    }
                })
                .state('reports', {
                    url: '/reports',
                    views: {
                        'qbappHomeView': {
                            templateUrl: 'quickbase/qbapp/reports/dashboard/reportsDashboard.html',
                            controller: 'ReportsDashboardCtrl'
                        }
                    }
                })
                .state('reports/report', {
                    url: '/:id',
                    parent: 'reports',
                    views: {
                        'dashboardContent': {
                            templateUrl: 'quickbase/qbapp/reports/reportManager/reportManager.html',
                            controller: 'ReportCtrl'
                        }
                    }
                })
                .state('report', {
                    url: '/report/:id',
                    views: {
                        'qbappHomeView': {
                            templateUrl: 'quickbase/qbapp/reports/reportManager/reportManager.html',
                            controller: 'ReportCtrl'
                        }
                    }
                });
        }]);

    reportsAppConfig.run(['$state', function ($state) {
        $state.transitionTo('qbapp');
    }]);

}());
