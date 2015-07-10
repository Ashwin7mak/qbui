(function() {
    'use strict';

    angular.module('qbse.qbapp.dashboard')
        .controller('AppDashboardCtrl', AppDashboardController);

    AppDashboardController.$inject = ['$scope', '$state', '$stateParams', 'ReportsDashboardModel'];

    function AppDashboardController($scope, $state, $stateParams, ReportsDashboardModel) {

        $scope.appId = $stateParams.appId;
        $scope.tableId = $stateParams.tableId;

        if ($scope.appId && $scope.tableId) {
            $scope.reports = [];
            // TODO: should really be an AppsDashboardModel..
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
            $scope.tables = [];
            $scope.apps = [];
            ReportsDashboardModel.getApps().then(
                function (apps) {
                    $scope.showLayout = true;  // display the html as we know the user is authenticated
                    if (apps) {
                        apps.forEach(function (app) {
                            ReportsDashboardModel.getApp(app.id).then(
                                function (app) {
                                    $scope.apps.push({id: app.id, name: app.name, tables: app.tables});
                                    if (app.tables) {
                                        var tables = app.tables;
                                        tables.forEach(function (table) {
                                            $scope.tables.push({
                                                appId: app.id,
                                                appName: app.name,
                                                tableId: table.id,
                                                tableName: table.name
                                            });
                                        });
                                    }
                                    else {
                                        console.log('No tables found for app: ' + app.id);
                                    }
                                },
                                function (resp) {
                                    console.log('Error getting app detail.  Status: ' + resp.status);
                                }
                            );
                        });
                    }
                    else {
                        $scope.apps.push({id:'', name: 'No apps found.', tables:[ ] })
                        console.log('No apps found for logged in user.   Nothing to display.');
                    }
                },
                function (resp) {
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
