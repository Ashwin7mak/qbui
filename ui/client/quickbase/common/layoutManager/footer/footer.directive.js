(function() {
    'use strict';

    angular.module('qbse.layout')
            .directive('qbGlobalFooter', GlobalFooter);

    function GlobalFooter() {
        return {
            restrict   : 'E',
            templateUrl: 'quickbase/common/layoutManager/footer/footer.html',
            scope      : {
                footerInfo: '=info'
            }
        };
    }

}());
