(function() {
    'use strict';

    angular.module('qbapp.reports.dashboard')
        .controller('ReportsDashboardCtrl', ReportDashboardController);

    ReportDashboardController.$inject = ['$scope', '$state', 'ReportsDashboardModel'];

    function ReportDashboardController($scope, $state, ReportsDashboardModel) {

        var model = ReportsDashboardModel.get();

        $scope.menus = model.menu;

        //  set appropriate header object data
        $scope.header = {
            leftContent: 'Beta > Reports',
            rightContent: ''
        };

        $scope.getNavigationContent = function() {
            return 'quickbase/qbapp/reports/dashboard/reportsDashboardMenu.html';
        };

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
    }

}());
