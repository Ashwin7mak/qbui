(function() {
    'use strict';

    angular.module('qbapp.reports.manager')
        .factory('ReportModel', ReportManagerModel);

    ReportManagerModel.$inject = ['ReportService'];

    function ReportManagerModel(ReportService) {

        var model = [];
        model.get = function(reportId) {
            model = ReportService.get(reportId);
            return model;
        };

        return model;

    }

}());
