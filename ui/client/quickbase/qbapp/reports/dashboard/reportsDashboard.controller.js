(function() {
    'use strict';

    angular.module('qbse.qbapp.reports.dashboard')
        .controller('ReportsDashboardCtrl', ReportDashboardController);

    ReportDashboardController.$inject = ['$scope', '$state', '$stateParams', 'ReportsDashboardModel'];

    function ReportDashboardController($scope, $state, $stateParams, ReportsDashboardModel) {

        var model = ReportsDashboardModel.get();

        $scope.menus = model.menu;

        //  TODO: this probably is not the right way to fetch the appid and tableid..model call?
        var appId = $stateParams.appId;
        var tableId = $stateParams.tableId;

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
                $state.transitionTo('reports/report', {appId:appId, tableId:tableId,id: menu.id});
            }
            if (menu.id === 2) {
                $state.transitionTo('reports/report', {appId:appId, tableId:tableId,id: menu.id});
            }
            if (menu.id === 3) {
                $state.transitionTo('reports/report', {appId:appId, tableId:tableId,id: menu.id});
            }
        };
    }

}());
