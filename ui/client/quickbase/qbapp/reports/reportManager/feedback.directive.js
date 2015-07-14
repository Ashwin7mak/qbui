(function() {
    'use strict';

    angular.module('qbse.qbapp.reports.manager')
        .directive('reportFeedbackButton', ReportFeedbackButton);

    function ReportFeedbackButton() {
        return {
            restrict: 'E',
            replace: true,
            scope: true,
            templateUrl: 'quickbase/qbapp/reports/reportManager/feedback.html',
            link: function(scope /*,elem*/) {
                scope.sendFeedback = function() {
                    //elem.attr('target', '_blank');
                    window.location.href = 'mailto:clay_nicolau@intuit.com?subject=ReArch LH Feedback';
                };
            }
        };
    }

}());
