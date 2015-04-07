(function() {
    'use strict';

    angular.module('qbapp.common').directive('globalHeader', function() {
        return {
            restrict: 'E',
            templateUrl: 'quickbase/common/layoutManager/header/header.html',
            controller: function($scope) {
                if ($scope.header) {
                    if (!$scope.header.rightContent) {
                        $scope.header.rightContent = 'Intuit QuickBase';
                    }
                }
                //  will want to put in something to show an 'X' close button
                //  for trowser...something like this::
                //  if (isCloseShowButton) {  blah...   }
            }
        };
    });
}());
