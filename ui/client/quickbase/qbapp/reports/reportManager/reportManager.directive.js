(function() {
    'use strict';

    angular.module('qbapp.reports.manager').directive('layoutStage', function() {

        return {
            restrict: 'E',
            link: function(scope) {
                var d = new Date();
                scope.stage = {
                    lastSnapshot: d.toLocaleString()
                };
            }
            //templateUrl: function(element, attr) {
            //    return template;
            //}
        };
    });
}());
