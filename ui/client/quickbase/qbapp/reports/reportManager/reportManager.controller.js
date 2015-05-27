(function() {
    'use strict';

    angular.module('qbse.qbapp.reports.manager')
        .controller('ReportCtrl', ReportManagerController);

    ReportManagerController.$inject = ['$q', '$scope', '$stateParams', 'ReportModel', 'gridConstants'];

    function ReportManagerController($q, $scope, $stateParams, ReportModel, gridConstants ) {

        $scope.showLayout = false;

        //  get the report data model
        var appId = $stateParams.appId;
        var tableId = $stateParams.tableId;
        var reportId = $stateParams.id;
        var companyName = 'ABC Company';

        $scope.dataGridReportService = function(requestType, offset, rows) {
            // service request type can be COLUMN_ONLY, DATA_ONLY or BOTH.  If no request type or an invalid/unsupport
            // request type, then BOTH is returned.
            var reqServiceFunc;
            switch (requestType) {
                case gridConstants.SERVICE_REQ.COLS:
                    reqServiceFunc = ReportModel.getColumnData;
                    break;
                case gridConstants.SERVICE_REQ.DATA:
                    reqServiceFunc = ReportModel.getData;
                    break;
                default:
                    reqServiceFunc = ReportModel.getAll;
            }

            var deferred = $q.defer();
            reqServiceFunc(appId, tableId, reportId, offset, rows).then (
                function(data) {
                    return deferred.resolve(data);
                },
                function(resp) {
                    return deferred.reject(resp);
                }
            );
            return deferred.promise;
        };

        ReportModel.getMetaData(appId, tableId, reportId).then (
            function(metaData) {

                //  showLayout scope variable inherits from the parent scope, which is defined in app.routes.js.  We're not
                //  rendering the layout immediately until we know the user's ticket is valid..otherwise it will flash.
                //  TODO: put in some feedback to the user..for example a spinner instead of just a blank page...
                $scope.showLayout = true;

                $scope.report = {};
                $scope.report.dataService = $scope.dataGridReportService;
                $scope.report.name = metaData.name;
                $scope.report.company = metaData.company;
                $scope.report.snapshot = metaData.snapshot;
                $scope.report.id = metaData.id;

                //  ui grid options
                $scope.report.qbseGridOptions = {
                    showGridFooter: false,
                    paginationPageSize: 2
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
                    companyName: companyName,
                    lastSnapshot: $scope.report.snapshot
                };

                //  get the stage content template
                $scope.getStageContent = function () {
                    return 'quickbase/qbapp/reports/reportManager/reportStage.html';
                };

                //  get the primary content template
                $scope.getContent = function () {
                    return 'quickbase/qbapp/reports/reportManager/reportGridContent.html';
                };

            },
            function(resp) {
                console.log('Error fetching model data in controller.  Status:' + resp.status);
            }

        );


    }

}());
