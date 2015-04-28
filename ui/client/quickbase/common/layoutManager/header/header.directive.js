(function() {
    'use strict';

    angular.module('qbapp.common')
        .directive('qbGlobalHeader', GlobalHeader);

    function GlobalHeader() {
        return {
            restrict: 'E',
            templateUrl: 'quickbase/common/layoutManager/header/header.html',
            scope: {
                headerInfo: '=info'
            }
        };
    }

}());
