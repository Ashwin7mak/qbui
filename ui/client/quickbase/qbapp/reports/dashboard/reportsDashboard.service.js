(function () {
    'use strict';

    angular.module('qbapp.reports.dashboard').service('ReportsDashboardService', function () {
        var service = {};
        service.get = function () {
            var menu = [];
            menu.push({id: 1, name: 'Report 1'});
            menu.push({id: 2, name: 'Report 2'});
            menu.push({id: 3, name: 'Report 3'});

            return menu;
        };

        return service;
    });

}());