(function() {
    'use strict';

    angular.module('qbse.qbapp.reports.manager')
        .directive('reportFeedbackButton', ReportFeedbackButton);

    function ReportFeedbackButton() {
        return {
            restrict: 'E',
            replace: true,
            scope: true,
            template:
                '<div class="reminder">' +
                '  <div class="icon"></div>' +
                '  <div class="header">Remember</div>' +
                '  <div class="subheader">Your Feedback Matters</div>' +
                '  <button ng-click="sendFeedback()" type="button">Send your thoughts</button>' +
                '</div>',
            link: function(scope /*,elem*/) {
                scope.sendFeedback = function() {
                    //elem.attr('target', '_blank');
                    window.location.href = 'mailto:clay_nicolau@intuit.com?subject=ReArch LH Feedback';
                };
            }
        };
    }

}());
