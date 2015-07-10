(function() {
    'use strict';

    angular.module('qbse.qbapp.reports.dashboard')
        .controller('ReportsDashboardCtrl', ReportDashboardController);

    ReportDashboardController.$inject = ['$scope', '$state', '$stateParams', 'ReportsDashboardModel'];

    function ReportDashboardController($scope, $state, $stateParams, ReportsDashboardModel) {

        $scope.appId = $stateParams.appId;
        $scope.tableId = $stateParams.tableId;
        $scope.reportId;

        if ($scope.appId && $scope.tableId) {
            $scope.reports = [];
            ReportsDashboardModel.get($scope.appId, $scope.tableId).then(
                function (reports) {
                    var defaultReport;
                    reports.forEach(function (report) {
                        if (!defaultReport) { defaultReport = report; }
                        $scope.reports.push({id: report.id, name: report.name});
                    });
                    if (defaultReport) {
                        $scope.goToPage(defaultReport);
                    }
                },
                function (resp) {
                    console.log('Error getting report list.  Status: ' + resp.status);
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
            $state.transitionTo('reports/report', {appId:$scope.appId, tableId:$scope.tableId,id: report.id});
            $scope.reportId = report.id;
        };

        $scope.isSelected = function(report) {
            return report.id === $scope.reportId;
        };
    }

}());
