(function() {
    'use strict';

    angular.module('qbapp.reports.manager')
        .controller('ReportCtrl', function($scope, $stateParams, ReportModel) {

            //  get the report data model
            $scope.report = ReportModel.get($stateParams.id);

            //  set appropriate header object data
            $scope.header = {
                leftContent: 'Beta > Reports > ' + $scope.report.name
            };

            //  set appropriate footer object data
            $scope.footer = {
                content: ''
            };

            //  set the stage object based on the model data
            $scope.stage = {
                companyName: $scope.report.company,
                lastSnapshot: $scope.report.snapshot
            };

            //  get the stage content template
            $scope.getStageContent = function() {
                return 'quickbase/qbapp/reports/reportManager/reportStage.html';
            };

            //  get the primary content template
            $scope.getContent = function() {
                return 'quickbase/qbapp/reports/reportManager/reportContent.html';
            };

        });

}());
