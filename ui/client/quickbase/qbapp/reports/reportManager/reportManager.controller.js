(function() {
    'use strict';

    angular.module('qbapp.reports.manager')
        .controller('ReportCtrl', function($scope, $stateParams) {

            $scope.reportId = $stateParams.id;

        });

}());
