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

        function dataGridReportService (requestType, offset, rows) {
            // service request type can be COLUMN_ONLY OR DATA_ONLY.  DEFAULT is DATA.
            var deferred = $q.defer();
            var promise;

            if (requestType === gridConstants.SERVICE_REQ.COLS) {
                promise = ReportModel.getColumnData(appId, tableId, reportId);
            }
            else {
                promise = ReportModel.getReportData(appId, tableId, reportId, offset, rows);
            }

            promise.then (
                function(data) {
                    return deferred.resolve(data);
                },
                function(resp) {
                    return deferred.reject(resp);
                }
            );

            return deferred.promise;
        }

        ReportModel.getMetaData(appId, tableId, reportId).then (
            function(metaData) {

                //  showLayout scope variable inherits from the parent scope, which is defined in app.modules.js.  We're not
                //  rendering the layout immediately until we know the user's ticket is valid..otherwise it will flash.
                //  TODO: put in some feedback to the user..for example a spinner instead of just a blank page...
                $scope.showLayout = true;

                $scope.report = {};
                $scope.report.id = metaData.reportId;
                $scope.report.appId = metaData.appId;
                $scope.report.appName = metaData.appName;
                $scope.report.tableId = metaData.tableId;
                $scope.report.dataService = dataGridReportService;
                $scope.report.name = metaData.name;
                $scope.report.company = metaData.company;

                //  ui grid options
                $scope.report.qbseGridOptions = {
                    paginationPageSize: 15,
                    enableColumnResizing: true,
                    showGridFooter: false
                };

                //  set appropriate header object data
                $scope.showHeader = false;
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
                    companyName: metaData.company,
                    reportName: metaData.name,
                    appName: metaData.appName
                };

                //  get the stage content template
                // TODO: the close/open of the stage area is choppy..
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
