(function() {
    'use strict';

    angular.module('qbapp.common')
        .directive('qbGlobalHeader', GlobalHeader);

    function GlobalHeader() {
        return {
            restrict: 'E',
            templateUrl: 'quickbase/common/layoutManager/header/header.html',
            controller: function($scope) {
                if ($scope.header) {
                    if (!$scope.header.rightContent) {
                        $scope.header.rightContent = 'Intuit QuickBase';
                    }
                }
                //  TODO: will need to show an 'X' close button for trowser header
                //  TODO: something like if (isShowClose) { ..blah.. }
            }
        };
    }

}());
