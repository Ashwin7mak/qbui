(function() {
    'use strict';

    angular.module('qbse.qbapp.dashboard')
        .controller('AppDashboardCtrl', AppDashboardController);

    AppDashboardController.$inject = ['$scope', '$state', '$stateParams', 'ReportsDashboardModel'];

    function AppDashboardController($scope, $state, $stateParams, ReportsDashboardModel) {

        //  TODO: replace with model call to fetch app and table info
        //$scope.appId = '0duiiaaabw6';
        //$scope.tableId = '0duiiaaabw7';
        $scope.appId = $stateParams.appId;
        $scope.tableId = $stateParams.tableId;

        if ($scope.appId && $scope.tableId) {
            $scope.reports = [];
            // TODO: should really be an AppsDashboardModel..
            ReportsDashboardModel.get($scope.appId, $scope.tableId).then(
                function (reports) {
                    reports.forEach(function (report) {
                        $scope.reports.push({id: report.id, name: report.name});
                    });
                }
            );
        }

        $scope.goToReports = function() {
            $state.transitionTo('reports', {appId:$scope.appId, tableId:$scope.tableId});
        };
        $scope.goToReport = function(report) {
            $state.transitionTo('report', {appId:$scope.appId, tableId:$scope.tableId, id:report.id});
        };

    }

}());
