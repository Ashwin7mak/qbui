(function() {
    'use strict';
    /**
     * A library of common utility functions
     **/
    angular.module('qbse.helper')
        .factory('qbUtility', UtilityFactory);

    function UtilityFactory() {

        var utilityFunctions = {};

        /**
         * Is the supplied value an integer
         *
         * @param val
         * @returns {boolean}
         */
        utilityFunctions.isInt = function(val) {
            return (typeof val==='number' && (val%1)===0);
        };

        return utilityFunctions;

    }

})();
