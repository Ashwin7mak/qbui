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
        utilityFunctions.setLocationHref = function(path) {
            window.location.href = path;
        };

        /**
         * For the given route and pattern, extract variable parameter arguments
         * from the route.
         *
         * @param route       /qbapp/report/apps/12345/tables/67890/report/1
         * @param pattern     /qbapp/report/apps/:appId/tables/:tableId/report/:id
         * @returns {{}}      {appId:12345, tableId:67890, id:1}
         */
        utilityFunctions.getRouteArguments = function(route, pattern) {
            var args = {};

            if (route && pattern) {
                var routeSplit = route.split('/');
                var patternSplit = pattern.split('/');


                if (routeSplit.length === patternSplit.length) {
                    for (var i = 0; i < routeSplit.length; i++) {
                        if (routeSplit[i] !== patternSplit[i]) {
                            if (patternSplit[i].charAt(0) === ':') {
                                args[patternSplit[i].substring(1)] = routeSplit[i];
                            }
                        }
                    }
                }
            }
            return args;
        }

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
