(function() {
    'use strict';

    angular.module('qbse.qbapp.reports.manager', ['ngSanitize', 'qbse.layout', 'qbse.grid']);

    // define the list of supported route urls
    var ROUTE = {
        report: '/qbapp/report/apps/:appId/tables/:tableId/report/:id'
    };

    var reportModule = angular.module('quickbase.report', ['ui.router', 'qbse.qbapp.reports.manager', 'qbse.layout']);
    reportModule.config(['$stateProvider', '$locationProvider, $log', function($stateProvider, $locationProvider, $log) {
        $log.log('setting up app.report.modules.js');
        $locationProvider.html5Mode(true);
        $stateProvider
                .state('report', {
                    url  : ROUTE.report,
                    views: {
                        reportView: {
                            templateUrl: 'quickbase/qbapp/reports/reportManager/reportLayout.html',
                            controller : function($scope) {
                                $scope.showLayout = false;   // hide until we know user is authenticated
                                $scope.layout = 'quickbase/common/layoutManager/shellNoNav.html';
                            }
                        }
                    }
                });
    }]);

}());
