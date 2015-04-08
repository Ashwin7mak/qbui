(function() {
    'use strict';

    angular.module('qbapp.common')
        .directive('qbGlobalFooter', GlobalFooter);

    directiveController.$inject = ['$scope'];

    function GlobalFooter() {
        return {
            restrict: 'E',
            templateUrl: 'quickbase/common/layoutManager/footer/footer.html',
            controller: directiveController
        };
    }

    function directiveController($scope) {
        if ($scope.footer) {
            $scope.footer.copyright = '&#169;2015 Intuit Inc. All rights reserved';
            $scope.footer.content = '';
        }
        //  will want to put in something to show an 'X' close button
        //  for trowser...something like this::
        //  if (isCloseShowButton) {  blah...   }
    }

}());
