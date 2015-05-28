(function() {
    'use strict';

    angular.module('qbse.qbapp.reports.dashboard')
        .controller('ReportsDashboardCtrl', ReportDashboardController);

    ReportDashboardController.$inject = ['$scope', '$state', '$stateParams', 'ReportsDashboardModel'];

    function ReportDashboardController($scope, $state, $stateParams, ReportsDashboardModel) {

        $scope.appId = $stateParams.appId;
        $scope.tableId = $stateParams.tableId;

        if ($scope.appId && $scope.tableId) {
            $scope.reports = [];
            ReportsDashboardModel.get($scope.appId, $scope.tableId).then(
                function (reports) {
                    reports.forEach(function (report) {
                        $scope.reports.push({id: report.id, name: report.name});
                    });
                }
            );
        }

        //  set appropriate header object data
        $scope.header = {
            leftContent: 'Beta > Reports',
            rightContent: ''
        };

        $scope.getNavigationContent = function() {
            return 'quickbase/qbapp/reports/dashboard/reportsDashboardMenu.html';
        };

        $scope.goToPage = function(report) {
            if (report.id === 1) {
                $state.transitionTo('reports/report', {appId:$scope.appId, tableId:$scope.tableId,id: report.id});
            }
            if (report.id === 2) {
                $state.transitionTo('reports/report', {appId:$scope.appId, tableId:$scope.tableId,id: report.id});
            }
            if (report.id === 3) {
                $state.transitionTo('reports/report', {appId:$scope.appId, tableId:$scope.tableId,id: report.id});
            }
        };
    }

}());
