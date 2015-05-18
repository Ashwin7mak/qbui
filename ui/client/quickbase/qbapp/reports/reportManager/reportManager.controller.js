(function() {
    'use strict';

    angular.module('qbse.qbapp.reports.manager')
        .controller('ReportCtrl', ReportManagerController);

    ReportManagerController.$inject = ['$scope', '$stateParams', 'ReportModel', 'ReportService'];

    function ReportManagerController($scope, $stateParams, ReportModel, ReportService) {

        //  get the report data model
        var aReport = ReportModel.get($stateParams.id);

        $scope.report = {};
        $scope.report.dataService = ReportService;
        $scope.report.name = aReport.name;
        $scope.report.id = aReport.id;
        $scope.report.data = aReport.data;

        //  ui grid options
        $scope.report.qbseGridOptions  = {
            showGridFooter: false
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
