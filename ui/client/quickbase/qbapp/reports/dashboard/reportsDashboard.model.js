
(function () {
    'use strict';

    angular.module('qbapp.reports.dashboard').factory('ReportsDashboardModel', function (ReportsDashboardService) {

        var model = [];
        model.get = function () {
            model = ReportsDashboardService.get();
            return model;
        };

        return model;

    });

}());
