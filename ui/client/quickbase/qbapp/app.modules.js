(function() {
    'use strict';

    angular.module('qbse.qbapp.dashboard', []);
    angular.module('qbse.qbapp.reports.dashboard', ['qbse.layout']);
    angular.module('qbse.qbapp.reports.manager', ['ngSanitize', 'qbse.layout', 'qbse.grid']);

    // define the list of supported route urls
    var ROUTE = {
        appDashboard: '/qbapp',
        reports: {
            list: '/qbapp/reports/:appId/:tableId',
            report: '^/qbapp/reports/apps/:appId/tables/:tableId/report/:id'
        },
        report: '/qbapp/report/apps/:appId/tables/:tableId/report/:id'
    };

    var reportsApp = angular.module('quickbase.qbapp', ['ui.router', 'qbse.qbapp.dashboard', 'qbse.qbapp.reports.dashboard', 'qbse.qbapp.reports.manager', 'qbse.layout']);
    var reportsAppConfig = reportsApp.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider) {
        console.log('setting up app.modules.js');
        $locationProvider.html5Mode(true);
        $stateProvider
            .state('qbapp', {
                url: ROUTE.appDashboard,
                views: {
                    qbappHomeView: {
                        templateUrl: 'quickbase/qbapp/dashboard/appDashboard.html',
                        controller: 'AppDashboardCtrl'
                    }
                }
            })
            .state('reports', {
                url: ROUTE.reports.list,
                views: {
                    qbappHomeView: {
                        templateUrl: 'quickbase/qbapp/reports/dashboard/reportsDashboard.html',
                        controller: 'ReportsDashboardCtrl'
                    }
                }
            })
            .state('reports/report', {
                url: ROUTE.reports.report,
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
                url: ROUTE.report,
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

    reportsAppConfig.run(['$state', '$location','qbUtility', function($state, $location, qbUtility) {
        var reqPath = $location.path();
        if (isReportRoute(reqPath)) {
            $state.transitionTo('report', qbUtility.getRouteArguments(reqPath, ROUTE.report));
        }
        else {
            $state.transitionTo('qbapp');
        }

        /**
         *  Determine if the route being requested is a stand-alone report route
         *
         * @returns boolean
         */
        function isReportRoute(reqPath) {

            console.log('Requesting route: ' + reqPath);

            //  Regex tests this format:  /qbapp/report/apps/:appId/tables/:tableId/report/:id
            var re = new RegExp('\/qbapp\/report\/apps\/[A-Za-z0-9]*\/tables\/[A-Za-z0-9]*\/report\/[0-9]*');
            return re.test(reqPath);
        }

    }]);

}());
