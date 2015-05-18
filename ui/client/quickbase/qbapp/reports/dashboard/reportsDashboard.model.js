(function() {
    'use strict';

    angular.module('qbse.qbapp.reports.dashboard')
        .factory('ReportsDashboardModel', ReportsDashboardModel);

    ReportsDashboardModel.$inject = ['ReportsDashboardService'];

    function ReportsDashboardModel(ReportsDashboardService) {

        var model = [];
        model.get = function() {
            model = ReportsDashboardService.get();
            return model;
        };

        return model;

    }

}());
