(function() {
    'use strict';

    angular.module('qbse.qbapp.reports.manager', ['ngSanitize', 'qbse.layout', 'qbse.grid']);

    // define the list of supported route urls
    var ROUTE = {
        report: '/qbapp/report/apps/:appId/tables/:tableId/report/:id'
    };

    var reportModule = angular.module('quickbase.report', ['ui.router', 'qbse.qbapp.reports.manager', 'qbse.layout']);
    var reportConfig = reportModule.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider) {
        console.log('setting up app.report.modules.js');
        $locationProvider.html5Mode(true);
        $stateProvider
            .state('report', {
                url: ROUTE.report,
                views: {
                    reportView: {
                        templateUrl: 'quickbase/qbapp/reports/reportManager/reportLayout.html',
                        controller: function($scope) {
                            $scope.showLayout = false;   // hide until we know user is authenticated
                            $scope.layout = 'quickbase/common/layoutManager/shellNoNav.html';
                        }
                    }
                }
            });
    }]);

    reportConfig.run(['$state', '$location','qbUtility', function($state, $location, qbUtility) {
        $state.transitionTo('report', qbUtility.getRouteArguments($location.path(), ROUTE.report));
    }]);

}());
