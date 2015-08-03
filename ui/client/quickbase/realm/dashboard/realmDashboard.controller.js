(function() {
    'use strict';

    angular.module('qbse.realm.dashboard')
        .controller('RealmDashboardCtrl', ['$scope', '$log', function($scope, $log) {
            $scope.$log = $log;
            $log.log('realm dashboard controller called..');
        }]);
}());
