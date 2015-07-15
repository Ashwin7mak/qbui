(function() {
    'use strict';

    angular.module('qbse.qbapp.dashboard')
        .controller('AppDashboardCtrl', AppDashboardController);

    AppDashboardController.$inject = ['$scope', '$state', '$stateParams', 'ReportsDashboardModel'];

    function AppDashboardController($scope, $state, $stateParams, ReportsDashboardModel) {

        $scope.appId = $stateParams.appId;
        $scope.tableId = $stateParams.tableId;

        //  for a given appId and tableId return list of reports
        if ($scope.appId && $scope.tableId) {
            $scope.reports = [];
            ReportsDashboardModel.get($scope.appId, $scope.tableId).then(
                function (reports) {
                    $scope.showLayout = true;  // display the html as we know the user is authenticated
                    reports.forEach(function (report) {
                        $scope.reports.push({id: report.id, name: report.name});
                    });
                }
            );
        }
        else {
            //  no specific appId/tableId combination requested...will return all apps
            $scope.apps = [];
            $scope.noApps = false;
            ReportsDashboardModel.getApps().then(
                function (apps) {
                    $scope.showLayout = true;
                    if (apps && apps.length > 0) {
                        apps.forEach(function (a) {
                            ReportsDashboardModel.getApp(a.id).then(
                                function (app) {
                                    $scope.apps.push({id: app.id, name: app.name, tables: app.tables});
                                },
                                function (resp) {
                                    console.log('Error getting app detail.  Status: ' + resp.status);
                                }
                            );
                        });
                    }
                    else {
                        $scope.noApps = true;
                        console.log('No apps found for logged in user.   Nothing to display.');
                    }
                },
                function (resp) {
                    $scope.showLayout = true;
                    $scope.noApps = true;
                    console.log('Error getting app list.  Status: ' + resp.status);
                }
            );
        }

        $scope.goToTable = function(table) {
            $state.transitionTo('reports', {appId:table.appId, tableId:table.id});
        };

        $scope.goToReports = function() {
            $state.transitionTo('reports', {appId:$scope.appId, tableId:$scope.tableId});
        };
        $scope.goToReport = function(report) {
            $state.transitionTo('report', {appId:$scope.appId, tableId:$scope.tableId, id:report.id});
        };

    }

}());
