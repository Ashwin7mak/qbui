(function() {
    'use strict';

    angular.module('qbse.qbapp.reports.manager')
        .directive('reportFeedbackButton', ReportFeedbackButton);

    function ReportFeedbackButton() {
        return {
            restrict: 'E',
            replace: true,
            scope: true,
            template: '<button ng-click="sendFeedback()" type="button" style="cursor:pointer;">Send your thoughts</button>',
            link: function(scope /*,elem*/) {
                scope.sendFeedback = function() {
                    //elem.attr('target', '_blank');
                    window.location.href = 'mailto:clay_nicolau@intuit.com?subject=QuickBaseReportFeedback';
                };
            }
        };
    }

}());
