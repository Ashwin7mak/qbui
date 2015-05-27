(function() {
    'use strict';

    angular.module('qbse.qbapp.dashboard')
        .controller('AppDashboardCtrl', AppDashboardController);

    function AppDashboardController($scope, $state, $stateParams) {

        //  TODO: replace with model call to fetch app and table info
        //$scope.appId = '0duiiaaabw6';
        //$scope.tableId = '0duiiaaabw7';
        $scope.appId = $stateParams.appId;
        $scope.tableId = $stateParams.tableId;
        $scope.reportId = $stateParams.reportId;

        $scope.goToReports = function() {
            $state.transitionTo('reports', {appId:$scope.appId, tableId:$scope.tableId});
        };
        $scope.goToReport = function(id) {
            $state.transitionTo('report', {appId:$scope.appId, tableId:$scope.tableId, id:$scope.reportId});
        };

    }

}());
