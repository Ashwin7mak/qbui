(function() {
    'use strict';

    angular.module('qbse.qbapp.reports.dashboard')
        .controller('ReportsDashboardCtrl', ReportDashboardController);

    ReportDashboardController.$inject = ['$scope', '$state', '$stateParams', 'ReportsDashboardModel'];

    function ReportDashboardController($scope, $state, $stateParams, ReportsDashboardModel) {

        $scope.appId = $stateParams.appId;
        $scope.tableId = $stateParams.tableId;

        $scope.reportId;        // holds the currently selected report
        $scope.reports = [];    // list of reports for given appId and tableId

        if ($scope.appId && $scope.tableId) {
            ReportsDashboardModel.get($scope.appId, $scope.tableId).then(
                function (reports) {
                    var defaultReport;
                    reports.forEach(function (report) {
                        // first report returned in the list is the default display report
                        if (!defaultReport) { defaultReport = report; }
                        $scope.reports.push({id: report.id, name: report.name});
                    });

                    //  rather than display an empty content pane, will transition to the default report (if any)
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
