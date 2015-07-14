(function() {
    'use strict';
    /**
     * A library of common utility functions.
     *
     * This module is intended to hold general utility functions that can be used and shared by other modules.
     *
     **/
    angular.module('qbse.helper')
        .factory('qbUtility', UtilityFactory);

    function UtilityFactory() {

        var utilityFunctions = {};

        /**
         * For the given path, redirect
         *
         * @param path
         */
        utilityFunctions.redirect = function(path) {
            window.location.href = path;
        };

        /**
         * Is the supplied value an integer
         *
         * @param val
         * @returns {boolean}
         */
        utilityFunctions.isInt = function(val) {
            return (typeof val==='number' && (val%1)===0);
        };

        /**
         * An object that maps keys to values. Similar implementation to a HashMap.
         */
        utilityFunctions.map = function() {

            var dict = {};

            this.size = function () {
                return Object.keys(dict).length;
            };

            this.get = function (key) {
                return dict[key];
            };

            this.put = function (key, value) {
                dict[key] = value;
            };

            this.containsKey = function (key) {
                return this.get(key) !== undefined;
            };

            this.remove = function (key) {
                delete dict[key];
            };

            this.isEmpty = function () {
                return Object.keys(dict).length === 0;
            };

            this.clear = function () {
                dict = {};
            };

            this.forEach = function (callback) {
                var len = this.size();
                for (var i = 0; i < len; i++) {
                    var item = this.get(Object.keys(dict)[i]);
                    callback(item, i);
                }
            };

        };

        return utilityFunctions;

    }

})();
