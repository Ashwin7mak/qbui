/**
 * Module containing helper functions which can be used generically across domains and spec files.
 * Created by klabak on 9/17/15.
 */
(function() {
    'use strict';
    module.exports = function() {
        var e2eUtils = {
            /**
             * Helper function that will convert an array of strings to uppercase
             */
            stringArrayToUpperCase: function(array) {
                var upperArray = [];
                array.forEach(function(lowerString) {
                    var res = lowerString.toUpperCase();
                    upperArray.push(res);
                });
                return upperArray;
            }
        };
        return e2eUtils;
    };
}());