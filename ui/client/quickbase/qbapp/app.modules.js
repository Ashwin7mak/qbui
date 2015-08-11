(function() {
    'use strict';

    angular.module('qbse.qbapp.dashboard', []);
    angular.module('qbse.qbapp.reports.dashboard', ['qbse.layout']);
    angular.module('qbse.qbapp.reports.manager', ['ngSanitize', 'qbse.layout', 'qbse.grid']);

    // define the list of supported route urls
    var ROUTE = {
        appDashboard: '/qbapp',
        reports     : {
            list  : '/qbapp/reports/:appId/:tableId',
            report: '^/qbapp/reports/apps/:appId/tables/:tableId/report/:id'
        }
    };

    var qbApp = angular.module('quickbase.qbapp', ['ui.router', 'qbse.qbapp.dashboard', 'qbse.qbapp.reports.dashboard', 'qbse.qbapp.reports.manager', 'qbse.layout']);
    var qbAppConfig = qbApp.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $stateProvider
                .state('qbapp', {
                    url  : ROUTE.appDashboard,
                    views: {
                        qbappHomeView: {
                            templateUrl: 'quickbase/qbapp/dashboard/appDashboard.html',
                            controller : 'AppDashboardCtrl'
                        }
                    }
                })
                .state('reports', {
                    url  : ROUTE.reports.list,
                    views: {
                        qbappHomeView: {
                            templateUrl: 'quickbase/qbapp/reports/dashboard/reportsDashboard.html',
                            controller : 'ReportsDashboardCtrl'
                        }
                    }
                })
                .state('reports/report', {
                    url   : ROUTE.reports.report,
                    parent: 'reports',
                    views : {
                        navigationTarget: {
                            templateUrl: 'quickbase/qbapp/reports/reportManager/reportLayout.html',
                            controller : function($scope) {
                                $scope.showLayout = false;  // hide until we know user is authenticated
                                $scope.layout = 'quickbase/common/layoutManager/layouts/default.html';
                            }
                        }
                    }
                });

    }]);

    qbAppConfig.run(['$state', function($state) {
        $state.transitionTo('qbapp');
    }]);

}());
