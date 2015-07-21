(function() {
    'use strict';

    angular.module('qbse.qbapp.dashboard', []);
    angular.module('qbse.qbapp.reports.dashboard', ['qbse.layout']);
    angular.module('qbse.qbapp.reports.manager', ['ngSanitize', 'qbse.layout', 'qbse.grid']);
    var reportsApp = angular.module('quickbase.qbapp', ['ui.router', 'qbse.qbapp.dashboard', 'qbse.qbapp.reports.dashboard', 'qbse.qbapp.reports.manager', 'qbse.layout']);
    var reportsAppConfig = reportsApp.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider) {
        console.log('setting up app.modules.js');
        $locationProvider.html5Mode(true);
        $stateProvider
            .state('qbapp', {
                url: '/qbapp',
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
                url: '^/qbapp/reports/apps/:appId/tables/:tableId/report/:id',
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
                url: 'qbapp/report/apps/:appId/tables/:tableId/report/:id',
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

    reportsAppConfig.run(['$state', '$stateParams', '$location', function($state, $stateParams, $location) {
        var reqPath = $location.path();

        //  Can either render the report in stand-a-lone mode or with a left navigation pane.
        //  Search for the stand-a-lone report url --> qbapp/report/apps/:appId/tables/:tableId/report/:id
        var re = new RegExp('qbapp\/report\/apps\/[A-Za-z0-9]*\/tables\/[A-Za-z0-9]*\/report\/[0-9]*');
        if (re.test(reqPath)) {
            console.log('..transitioning to report state.  Report:' + reqPath);
            //  extract out the appId, tableId and reportId supplied in the url
            var requestPath = reqPath.split('/');
            $state.transitionTo('report', {appId:requestPath[4], tableId:requestPath[6],id: requestPath[8]});
        }
        else {
            console.log('..transitioning to the apps dashboard.');
            $state.transitionTo('qbapp');
        }
    }]);

}());
