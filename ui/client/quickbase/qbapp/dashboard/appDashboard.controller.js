(function() {
    'use strict';

    angular.module('qbse.qbapp.dashboard')
        .controller('AppDashboardCtrl', AppDashboardController);

    function AppDashboardController($scope, $state) {
        $scope.goToReports = function() {
            $state.transitionTo('reports');
        };
        $scope.goToReport = function(id) {
            $state.transitionTo('report', {id: id});
        };
    }

}());
