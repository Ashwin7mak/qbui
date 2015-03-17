(function() {
    'use strict';

    angular.module('qbapp.reports.dashboard').controller('ReportsDashboardCtrl', function($scope, $state, ReportsDashboardModel) {

        $scope.menus = ReportsDashboardModel.get();
        $scope.goToPage = function(menu) {
            if (menu.id === 1) {
                $state.transitionTo('reports/report', {id: menu.id});
            }
            if (menu.id === 2) {
                $state.transitionTo('reports/report', {id: menu.id});
            }
            if (menu.id === 3) {
                $state.transitionTo('reports/report', {id: menu.id});
            }
        };

    });
}());
