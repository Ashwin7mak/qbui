(function() {
    'use strict';

    angular.module('qbse.qbapp.reports.dashboard')
        .service('ReportsDashboardService', ReportsDashboardService);

    function ReportsDashboardService() {

        var service = {
            get: function() {
                var model = {
                    company: 'ABC Enterprises',
                    menu: [
                        {id: 1, name: 'Report 1'},
                        {id: 2, name: 'Report 2'},
                        {id: 3, name: 'Report 3'}
                    ]
                };
                return model;
            }
        };

        return service;
    }

}());
