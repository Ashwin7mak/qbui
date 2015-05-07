(function() {
    'use strict';

    angular.module('qbapp.reports.manager')
        .controller('ReportCtrl', ReportManagerController);

    ReportManagerController.$inject = ['$scope', '$stateParams', 'ReportModel'];

    function ReportManagerController($scope, $stateParams, ReportModel) {

        //  get the report data model
        $scope.report = ReportModel.get($stateParams.id);

        //  ui grid options
        $scope.qbseGridOptions  = {
            showGridFooter: true,
            data: $scope.report.data
        };

        //  set appropriate header object data
        $scope.header = {
            leftContent: 'Beta > Reports > ' + $scope.report.name,
            rightContent: ''
        };

        //  set appropriate footer object data
        $scope.footer = {
            content: '&#169;2015 Intuit Inc. All rights reserved'
        };

        //  set the stage object based on the model data
        $scope.stage = {
            visible: true,
            companyName: $scope.report.company,
            lastSnapshot: $scope.report.snapshot
        };

        //  get the stage content template
        $scope.getStageContent = function() {
            return 'quickbase/qbapp/reports/reportManager/reportStage.html';
        };

        //  get the primary content template
        $scope.getContent = function() {
            return 'quickbase/qbapp/reports/reportManager/reportGridContent.html';
        };


    }

}());
